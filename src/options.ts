import { loadSettings, saveSettings, type Provider } from "./settings";

const provider = document.getElementById("provider") as HTMLSelectElement;
const anthropicApiKey = document.getElementById("anthropicApiKey") as HTMLInputElement;
const xaiApiKey = document.getElementById("xaiApiKey") as HTMLInputElement;
const status = document.getElementById("status") as HTMLSpanElement;

loadSettings().then((settings) => {
  provider.value = settings.provider;
  anthropicApiKey.value = settings.anthropicApiKey;
  xaiApiKey.value = settings.xaiApiKey;
});

/* Keys are printable ASCII with no spaces. A stray line break would also make the browser
   echo the whole key back in its "invalid header" error, so reject anything else up front */
const KEY_PATTERN = /^[\x21-\x7E]*$/;

function showStatus(text: string, isError = false) {
  status.textContent = text;
  status.classList.toggle("error", isError);
}

document.getElementById("save")!.addEventListener("click", async () => {
  const keys = { anthropicApiKey: anthropicApiKey.value.trim(), xaiApiKey: xaiApiKey.value.trim() };
  if (!KEY_PATTERN.test(keys.anthropicApiKey) || !KEY_PATTERN.test(keys.xaiApiKey)) {
    showStatus("API keys can't contain spaces, line breaks, or special characters.", true);
    return;
  }
  await saveSettings({ provider: provider.value as Provider, ...keys });
  showStatus("Saved");
  setTimeout(() => showStatus(""), 1500);
});
