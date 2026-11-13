# CLAUDE.md — Agromaterials Research Group website

Read this file first. The "Project status" section near the end holds the current state and next steps; update it at the end of every session.

## What this repo is

A static **Jekyll** website for the **Agromaterials Research Group**, Politeknik ATI Makassar (main field: composite materials
engineering; also agro-processing machinery, manufacturing/CNC, energy and drive systems), published with **GitHub Pages**.
The layout follows a clean academic-lab template (hero, research areas, featured research, news, team, filterable publications,
grants, blog, about, contact). CSS and JS are original; nothing was copied from the reference site.

- Live: https://agromaterials.atim.ac.id/ (custom domain, HTTPS enforced since 2026-11-10; `CNAME` file at the repo root; repo `agromaterials/agromaterials.github.io`, published branch `main`; renamed from `material-research/web` on 2026-11-08)
- Domain: `agromaterials.atim.ac.id` is live (DNS CNAME `agromaterials` -> `agromaterials.github.io`, set by campus IT). `url` in `_config.yml` is `https://agromaterials.atim.ac.id` and `baseurl` is empty. Do not delete the `CNAME` file.
- Owner's preferred language for chat: Indonesian. The website is **bilingual (English default, Indonesian via the EN | ID button)**. Current status and open items are in "Project status" below.

## Where things live

| Change | File |
|---|---|
| Group name, email, address, social links, site URL | `_config.yml` |
| Colours | `:root` in `assets/css/main.css` |
| Home hero text | `_data/i18n.yml` (`hero_title`, `hero_tagline`) |
| Research themes | `_data/research.yml` |
| Featured Research (home, best composite papers) | `_data/projects.yml` |
| News | `_data/news.yml` |
| Team and alumni | `_data/team.yml` (photos: `assets/img/team/`) |
| Publications and filter themes | `_data/publications.yml`, `_data/pub_themes.yml` |
| Grants (funder, scheme, amount, period, status) | `_data/grants.yml` |
| Resources | `_data/resources.yml` |
| Calendar | `_data/deadlines.yml` |
| Blog | `_posts/YYYY-MM-DD-title.md` |
| Interface strings (menu, buttons, headings) in EN and ID | `_data/i18n.yml` |
| Shared layout | `_layouts/`, `_includes/nav.html`, `_includes/footer.html` |
| Behaviour (JavaScript) | `_includes/js/*.js` (see "JavaScript"), not `assets/js/main.js` |

Content is data-driven: prefer editing `_data/*.yml` over editing HTML.

## Bilingual (EN | ID) system

