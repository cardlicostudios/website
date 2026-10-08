# Website repository workflow

Only direct human approval authorizes changes. Keep this repository public;
internal operations records belong in the sibling cardlico-website-internal
private repository. Read its README and relevant docs before operational work.
Record decisions and completion reports there, not in this public repository.
If private records are unavailable, request access before operational changes.

Preserve site-config.js store state unless explicitly approved. Do not invent
listing URLs or launch dates. Never commit secrets or subscriber information.
Never rerun an applied migration; present exact database/proxy changes before
application. Retain strict CSP, dependency-free runtime and friendly game copy.
Run lint, tests and build and audit a Vercel preview before each public commit.
Keep each commit scoped to the approved task; verify the resulting deployment.
