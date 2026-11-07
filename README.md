# Awesome Grist Widgets

A curated collection of custom widgets for **Grist**, all built with [grist-widget-sdk](https://github.com/ArthurBlanchon/grist-widget-sdk).

Each widget is described by the `grist-widget.json` manifest its own deploy publishes: what it does, the access it asks for, the columns it expects, its version and license. The list below is generated from them, and the same data is published for programs:

- [`widgets.json`](./widgets.json): every widget with its manifest, used by the widget directory on [gristwidgets.com](https://gristwidgets.com/widgets).
- [`grist-widgets.json`](./grist-widgets.json): the same widgets in Grist's own widget-list format. Set a self-hosted Grist's `GRIST_WIDGET_LIST_URL` to `https://raw.githubusercontent.com/ArthurBlanchon/awesome-grist-widgets/main/grist-widgets.json`, and they appear in its custom widget gallery.

Widgets marked *reference* are checked by grist-widget-sdk against every SDK change before it is released: typecheck, tests and build on each pull request, and weekly inside a real Grist.

<!-- WIDGETS:START -->

## ArthurBlanchon

- [Grist Widget Template](https://github.com/ArthurBlanchon/grist-widget-template) — Edit the selected row's title and mark it done. ([install](https://arthurblanchon.github.io/grist-widget-template/latest/))
  <br>Access: `full` · Columns: title (Text), done (Bool) · v0.3.32 · MIT · grist-widget-sdk 0.3.27

<!-- WIDGETS:END -->

## Contributing

Add a widget with two URLs in [`registry.json`](./registry.json): its GitHub repository and the install URL its README documents. Run `npm run build`, commit, and open a pull request; everything else comes from the widget's manifest. [`CONTRIBUTING.md`](./CONTRIBUTING.md) has the details, and [`AGENTS.md`](./AGENTS.md) the process for a coding agent.

Widgets **must**:

- be built with [grist-widget-sdk](https://github.com/ArthurBlanchon/grist-widget-sdk), with `create-grist-widget` 0.3.32 or later (scaffolded with `npm create grist-widget`)
- live in a public, open-source GitHub repository, under a license
- have clear documentation and installation instructions
- show active maintenance

## License

The contents of this repository are licensed under the MIT License. Individual widgets remain the property of their respective authors and are distributed under their own licenses.
