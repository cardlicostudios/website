# Cardlico — Marketing Site

The marketing and landing website for **Cardlico**, a mobile card-sorting game.
Plain HTML + CSS + vanilla JavaScript. No framework, no build step, no external
dependencies or fonts.

## File structure

```
cardlico-site/
├── index.html              Landing page
├── how-to-play.html        Rules, special cards, modifiers, scoring
├── leaderboard.html        All-time / Daily Challenge / Endless leaderboards
├── privacy.html            Privacy policy
├── styles.css              Shared design system and styles
├── nav.js                  Shared nav, launch-state, and form behaviour
├── vercel.json             Deployment config + security headers
├── README.md               This file
└── .github/
    └── workflows/
        └── deploy.yml      HTML validation on push
```

## Local preview

No build step needed. Just serve the folder with any static file server, e.g.:

```bash
npx serve .
```

Or open `index.html` directly in a browser.

## Deploying to Vercel

1. Push this folder to a new GitHub repository.
2. In the [Vercel dashboard](https://vercel.com/new), import the repository.
3. Framework preset: **Other** (static site) — no build command, no output
   directory override needed.
4. Deploy. Every subsequent push to `main` redeploys automatically.

`vercel.json` sets clean URLs (`/how-to-play` instead of `/how-to-play.html`)
and baseline security headers.

## Going live (launch day)

All download buttons are controlled by a single flag in `nav.js`:

```js
const LAUNCHED = false;
```

To go live:

1. Open `nav.js`.
2. Set `LAUNCHED = true`.
3. Fill in your real store URLs:

   ```js
   const STORE_URLS = {
     googlePlay: 'https://play.google.com/store/apps/details?id=YOUR_APP_ID',
     appStore:   'https://apps.apple.com/app/idYOUR_APP_ID',
   };
   ```

4. Commit and push to `main`. Vercel redeploys, and every download button on
   every page instantly points to the real stores. The email capture forms
   and "leaderboards go live at launch" banner hide themselves automatically.

## Updating store links later

Store URLs live in one place — `STORE_URLS` at the top of `nav.js`. Update
them there and push; every page picks up the change, since all download
buttons are wired via `data-store="play"` / `data-store="ios"` attributes
rather than hardcoded links.

## Design system

The website follows the current game shell: turquoise backgrounds, ivory
reading surfaces, indigo structure, rose actions and rounded system headings.
Shared tokens and responsive styles live in `styles.css`. The temporary
three-card mark uses HTML/CSS, with no external fonts or new artwork.
See [the visual design record](docs/visual-design.md) for sources and scope.

## Notes

- The game prototype file is **not** included in this deliverable. This
  repository only contains the marketing site.
- Leaderboard data on `leaderboard.html` is placeholder until the app ships
  and a real backend (Supabase) is wired in.
- The email capture form in the Coming Soon state currently just clears the
  input and shows a success message — connect it to a real endpoint
  (e.g. a Supabase table or a form service) before relying on it to collect
  real signups.
