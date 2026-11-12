# Zen Grammar Fix

A Zen/Firefox extension that fixes the grammar of text you're writing. Select text in an input, textarea, or rich-text editor, right-click, and choose **Fix grammar**. The selection is replaced with the corrected text (Ctrl+Z undoes it).

Uses the [AI SDK](https://ai-sdk.dev) with Claude (`claude-haiku-5-5`), OpenAI (`gpt-5.4-nano`), or Grok (`grok-4.20-non-reasoning`). You bring your own API key.

## Usage

Open the extension's preferences (`about:addons` → Zen Grammar Fix → Preferences), choose a provider, and paste your API key. Keys are stored locally in `browser.storage.local` and sent only to the provider's API. See [PRIVACY.md](PRIVACY.md).

## Development

Requires [Bun](https://bun.sh) 1.2.23.

```sh
bun install --frozen-lockfile
bun run build        # outputs the extension to dist/
```

Load it in Zen: `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on…** → pick `dist/manifest.json`.

### Scripts

- `bun run build` – bundle `src/` into `dist/`
- `bun run typecheck` – run `tsc`
- `bun run lint` – build and run the AMO linter (`web-ext lint`) on `dist/`
- `bun run package` – build and zip `dist/` into `web-ext-artifacts/` for upload
- `bun run package:source` – zip the source needed to reproduce the build, for AMO review

## Building from source (for AMO reviewers)

`dist/` is bundled and minified by Bun from the TypeScript in `src/`. To reproduce it:

1. Install Bun 1.2.23 (`curl -fsSL https://bun.sh/install | bash -s "bun-v1.2.23"`).
2. In the source folder, run `bun install --frozen-lockfile` then `bun run build`.
3. The output in `dist/` matches the submitted package.

Notes:

- `scripts/build.ts` is the whole build: `Bun.build` bundles `src/background.ts`, `src/content.ts`, and `src/options.ts`, then copies `manifest.json`, `options.html`, and the icon.
- The only network requests go to the provider the user picks (`api.anthropic.com`, `api.openai.com`, `api.x.ai`), triggered by the **Fix grammar** menu item. Other URLs in the bundle (e.g. Vercel AI Gateway, JSON Schema) are unused code from the AI SDK.
- The single `new Function("")` in `background.js` is zod's feature check for whether eval is allowed. The extension CSP blocks it, so zod falls back to its non-eval path.
- The content script runs on all pages so it can read the selection in any editable field, but it only acts on messages from the background script after the user clicks the menu item.

## Limitations

Editors that draw text on a canvas (e.g. Google Docs) can't be edited this way.
