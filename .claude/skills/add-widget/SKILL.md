---
name: add-widget
description: Add one or more Grist widgets built with grist-widget-sdk to this repo's registry (registry.json) and open a PR. Use when asked to add, register, submit, or catalog a Grist widget/repo, or when given a GitHub repo URL to add to the awesome-grist-widgets list.
---

# Add a widget to the registry

Full rules: [`AGENTS.md`](../../../AGENTS.md) at the repo root. This is the
short version.

## The rules that matter most

- **SDK widgets only.** The widget must be built with `grist-widget-sdk`
  (`create-grist-widget` 0.3.32 or later), so its deploy publishes
  `grist-widget.json` next to its install URL. Anything else isn't eligible.
- **Never invent a `widgetUrl`.** Use the install URL the widget's own README
  documents (usually `https://<owner>.github.io/<repo>/latest/`). None
  documented: not eligible yet; say so.
- **Never add `"reference": true`** unless the maintainer asks.

## Steps

1. Read the target repo: README (install URL), `package.json` (depends on
   `grist-widget-sdk`, has a `license`), recent activity. Not qualifying:
   skip it and say why.
2. Check `<widgetUrl>grist-widget.json` is served (a release build of that
   repo).
3. Check `registry.json` for the same `repoUrl` or `widgetUrl`.
4. Add `{ "repoUrl": ..., "widgetUrl": ... }` to `registry.json`. No other
   field: name, description and the rest come from the manifest.
5. Run:
   ```sh
   npm test
   npm run build   # rewrites README.md, widgets.json and grist-widgets.json
   npm run check
   ```
6. Commit `registry.json`, `README.md`, `widgets.json` and
   `grist-widgets.json` on a new branch
   (never `main`), and open a PR listing each widget, its qualification
   checks, and where its install URL is documented. Mention skipped
   candidates in your response.
