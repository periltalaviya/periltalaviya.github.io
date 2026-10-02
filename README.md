# periltalaviya.github.io

My personal portfolio. Hand written HTML, CSS and JavaScript — no framework, no
build step, no dependencies.

**Live:** https://periltalaviya.github.io

## Run it locally

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Any static server works. Opening `index.html` directly also works, though serving
over HTTP is closer to how GitHub Pages behaves.

## Files

| File | What it is |
|---|---|
| `index.html` | All the content and markup |
| `styles.css` | Theme variables, layout, responsive rules |
| `main.js` | Theme toggle, mobile menu, scroll spy, reveals, interactive terminal |
| `assets/favicon.svg` | Favicon |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

## Notes

- Light theme is the default; the toggle stores the choice in `localStorage` and
  a small script in `<head>` applies it before first paint so there is no flash.
- The terminal in the hero is real. Try `help`, `whoami`, `stack`, `experience`,
  `contact`, `theme`, `clear`.
- Everything degrades without JavaScript: content is only hidden once the page
  confirms JS is running, and a timer reveals it all regardless after 2.2s.

## Deploy

Push to `main`. GitHub Pages serves it directly — there is no build step.
