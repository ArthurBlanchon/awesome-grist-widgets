# Contributing

This repository is both a browsable "awesome list" and the data source for the widget directory on the companion website. To keep both in sync, widgets are tracked as data rather than as hand-written Markdown.

## Adding a widget

1. Add an entry to [`widgets.json`](./widgets.json):

   ```json
   {
     "id": "owner/repo",
     "name": "Widget Name",
     "repoUrl": "https://github.com/owner/repo",
     "widgetUrl": "https://owner.github.io/repo/",
     "author": "Author or org name",
     "description": "One sentence describing what the widget does."
   }
   ```

   `widgetUrl` is the URL a user pastes into Grist's "Custom Widget" install field (usually GitHub Pages) — not the GitHub repo link. `repoUrl` is the source code. Widgets in the README are grouped by `author`.

2. Run:

   ```sh
   npm run generate-readme
   ```

   and commit the resulting change to `README.md` alongside `widgets.json`.

3. Open a pull request. CI runs `npm run check-readme` and fails if `README.md` doesn't match `widgets.json` — if that happens, just re-run step 2.

## Requirements for listed widgets

- a public GitHub repository
- clear documentation
- a license
- installation instructions
- active maintenance

## Editing an existing widget

Edit its entry in `widgets.json`, regenerate the README, and open a PR — same as adding one.

Please don't hand-edit the widget list inside the `<!-- WIDGETS:START -->` / `<!-- WIDGETS:END -->` markers in `README.md`; it's overwritten by the generator.
