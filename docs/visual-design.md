# Website visual system

## Decision — 2026-10-01

Problem: the website uses the previous navy/gold game prototype identity.

Option 1 (proposed): update all four pages to the current game's typography,
palette, card styling and layout; reuse approved assets; validate desktop/mobile
layouts and links; document the change and completion evidence locally.

Marcus's exact response: "approve".

Commit, push and production deployment remain outside this approval.

## Source of truth

The game repository's docs/visual-design-system.md and src/styles/brand.css
define turquoise #52d5cb, ivory #fff8e8, indigo #173a72, rose #c82f6f,
jade #1e7d69 and reward yellow #f4c542. Rounded system headings, flat
surfaces, thin indigo outlines and restrained shadows carry the identity.
The temporary three-card mark is reused as HTML/CSS; it is not final artwork.
No card-back artwork is created or changed.

The website remains static HTML/CSS/JavaScript. Shared styles live in styles.css.
The hero illustration is a simplified gameplay illustration, not a screenshot.
Gameplay rules, launch state, store URLs, mailing-list integration and privacy
copy are retained. Content accuracy requires a separate review.

## Validation and release boundary

Check all four pages at phone and desktop sizes, local links, navigation,
keyboard focus and reduced motion. This repository has no package manifest,
Android project or npm build/test scripts; game version bumps and Capacitor
sync do not apply to this website-only change.
GitHub main remains connected to Vercel; publishing requires later approval.

## Publication approval — 2026-10-01

Marcus's exact decision after reviewing the local update: "approve and deploy to github".
This authorizes committing the reviewed source and records, pushing to the website
repository, and checking the existing GitHub-to-Vercel deployment. The earlier
local-only approval remains recorded above as the original decision.

## Public content decision — 2026-10-01

Option 1: publish support@cardlico.com and retain only the basic swipe rules,
leaving special-card mechanics and bonuses for discovery in the game.
Option 2: use hello@cardlico.com with the same minimal rules.
Marcus chose: "use support email. yeah just the main rules on the website, the rest should be learnt from playing the game".
Public gameplay copy must explain the four suit directions and swiping before
time runs out, without special-card details, scoring formulas or progression spoilers.
