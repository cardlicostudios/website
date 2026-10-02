# Website privacy, advertising verification and logo — 2026-10-02

Option 1: correct the privacy policy from current game data flows, publish the
exact AdMob app-ads.txt line, validate, commit and deploy. Marcus supplied
`google.com, pub-9255693906990271, DIRECT, f08c47fec0942fa0` and approved the
complete scope with "ok".

During implementation Marcus also requested: "can u update with this logo ?"
and identified cardlico_app_icon_master.svg, google_play_icon_512x512.png and
cardlico_icon_master_1024x1024.png under the game's docs/assets/app-icon-preview/.
Use those supplied assets for website identity. Do not modify Android or game assets.

Policy sources: current game docs/supabase-architecture.md, docs/data-and-save-contract.md,
src/supabase/auth.ts, src/ads/AdMobService.ts, docs/settings.md and audience decision
in docs/monetization_spec.md. Website nav.js stores voluntary launch signup email
in Supabase; the public site also uses Cloudflare services and Vercel hosting.
Google SDK disclosure: https://developers.google.com/admob/android/privacy/play-data-disclosure
Google app-ads setup: https://support.google.com/admob/answer/9363762

Publishing these files does not complete Play Data Safety, consent-message
publication or AdMob verification/review. Those remain separate account tasks.
