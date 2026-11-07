# Awesome Grist Widgets

A curated collection of custom widgets for **Grist**, all built with [grist-widget-sdk](https://github.com/ArthurBlanchon/grist-widget-sdk).

This list is also published as structured data in [`widgets.json`](./widgets.json), used to power the "discover widgets" directory on the companion website. The list below is generated from that file — see [Contributing](#contributing) before editing it by hand.

Widgets marked *reference* are built with [grist-widget-sdk](https://github.com/ArthurBlanchon/grist-widget-sdk), which checks them against every SDK change before it is released: typecheck, tests and build on each pull request, and weekly inside a real Grist.

<!-- WIDGETS:START -->



<!-- WIDGETS:END -->

## More Widgets Coming

The first widgets join as they are released. Every entry uses the GitHub repository as the canonical source.

## Contributing

Widgets are tracked as data in [`widgets.json`](./widgets.json) — this README is generated from it, so please don't edit the list above by hand.

To add a widget:

1. Add an entry to `widgets.json` with `name`, `repoUrl` (the widget's unique identifier — a bare `https://github.com/<owner>/<repo>` URL), `widgetUrl` (the URL to paste into Grist's "Custom Widget" install field), and `description`. These four fields are required on every entry; `reference` is optional and set by the maintainer only (see [`AGENTS.md`](./AGENTS.md)) — `widgetUrl` must be an install URL the target repo explicitly documents; if it doesn't document one, the widget isn't eligible yet. There's no `author` field — it's derived from the `<owner>` in `repoUrl`, which is also how the list below is grouped.
2. Run `npm run generate-readme` and commit the resulting `README.md` change alongside `widgets.json`.
3. Open a pull request. CI checks that `README.md` matches `widgets.json`.

Coding agents can do this end-to-end — see [`AGENTS.md`](./AGENTS.md) for the
full process and rules (most importantly: never invent a `widgetUrl`).

Widgets **must**:

- be built with [grist-widget-sdk](https://github.com/ArthurBlanchon/grist-widget-sdk) (scaffolded with `npm create grist-widget`, or using the SDK)
- live in a public, open-source GitHub repository (the repo itself is the widget's home — no proprietary/closed-source submissions, no repos that are private or gated)
- have clear documentation
- have a license
- have installation instructions
- show active maintenance

## License

The contents of this repository are licensed under the MIT License. Individual widgets remain the property of their respective authors and are distributed under their own licenses.
