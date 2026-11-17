# Splitly — notes for Claude

Thai web app for splitting trip/group expenses. Plain HTML/CSS/JS front end + one Netlify Function + Netlify Blobs. No framework, no build step.
Live: https://splitly-tu109.netlify.app (the old `splitly-q3cbw` address is dead; README and two shared docs still link to it). Repo is public on GitHub, branch `main`.

## How to work with the user
- The user writes Thai; reply in Thai, simple words, outcome first, and say plainly what was NOT verified (e.g. not tried on a real iPhone).
- Test locally first, then **ask before commit, push and deploy**. The user replies "Push and deploy". An earlier "yes" never covers later changes.
- One commit per feature when files allow (run `npm test` first, `git fetch` to see others' commits). End commit messages with
  `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Never repeat or commit API keys. Keys live in Netlify env vars (the user sets them) and a git-ignored local `.env`. Do not type keys into web forms.
- Deploying: `npx netlify deploy --prod --dir=public --functions=netlify/functions`, then delete `netlify/functions/*.zip` and `manifest.json` if a build left them. A production deploy costs 15 of the free plan's 300 monthly credits, so batch changes and mention the cost.
- The user's devices: iPhone 16 Plus (iOS 26) and iPad Air 5, both running the home-screen app.

## Layout
- `public/app.js` (client, one big file), `public/style.css` (8 themes via `:root[data-theme]`), `public/index.html`, `public/sw.js` (push only, caches nothing), `public/manifest.webmanifest` and PNG icons.
- `netlify/functions/api.mjs` — all routes (`/api/auth/*`, `/api/me`, `/api/groups/*`, `/api/places`, `/api/geocode`, `/api/push/*`, `/api/admin/stats`). `handle(req, stores, deps)` is testable with in-memory stores.
- `netlify/lib/`: `auth.mjs` (scrypt, signed cookie `sp_session`), `groups.mjs` (all money rules, enforced server-side), `places.mjs` (OpenStreetMap + Foursquare), `push.mjs` (Web Push, notification text).
- `test/groups.test.mjs` (`npm test`, 37 tests, no internet), `test/local-server.mjs` (run app at http://localhost:8787, data lost on exit; use 127.0.0.1:8787 for a second account).
- `netlify.toml`: `web-push` is listed in `external_node_modules` so it ships with the function.

## Behaviour worth remembering
- Group data syncs by polling `GET /api/groups/:id?rev=N` — 5 s while active, backing off to 15/30 s and stopping after 15 min without a touch (saves Netlify credits).
- Group collections: members, expenses, payments, plans, reminders, spots (restaurants for the wheel, max 40). A transfer only counts once the receiver confirms.
- Sign-up through an invite link needs only a nickname; payment details can be added later (`later:true`), a banner reminds them. Normal sign-up still requires PromptPay or bank.
- Profile photo: small JPEG data URL (<=7000 chars) kept in the profile and in the member doc; validated server-side (`cleanPhoto`).
- Push: subscriptions stored per account at `push:<uid>` in the users store; VAPID keys made once at `config:vapid` (or `VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY`). **The VAPID subject must be an https URL — Apple rejects a made-up mail domain with 403 BadJwtToken.** The client re-registers the device on every app open (`syncPush`) because iOS can drop subscriptions after long idle. Notification = group name / who / what; iOS adds its own "from Splitly" line, which cannot be removed or moved.
- iPhone: push only works from the home-screen app (iOS 16.4+), which has separate storage from Safari (log in again there). Camera QR scan opens Safari, not the home-screen app.
- Admin dashboard: only the account named `admin` (or `ADMIN_USERNAME`) sees it; other accounts get a plain 404. **After a fresh deploy the `admin` name is claimable by anyone — the user must register it first.** It shows usernames and nicknames only, never passwords or payment data.
- Pinch zoom is blocked on purpose (viewport, `touch-action: pan-x pan-y`, iOS gesture events).
- Restaurant finder: Overpass mirrors (overpass.openstreetmap.fr works; others often fail TLS here) + optional Foursquare (free fields only). Rate limit 40 searches per 10 min per user.

## Known gaps / open items
- No forgot-password, no delete-account, "ฉันโอนแล้ว" is not checked with a bank, no timed reminders.
- Google Places was tried and returned 403 PERMISSION_DENIED (billing/API/key restriction); not integrated. A Google key was pasted in chat once — the user was told to rotate it.
- README still links the dead `splitly-q3cbw` address and says "32 tests"; user said "Not now" to fixing links. README does not yet describe push, photos, the wheel or the admin dashboard.
- Old invite QR codes made before the rename point at the dead address. Test accounts like `zz_smoke_*` remain on the live site.
- Never verified on a real device: wheel label fit on iPhone, photo picking from the album, pinch-zoom blocking, push after long idle.

## Gotchas
- Windows + Git Bash: Windows Python cannot open `/c/...` paths — pass `D:/...` paths or pipe a script via stdin. When patching files with Python from a heredoc, write `\n` via `chr(10)`/`chr(92)` or the escape becomes a real newline.
- The Browser pane sometimes refuses localhost; retry `navigate`/`preview_start`. It cannot run service workers, so push can't be tested there.
- Stale CSS: the browser may cache `style.css`; re-fetch with `cache:'reload'` before concluding a rule is missing.
