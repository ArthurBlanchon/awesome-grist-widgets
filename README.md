# Awesome Grist Widgets

A curated collection of custom widgets for **Grist**, all built with [grist-widget-sdk](https://github.com/ArthurBlanchon/grist-widget-sdk).

Each widget is described by the `grist-widget.json` manifest its own deploy publishes: what it does, the access it asks for, the columns it expects, its version and license. The list below is generated from them, and the same data is published for programs:

- [`widgets.json`](./widgets.json): every widget with its manifest, used by the widget directory on [gristwidgets.com](https://gristwidgets.com/widgets).
- [`grist-widgets.json`](./grist-widgets.json): the same widgets in Grist's own widget-list format. Set a self-hosted Grist's `GRIST_WIDGET_LIST_URL` to `https://raw.githubusercontent.com/ArthurBlanchon/awesome-grist-widgets/main/grist-widgets.json`, and they appear in its custom widget gallery.

Widgets marked *reference* are checked by grist-widget-sdk against every SDK change before it is released: typecheck, tests and build on each pull request, and weekly inside a real Grist.

<!-- WIDGETS:START -->

## ArthurBlanchon

- [Ask AI](https://github.com/ArthurBlanchon/ask-ai-widget) · *reference* — Ask AI questions about your Grist data. ([install](https://arthurblanchon.github.io/ask-ai-widget/latest/))
  <br>Access: `read table` · Columns: no column mapping · v0.2.0 · MIT · grist-widget-sdk 0.4.0

- [Create Email Draft](https://github.com/ArthurBlanchon/create-email-draft) · *reference* — Compose an email draft from Grist row data and recipients. ([install](https://arthurblanchon.github.io/create-email-draft/latest/))
  <br>Access: `full` · Columns: recipients (Text), replyToEmail (Text), subject (Text), content (Text)?, removedRecipients (Text)?, status (Text)?, statusDate (DateTime)? · v0.2.0 · MIT · grist-widget-sdk 0.4.0

- [Gantt](https://github.com/ArthurBlanchon/gantt-widget) · *reference* — Timeline grouped by Group_name and Sequence_name — bar colors from Event_status_color Choice styling. ([install](https://arthurblanchon.github.io/gantt-widget/latest/))
  <br>Access: `full` · Columns: Group_name (Text,Ref,Choice), Sequence_name (Text,Ref), Event_name (Text), Event_start_date (Date), Event_end_date (Date), Event_status_color (Choice)? · v0.2.0 · MIT · grist-widget-sdk 0.4.0

- [Grist Widget Template](https://github.com/ArthurBlanchon/grist-widget-template) — Mark the selected task done. ([install](https://arthurblanchon.github.io/grist-widget-template/latest/))
  <br>Access: `full` · Columns: Title (Text), Done (Bool) · v0.6.2 · MIT · grist-widget-sdk 0.6.2

- [News feed](https://github.com/ArthurBlanchon/news-feed-widget) · *reference* — GDELT Doc 2.0 article list driven by mapped columns on the linked Grist row. ([install](https://arthurblanchon.github.io/news-feed-widget/latest/))
  <br>Access: `read table` · Columns: Query (Text), Mode (Text)?, MaxRecords (Numeric)?, Timespan (Text)?, StartDateTime (Text,DateTime)?, EndDateTime (Text,DateTime)?, SourceLang (Text)?, SourceCountry (Text)?, Theme (Text)?, Domain (Text)?, Display (Text)? · v0.2.0 · MIT · grist-widget-sdk 0.4.0

- [Upload with AI](https://github.com/ArthurBlanchon/scan-with-ai) · *reference* — Upload a file per row, extract raw text, and scan with AI into metadata and AI text columns. ([install](https://arthurblanchon.github.io/scan-with-ai/latest/))
  <br>Access: `full` · Columns: File (Attachments), FileMetadata (Text), FileExtract (Text), AiText (Text) · v0.2.0 · MIT · grist-widget-sdk 0.4.0

- [World map](https://github.com/ArthurBlanchon/world-map) · *reference* — Choropleth of country counts from a table — map CountryISO (2 or 3 letters) and Count columns. ([install](https://arthurblanchon.github.io/world-map/latest/))
  <br>Access: `read table` · Columns: CountryISO (Text), Count (Numeric) · v0.2.0 · MIT · grist-widget-sdk 0.4.0

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
