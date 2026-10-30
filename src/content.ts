import { MAX_INPUT_CHARS, type CaptureResponse, type ContentMessage } from "./messages";

type TextField = HTMLInputElement | HTMLTextAreaElement;

/* What was selected when the menu was clicked, so we can put the fix back in the same spot */
type Target = { id: string; original: string } & (
  | { kind: "field"; element: TextField; start: number; end: number }
  | { kind: "editable"; element: HTMLElement; range: Range }
);

let target: Target | null = null;

browser.runtime.onMessage.addListener((message: ContentMessage) => {
  switch (message.type) {
    case "captureSelection":
      return Promise.resolve(captureSelection(message.id));
    case "replaceSelection":
      replaceSelection(message.id, message.text);
      return;
    case "showStatus":
      showStatus(message.text, message.isError);
      return;
  }
});

/* Follow focus into open shadow roots, since many web components host their inputs there */
function deepActiveElement(): Element | null {
  let element = document.activeElement;
  while (element?.shadowRoot?.activeElement) element = element.shadowRoot.activeElement;
  return element;
}

function isTextField(element: Element | null): element is TextField {
  return element instanceof HTMLTextAreaElement
    || (element instanceof HTMLInputElement && element.selectionStart !== null);
}

function checkLength(text: string): string | null {
  if (!text.trim()) return "Select some text first.";
  if (text.length > MAX_INPUT_CHARS) return `Select at most ${MAX_INPUT_CHARS.toLocaleString()} characters.`;
  return null;
}

function captureSelection(id: string): CaptureResponse {
  target = null;
  const element = deepActiveElement();

  if (isTextField(element)) {
    const start = element.selectionStart ?? 0;
    const end = element.selectionEnd ?? 0;
    const original = element.value.slice(start, end);
    const error = checkLength(original);
    if (error) return { error };
    target = { id, kind: "field", element, start, end, original };
    return { text: original };
  }

  if (element instanceof HTMLElement && element.isContentEditable) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return { error: "Select some text first." };
    const range = selection.getRangeAt(0).cloneRange();
    const original = range.toString();
    const error = checkLength(original);
    if (error) return { error };
    target = { id, kind: "editable", element, range, original };
    return { text: original };
  }

  return { error: "Couldn't find the text field you're editing." };
}

/* Models tend to drop surrounding whitespace, so keep the original's */
function keepSurroundingWhitespace(original: string, fixed: string): string {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return leading + fixed.trim() + trailing;
}

function replaceSelection(id: string, fixed: string) {
  /* A newer capture replaced this one; its own reply will handle it */
  if (!target || target.id !== id) return;
  const { original } = target;
  const text = keepSurroundingWhitespace(original, fixed);

  if (target.kind === "field") {
    const { element, start, end } = target;
    if (element.value.slice(start, end) !== original) {
      showStatus("The text changed while fixing, so it was left alone.", true);
      return;
    }
    if (!focusTarget(element)) return;
    element.setSelectionRange(start, end);
    /* execCommand keeps undo history and fires the input events frameworks listen for */
    if (!document.execCommand("insertText", false, text)) {
      element.setRangeText(text, start, end, "end");
      element.dispatchEvent(new Event("input", { bubbles: true }));
    }
  } else {
    const { element, range } = target;
    if (range.toString() !== original || !element.contains(range.commonAncestorContainer)) {
      showStatus("The text changed while fixing, so it was left alone.", true);
      return;
    }
    if (!focusTarget(element)) return;
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    if (!document.execCommand("insertText", false, text)) {
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      element.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  target = null;
  hideStatus();
}

/* insertText writes wherever focus is, so make sure the page didn't move it elsewhere */
function focusTarget(element: HTMLElement): boolean {
  element.focus();
  if (deepActiveElement() === element) return true;
  showStatus("Couldn't return to the text field, so it was left alone.", true);
  return false;
}

let statusEl: HTMLDivElement | null = null;
let hideTimer: number | undefined;

function showStatus(text: string, isError = false) {
  if (!statusEl) {
    statusEl = document.createElement("div");
    Object.assign(statusEl.style, {
      position: "fixed",
      bottom: "16px",
      right: "16px",
      zIndex: "2147483647",
      padding: "8px 12px",
      borderRadius: "8px",
      font: "13px/1.4 system-ui, sans-serif",
      color: "#fff",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
      maxWidth: "360px",
      pointerEvents: "none",
    });
  }
  statusEl.textContent = text;
  statusEl.style.background = isError ? "#b3261e" : "#333";
  document.documentElement.append(statusEl);

  window.clearTimeout(hideTimer);
  /* Progress messages get a long fallback in case the reply never arrives */
  hideTimer = window.setTimeout(hideStatus, isError ? 5000 : 60_000);
}

function hideStatus() {
  window.clearTimeout(hideTimer);
  statusEl?.remove();
}
