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

// Fixed emoji per category, purely cosmetic. Add a new line here when a
// new category is introduced in widgets.json.
const CATEGORY_EMOJI = {
  "Charts & Data Visualization": "📊",
  "Kanban & Project Management": "📋",
  "Developer Tools": "🧰",
  "Specialized Widgets": "🏛️",
};

function loadWidgets() {
  const raw = JSON.parse(readFileSync(WIDGETS_PATH, "utf8"));

  if (!Array.isArray(raw)) {
    throw new Error("widgets.json must contain an array of widgets.");
  }

  const seenIds = new Set();
  const seenRepoUrls = new Set();
  const requiredFields = ["id", "name", "repoUrl", "author", "description", "category"];

  for (const widget of raw) {
    for (const field of requiredFields) {
      if (!widget[field] || typeof widget[field] !== "string") {
        throw new Error(
          `Widget entry ${JSON.stringify(widget)} is missing required string field "${field}".`
        );
      }
    }
    if (seenIds.has(widget.id)) {
      throw new Error(`Duplicate widget id: ${widget.id}`);
    }
    if (seenRepoUrls.has(widget.repoUrl)) {
      throw new Error(`Duplicate repoUrl: ${widget.repoUrl}`);
    }
    seenIds.add(widget.id);
    seenRepoUrls.add(widget.repoUrl);
  }

  return raw;
}

function groupByCategory(widgets) {
  const groups = new Map();
  for (const widget of widgets) {
    if (!groups.has(widget.category)) {
      groups.set(widget.category, []);
    }
    groups.get(widget.category).push(widget);
  }
  return groups;
}

function renderWidgetsSection(widgets) {
  const groups = groupByCategory(widgets);
  const categories = [...groups.keys()].sort((a, b) => a.localeCompare(b));

  const sections = categories.map((category) => {
    const emoji = CATEGORY_EMOJI[category] ?? "🧩";
    const entries = groups
      .get(category)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(
        (w) =>
          `- [${w.name} - by ${w.author}](${w.repoUrl}): ${w.description}`
      )
      .join("\n\n");
    return `## ${emoji} ${category}\n\n${entries}`;
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
