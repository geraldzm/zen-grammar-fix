/* Longest selection we'll send, to keep a single click from costing much */
export const MAX_INPUT_CHARS = 10_000;

/* Messages sent from the background script to the content script */
export type ContentMessage =
  | { type: "captureSelection"; id: string }
  | { type: "replaceSelection"; id: string; text: string }
  | { type: "showStatus"; text: string; isError?: boolean };

export type CaptureResponse = { text: string } | { error: string };
