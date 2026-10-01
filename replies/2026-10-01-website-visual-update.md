# Website visual update — 2026-10-01

## Problem, options and decision

The public website retained the previous navy/gold prototype identity.
Option 1: bring all four pages into the current game visual system, reuse
approved identity, validate responsive layouts and links, and record the work.
Marcus approved this local implementation/validation scope with: "approve".
Commit, push and production deployment were explicitly deferred for review.

## Implementation

- styles.css: current palette, rounded headings, outlined ivory surfaces,
  responsive spacing, focus indicators and reduced-motion styling.
- index.html: temporary three-card mark, semantic hero heading, simplified
  turquoise gameplay illustration with the current upper countdown rail.
- how-to-play.html, leaderboard.html, privacy.html: shared mark and theme color.
- README.md and docs/visual-design.md: current visual system and decision record.
- This report records validation and disposition.

No artwork files generated. No changes to the game repository, Android,
Supabase, DNS, Vercel or GitHub remote. Launch state and backend code retained.

## Validation

Playwright Chromium checked all four pages at widths 320, 393 and 1440:
12 page/viewport combinations passed without horizontal overflow, missing local
link targets or page JavaScript errors. Each page has one h1. Mobile menu open
and close passed at both phone widths on every page. Keyboard focus has a solid
visible outline. Reduced motion disables smooth scrolling and bomb animation.
Desktop/mobile full-page home screenshots and mobile inner-page screenshots
were visually reviewed. No mailing-list submissions were made.

node --check nav.js passed. git diff --check passed after whitespace cleanup.
Git emits normal Windows LF/CRLF conversion warnings.
No npm scripts, package version or Android project exist in this static website;
game npm validation, release version changes and Capacitor sync do not apply.

## Git disposition

Separate checkout: C:/Users/Marcus/Documents/mcwh/cardlico-website.
Base: 7d8118a5564471e24d4f42a256349265d0a3e7f3, main.
Six existing source/document files modified; two new records marked intent-to-add
so they appear in Git diff. Not committed, not pushed, not deployed.
Recommended commit: Align website styling with current Cardlico game identity.

## Remaining work and known limitations

- Marcus's visual review and separate authorization to commit/push/deploy.
- Connected GitHub repository permissions were read-only during initial review.
- Existing gameplay copy still describes 20 levels/5 Acts, unlike the current
  game's documented 54 levels/18 stages. Gameplay content review is separate.
- Leaderboards remain placeholders. Store buttons remain pre-launch disabled.
- The existing Notify Me navigation points at a download section without a form;
  the actual existing signup form is in the homepage hero.
- Existing README email-integration notes are stale; nav.js already calls
  Supabase. Backend availability and real signup delivery were not tested.
- This is a visual refresh, not a full accessibility or gameplay-content audit.

## Publication follow-up — 2026-10-01

Marcus approved publication with: "approve and deploy to github".
Remote main was verified at 7d8118a5564471e24d4f42a256349265d0a3e7f3 before
publication. The reviewed eight files are included in the publication commit;
its hash is discoverable with git log against this report. The earlier
not-committed disposition above records the local-review stage.
Whitespace validation passed again. Existing responsive/browser validation
remains applicable because no implementation files changed after review.
Push and Vercel verification outcomes will be reported in the task chat.
