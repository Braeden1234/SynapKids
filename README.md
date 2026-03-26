# Synap Kids — Website

A youth-led nonprofit website advancing pediatric brain health through education, storytelling, and advocacy.

## Project Structure

```
SynapKids/
├── index.html              # Home page
├── about.html              # Our Story
├── staff.html              # Our Team
├── programs.html           # Programs
├── resources.html          # Resource Library
├── articles.html           # Articles / Blog
├── chapters.html           # All Chapters
├── involve.html            # Get Involved (Start / Join a Chapter, Exec Team)
├── donate.html             # Donate
├── sponsor.html            # Sponsor Us
├── contact.html            # Get Help / Contact
├── googled512b4efaa821aad.html  # Google Search Console verification
│
├── assets/
│   ├── css/
│   │   └── global.css      # All site-wide styles
│   └── js/
│       └── global.js       # Navbar, footer, routing (go()), and all logic
│
└── components/
    ├── navbar.html         # Standalone navbar (reference copy)
    └── footer.html         # Standalone footer (reference copy)
```

## Getting Started

Open `index.html` in a browser — no build step or server required.

For local development with a proper server (recommended for fetch-based features):
```bash
npx serve .
# or
python3 -m http.server 8080
```

## Navigation

All page navigation uses the `go(key)` function defined in `assets/js/global.js`.

| Key         | Destination        |
|-------------|--------------------|
| `home`      | `index.html`       |
| `about`     | `about.html`       |
| `staff`     | `staff.html`       |
| `programs`  | `programs.html`    |
| `resources` | `resources.html`   |
| `articles`  | `articles.html`    |
| `involve`   | `involve.html`     |
| `chapters`  | `chapters.html`    |
| `donate`    | `donate.html`      |
| `sponsor`   | `sponsor.html`     |
| `contact`   | `contact.html`     |

## Editing the Navbar / Footer

The navbar and footer are injected on every page via `global.js` (see `NAVBAR_HTML` and `FOOTER_HTML` constants at the top of the file). Edit them once there and the change applies site-wide.

## Deployment

Drop the entire folder onto any static host (Netlify, Vercel, GitHub Pages, etc.). No server-side code required.
