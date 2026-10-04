# Copilot instructions

This repository is a plain static portfolio site. Keep changes compatible with a no-build workflow.

- Prefer editing [data/site.json](data/site.json) for content updates.
- Use [css/styles.css](css/styles.css) for styling and [js/main.js](js/main.js) for behavior and analytics.
- Keep the site fully usable by opening files directly or via a simple local server.
- When verifying changes, use a simple static server such as `python3 -m http.server 8000`.
- There is no standalone resume page; `/resume` redirects to [Resume/Jordy_Graven_CV.pdf](Resume/Jordy_Graven_CV.pdf) (see vercel.json).
