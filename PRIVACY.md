# Privacy Policy – Zen Grammar Fix

Zen Grammar Fix has no servers of its own and collects no analytics or telemetry. The developer never receives your text or your API keys.

## What the extension handles

- **Text you choose to fix.** When you select text in a text field and click **Fix grammar**, that selection (up to 10,000 characters) is sent directly from your browser to the AI provider you picked in the options. Nothing is read from the page or sent anywhere until you click the menu item.
- **Your API keys.** The keys you enter are stored in your browser profile with `browser.storage.local`. Websites and other extensions can't read them, but they aren't encrypted on disk, so anyone with access to your browser profile folder could. They're never synced and are sent only to the matching provider to authorize requests. Using a dedicated key with a spending limit is recommended.

## Who receives your text

Only the provider you selected:

| Provider | Endpoint | Privacy policy |
| --- | --- | --- |
| Anthropic (Claude) | `api.anthropic.com` | https://www.anthropic.com/legal/privacy |
| OpenAI | `api.openai.com` | https://openai.com/policies/privacy-policy |
| xAI (Grok) | `api.x.ai` | https://x.ai/legal/privacy-policy |

Requests to OpenAI and xAI ask the provider not to store the response (`store: false`). How each provider keeps, uses, or deletes API data is governed by its own policy and your account settings with it.

## Removing your data

Clear the key fields and save, or remove the extension, which deletes its local storage.

## Contact

Questions about this policy can be sent through the extension's page on addons.mozilla.org.
