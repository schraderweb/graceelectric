# Grace Electric — Website

Official website for Grace Electric. A static site built from reusable sections and deployed on Vercel.

---

## The One Rule You Must Remember

> **Everything you edit lives in `public/`.**
>
> The HTML pages inside `public/` (`index.html`, `residential.html`, `contact.html`) are **generated** from `public/src/` — the build overwrites them every time.
>
> ⚠️ The `index.html` at the project root is a **stale legacy copy** — the live site does not use it. Ignore it (and the stray files like `bg.jpg`, `hero-desktop.png`, `logo-nav.svg` at the root). Only work inside `public/`.

How the build works:

```
 public/src/*.html  (page sections)  ──▶  npm run build  ──▶  public/index.html
                                                                public/residential.html
                                                                public/contact.html
                                                                └──▶  Vercel publishes the public/ folder
```

---

## Folder Map

```
◄── EDIT HERE ───────────────────────────────────────────────────────►

 public/                    THE place to make changes
 ├── src/                   Page sections (the text/content of the site)
 │   ├── _hero.html           Homepage banner
 │   ├── _hero-residential.html   Residential page banner
 │   ├── _hero-contact.html       Contact page banner
 │   ├── _about.html          About section
 │   ├── _expertise.html      Services section
 │   ├── _projects.html       Projects gallery
 │   ├── _reviews.html        Customer reviews
 │   ├── _footer.html         Footer + contact info
 │   └── (full list below)
 ├── images/                ALL website images live here
 │   ├── expertise/           Service photos
 │   ├── projects/            Project photos
 │   ├── residential/         Residential page photos
 │   └── ...                  Hero, about, logo, favicons
 ├── css/                   Styles (home, residential, contact, shared)
 ├── js/                    Scripts
 └── build.js               The build script — assembles the 3 pages

 form-mail.html            Email template for the contact form


◄── DO NOT TOUCH ───────────────────────────────────────────────────►

 index.html                Generated page (built from src/)
 residential.html          Generated page (built from src/)
 contact.html              Generated page (built from src/)

 api/send-enquiry.js       Form endpoint (Vercel serverless)
 functions/                Cloudflare Pages versions of the API endpoints
 server.js                 Local dev server
 vercel.json               Deploy settings
 package.json              Project commands
```

### Page sections in `public/src/`

| File | What it contains |
| --- | --- |
| `_head.html` / `_head-residential.html` / `_head-contact.html` | Page title + meta tags per page |
| `_nav.html` | Top navigation bar |
| `_hero*.html` | Page banners |
| `_about.html` | About section |
| `_expertise.html` | Services offered |
| `_reviews.html` | Customer reviews |
| `_projects.html` | Projects gallery |
| `_content-residential.html` | Residential page body |
| `_content-contact.html` | Contact page body |
| `_badges.html` | Trust badges |
| `_serving.html` | Areas served |
| `_map.html` | Embedded map |
| `_footer.html` | Footer + contact/links |
| `_scripts.html` | Script includes |

---

## How to Update Images (most common task)

1. Find the right folder inside `public/images/` — service photos in `public/images/expertise/`, project photos in `public/images/projects/`, etc.
2. **Keep the exact same file name** as the one you are replacing.
   - Same name = no code changes needed.
   - Adding a brand-new image? Simple name: lowercase, no spaces.
3. Rebuild and deploy (next section).

> **Supported formats:** `.webp` (best), `.png`, `.jpg`. Keep images a few hundred kB or less.

---

## How to Edit Text / Prices / Phone Numbers

1. Open the matching section file in `public/src/` (see the table above).
2. Change the text, save the file.
3. Rebuild and deploy.

---

## Run Locally (Developer)

Requirements: [Node.js](https://nodejs.org) (LTS) installed.

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Start the dev environment
npm start
```

Then open **http://localhost:3000** — the page auto-reloads when you edit HTML/CSS/JS in `public/`.

| Command | What it does |
| --- | --- |
| `npm install` | Installs dependencies (run once after cloning) |
| `npm start` / `npm run dev` | Build + dev server + live reload on port 3000 |
| `npm run build` | Assembles the 3 pages inside `public/` |
| `npm run server` | Just the server on port 3001 (no auto-reload) |
| `node public/sync.js` | Utility: pull edits made directly in a built page back into `src/` |

---

## Deploy (Publish the Site)

The site is hosted on **Vercel**, connected to the GitHub repository.

1. Edit files in `public/src/` (or `public/images/`).
2. `npm run build` so the generated pages are up to date.
3. Commit and push to `main` — Vercel builds and publishes the `public/` folder automatically.

```
 Edit public/  →  npm run build  →  Commit + push to main  →  Vercel deploys  →  Live site
```

---

## Environment Variables

Sensitive settings live in the hosting dashboard (Vercel → Settings → Environment Variables). Never put them in code.

| Variable | Purpose |
| --- | --- |
| `GOOGLE_MAPS_API_KEY` | Loads the map embedded on the site (served via `/api/maps-key`) |
| `RESEND_API_KEY` | Sends contact-form emails |
| `FROM_EMAIL` | Sender address for form emails |
| `TO_EMAILS` | Where enquiry emails are delivered (comma-separated) |

---

## Contact Form

The enquiry form submits to `api/send-enquiry.js` (Vercel), which sends the email via [Resend](https://resend.com). A Cloudflare Pages version also exists in `functions/api/` if the site ever moves to Cloudflare. Configure the variables above in whichever host is active.
