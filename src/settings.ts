export type Provider = "anthropic" | "openai" | "xai";

export interface Settings {
  provider: Provider;
  anthropicApiKey: string;
  openaiApiKey: string;
  xaiApiKey: string;
}

export const defaultSettings: Settings = {
  provider: "anthropic",
  anthropicApiKey: "",
  openaiApiKey: "",
  xaiApiKey: "",
};

export async function loadSettings(): Promise<Settings> {
  return (await browser.storage.local.get(defaultSettings)) as Settings;
}

export async function saveSettings(settings: Settings): Promise<void> {
  await browser.storage.local.set({ ...settings });
}
