# Agent instructions: adding widgets to this registry

This repo is a registry of Grist custom widgets **built with
[grist-widget-sdk](https://github.com/ArthurBlanchon/grist-widget-sdk)**.
`registry.json` is the curated list, and the only file you edit. Everything
else about a widget (its name, description, access level, columns, version,
license) comes from the `grist-widget.json` manifest its own deploy
publishes next to its install URL, so it is never typed by hand and never
goes stale.

`scripts/build.mjs` reads `registry.json` and each manifest, and generates
three committed files, regenerated in the pull request that changes
`registry.json` (`npm run build`) and read straight from the repository:

- `README.md`'s widget list (between the WIDGETS markers);
- `widgets.json`: every widget with its manifest, read by the website's
  "discover widgets" page and by grist-widget-sdk's Real widgets workflow;
- `grist-widgets.json`: the same widgets in Grist's own widget-list format,
  for a self-hosted Grist's `GRIST_WIDGET_LIST_URL`.

What a widget's release changes in its manifest (version, last-updated
date) reaches these files with the next registry pull request.

If you are an agent asked to add one or more widgets and open a PR, follow
this process exactly.

## The hard rule: never invent a URL

`widgetUrl` must be the install URL the widget's own repo **explicitly
documents** (its README's install URL, usually `https://<owner>.github.io/<repo>/latest/`).
Don't guess one from the `owner.github.io/repo/` convention, don't assume
`repoUrl` and `widgetUrl` are the same, don't copy one from a similar
project. If a repo documents none, it isn't eligible yet: say so instead of
adding it.

The build enforces the rest: it fetches `<widgetUrl>grist-widget.json` and
lists the widget only if that manifest is a **release** build whose
`gristWidgetSdk.repository` is the entry's `repoUrl`. Only grist-widget-sdk's
deploy writes that file, so a wrong URL, a `/dev/` URL or a widget not built
with the SDK fails the check.

## `registry.json` schema

```json
{
  "repoUrl": "https://github.com/owner/repo",
  "widgetUrl": "https://owner.github.io/repo/latest/"
}
```

- `repoUrl`: required, the widget's unique identifier. A bare
  `https://github.com/<owner>/<repo>`, no subpath. Its `<owner>` is how the
  README groups widgets.
- `widgetUrl`: required, unique, `https`, ending with `/`: the release
  install URL its repo documents (see the hard rule).
- `reference`: optional, `true` only. Marks a **reference widget**, which
  grist-widget-sdk's CI checks against every SDK change (its "Real widgets"
  workflow reads the reference entries of `widgets.json` on `main`,
  clones each one, and runs its typecheck, tests and build; weekly also in a
  real Grist). That runs the widget's code, read-only and without secrets,
  so **never add `reference` on your own**: only when the maintainer asks.

No other field is accepted: `name`, `description` and the rest come from the
manifest.

## Checklist for adding a widget

1. **Verify the repo qualifies** — a hard requirement:
   - **built with `grist-widget-sdk`** (its `package.json` depends on it),
     with `create-grist-widget` 0.3.32 or later, whose deploy publishes
     `grist-widget.json`;
   - **public, open-source GitHub repository**, with a license (the
     manifest's `gristWidgetSdk.license` must be set), documentation,
     installation instructions, and recent activity.
   If any of these is missing, don't add it; say why.
2. **Find the documented install URL** in its README (see the hard rule).
   Check that `<widgetUrl>grist-widget.json` is served.
3. **Check for duplicates** in `registry.json` (same `repoUrl` or
   `widgetUrl`).
4. **Add the entry** to `registry.json`.
5. **Build and check**:
   ```sh
   npm test          # the build script's own tests
   npm run build     # fetches the manifests, rewrites README.md, widgets.json, grist-widgets.json
   npm run check     # what CI runs
   ```
   A manifest problem is reported per widget, with the reason: fix the
   entry, or leave the widget out and say why.
6. **Commit** `registry.json`, `README.md`, `widgets.json` and
   `grist-widgets.json` together, on a
   branch (never `main`), and **open a PR** listing each widget added, its
   qualification checks, and where its install URL is documented. Mention
   skipped candidates and why in your response.

Batching several widgets in one PR is fine: add them all, then build once.

## Do not hand-edit generated content

Never edit the list between `<!-- WIDGETS:START -->` and
`<!-- WIDGETS:END -->` in `README.md`, nor `widgets.json` or
`grist-widgets.json`: `npm run build` overwrites them. Edit `registry.json` and rebuild.
