# Friendly website CTA and Apple status — 2026-10-03

Problem: "Ready to lose?" conflicted with the friendly game tone.
Option 1: use "Ready to play?" on all pages; validate, commit and deploy.
Marcus's exact decision: "approve, put coming soon for apple".

Implementation: index.html, how-to-play.html, leaderboard.html and privacy.html
now use the friendly CTA and label Apple buttons "Coming soon" / "App Store".
Five Apple placements updated; existing pre-launch disabled behaviour retained.
Decision recorded in docs/visual-design.md. No adjacent copy or game changes.

Validation: all four CTA replacements and all five Apple labels verified against
HTML; old CTA absent. git diff --check passed (normal Windows line-ending
warnings only). No layout, scripts or backend changes; no new test files needed.

Git: clean at start; base 9096db82719a51e5bb9220fb97e14329a4ddc8e8. Source,
design record and report included together in publication commit, identifiable
with git log for this file. Commit message: Use friendly play CTA and mark Apple coming soon.
External systems: approved GitHub main push triggers existing Vercel deployment.
Public verification follows in task chat. DNS, AdMob and Supabase unchanged.
No Android work, game version bump or build artifacts. No remaining implementation
work; store availability remains pre-launch with no iOS release date promised.