- Every translated string is rendered twice, `<span data-lang="en">` and `<span data-lang="id">`; CSS shows
  only the language set on `<html lang>`. The choice is stored in `localStorage` (`lang`). Default is English for every visitor (no browser-language detection, by the owner's decision).
- UI text: add a key to `_data/i18n.yml` (`{ en: ..., id: ... }`) and use `{% include t.html key="..." %}`.
- Content data: add `field_id` next to `field` (e.g. `desc` / `desc_id`) and use
  `{% include tt.html en=x.desc id=x.desc_id %}`. If the `_id` value is empty, English is shown.
- Page titles/subtitles/ledes use `title_id`, `subtitle_id`, `lede_id` in front matter.
- Jekyll 3 `include` params cannot contain `[ ]`; assign to a variable first.
- `_includes/t.html` and `tt.html` must have **no trailing newline** (it would add a stray space before punctuation).
- Not translated by design: publication titles/venues and personal names. **Blog posts are bilingual** (see "Posts" below), so each language mode shows only its own language.
- JS strings (counts, calendar) live in `_data/i18n.yml` under `js_*` keys.
- **Every new piece of text needs both languages.**

## Optional / hidden pages

`resources.html`, `deadlines.html` (Calendar) and `apply.html` are hidden for now (Grants is visible). In `_config.yml`:
`show_pages.<name>: false` hides the menu links, and the three files are listed under `exclude:` so they
are not built. To bring one back, set its flag to `true` and delete its file name from `exclude:`.
Do not delete these pages or their data files unless the owner asks.

## Blog covers

Every post always has a cover. If the post has `thumbnail: file.jpg` in front matter (file in `assets/img/`), the photo is used.
**Photo sizes (keep the site fast):** use **WebP** for every photo and logo (owner already works in WebP; quality about 65-80, `method=6`). Keep JPEG/PNG only where WebP is not reliable (the social preview `og-logo.jpg`, favicon and apple-touch PNGs). `thumbnail` = article hero, about 1100 px wide, under about 120 KB.
`thumbnail_card` = blog list card, 640x360, under about 50 KB (the list uses it; the first card loads eagerly, the rest lazily). Inline
photos about 1000 px wide, under about 120 KB. Team photos square about 240 px (director portrait about 490x612), under about 40 KB. Never put a full-size camera photo in the repo. Use a new file name when replacing a photo (browser cache).
A post can also set `cover: logo` in front matter to show the group logo centred on the hexagon tile (used by the welcome post). Otherwise `_includes/post-cover.html` shows a **static** illustration (bamboo / coffee / coconut) chosen by front-matter `illus:`,
then by tags (bamboo, composite, fiber / coffee, agro, machine / coconut, ginger), then by title length. Never leave a post without a cover.

## Posts, news links, and dates

- `_config.yml` has `future: true`, so posts dated later than today are still published.
- **Every post has both languages.** Front matter: `title`, `title_id`, `summary`, `summary_id` (card text), `tags`, `tags_id`. Body: one
  `<div data-lang="en" markdown="1">...</div>` and one `<div data-lang="id" markdown="1">...</div>` (translated paragraph for paragraph). An inline
  figure sits between the blocks, with its caption written as two `<span data-lang>` spans. Dates are formatted per language by
  `_includes/date-long.html` and `date-short.html` (Indonesian month names). Do not publish a post in only one language.
- Inline photos in a post: `<figure class="post-figure"><img src="{{ '/assets/img/blog/x.jpg' | relative_url }}" alt="..."><figcaption>...</figcaption></figure>`.
- Two portrait photos side by side: `<figure class="post-figure post-figure--pair"><div class="post-figure-row"><img ...><img ...></div><figcaption>...</figcaption></figure>` (crop both to the same ratio, for example 600x800).
- Longer news model (owner's request 2026-11-12, after studying a university program news story): dateline lead, short summary of the activity, "why it matters" (problem and solution), preparation, day by day, safety, what comes next, about the program and partners with a media contact (use the group email), photos with factual captions and dates. Use facts only from the owner's reports, rundown and proposal; never invent quotes or results; leave out budgets, ID numbers, home addresses and phone numbers; avoid photos with close-up faces, vehicle plates or political prints unless the owner agrees. Photos come from the "Clean" folders (no timestamp) of the owner's Drive.
- Links to site pages inside `_data/news.yml` use the placeholder `@BASE@` (replaced by `site.baseurl` in `index.html`), e.g. `href="@BASE@/blog/..."`.

## Research page

`research.html` renders each area of `_data/research.yml` as a detail card (number, "Main field" badge on the entry with `main: true`,
same illustration as Home, same description as Home). Extra optional fields per area, each with an `_id` twin for Indonesian: `short`, `anchor`,
`topics`, `materials` (items `{ en, id, planned: true }`; `materials_label: commodities` for non-material lists), `apps`, `next`.
It deliberately has **no publications, grants, or featured projects** (they have their own pages). The Home page template is not touched by this page.
Add a new area by adding an entry (with `illus` and an SVG include plus an `elsif` in both `index.html` and `research.html`).

## Grants total

The Grants page shows a **Total funding awarded** card computed from `_data/grants.yml`. Every grant needs `amount_value` (plain number, IDR, no dots)
next to the free-text `amount`; only `status: active` or `completed` grants in rupiah are summed (add `currency: USD` etc. to leave a grant out). There is no "under review"
category: grants with `status: submitted` are not shown at all, so do not add them until they are awarded. Adding a grant with `amount_value` updates the total automatically.

Optional near-real-time rate: `lab.usd_idr_sheet` in `_config.yml` = URL of a Google Sheet published to the web as CSV (A1 `=GOOGLEFINANCE("CURRENCY:USDIDR")`, B1 optional `=NOW()`); tried first, then the public services.

Grants total card: Rupiah (from data) counts up, plus an approximate US-dollar total computed in the browser from a live USD/IDR rate (Frankfurter, backup open.er-api.com; code in `main.js`, "Grants total"). If both fail, the reference rate `lab.usd_idr_fallback` / `usd_idr_fallback_date` in `_config.yml` is used and labelled as such; refresh it now and then. The checker reads the Rupiah figure from `id="gtIdr"`. The rate note under the total (`#gtRate`) stays empty until the rate request has finished, so "Reference rate" is shown only when the live rate really failed (no flash before "Google Finance").

Home hero stat numbers (`.hero-stats b`, `.grant-stat-num`): the HTML holds the final value (no-JS, SEO, checker), CSS hides them (`.js .hero-stats b`, with a 2 s fallback reveal) until `main.js` has set them to 0 and added `stats-ready` to `<html>`, then they count up when visible. The Home USD figure (`#hsUsd`) uses the **live rate** again (owner's choice 2026-11-11, after trying a fixed estimate): all three hero numbers wait for the rate (Google Sheet first, then the public services) for 1.5 s at most (`window.LAB_STAT_GATE` in `main.js`) so they count up together; if the rate is slower, counting starts with the reference rate `lab.usd_idr_fallback` and a late rate is applied afterwards. `#hsUsd` is excluded from the small-stat count-up (it has its own). Do not show the final value before the count starts.

## Copyright

The owner chose **all rights reserved** (2026-11-05, option A): `LICENSE` and the notice in `README.md` say content, photos, logo, illustrations, and code may not be reused
without written permission (requests to agromaterialsrg@atim.ac.id). Keep both files. Do not add third-party code or media with licences that require attribution or
sharing without telling the owner. `LICENSE` is excluded from the build.

## Shared pieces added in the UI round

`_includes/cta.html` (call-to-action band, used at the end of Research, Team, Grants), back-to-top button (`#toTop` in `_layouts/default.html`, logic in `main.js`), Publications "show 10 first" limit (`PUB_LIMIT` in `main.js`), per-page `description:` front matter (used for meta and Open Graph; posts fall back to `summary`). Every new page needs a `description:`.

## Contact form

`contact.html` shows a Web3Forms form only when `lab.contact_form_key` (in `_config.yml`) is non-empty; otherwise just the email address. Logic is in `main.js` ("Contact form"), strings are the `form_*` keys in `i18n.yml`, styles `.contact-form*` in `main.css`. Do not add a second service or store messages in the repo (privacy). The key is public by design, not a secret.

## News items

`_data/news.yml` items are shown on Home as the same cards as the Blog page (`_includes/post-card.html` is shared by `blog.html` and Home: cover, date, bold title, summary, "Read more"; do not fork the two designs), **the 3 newest only**, followed by a "See all articles" button to the Blog. A `url` makes the whole card a link; when it is a blog post, the card shows that post's cover, title, and summary (the news `html` text is then not displayed); a news item without a post uses its `html` text as the title, with `image` (WebP, under 60 KB) or a patterned placeholder. With a `url` the text must not contain `<a>` links. The checker enforces this.

## Email links

Every `mailto:` link also copies the address and shows a small notice (`main.js`, "Email links"; strings `copied`), because `mailto:` does nothing on devices or in-app browsers (for example WhatsApp) that have no mail app. Keep using plain `mailto:` links; the script adds the behaviour.

## Isometric illustrations

The Home hero and the composites research area use isometric 3D animated SVGs generated by Python (`tools/gen_iso_hero.py`, `tools/gen_iso_composites.py`, shared `tools/iso_lib.py`); do not hand-edit the generated `_includes/illus/*-iso.html` or `hero-iso.html`, change the generator and re-run it. Research areas switch with `iso: true` in `_data/research.yml` (all four are on; generators `gen_iso_composites|agro|cnc|energy.py`, shared `iso_lib.py`). Home uses zigzag rows (`.research-row`, odd rows flipped); a new area needs its `{% if t.iso %}` branch in both `index.html` and `research.html`. Rules from the owner: blue and yellow only, labels in English only and hidden on phones, no glass box or tile behind the scene, keep the text small. CSS is the `.iso-*` block in `main.css`.

## Featured Research (Home)

Home section order (owner approved 2026-11-13): Hero, logo marquee, **Featured Research** (proof first), What We Study, From plant to product, News, Instagram. Section backgrounds alternate (marquee white, Featured grey, What We Study page colour, flow map grey, News white, Instagram grey); keep that alternation when reordering.

Redone on 2026-11-13 at the owner's request: **only the main field (composites), the best 3 papers**, each card a real figure from the paper, no illustrations. `_data/projects.yml` entries hold only `id`, `pub` (the paper's url exactly as in `publications.yml`, which supplies title, venue, year and journal level, one source of truth), `image` (WebP 1000x562, 16:9, with a margin of white or the figure's own background around the picture so nothing touches the card edge, under 100 KB, in `assets/img/featured/`), `alt` (English), `credit`, `license`, `license_url`, and `desc`/`desc_id` (one sentence with the main finding, only numbers that are in the paper, no colon). The whole card links to the paper (stretched title link, `target=_blank`); the credit line is the one clickable exception. Compact on purpose (the owner wants the whole section on one screen): 3 columns on desktop, a swipeable row (scroll-snap) on tablets and phones, small type; 1 paper = wide card with the image on the left. **Image rights:** use a figure only if the paper is open access with a licence that allows reuse (CC BY needs credit, shown under the card) or if it is the group's own photo; check the licence in each PDF (paper 1, Discover Materials, is CC BY 4.0). This is an exception to "all rights reserved" and the credit must stay. The old isometric featured illustrations (`feat-*-iso.html`) and `tools/gen_iso_featured.py` were deleted (the other isometric generators stay).

**Journal ranking badge** (shown to visitors as "Journal ranking" / "Peringkat jurnal"; Scopus Q1 to Q4 is the journal quartile from SJR/Scopus, SINTA 1 to 6 is the Indonesian national accreditation, not a quartile; the data field stays `level`): optional `level` ("Scopus Q1".."Scopus Q4", or plain "SINTA" as the owner chose on 2026-11-13, "SINTA 1".."SINTA 6" also valid) and `level_basis` (for example "SJR 2025", needed for Scopus levels; the two Coffee Science and the IJAME entries carry just "SJR" because the owner gave the quartile without a year) per publication in `publications.yml`, given by the owner (never guess). It shows as a yellow pill in the Publications list and on Featured cards, and the Publications page has a "level" filter (`#pubLevel`) and a "By journal ranking" bar chart under "By research area" (a bar click sets the filter; hidden while no publication has a ranking; no note under the chart, by the owner's choice) built from the levels in the data (hidden while no publication has a level). Quartiles change every year, so always state the ranking year in `level_basis` and keep it consistent. The checker validates the format.

## Home flow map, site search, charts

`_data/flow.yml` drives the Home "From plant to product" map (exactly 5 steps, EN/ID twins). `search.json` is the site-search index (add new content types there). The Publications charts are plain Liquid counts; do not add a chart library.

## SEO

Titles: Home is "Agromaterials Research Group | Politeknik ATI Makassar"; other pages "<Page> | Agromaterials Research Group". Keep titles near 60 characters and descriptions under 155 (every page needs `description:`). A post with a long title can set `seo_title:` in front matter (used only for `<title>` and Open Graph). Structured data (WebSite, ResearchOrganization with logo, Article for posts) is in `_layouts/default.html`. `lab.google_site_verification` in `_config.yml` holds the Search Console token (empty = no tag). Google Search Console is verified with the file `google1f7dc11973295fd2.html` at the repo root; do not delete it (the site would lose verification). The Home news section has `data-nosnippet` so Google does not use a news item as the result snippet (it then falls back to the meta description). The favicon is `favicon.ico` at the repo root plus `assets/img/logo-small.png` (96 px; Google wants a multiple of 48) and `favicon.png`; Google shows it in results days to weeks after indexing. The sitemap is generated by `jekyll-sitemap` and listed in `robots.txt`.

## About page logo walls

Funders and Co-author institutions on About are **logos only** (name kept as `alt` and tooltip). Data is in `_data/about.yml` (`funders`, `collaborators`, each `name`, `name_id`, `logo`); logos are WebP, cropped tight to the artwork, in `assets/img/partners/` (`h` in `about.yml` is the display height in px, set for equal visual weight: h about 66 * aspect^-0.35, so square emblems are tallest and wide wordmarks shorter; the file is exported at 2x that height; use a new file name when replacing a logo) (the checker verifies the files exist). One logo per institution (the two education ministries share one emblem; Gross Nusa Tech and PT Tjokro have no logo and are not shown, by the owner's decision). iCARE and The World Bank are shown as funders at the owner's request (the logos wrap onto a second row on About when the first row is full). The list is no longer derived from `grants.yml`, so a new funder needs a logo and an entry in `about.yml`. Logo use is by the owner's responsibility (institutions' own logos).

## JavaScript

`assets/js/main.js` is only a shell (front matter plus `{% include js/xxx.js %}` lines): Jekyll joins the parts in `_includes/js/` into **one** file at build time, so visitors download one script and all parts share one closure. **Edit the parts, not `main.js`.** Order matters: `core.js` first (helpers `qsa`, `lang`, `tr`, navigation, language switch, email links), then `publications.js`, `calendar.js`, `grants.js` (filter, total and live rate, count-up numbers), `home.js` (videos, flow map, typed word), `motion.js`, `search.js`, `views.js` (Firebase read counts), `contact.js`, and `boot.js` last (first language pass and scroll fade-in). A feature that has to change texts when the language switches listens to the `langchange` event itself (the language switch in `core.js` knows nothing about the features). A new part needs its `{% include %}` line in `main.js`; the checker verifies that every part is included, that no Liquid is left in the built file and that its syntax is valid (needs `node`). Do not write `{{` or `{%` inside a part.

## Icons

The Font Awesome library is **not** loaded. Markup stays `<i class="fas fa-flask" aria-hidden="true"></i>` (`fab` for brands), but each icon is a CSS mask with its SVG embedded in `main.css`, between the markers `ICONS:START` and `ICONS:END` (generated, do not edit by hand). Source SVGs (Font Awesome Free 6.5.1 by Fonticons, Inc., licence CC BY 4.0, notice kept in `tools/icons/LICENSE-FontAwesome.txt` and in the CSS header) are in `tools/icons/solid` and `tools/icons/brands`. To use a new icon: get its SVG from the package (`npm pack @fortawesome/fontawesome-free@6.5.1`, folders `svgs/solid` or `svgs/brands`), put it in `tools/icons/...`, run `python3 tools/gen_icons.py`. The checker fails on any `fa-xxx` used without an SVG (including `icon:` in `research.yml` and `flow.yml`). The tick in `.check-list` uses the same mask technique. Icons follow the text colour and font size.

## Automatic check on GitHub

`.github/workflows/check.yml` runs `python3 tools/check.py --build` on every push to `main` and on pull requests (a red cross on the commit means the checker found an ERROR; Pages still deploys by itself). Check the Actions tab after a push.

## Home logo marquee

Under the Home hero, `_includes/partners-marquee.html` shows a slow scrolling strip titled "Funding & Collaboration" (`about_network_title`; same font and size as the "What We Study" item names, `.theme-name`: Poppins 600, 1.2rem, sentence case) with the distinct logos from `_data/about.yml` (10 now) (funders first, then co-author institutions not already shown, so Hasanuddin appears once). Pure CSS (`.marquee*` at the end of `main.css`): four copies of the list, the track moves by -25% in a loop (44 s desktop, 36 s phone), pauses on hover (only for real pointers, `(hover: hover) and (pointer: fine)`) and while a finger presses on touch screens (`.is-held`, set by `home.js`; never rely on `:hover` for touch), fades at both edges with `mask-image` (with `-webkit-` prefix), logo heights follow `h` in `about.yml`. Only the first copy has alt text; the others are `aria-hidden`. With `prefers-reduced-motion` it becomes a static centred wrap. A new logo added to `about.yml` joins the strip automatically.

## Home Instagram gallery

Under the Home news section, `_includes/instagram-gallery.html` shows "Follow our work on Instagram". Two modes. **Grid (target, owner's choice 2026-11-12):** when `_data/instagram.yml` has `enabled: true`, a grid of the real posts as 4:5 portrait tiles (480x600 WebP in `assets/img/social/ig-<id>.webp`, link to each post, small icon for video and carousel), no third-party script on the visitor's side. **Fallback:** while `enabled: false`, the official Instagram profile embed (iframe, `.ig-embed`), which the owner found ugly (profile header, square crop, cannot be styled). The data file is written by `tools/fetch_instagram.py`, run every 6 hours by `.github/workflows/instagram.yml` (a commit only when the feed changed; also by hand: Actions > Update Instagram gallery > Run workflow), which commits to `main`. Source of the posts: `lab.instagram_feed` in `_config.yml` = the public JSON feed of the account made at Behold.so (Content type User, Output JSON; free account of the owner); fallback source is the secret `INSTAGRAM_TOKEN` (official Instagram API, 60-day token). The Behold address is public by design, not a secret. Behold refreshes its feed on its own schedule (slower on the free plan), then our workflow copies the pictures, so a new post appears within about 6 to 24 hours (2026-11-13 the owner posted and the nightly run still saw the old feed, a manual run a few hours later picked it up, so the wait is mostly Behold's own refresh). The sandbox cannot reach Behold (host blocked), but the first real run on GitHub (2026-11-12) worked: 4 posts, all carousels. Tiles are flex-centred, 4 per row on desktop, 2 on tablet and phone. The gallery shows the 4 newest posts (one row on desktop; `IG_COUNT` in the script). If Behold changes its data format, adapt `from_behold()`. The profile link is `lab.social.instagram`. Texts are the `ig_*` keys in `i18n.yml`.

## Visitor counter

Two parts. **GoatCounter** (`lab.goatcounter`, account `agromaterials`, dashboard at agromaterials.goatcounter.com, registered with the unit email) is the analytics dashboard (cookie-free page views, sources, countries, devices); its script is in `_layouts/default.html`. Its public counter proved to lag far behind the dashboard, so it is no longer used for the numbers on the pages.
**Read counts shown on the site** come from **Firebase Realtime Database** (`lab.firebase_db` in `_config.yml`, project `agromaterials`, Spark plan, region asia-southeast1, no card). JS "View counts" in `main.js` uses plain REST (no SDK): one `GET /views.json` for all counts, and `PUT /views/<key>.json` with `{".sv":{"increment":1}}` once per article per browser session. Key = path without slashes, `/` -> `~` (e.g. `blog~2026~11~06~bimtek-icare-soppeng`). Bots, headless browsers and the owner's browser (`localStorage.skipgc`, set by opening `#toggle-goatcounter` once) are not counted. Elements: `#postViews` (article) and `.card-views` with `data-views-path` (cards), hidden while the count is 0. Database rules (set in the Firebase console, Rules tab): public read of `views`; a write is allowed only when the new value is the old value plus one, so counts cannot be lowered or deleted. Abuse (someone scripting extra +1) is possible by design; reset a number in the console if needed. New posts need no setup. Counting started at zero on 2026-11-10; a starting number can be typed in the console (Data tab, `views/<key>`). If `firebase_db` is empty the counts are off.

## Naming

The group's name on the site is **Agromaterials Research Group** (no "ATIM" prefix); the campus is **Politeknik ATI Makassar**.
The logo image itself still contains the text "ATIM" (owner's artwork). Email domain `atim.ac.id` is unchanged.

## Rules

1. **Links must use `relative_url`** (`{{ '/research/' | relative_url }}`), never a bare `/research`,
   so the site works under `/web/` and on a custom domain.
2. **Safari/iPhone safety.** The owner uses iPhone Safari and only Chromium is available for testing. Never use the keyword `transparent` as a gradient stop (write the same colour at alpha 0, otherwise Safari shows grey/black), avoid `filter: drop-shadow` on animated SVG, prefix `backdrop-filter` with `-webkit-`, and prefer explicit `top/right/bottom/left` over `inset`.
3. Keep dependencies at zero: plain CSS and vanilla JS. Text fonts load from Google Fonts; **icons are built into `main.css`** (no Font Awesome library, see "Icons").
4. **Placeholders**: entries marked `[Example]`, "Your Name", `TODO`, or `example.ac.id` are fake.
   Never present them as real data; replace them when the owner provides real information.
5. **Privacy**: the repo is public. Do not commit unpublished manuscripts, raw research data,
   credentials, or personal contact details without the owner's consent.
6. Do not invent publications, people, grants, or results.
7. Do not create a pull request unless asked.
8. **Publishing branch: `main`.** The owner gave standing permission (2026-11-05, "Ya, push langsung ke main") to commit and push **directly to `main`**
   for this repo; GitHub Pages publishes `main`, so every push goes live. Work on `main`, no pull request or merge step. Do not force-push or
   rewrite history on `main` (exceptions: on 2026-11-05 and again on 2026-11-07 the owner explicitly asked for the whole history to be squashed into a single "Initial release" commit holding the current site; force-push only when the owner asks for it again). Test the build locally before pushing.

## Data checker (run before every push)

```bash
python3 tools/check.py --build
```

Needs PyYAML and Jekyll. It checks publications (theme, year, DOI format, duplicates), grants (`amount_value`, status, EN/ID twins), research areas
(topics/apps length vs `_id`, illustration file), projects, team (photos exist), news links (`@BASE@`), every `i18n` key (EN and ID), blog posts
(both languages, summary, tags, cover files), image sizes (blog 130 KB max, card 60 KB, team 50 KB, WebP), placeholder text, the no-colon style rule, and with
`--build` also internal links and that the numbers shown on the site (hero stats, grants total) match the data. **ERROR means do not push.** WARN items
(no DOI yet, `TODO` in the config) are reminders for the owner. If you add a new kind of data, extend the checker.

## Preview and test

```bash
bundle install && bundle exec jekyll serve   # http://localhost:4000/web/
```

Quick build check without bundler (as used in cloud sessions):
`gem install jekyll:3.10.0 kramdown-parser-gfm jekyll-sitemap webrick`, then
`JEKYLL_NO_BUNDLER_REQUIRE=1 jekyll build -d /tmp/site`.
After changes, check there are no broken internal links and no JS console errors.

## Deployment

`main.css` and `main.js` are linked with `?v=<build time>` in `_layouts/default.html` (cache-busting), so a new deploy always loads fresh styles. Do not remove it.

GitHub Pages builds automatically on every push to `main` (the published branch). A change appears on
the web 1–3 minutes after it is pushed to that branch. Check the Actions tab for the
"pages build and deployment" run.

## Project status (update at the end of every session)

**Live:** https://agromaterials.atim.ac.id/ (HTTPS enforced since 2026-11-10; the old github.io address redirects). Repo `agromaterials/agromaterials.github.io`, branch `main`, GitHub Pages from the root. A push goes live in 1-3 minutes; browsers may hold the old page for about 10 minutes. The owner uses iPhone Safari and often opens links inside WhatsApp (aggressive cache): after a deploy, ask for one reload in Safari. Do not delete the `CNAME` file.

**Owner:** Dr. Massriyady Massaguni, S.ST., M.T. (Research Director). Chats in Indonesian. Likes short answers, wants to discuss before big design changes, and approves visual changes step by step.

**What exists:** Home (typing headline word, isometric hero, "From plant to product" map, What We Study with zigzag rows, Featured Research (best composite papers), hero stats with funding in USD), Research, Team (director, Research Members, Research Collaborators, alumni hidden while empty), Publications (filters, charts, search), Grants (total in Rupiah and live USD, count-up numbers), Blog (bilingual posts), About, Contact (Web3Forms form), site search (Ctrl/Cmd+K), dark-blue theme with yellow accents, hidden pages (Resources, Calendar, Apply). Illustrations are generated isometric SVGs (see "Isometric illustrations").

**Rules the owner decided:** blue `#0b3d91` and yellow `#ffd60a` only; no colon (:) in site prose; EN mode shows only English and ID only Indonesian; never invent data; planned research is written as planned; no "Our role" line on grants; vision and mission stay hidden; all rights reserved (`LICENSE`); photos of people only with consent; the repo is public, so no unpublished manuscripts, raw data, or personal contact details. Do not rewrite git history unless the owner asks (done on request on 2026-11-05, 2026-11-07, 2026-11-10, 2026-11-12, and 2026-11-13).

**Data updated 2026-11-10:** Grants now has 16 entries (from the owner's CV; funder names are unified so the About funders list has no duplicates, keep one name per institution); Team has 3 Research Collaborators (Prof. Zulkifli Djafar, Prof. Rozli Zulkifli, Dr. Syahruddin Kadir), shown after the Research Members (order swapped on the owner's request).

**Open items for the owner:**
1. Web3Forms key: the contact form key is registered under a personal account, so messages arrive there. Register one with the unit email (agromaterialsrg@atim.ac.id), give Claude the new key, and set the website URL in the Web3Forms panel to the new domain (`agromaterials.atim.ac.id/contact`).
2. DOIs and full author names for the 17 publications without one; more members (name with degrees, role, focus, photo with consent), news, grants.
3. Bimtek article: outcomes and photos of day 3 if available.
3a. Featured Research is complete with 3 papers (Discover Materials, Scopus Q1, CC BY 4.0; Material Design & Processing Communications, Scopus Q2, CC BY, SJR 2025; and the safety cabin paper, Journal of Metals, Materials and Minerals, DOI 10.55713/jmmm.v36i4.2563, Scopus Q2 SJR 2025); the third card's PDF states no licence, so the card credits it as the authors' own figure (Fig. 7, UL-94 burn test, cropped to three rows on a navy canvas) at the owner's instruction (2026-11-13) and the checker keeps a WARN reminder to confirm the journal's reuse policy. Remove the image if the journal objects. Rankings of the other publications are optional and come from the owner; on 2026-11-13 the owner decided to keep only rankings that are certain (3 papers now) and leave the rest without one (national proceedings, a dissertation, book chapter). Never fill a ranking from memory or from outdated aggregator pages; sinta and scimagojr are not reachable from the sandbox. Note for the owner: the abstract of paper 2 lists 3%, 5% and 7% NaOH but its table and conclusion include 11%.
3b. Instagram gallery is live from the Behold feed (2026-11-12) and refreshed every 6 hours by a workflow; nothing to do unless Behold stops (free plan refresh interval unknown) or the workflow turns red. Publications rankings are in for 11 of 25 papers (Scopus Q1 x1, Q2 x2, Q3 x3, SINTA x5); the rest stay without one.
4. Review the Indonesian text written by Claude.
5. Register the new address in Google Search Console and replace old links shared earlier.
6. Security: the owner confirmed (2026-11-11) that 2FA is already on for their GitHub account. Do not ask about it again.
7. Optional: restyle the static blog covers (bamboo, coffee, coconut) in the isometric style; a drill bit in the composites scene (undecided).

**Common tasks:** add a member in `_data/team.yml` (WebP photo about 240 px, new file name; a `collaborators:` list works the same way); publications in `_data/publications.yml` (DOI as `https://doi.org/...`); grants in `_data/grants.yml` (`amount_value` always; the total in Rupiah and USD updates by itself); news in `_data/news.yml`; posts in `_posts/` (both languages). Every text needs EN and ID. Run `python3 tools/check.py --build` before every push (0 errors).

**Periodic routine:** update when something notable happens and do a short review at the end of each month (also refresh `usd_idr_fallback` in `_config.yml`, the reference rate used when the live rate is unavailable): new publications or DOIs, new or changed grants, members and roles, news and posts, changes to titles or contact details. Then run the checker, push to `main`, and update this section.

**Sandbox limits (for Claude):** no access to `github.io`, `atim.ac.id`, Scholar, ORCID, or public DNS services (the owner pastes data; check deploys through GitHub Actions); only Chromium is available for screenshots, not Safari; avoid `rm -rf` style commands (use `git rm` for tracked files). The git remote may point to the old repo name; it redirects, but set it to `https://github.com/agromaterials/agromaterials.github.io`.

## Session handoff protocol

At the end of every work session, update the "Project status" section above: what was done, what is still pending or blocked, decisions made and why, and anything the owner must do. Commit it together with the work. At the start of a session, read this file, then `git log --oneline -10`, before changing anything.
