#!/usr/bin/env node
// Builds the registry from registry.json, the curated list, and the
// grist-widget.json manifest each widget deploys next to its install URL
// (written by grist-widget-sdk's `create-grist-widget manifest`):
//
//   widgets.json        every entry with its manifest: name and description
//                       at the top level (what the website reads), the
//                       whole manifest under `manifest`.
//   grist-widgets.json  the list in Grist's own format (ICustomWidget), for
//                       a self-hosted Grist's GRIST_WIDGET_LIST_URL.
//   README.md           the section between the WIDGETS markers.
//
// All three are committed, regenerated in the pull request that changes
// registry.json, and read straight from the repository (raw URLs), with no
// publishing step. What a widget's release changes in its manifest (its
// version, lastUpdatedAt) reaches them with the next registry pull request;
// a reader that wants it live (the website) fetches the manifest from the
// widget's install URL.
//
// It reads data only: no widget code runs. A manifest must be a release
// build (not /dev/) and name the entry's own repository, which only the
// SDK's CLI writes: that is how an entry proves it is an SDK widget whose
// install URL its own deploy publishes.
//
//   node scripts/build.mjs           fetch the manifests, write the three files
//   node scripts/build.mjs --check   validate the manifests, and that the three files
//                                    list exactly registry.json's entries
//
// No dependencies: Node 22's fetch and builtins only.

import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
export const MANIFEST_FILE = "grist-widget.json"
const START = "<!-- WIDGETS:START -->"
const END = "<!-- WIDGETS:END -->"

