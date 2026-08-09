# It's Doable

A personal health tracker: profile intake, body composition estimates, an AI-generated
diet & workout plan, recipes, exercise guides, and daily meal/weight tracking.

It's a single self-contained page (`index.html`) — no build step, no backend.

## Running it

Just open `index.html` in a browser, or serve the repo with any static file server:

```
python3 -m http.server 8000
```

### GitHub Pages

A workflow at `.github/workflows/pages.yml` deploys `index.html` to GitHub Pages on every
push to `main`. To turn it on (one-time): **Settings → Pages → Build and deployment →
Source: GitHub Actions**. After that, pushes to `main` publish automatically.

## Data storage

All accounts, profiles, meal logs, and uploaded files (photos, lab reports) are stored
locally in the browser via IndexedDB. Nothing leaves your device except the AI calls
described below. Data is per-browser/per-device — there's no sync across devices, and
clearing site data / browser storage will delete it.

Sign-up and password-reset verification codes are shown on-screen instead of emailed,
since this app has no backend to send mail from.

## AI features

Report analysis, plan generation, recipes, exercise guides, and meal-calorie estimates
call the Anthropic API directly from your browser. Click the ⚙ icon (top right, once
logged in) and paste your own Anthropic API key — get one at
[console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys).

The key is stored only in your browser's IndexedDB and sent only to `api.anthropic.com`.
Because it lives in the browser, anyone with access to your browser/devtools on that
device could read it — fine for personal use on a device you control, but don't use a
key with a high spending limit, and don't share the page/device with others.

Without a key, everything else in the app (the intake steps, body-composition math,
measurements, tracking) still works — only the AI-backed steps are unavailable.
