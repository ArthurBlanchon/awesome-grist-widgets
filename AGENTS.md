# Agent instructions: adding widgets to this registry

This repo is a registry of Grist custom widgets. `widgets.json` is the single
source of truth; `README.md` is generated from it. A second consumer (a
website's "discover widgets" page) fetches `widgets.json` directly, so data
quality in that file matters more than in a typical awesome-list.

If you are an agent asked to add one or more widgets to this registry and
open a PR, follow this process exactly.

## The hard rule: never invent a URL

Every field in `widgets.json` must come from something you actually read —
the target repo's README, its `package.json` `homepage` field, its
`manifest.json`, a linked demo site, or a GitHub Pages URL that is
*explicitly stated* in the repo's own documentation.

Do **not**:
- Guess a GitHub Pages URL from the `owner.github.io/repo/` convention
  and present it as the install URL.
- Assume `repoUrl` and `widgetUrl` are the same.
- Copy a URL from a similarly-named project.

If a repo does not explicitly document its install URL, set `widgetUrl` to
JSON `null`. Do not leave the field out and do not fill it with a guess. Say
so plainly in the PR description so a human can verify and fill it in.

This rule exists because a wrong `repoUrl` just annoys a browsing human, but
a wrong `widgetUrl` is a URL that gets pasted directly into someone's Grist
document — it must be trustworthy.

## `widgets.json` schema

Each entry:

```json
{
  "id": "owner/repo",
  "name": "Human-readable widget name",
  "repoUrl": "https://github.com/owner/repo",
  "widgetUrl": "https://owner.github.io/repo/",
  "author": "Author or org display name",
  "description": "One sentence, present tense, describing what the widget does."
}
```

Field notes:
- `id`: always `owner/repo` from the GitHub URL. Must be unique.
- `repoUrl`: the canonical GitHub repository. Must be unique (don't add the
  same repo twice under different names/categories).
- `widgetUrl`: the URL a user pastes into Grist's "Custom Widget" install
  field. String if explicitly documented, `null` otherwise (see rule above).
- `author`: used to group entries in the generated README — keep the same
  spelling/casing across entries from the same author so they group
  together (e.g. always "Grist Labs", not "Grist Labs" and "gristlabs").
- `description`: one sentence. Don't editorialize or add marketing language
  beyond what the widget's own docs say about it.

There is no `category` field — the README groups by `author`.

## Checklist for adding a widget

1. **Verify the repo qualifies** (per `README.md` / `CONTRIBUTING.md`):
   public GitHub repo, has documentation, has a license, has installation
   instructions, looks actively maintained (check last commit date).
2. **Read the target repo's README** (and `package.json` / `manifest.json`
   if present) to find:
   - a one-sentence description (use the project's own wording, condensed)
   - the author/org name
   - the explicit install URL, if documented
3. **Check for duplicates**: search `widgets.json` for the same `repoUrl` or
   an equivalent `id` before adding a new entry.
4. **Add the entry** to `widgets.json`, keeping the array sorted however you
   like — the generator sorts output itself, so array order in the file
   doesn't need to match the README.
5. **Regenerate the README**:
   ```sh
   npm run generate-readme
   ```
6. **Validate**:
   ```sh
   npm run check-readme        # confirms README.md matches widgets.json
   node -e "JSON.parse(require('fs').readFileSync('widgets.json','utf8'))"  # valid JSON
   ```
7. **Commit** both `widgets.json` and the regenerated `README.md` together.
8. **Open a PR.** In the description, list each widget added and, for any
   `widgetUrl: null` entries, say explicitly that the install URL wasn't
   documented in the source repo and needs a human to confirm it.

## Adding multiple widgets in one PR

Fine to batch several additions into one PR. Run the same checklist once at
the end (add all entries, then one `generate-readme` + `check-readme` pass).
List every widget added in the PR description, each with its qualification
status (rule 1) and whether `widgetUrl` was found or left `null`.

## Do not hand-edit generated content

Never edit the widget list inside `<!-- WIDGETS:START -->` /
`<!-- WIDGETS:END -->` in `README.md` directly — it's overwritten by
`npm run generate-readme`. Edit `widgets.json` and regenerate instead.
