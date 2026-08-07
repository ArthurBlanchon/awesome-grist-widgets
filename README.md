# Awesome Grist Widgets

A curated collection of custom widgets for **Grist**.

This list is also published as structured data in [`widgets.json`](./widgets.json), used to power the "discover widgets" directory on the companion website. The list below is generated from that file — see [Contributing](#contributing) before editing it by hand.

<!-- WIDGETS:START -->

## beta.gouv.fr

- [Grist Custom Widgets FR Admin](https://github.com/betagouv/grist-custom-widgets-fr-admin) — Collection of widgets developed for French administration workflows. ([install](https://betagouv.github.io/grist-custom-widgets-fr-admin/))

## Grist Labs

- [Advanced Charts](https://github.com/gristlabs/custom-charts-widget) — Interactive Plotly-powered charting widget for creating rich visualizations directly in Grist. ([install](https://gristlabs.github.io/custom-charts-widget/))

- [Grist Widget Examples](https://github.com/gristlabs/grist-widget) — Official reference implementations and examples for building custom Grist widgets, including record views and invoice-style layouts. ([install](https://gristlabs.github.io/grist-widget/))

## opocola

- [Ultra Kanban Widget](https://github.com/opocola/ultra-kanban-widget) — Advanced Kanban board experience for managing Grist records visually. ([install](https://opocola.github.io/ultra-kanban-widget/))

## salmanmkc

- [Grist Custom Widget Kanban](https://github.com/salmanmkc/Grist-Custom-Widget-Kanban) — Kanban-style custom widget for organizing records by workflow state. ([install](https://dycazo-by-fastcube.github.io/Grist-Custom-Widget-Kanban/))

<!-- WIDGETS:END -->

## More Widgets Coming

This catalog is being expanded with additional community widgets. Every entry uses the GitHub repository as the canonical source.

## Contributing

Widgets are tracked as data in [`widgets.json`](./widgets.json) — this README is generated from it, so please don't edit the list above by hand.

To add a widget:

1. Add an entry to `widgets.json` with `id` (`owner/repo`), `name`, `repoUrl`, `widgetUrl` (the URL to paste into Grist's "Custom Widget" install field), `author`, and `description`.
2. Run `npm run generate-readme` and commit the resulting `README.md` change alongside `widgets.json`.
3. Open a pull request. CI checks that `README.md` matches `widgets.json`.

Widgets should have:

- a public GitHub repository
- clear documentation
- a license
- installation instructions
- active maintenance

## License

The contents of this repository are licensed under the MIT License. Individual widgets remain the property of their respective authors and are distributed under their own licenses.
