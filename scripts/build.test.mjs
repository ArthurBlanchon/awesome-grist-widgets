// node --test scripts/: the registry's rules (build.mjs), without the network.
import assert from "node:assert/strict"
import { test } from "node:test"

import { catalog, gristList, manifestProblems, readmeSection, registryProblems, staleFiles, withSection } from "./build.mjs"

const entry = { repoUrl: "https://github.com/Acme/map", widgetUrl: "https://acme.github.io/map/latest/" }
const manifest = (extra = {}, sdk = {}) => ({
  name: "Map",
  widgetId: "@acme/map",
  url: "https://acme.github.io/map/v1.0.0/",
  published: true,
  accessLevel: "read table",
  columns: [{ name: "Country", type: "Text" }],
  description: "A map.",
  gristWidgetSdk: { schema: 1, channel: "release", version: "1.0.0", repository: "https://github.com/acme/map", license: "MIT", sdk: "0.3.27", ...sdk },
  ...extra,
})

test("registry.json: shape, fields and duplicates", () => {
  assert.deepEqual(registryProblems([entry, { ...entry, repoUrl: "https://github.com/acme/other", widgetUrl: "https://acme.github.io/other/latest/", reference: true }]), [])
  assert.match(registryProblems([{ ...entry, name: "x" }])[0], /unknown field "name"/)
  assert.match(registryProblems([{ ...entry, repoUrl: "https://github.com/acme/map/tree/dev" }])[0], /repoUrl/)
  assert.match(registryProblems([{ ...entry, widgetUrl: "http://acme.github.io/map/" }])[0], /https URL ending with \//)
  assert.match(registryProblems([{ ...entry, reference: false }])[0], /"reference" must be true/)
  assert.match(registryProblems([entry, entry]).join(), /duplicate/)
  assert.deepEqual(registryProblems({}), ["registry.json must be an array"])
})

test("a manifest is listed only if it is a release build of the entry's own SDK widget", () => {
  assert.deepEqual(manifestProblems(entry, manifest()), [])
  assert.match(manifestProblems(entry, manifest({}, { repository: "https://github.com/evil/map" })).join(), /belongs to/)
  assert.match(manifestProblems(entry, manifest({ published: false }, { channel: "dev" })).join(), /dev build/)
  assert.match(manifestProblems(entry, manifest({ gristWidgetSdk: undefined })).join(), /grist-widget-sdk/)
  assert.match(manifestProblems(entry, manifest({}, { license: null })).join(), /no license/)
  assert.match(manifestProblems(entry, manifest({ accessLevel: "admin" })).join(), /accessLevel/)
  assert.match(manifestProblems(entry, manifest({ name: "" })).join(), /no name/)
})

test("widgets.json keeps the website's fields; the Grist list installs /latest/", () => {
  const listed = [{ entry: { ...entry, reference: true }, manifest: manifest() }]
  const [w] = catalog(listed)
  assert.deepEqual(Object.keys(w), ["name", "repoUrl", "widgetUrl", "description", "reference", "manifest"])
  const [g] = gristList(listed)
  assert.equal(g.url, entry.widgetUrl)
  assert.equal(g.published, true)
  assert.equal(g.widgetId, "@acme/map")
})

test("the README section groups by owner and says what each widget declares", () => {
  const section = readmeSection(catalog([{ entry, manifest: manifest() }]))
  assert.match(section, /^## Acme/)
  assert.match(section, /Access: `read table` · Columns: Country \(Text\) · v1\.0\.0 · MIT · grist-widget-sdk 0\.3\.27/)
  assert.match(readmeSection([]), /No widget yet/)
  assert.equal(withSection("a<!-- WIDGETS:START -->old<!-- WIDGETS:END -->b", "new"), "a<!-- WIDGETS:START -->\n\nnew\n\n<!-- WIDGETS:END -->b")
})

test("a pull request must regenerate the three files when registry.json changes", () => {
  const listed = [{ entry, manifest: manifest() }]
  const widgets = catalog(listed)
  const readme = withSection("<!-- WIDGETS:START --><!-- WIDGETS:END -->", readmeSection(widgets))
  assert.deepEqual(staleFiles([entry], readme, widgets, gristList(listed)), [])
  const added = { repoUrl: "https://github.com/acme/new", widgetUrl: "https://acme.github.io/new/latest/" }
  assert.deepEqual(staleFiles([entry, added], readme, widgets, gristList(listed)), ["README.md", "widgets.json", "grist-widgets.json"])
  assert.deepEqual(staleFiles([entry], readme, widgets, null), ["grist-widgets.json"])
  assert.deepEqual(staleFiles([], withSection("<!-- WIDGETS:START --><!-- WIDGETS:END -->", readmeSection([])), [], []), [])
})
