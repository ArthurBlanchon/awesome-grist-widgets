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

Each entry has exactly these four fields, **all of them required on every
entry** — none are optional, none may be omitted:

```json
{
  "name": "Human-readable widget name",
  "repoUrl": "https://github.com/owner/repo",
  "widgetUrl": "https://owner.github.io/repo/",
  "description": "One sentence, present tense, describing what the widget does."
}
```

Field notes:
- `name`: required string.
- `repoUrl`: required string. **This is the widget's unique identifier** —
  there is no separate `id` field. It must be a bare
  `https://github.com/<owner>/<repo>` URL with no subpaths (the generator
  enforces this shape and rejects duplicates). The `<owner>` segment is
  used directly as the widget's author — there is no separate `author`
  field either, and no free text to keep consistent: it's derived, so it's
  always correct and always groups correctly in the generated README.
- `widgetUrl`: required key, but its value is a string **or `null`** — never
  omit the key itself. String if explicitly documented by the target repo,
  `null` otherwise (see the hard rule above). Non-null values must also be
  unique across entries.
- `description`: required string, one sentence. Don't editorialize or add
  marketing language beyond what the widget's own docs say about it.

There is no `category` field and no `id` field — the README groups by the
author derived from `repoUrl`.

## Checklist for adding a widget

1. **Verify the repo qualifies** (per `README.md` / `CONTRIBUTING.md`) —
   this is a hard requirement, not a nice-to-have:
   - **public, open-source GitHub repository.** The repo itself must be the
     widget's home, publicly visible and under an open-source license — not
     private, not gated, not just a marketing link to something closed-source.
   - has documentation, has a license, has installation instructions, and
     looks actively maintained (check last commit date). If any of these is
     missing, don't add the widget — say why in your response instead.
2. **Read the target repo's README** (and `package.json` / `manifest.json`
   if present) to find:
   - a one-sentence description (use the project's own wording, condensed)
   - the explicit install URL, if documented (do not derive `author` from
     here — it always comes from `repoUrl`, per the schema above)
3. **Check for duplicates**: search `widgets.json` for the same `repoUrl`
   before adding a new entry — it's the unique key.
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
