# Website language aligned with bible, 2026-10-03

Problem: website copy retained punitive language, em dashes and arrow glyphs.
Option 1: consult the bible and docs, correct these across the website, validate,
commit and deploy. Marcus's exact approval: "approve".

Sources: game_design_bible.md Core Principles and Failure presentation;
production_bible.md campaign failure decisions; game-rules.md core input mapping;
visual-design-system.md presentation guidance. Non-punitive learning governs tone.

Changes: four HTML pages replace punitive phrases and metadata with encouraging
learning language, spell out suit directions, remove standalone direction arrows,
and replace em dashes (including leaderboard empty cells with Pending). nav.js
uses ordinary punctuation in its failure message. Supplied logo artwork unchanged.
Durable language rule added to docs/visual-design.md.

Validation: source scan across all four pages and nav.js finds no Game over,
Zero mercy, em dash or cardinal arrow glyph. Playwright checks at 320, 393 and
1440px across all pages passed without horizontal overflow. node --check nav.js
and git diff --check passed. Normal Windows line-ending warnings only. No signup
or backend writes. Local file rendering checks layout, not live backend behaviour.

Git: source and both records included in publication commit, identifiable via git
log for this report. Recommended commit: Align website language with friendly game bible.
External systems: approved GitHub push triggers Vercel. Public deployment verified
in task chat. No game, Android, DNS, Supabase or AdMob changes. Website-only edits
require no game release version, native sync or Android artifact generation.
Remaining: no further implementation in this scope; account tasks remain separate.
