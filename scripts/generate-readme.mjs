#!/usr/bin/env node
// Generates the widget list section of README.md from widgets.json.
//
// widgets.json is the single source of truth. Do not hand-edit the
// generated section of README.md between the WIDGETS:START/END markers —
// run `npm run generate-readme` instead.
//
// Usage:
//   node scripts/generate-readme.mjs          # writes README.md
//   node scripts/generate-readme.mjs --check   # exits 1 if README.md is stale

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const WIDGETS_PATH = path.join(ROOT, "widgets.json");
const README_PATH = path.join(ROOT, "README.md");

const START_MARKER = "<!-- WIDGETS:START -->";
const END_MARKER = "<!-- WIDGETS:END -->";

// repoUrl is the unique identifier for a widget (no separate "id" field)
// and also the source we derive the display "author" from — the GitHub
// owner/org segment. This must be a bare https://github.com/<owner>/<repo>
// URL (no subpaths) for both of those to work reliably.
const REPO_URL_PATTERN = /^https:\/\/github\.com\/([A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)\/([A-Za-z0-9._-]+?)\/?$/;

function repoOwner(repoUrl) {
  const match = repoUrl.match(REPO_URL_PATTERN);
  if (!match) {
    throw new Error(
      `repoUrl "${repoUrl}" must look like https://github.com/<owner>/<repo> (no subpaths, no trailing content) — the owner segment is used as the widget's author.`
    );
  }
  return match[1];
}

function loadWidgets() {
  const raw = JSON.parse(readFileSync(WIDGETS_PATH, "utf8"));

  if (!Array.isArray(raw)) {
    throw new Error("widgets.json must contain an array of widgets.");
  }

  const seenRepoUrls = new Set();
  const seenWidgetUrls = new Set();
  // Every field is required and non-null on every entry. widgetUrl must be
  // an explicitly documented install URL (see AGENTS.md) — a widget with no
  // documented install URL doesn't get an entry here at all, rather than a
  // null placeholder.
  const requiredStringFields = ["name", "repoUrl", "widgetUrl", "description"];

  for (const widget of raw) {
    for (const field of requiredStringFields) {
      if (!widget[field] || typeof widget[field] !== "string") {
        throw new Error(
          `Widget entry ${JSON.stringify(widget)} is missing required string field "${field}".`
        );
      }
    }

    // Validates the repoUrl shape and, as a side effect, that we can derive
    // an author from it.
    repoOwner(widget.repoUrl);

    if (seenRepoUrls.has(widget.repoUrl)) {
      throw new Error(`Duplicate repoUrl (this is the unique identifier): ${widget.repoUrl}`);
    }
    seenRepoUrls.add(widget.repoUrl);

    if (seenWidgetUrls.has(widget.widgetUrl)) {
      throw new Error(`Duplicate widgetUrl: ${widget.widgetUrl}`);
    }
    seenWidgetUrls.add(widget.widgetUrl);
  }

  return raw;
}

function groupByAuthor(widgets) {
  const groups = new Map();
  for (const widget of widgets) {
    const author = repoOwner(widget.repoUrl);
    if (!groups.has(author)) {
      groups.set(author, []);
    }
    groups.get(author).push(widget);
  }
  return groups;
}

function renderWidgetsSection(widgets) {
  const groups = groupByAuthor(widgets);
  const authors = [...groups.keys()].sort((a, b) => a.localeCompare(b));

  const sections = authors.map((author) => {
    const entries = groups
      .get(author)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(
        (w) => `- [${w.name}](${w.repoUrl}) — ${w.description} ([install](${w.widgetUrl}))`
      )
      .join("\n\n");
    return `## ${author}\n\n${entries}`;
  });

  return sections.join("\n\n");
}

function main() {
  const checkOnly = process.argv.includes("--check");

  const widgets = loadWidgets();
  const generated = renderWidgetsSection(widgets);

  const readme = readFileSync(README_PATH, "utf8");
  const startIdx = readme.indexOf(START_MARKER);
  const endIdx = readme.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error(
      `README.md must contain both ${START_MARKER} and ${END_MARKER} markers.`
    );
  }

  const before = readme.slice(0, startIdx + START_MARKER.length);
  const after = readme.slice(endIdx);
  const next = `${before}\n\n${generated}\n\n${after}`;

  if (checkOnly) {
    if (next !== readme) {
      console.error(
        "README.md is out of date with widgets.json. Run `npm run generate-readme` and commit the result."
      );
      process.exit(1);
    }
    console.log("README.md is up to date with widgets.json.");
    return;
  }

  writeFileSync(README_PATH, next);
  console.log("README.md regenerated from widgets.json.");
}

main();
