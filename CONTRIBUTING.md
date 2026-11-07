# Contributing

This registry lists Grist custom widgets built with
[grist-widget-sdk](https://github.com/ArthurBlanchon/grist-widget-sdk). You
add a widget with two URLs; everything else is read from the
`grist-widget.json` manifest the widget's own deploy publishes.

## Adding a widget

1. Add an entry to [`registry.json`](./registry.json):

   ```json
   {
     "repoUrl": "https://github.com/owner/repo",
     "widgetUrl": "https://owner.github.io/repo/latest/"
   }
   ```

   - `repoUrl` is the widget's unique identifier: a bare
     `https://github.com/<owner>/<repo>`.
   - `widgetUrl` is the URL a user pastes into Grist's custom widget field,
     **as the widget's own README documents it**. Never guess one. A widget
     scaffolded with `npm create grist-widget` writes it into its README at
     its first release.

   An optional `"reference": true` marks a reference widget, which
   grist-widget-sdk's CI checks against every change. The maintainer sets
   it; don't add it in a submission.

2. Run `npm run build`: it fetches each widget's manifest and rewrites the
   list below in `README.md` and `widgets.json`. Commit them with
   `registry.json`.

3. Open a pull request. CI (`npm run check`) fetches every manifest again
   and fails if one is missing, comes from a `/dev/` build, or names another
   repository.

## Requirements for listed widgets

- **Built with grist-widget-sdk**, with `create-grist-widget` 0.3.32 or
  later: its deploy publishes `grist-widget.json` next to the widget.
- **Open source**: a public GitHub repository under an open-source license.
- Clear documentation, installation instructions, active maintenance.

## Editing or removing a widget

A widget's name, description, access level and columns come from its
manifest: change them in the widget (`WIDGET_METADATA`, `GRIST_OPTIONS`) and
release it; the published data follows within a day. To remove a widget,
delete its entry and rebuild.

## Using a coding agent

[`AGENTS.md`](./AGENTS.md) is the full process for an agent, and
[`.claude/skills/add-widget/SKILL.md`](./.claude/skills/add-widget/SKILL.md)
the Claude Code version of it.
