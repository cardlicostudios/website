# Privacy, app-ads.txt and supplied logo — 2026-10-02

Problem: the old privacy policy denied ad identifiers and omitted AdMob,
Google leaderboard identity and website signup processing. The site also needed
the AdMob publisher record and Marcus's selected logo.

Option 1: update privacy disclosures from source, add the exact publisher line,
validate, commit and deploy. Marcus approved with "ok" after supplying
`google.com, pub-9255693906990271, DIRECT, f08c47fec0942fa0`.
Additional direct instruction: "can u update with this logo ?" followed by
three master SVG/PNG paths; these supplied assets replace the temporary mark.

Changed: privacy.html; app-ads.txt; vercel.json plain-text response header;
all four pages' logo and browser-icon references; styles.css logo sizing/link
readability; three supplied files copied under assets/; README.md;
docs/privacy-and-advertising.md; docs/visual-design.md; this report.

Validation: node --check nav.js and git diff --check passed. Playwright checked
four pages at 320, 393 and 1440px: no horizontal overflow, all logo images loaded,
no obsolete no-ad-identifiers statement. Exact app-ads.txt string assertion passed.
Desktop home and mobile privacy screenshots visually reviewed. Initial browser
check found the old local preview server stopped; restarted it and all checks
passed. Windows line-ending warnings only. No signup submissions or backend writes.

Git disposition: reviewed files included together in publication commit; obtain
its SHA using git log for this report. Base main 458ce9909c233ce079d63821f12fb5ef90dbc6ec.
Recommended commit: Publish privacy and AdMob verification with supplied Cardlico logo.
External systems: GitHub main push and its existing Vercel deployment. DNS,
Supabase, Google Play and AdMob account settings remain unchanged.

Remaining: public endpoint/deployment verification is reported in the task chat.
AdMob crawling/verification, consent-message publication and Play Data Safety
remain separate account tasks. Website publication alone does not complete those.
No game code, app version, native icon, Android sync, APK or AAB changed.
