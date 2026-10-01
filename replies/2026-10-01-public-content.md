# Public content simplification — 2026-10-01

Problem: the website revealed mechanics intended to be learned in play and used
a placeholder privacy contact.

Options: Option 1, support@cardlico.com with basic rules only; Option 2,
hello@cardlico.com with basic rules only.

Marcus's exact decision: "use support email. yeah just the main rules on the website, the rest should be learnt from playing the game".
This follows the ongoing approved GitHub publication request.

Implementation: all four HTML pages link support@cardlico.com in the footer;
privacy contact uses the same address. Home and How to Play remove special-card
mechanics, bonuses, modifiers, tips and progression spoilers. Mode descriptions
are brief; placeholder leaderboard headings and the hero illustration omit
bonus/multiplier details. docs/visual-design.md retains the decision and policy.

Validation: Playwright Chromium checked four pages at 320, 393 and 1440 pixels.
All 12 combinations had no horizontal overflow, retained their footer and
support mailto link, and contained none of the checked detailed-mechanic terms.
git diff --check passed; only normal Windows line-ending warnings remain.
No backend writes or mailing-list submissions were made. This static repository
has no package version, npm build/test scripts or Android sync requirement.

Git: source, durable design record and this report are included together in the
publication commit, identifiable by git log for this file. Recommended commit:
Keep public gameplay rules minimal and publish support contact.
External systems: GitHub main publication triggers the existing Vercel deployment;
DNS and Supabase are unchanged. Deployment result is verified in the task chat.
Remaining: existing pre-launch state and placeholder leaderboard data remain.
