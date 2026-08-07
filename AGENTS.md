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

If a repo does not explicitly document its install URL, **the widget is not
eligible for this registry yet** — do not add it, and do not use `null` as a
placeholder. Say so in your response instead of opening a PR for it (or open
an issue proposing it once the maintainer documents an install URL).

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
- `widgetUrl`: required string, must be unique across entries. It must be an
  install URL the target repo *explicitly documents* (see the hard rule
  above). Never `null`, never omitted, never guessed — if there's nothing
  explicit to put here, the widget doesn't get an entry.
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
   - the explicit install URL (do not derive `author` from here — it always
     comes from `repoUrl`, per the schema above). **If you can't find one
     explicitly documented, stop here** — don't add the widget, and say so
     in your response.
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
8. **Open a PR.** In the description, list each widget added, its
   qualification checks, and where its `widgetUrl` was documented (link or
   quote the source). If you skipped a candidate widget because it had no
   documented install URL, mention that in your response too, outside the PR.

## Adding multiple widgets in one PR

Fine to batch several additions into one PR. Run the same checklist once at
the end (add all entries, then one `generate-readme` + `check-readme` pass).
List every widget added in the PR description, each with its qualification
status (rule 1) and where its `widgetUrl` was sourced from. List any
candidates you skipped for lacking a documented install URL separately, so
the human knows what didn't make it in and why.

## Do not hand-edit generated content

Never edit the widget list inside `<!-- WIDGETS:START -->` /
`<!-- WIDGETS:END -->` in `README.md` directly — it's overwritten by
`npm run generate-readme`. Edit `widgets.json` and regenerate instead.
