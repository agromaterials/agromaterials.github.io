# Agromaterials Research Group website

Website of the **Agromaterials Research Group**, Politeknik ATI Makassar. Main field is composite materials engineering, with agro-processing machinery, manufacturing and CNC, and energy and drive systems.
Static [Jekyll](https://jekyllrb.com/) site on GitHub Pages, bilingual (English and Indonesian).

- Live site: https://agromaterials.atim.ac.id/ (repo `agromaterials/agromaterials.github.io`; the github.io address redirects to the campus domain)
- Publishing branch: `main` (every push goes live in 1 to 3 minutes)

## What the site has

- Home with an animated isometric hero (typing headline word), a "From plant to product" map, research areas, featured research, and recent news
- Research, Team, Publications (filters, charts, search), Grants (total funding in Rupiah and live US dollars), Blog (bilingual articles), About, and Contact (form delivered to the group email)
- English and Indonesian switch (EN | ID), site search (Ctrl/Cmd+K), responsive layout for phones, tablets, and desktops
- Plain HTML, CSS, and JavaScript with no frameworks or libraries; icons and fonts load from CDNs

## Copyright and reuse

© 2026 Agromaterials Research Group, Politeknik ATI Makassar. **All rights reserved.** The content, photographs, logo, illustrations, and code are shared for viewing only and may not be copied or reused without written permission. See [LICENSE](LICENSE). Permission requests: agromaterialsrg@atim.ac.id

**Hak cipta.** Konten, foto, logo, ilustrasi, dan kode dilindungi dan tidak boleh disalin atau dipakai ulang tanpa izin tertulis. Lihat [LICENSE](LICENSE). Permintaan izin ke agromaterialsrg@atim.ac.id

## For maintainers

Read `CLAUDE.md` (rules, file map, current status, and open items) first.

| What | Where |
|---|---|
| Group name, email, address, site URL | `_config.yml` |
| Colours | `:root` in `assets/css/main.css` |
| Research areas, projects, news | `_data/research.yml`, `projects.yml`, `news.yml` |
| Home "From plant to product" steps | `_data/flow.yml` |
| Team and photos | `_data/team.yml`, `assets/img/team/` |
| Publications and grants | `_data/publications.yml`, `pub_themes.yml`, `grants.yml` |
| Blog posts | `_posts/` (always English and Indonesian) |
| Interface text in both languages | `_data/i18n.yml` |
| Isometric illustrations (generated, do not hand-edit) | `tools/gen_iso_*.py` and `tools/iso_lib.py`, output in `_includes/illus/` |
| Site search index | `search.json` |

Before every push run the data checker:

```bash
python3 tools/check.py --build
```

Local preview:

```bash
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000/ (the site is served from the root, `baseurl` in `_config.yml` is empty).

Without Bundler (quick check): `JEKYLL_NO_BUNDLER_REQUIRE=1 jekyll build -d /tmp/site`.

## Domain

The site is served from the campus subdomain `agromaterials.atim.ac.id`, a DNS `CNAME` record pointing to `agromaterials.github.io`. The `CNAME` file at the repo root keeps the custom domain attached; do not delete it.

## Notes

- Do not commit unpublished manuscripts, raw research data, credentials, or personal contact details to this public repository.
- Photos of people are published only with their consent.