const REPO_URL = /^https:\/\/github\.com\/([A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)\/([A-Za-z0-9._-]+)$/
const ENTRY_KEYS = new Set(["repoUrl", "widgetUrl", "reference"])
const ACCESS = new Set(["none", "read table", "full"])

/** Problems with registry.json itself (shape, duplicates); [] when fine. */
export function registryProblems(registry) {
  if (!Array.isArray(registry)) return ["registry.json must be an array"]
  const problems = []
  const seen = new Set()
  for (const entry of registry) {
    const id = JSON.stringify(entry?.repoUrl ?? entry)
    if (!entry || typeof entry !== "object") {
      problems.push(`${id}: not an object`)
      continue
    }
    for (const key of Object.keys(entry)) if (!ENTRY_KEYS.has(key)) problems.push(`${id}: unknown field "${key}"`)
    if (!REPO_URL.test(entry.repoUrl ?? "")) problems.push(`${id}: repoUrl must be https://github.com/<owner>/<repo>`)
    let url
    try {
      url = new URL(entry.widgetUrl)
    } catch {
      problems.push(`${id}: widgetUrl is not a URL`)
    }
    if (url && (url.protocol !== "https:" || !url.pathname.endsWith("/"))) {
      problems.push(`${id}: widgetUrl must be an https URL ending with /`)
    }
    if ("reference" in entry && entry.reference !== true) problems.push(`${id}: "reference" must be true, or left out`)
    for (const key of [String(entry.repoUrl).toLowerCase(), String(entry.widgetUrl).toLowerCase()]) {
      if (seen.has(key)) problems.push(`${id}: duplicate ${key}`)
      seen.add(key)
    }
  }
  return problems
}

/** Problems with an entry's fetched manifest; [] when it may be listed. */
export function manifestProblems(entry, manifest) {
  const id = entry.repoUrl
  if (!manifest || typeof manifest !== "object") return [`${id}: ${MANIFEST_FILE} is not a JSON object`]
  const problems = []
  for (const key of ["name", "widgetId", "url"]) {
    if (typeof manifest[key] !== "string" || !manifest[key].trim()) problems.push(`${id}: manifest has no ${key}`)
  }
  if (manifest.accessLevel !== undefined && !ACCESS.has(manifest.accessLevel)) {
    problems.push(`${id}: manifest accessLevel ${JSON.stringify(manifest.accessLevel)} is not one of ${[...ACCESS].join(", ")}`)
  }
  const sdk = manifest.gristWidgetSdk
  if (!sdk || sdk.schema !== 1) {
    problems.push(`${id}: no gristWidgetSdk.schema 1 in the manifest: is it built with grist-widget-sdk (create-grist-widget 0.3.32 or later)?`)
    return problems
  }
  if (String(sdk.repository).toLowerCase() !== id.toLowerCase()) {
    problems.push(`${id}: the manifest at widgetUrl belongs to ${JSON.stringify(sdk.repository)}`)
  }
  if (sdk.channel !== "release" || manifest.published === false) {
    problems.push(`${id}: widgetUrl serves a ${sdk.channel} build: use the release URL (…/latest/)`)
  }
  if (!sdk.license) problems.push(`${id}: the widget has no license in package.json`)
  return problems
}

/** widgets.json: what the website reads, sorted by name. */
export function catalog(listed) {
  return listed
    .map(({ entry, manifest }) => ({
      name: manifest.name,
      repoUrl: entry.repoUrl,
      widgetUrl: entry.widgetUrl,
      description: manifest.description ?? "",
      ...(entry.reference ? { reference: true } : {}),
      manifest,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

/** grist-widgets.json: Grist's widget-list format, installing each widget's /latest/ URL. */
export function gristList(listed) {
  return catalog(listed).map(({ widgetUrl, manifest }) => ({ ...manifest, url: widgetUrl, published: true }))
}

function owner(repoUrl) {
  return REPO_URL.exec(repoUrl)[1]
}

function columnsText(columns) {
  if (!columns?.length) return "no column mapping"
  return columns.map((c) => (typeof c === "string" ? c : `${c.name}${c.type ? ` (${c.type})` : ""}${c.optional ? "?" : ""}`)).join(", ")
}

/** The README section: widgets grouped by owner, each with what its manifest declares. */
export function readmeSection(widgets) {
  if (!widgets.length) return "_No widget yet: the first ones join as they are released._"
  const groups = new Map()
  for (const w of widgets) groups.set(owner(w.repoUrl), [...(groups.get(owner(w.repoUrl)) ?? []), w])
  return [...groups.keys()]
    .sort((a, b) => a.localeCompare(b))
    .map((who) => {
      const lines = groups.get(who).map((w) => {
        const m = w.manifest
        const s = m.gristWidgetSdk
        return [
          `- [${w.name}](${w.repoUrl})${w.reference ? " · *reference*" : ""} — ${w.description} ([install](${w.widgetUrl}))`,
          `  <br>Access: \`${m.accessLevel ?? "none"}\` · Columns: ${columnsText(m.columns)} · v${s.version} · ${s.license} · grist-widget-sdk ${s.sdk}`,
        ].join("\n")
      })
      return `## ${who}\n\n${lines.join("\n\n")}`
    })
    .join("\n\n")
}

export function withSection(readme, section) {
  const start = readme.indexOf(START)
  const end = readme.indexOf(END)
  if (start === -1 || end < start) throw new Error(`README.md must contain ${START} and ${END}`)
  return `${readme.slice(0, start + START.length)}\n\n${section}\n\n${readme.slice(end)}`
}

async function fetchManifest(entry) {
  const url = new URL(MANIFEST_FILE, entry.widgetUrl).href
  let response
  try {
    response = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(20_000) })
  } catch (e) {
    return { problems: [`${entry.repoUrl}: ${url}: ${e.message}`] }
  }
  if (!response.ok) return { problems: [`${entry.repoUrl}: ${url}: HTTP ${response.status}`] }
  try {
    return { manifest: await response.json() }
  } catch {
    return { problems: [`${entry.repoUrl}: ${url} is not JSON`] }
  }
}

/** Committed files listing other entries than registry.json does (a stale pull request). */
export function staleFiles(registry, readme, widgets, gristWidgets) {
  const sorted = (list) => list.map((s) => String(s).toLowerCase()).sort().join("\n")
  const want = sorted(registry.map((e) => e.repoUrl))
  const inReadme = sorted([...readme.slice(readme.indexOf(START), readme.indexOf(END)).matchAll(/^- \[[^\]]*\]\((https:\/\/github\.com\/[^)]+)\)/gm)].map((m) => m[1]))
  const inWidgets = sorted((Array.isArray(widgets) ? widgets : []).map((w) => w.repoUrl))
  const inGrist = sorted((Array.isArray(gristWidgets) ? gristWidgets : []).map((w) => w.gristWidgetSdk?.repository))
  return [
    inReadme === want ? null : "README.md",
    inWidgets === want ? null : "widgets.json",
    inGrist === want ? null : "grist-widgets.json",
  ].filter(Boolean)
}

async function main() {
  const args = process.argv.slice(2)
  const check = args.includes("--check")
  const registry = JSON.parse(readFileSync(path.join(ROOT, "registry.json"), "utf8"))
  const problems = registryProblems(registry)
  const listed = []
  if (!problems.length) {
    for (const entry of registry) {
      const { manifest, problems: fetchProblems } = await fetchManifest(entry)
      if (fetchProblems) problems.push(...fetchProblems)
      else {
        const found = manifestProblems(entry, manifest)
        if (found.length) problems.push(...found)
        else listed.push({ entry, manifest })
      }
    }
  }
  if (problems.length) {
    console.error(`registry: ${problems.length} problem(s)\n- ${problems.join("\n- ")}`)
    process.exit(1)
  }
  console.log(`registry: ${listed.length} widget(s), every manifest valid`)
  const readmePath = path.join(ROOT, "README.md")
  const widgetsPath = path.join(ROOT, "widgets.json")
  const gristPath = path.join(ROOT, "grist-widgets.json")
  if (check) {
    const read = (file) => {
      try {
        return JSON.parse(readFileSync(file, "utf8"))
      } catch {
        return null
      }
    }
    const stale = staleFiles(registry, readFileSync(readmePath, "utf8"), read(widgetsPath), read(gristPath))
    if (stale.length) {
      console.error(`${stale.join(" and ")} don't list registry.json's entries: run \`npm run build\` and commit the result.`)
      process.exit(1)
    }
    return
  }
  const widgets = catalog(listed)
  const json = (value) => JSON.stringify(value, null, 2) + "\n"
  writeFileSync(widgetsPath, json(widgets))
  writeFileSync(gristPath, json(gristList(listed)))
  writeFileSync(readmePath, withSection(readFileSync(readmePath, "utf8"), readmeSection(widgets)))
  console.log("wrote README.md, widgets.json and grist-widgets.json")
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main()
