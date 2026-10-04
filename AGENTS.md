# AGENTS.md

## Project overview
This workspace is a static personal portfolio site built with plain HTML, CSS, and JavaScript. There is no framework, bundler, or build step.

## Key files
- [index.html](index.html) — homepage structure
- [css/styles.css](css/styles.css) — site styling
- [js/main.js](js/main.js) — content rendering, interactions, and analytics hooks
- [data/site.json](data/site.json) — homepage content data
- [Resume/Jordy_Graven_CV.pdf](Resume/Jordy_Graven_CV.pdf) — CV asset

## Working conventions
- Keep the site fully static. Avoid introducing a framework, build tooling, or package dependencies unless explicitly requested.
- Prefer editing the JSON data files for content changes and the HTML/CSS/JS files for structure and behavior.
- Preserve the existing simple navigation and section-based structure unless the brief changes.
- When adding interactions, keep them lightweight and progressive; the site should remain easy to preview locally.

## Local preview
Run a simple local server from the project root when verifying changes:

```bash
python3 -m http.server 8000
```

Then open http://127.0.0.1:8000/.

## Analytics
The site uses PostHog in the browser. Keep the analytics initialization logic in the HTML pages and the event tracking logic in [js/main.js](js/main.js).

## Content notes
- The homepage uses data-driven rendering from [data/site.json](data/site.json).
- Images live under [Photos](Photos) and should be referenced relative to the project root.
