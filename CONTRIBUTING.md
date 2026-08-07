# Contributing

This repository is both a browsable "awesome list" and the data source for the widget directory on the companion website. To keep both in sync, widgets are tracked as data rather than as hand-written Markdown.

## Adding a widget

1. Add an entry to [`widgets.json`](./widgets.json):

   ```json
   {
     "name": "Widget Name",
     "repoUrl": "https://github.com/owner/repo",
     "widgetUrl": "https://owner.github.io/repo/",
     "description": "One sentence describing what the widget does."
   }
   ```

   All four fields are required on every entry — there is no optional field.

   - `repoUrl` is the widget's **unique identifier** (there's no separate `id` field). It must be a bare `https://github.com/<owner>/<repo>` URL, no subpaths — the `<owner>` segment is also what the README groups widgets by (there's no `author` field either; it's derived from this URL).
   - `widgetUrl` is the URL a user pastes into Grist's "Custom Widget" install field (usually GitHub Pages) — not the GitHub repo link.
     **Never invent it.** Only use it if the target repo's own README/`package.json`/`manifest.json` explicitly documents an install URL. If it doesn't, set `"widgetUrl": null` — don't guess a `owner.github.io/repo/`-style URL and present it as real. (The field is still required — always include the key, with `null` as its value when there's nothing documented.)

2. Run:

   ```sh
   npm run generate-readme
   ```

   and commit the resulting change to `README.md` alongside `widgets.json`.

3. Open a pull request. CI runs `npm run check-readme` and fails if `README.md` doesn't match `widgets.json` — if that happens, just re-run step 2.

## Requirements for listed widgets

- **Must be open source**: the repo behind `repoUrl` must be public and shared under an open-source license. No private, gated, or closed-source repos — the GitHub repository *is* the widget's canonical home, not just a landing page for it.
- clear documentation
- a license
- installation instructions
- active maintenance

## Editing an existing widget

Edit its entry in `widgets.json`, regenerate the README, and open a PR — same as adding one.

Please don't hand-edit the widget list inside the `<!-- WIDGETS:START -->` / `<!-- WIDGETS:END -->` markers in `README.md`; it's overwritten by the generator.

## Using a coding agent to add widgets

See [`AGENTS.md`](./AGENTS.md) for a process a coding agent can follow
end-to-end — including the full schema and the rule against invented URLs.
A Claude Code-specific version of the same steps lives at
[`.claude/skills/add-widget/SKILL.md`](./.claude/skills/add-widget/SKILL.md).
