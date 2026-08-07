---
name: add-widget
description: Add one or more Grist widgets to this repo's registry (widgets.json) and open a PR. Use when asked to add, register, submit, or catalog a Grist widget/repo, or when given a GitHub repo URL to add to the awesome-grist-widgets list.
---

# Add a widget to the registry

Full rules and schema reference: [`AGENTS.md`](../../../AGENTS.md) at the
repo root. Read it before making changes — this skill is the short
step-by-step version of the same process.

## The one rule that matters most

**Never invent a `widgetUrl`.** It must come from something explicit in the
target repo (README, `package.json` homepage, `manifest.json`, a linked demo
site). If the repo doesn't document its install URL, set `"widgetUrl": null`
— do not guess a `owner.github.io/repo/`-style URL and pass it off as real.
A wrong repo link is annoying; a wrong widget install URL is something a
user pastes straight into their Grist document.

## Steps

For each widget repo you're asked to add:

1. **Fetch and read the target repo** (README, `package.json`,
   `manifest.json`). Confirm it qualifies — hard requirement: **public,
   open-source repo** (not private/gated/closed-source) — plus documented,
   licensed, has install instructions, looks maintained. If it doesn't
   qualify, don't add it; say why instead.
2. **Extract**: `name`, one-sentence `description` (in the project's own
   words, condensed), `repoUrl` (bare `https://github.com/owner/repo`, no
   subpaths — this is the unique identifier and also where `author` gets
   derived from, so don't add an `author` field), and `widgetUrl` if — and
   only if — explicitly documented.
3. **Check `widgets.json` for an existing entry** with the same `repoUrl`
   (the unique key). Skip or update instead of duplicating.
4. **Append the entry** to the JSON array in `widgets.json` — all four
   fields (`name`, `repoUrl`, `widgetUrl`, `description`) required on every
   entry, per the schema in `AGENTS.md`.
5. **Regenerate and validate**:
   ```sh
   npm run generate-readme
   npm run check-readme
   node -e "JSON.parse(require('fs').readFileSync('widgets.json','utf8'))"
   ```
6. **Commit** `widgets.json` and the regenerated `README.md` together, on a
   new branch (don't commit to `main`).
7. **Open a PR.** In the body, list every widget added, note its
   qualification checks, and call out any entry left with `widgetUrl: null`
   so a human knows to verify and fill it in.

## Batching

Adding several widgets in one session? Do steps 1–4 for each, then run
step 5's validation once at the end before committing. One PR, one summary
listing all additions.
