# Website repository workflow

Workspace map: see `../AGENTS.md` (mcwh). Sibling private records:
`../cardlico-website-internal` (read its README and docs before ops work).

Only direct Marcus approval authorizes changes. Keep this repository public;
record decisions and completion reports in cardlico-website-internal, not here.
If private records are unavailable, request access before operational changes.

Preserve `site-config.js` store state unless explicitly approved. Do not invent
listing URLs or launch dates. Never commit secrets or subscriber information.
Never rerun an applied migration; present exact database/proxy changes before
application. Retain strict CSP, dependency-free runtime and friendly game copy.

Before each public commit: run lint, tests and build, then audit a Vercel
preview (`npx vercel`; `vercel curl` if Deployment Protection blocks the page).
Push to `origin/main` only after explicit push approval — preview alone is not
enough. Production is GitHub → Vercel (cardlico.com); do not `vercel --prod`
unless Marcus asks for a CLI production deploy. Keep each commit scoped to the
approved task; verify the resulting deployment.
