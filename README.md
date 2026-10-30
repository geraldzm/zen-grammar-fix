# Zen Grammar Fix

A Zen/Firefox extension that fixes the grammar of text you're writing. Select text in an input, textarea, or rich-text editor, right-click, and choose **Fix grammar**. The selection is replaced with the corrected text (Ctrl+Z undoes it).

Uses the [AI SDK](https://ai-sdk.dev) with either Claude (`claude-haiku-5-5`) or Grok (`grok-4.20-non-reasoning`).

## Setup

```sh
bun install
bun run build        # outputs the extension to dist/
```

Load it in Zen: `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on…** → pick `dist/manifest.json`.

Then open the extension's preferences (`about:addons` → Zen Grammar Fix → Preferences), choose a provider, and paste your API key. Keys are stored locally in `browser.storage.local` and sent only to the provider's API.

## Scripts

- `bun run build` – bundle `src/` into `dist/`
- `bun run typecheck` – run `tsc`
- `bun run package` – build and zip with `web-ext` into `web-ext-artifacts/`

## Limitations

Editors that draw text on a canvas (e.g. Google Docs) can't be edited this way.
