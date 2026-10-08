# Cardlico website

Public source for cardlico.com: static HTML, CSS and JavaScript on Vercel,
with two same-origin serverless endpoints. No browser runtime dependencies.

## Develop and validate
Use Node.js 22 or newer (tested on Node 22 and 24).
Run `npm run lint`, `npm test`, and `npm run build`.
Run `npm run dev` to serve dist at http://127.0.0.1:4180.
The local preview does not implement the serverless endpoints; validate those
on a Vercel preview without submitting real personal data during tests.

Edit shared navigation, footer and store markup in partials/. Build expands it
into the same five page URLs and generates a content-based stylesheet hash.
Source HTML has placeholders; view built output, not source files directly.
Keep the strict CSP. The only approved inline data is the factual homepage
JSON-LD block with its matching exact CSP hash. No executable inline scripts,
inline styles, invented store URLs, release dates, ratings or prices.

## Configuration
Keep store availability in site-config.js. Empty store URLs remain disabled;
Apple stays coming soon until separately approved with a verified listing.
Server-only environment variables belong in Vercel settings, never in Git or
browser code. The leaderboard requires SUPABASE_ANON_KEY and calls a restricted read-only
RPC. Signup still requires SUPABASE_SERVICE_ROLE_KEY and SIGNUP_HASH_SECRET. Do not trust caller-supplied proxy headers or alter database
permissions without the approved private operations procedure.

## Publication and records
Create and audit a Vercel preview before committing. Run lint, tests and build
before each commit. Review scope and credentials before staging. Push approved
commits only after the preview passes; verify live CSP and robots after deployment.
No Android builds or native sync apply to this repository.

Internal proposals, applied SQL, approvals and completion records live in the
separate private website operations repository. Do not add docs/, replies/ or
sql/ here; those paths are ignored and checked by tests. Public history starts
from a single website snapshot. Earlier history is preserved in a local mirror
backup, with internal records in the private operations repository. Older clones,
forks and cached commit views may still contain earlier content. Contributors
must re-clone after replacement; GitHub Support can assist with cached views.
