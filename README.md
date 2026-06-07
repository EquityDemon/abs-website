# LSESU African Business Society

Static website for the LSESU African Business Society.

## Pages

- `index.html` — Landing page (hero, sector coverage, conversation, footer)
- `about.html` — Mission + team
- `reports.html` — Research reports with sector filter
- `events.html` — Upcoming and past events
- `contact.html` — Contact form + alternative ways to reach the society

## Stack

Pure static HTML/CSS/JS — no build step, no framework, no dependencies.

- Inter (sans) + Playfair Display (serif) loaded from Google Fonts
- Logo and team photos embedded as base64 (no external image files needed)
- Single shared CSS block per page, JavaScript inline at the bottom

## Local preview

Open `index.html` in any browser. All pages cross-link to each other; the site
works fully offline.

## Deployment (Vercel)

The `vercel.json` enables clean URLs — `/about` instead of `/about.html`.

### Option A — drag & drop (no GitHub)

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Look for "Deploy without Git" / "drop a folder" option
4. Drag the entire folder containing these files
5. Click Deploy. Done — you get a `*.vercel.app` URL in about 30 seconds.

### Option B — GitHub + Vercel (recommended for ongoing updates)

1. Create a GitHub repo (e.g. `abs-website`)
2. Push these files to it (`git init`, commit, push)
3. On Vercel, click "Add New..." → "Project" → "Import Git Repository"
4. Pick your repo. Settings: framework "Other", no build command needed.
5. Click Deploy.

Any future `git push` re-deploys automatically.

## Updating content

- **Reports** — edit the `reports` array in `reports.html`.
- **Events** — edit `upcoming` and `past` arrays in `events.html`.
- **Team** — edit the cards in the team section of `about.html`. To change
  photos, swap the `data:image/jpeg;base64,...` strings.

## Contact form

The form currently opens the user's email client via `mailto:`. For a real
backend capturing submissions to a dashboard:

1. Sign up at https://formspree.io (free tier: 50 submissions/month)
2. Get your endpoint URL (e.g. `https://formspree.io/f/abc123`)
3. In `contact.html`, change the `<form>` opening tag to add `action` and `method`
4. Remove the JavaScript handler at the bottom of `contact.html`.

## Custom domain

After deploying to Vercel:
1. Go to Project → Settings → Domains
2. Add your domain
3. Add the DNS records Vercel shows at your registrar
4. Propagation takes minutes to a few hours.
