#!/usr/bin/env python3
"""Updates the Home Instagram gallery from the group's Instagram account (official API).

Run by .github/workflows/instagram.yml every day (and by hand from the Actions tab).
Source of the posts, first match wins:
  a. lab.instagram_feed in _config.yml (or env IG_FEED_URL): a Behold.so JSON feed of the account (no token),
  b. env INSTAGRAM_TOKEN: a long-lived token of the official Instagram API (Business or Creator account).
What it does:
  1. (token mode only) refreshes the token,
  2. reads the newest posts (photos, carousels, videos and reels),
  3. downloads each picture, crops it to a 480x600 (4:5 portrait) WebP in assets/img/social/,
  4. rewrites _data/instagram.yml (tiles with the post link) and turns the gallery on.
Without a token it does nothing (exit 0). If the API refuses, it exits with an error so the workflow turns red.
Only the Python standard library and Pillow are used. The token is never printed.
Environment for tests: IG_API_BASE (default https://graph.instagram.com), IG_ROOT (repo folder), IG_COUNT (default 4).
"""
import io, json, os, re, sys, urllib.parse, urllib.request, datetime
from pathlib import Path
from PIL import Image

ROOT = Path(os.environ.get("IG_ROOT") or Path(__file__).resolve().parent.parent)
API = os.environ.get("IG_API_BASE", "https://graph.instagram.com").rstrip("/")
COUNT = int(os.environ.get("IG_COUNT", "4"))
TOKEN = os.environ.get("INSTAGRAM_TOKEN", "").strip()
UA = {"User-Agent": "agromaterials-site-gallery/1.0"}
SOCIAL = ROOT / "assets" / "img" / "social"
DATA = ROOT / "_data" / "instagram.yml"

def fetch(url, binary=False):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=40) as r:
        body = r.read()
    return body if binary else json.loads(body.decode("utf-8"))

def clean_caption(text, limit=110):
    t = re.sub(r"https?://\S+", "", text or "")
    t = re.sub(r"\s+", " ", t).strip()
    if len(t) > limit:
        t = t[:limit].rsplit(" ", 1)[0].rstrip(",.;") + "..."
    return t

def portrait(raw):
    """Crops to the 4:5 portrait ratio of Instagram posts (a 4:5 post stays whole) and saves a 480x600 WebP."""
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    w, h = im.size
    if w * 5 > h * 4:   # wider than 4:5: trim the sides
        nw = round(h * 4 / 5); x = (w - nw) // 2; im = im.crop((x, 0, x + nw, h))
    else:               # taller than 4:5: trim top and bottom
        nh = round(w * 5 / 4); y = (h - nh) // 2; im = im.crop((0, y, w, y + nh))
    im = im.resize((480, 600), Image.LANCZOS)
    out = None
    for q in (72, 64, 56, 48, 40):
        buf = io.BytesIO(); im.save(buf, "WEBP", quality=q, method=6); out = buf.getvalue()
        if len(out) <= 48 * 1024: break
    return out

def feed_url():
    u = os.environ.get("IG_FEED_URL", "").strip()
    if u: return u
    try:
        m = re.search(r'^\s*instagram_feed:\s*"?([^"\s#]+)', (ROOT / "_config.yml").read_text(encoding="utf-8"), re.M)
        return m.group(1) if m else ""
    except OSError:
        return ""

def from_behold(url):
    d = fetch(url)
    out = []
    for p in (d.get("posts") if isinstance(d, dict) else d) or []:
        sizes = p.get("sizes") or {}
        img = None
        for k in ("large", "medium", "full", "small"):
            if (sizes.get(k) or {}).get("mediaUrl"): img = sizes[k]["mediaUrl"]; break
        kind = p.get("mediaType")
        if not img: img = p.get("thumbnailUrl") if kind == "VIDEO" else p.get("mediaUrl")
        if p.get("isReel"): kind = "VIDEO"
        out.append({"id": str(p.get("id")), "caption": p.get("prunedCaption") or p.get("caption") or "",
                    "media_type": kind, "src": img, "permalink": p.get("permalink"), "timestamp": p.get("timestamp") or ""})
    return out

def from_graph(token):
    q = urllib.parse.urlencode({"fields": "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp", "limit": 25, "access_token": token})
    return [{"id": m["id"], "caption": m.get("caption"), "media_type": m.get("media_type"),
             "src": m.get("thumbnail_url") if m.get("media_type") == "VIDEO" else m.get("media_url"),
             "permalink": m.get("permalink"), "timestamp": m.get("timestamp") or ""} for m in fetch(f"{API}/me/media?{q}").get("data", [])]

def main():
    url = feed_url()
    if not url and not TOKEN:
        print("No lab.instagram_feed and no INSTAGRAM_TOKEN: the gallery is left as it is.")
        return 0
    try:
        if url:
            media = from_behold(url)
        else:
            token = TOKEN
            try:
                r = fetch(f"{API}/refresh_access_token?" + urllib.parse.urlencode({"grant_type": "ig_refresh_token", "access_token": token}))
                token = r.get("access_token") or token
                print("Token refreshed, valid for about", round(int(r.get("expires_in", 0)) / 86400), "more days.")
            except Exception as e:
                print("Token refresh skipped (", type(e).__name__, "): continuing with the current token.")
            media = from_graph(token)
    except Exception as e:
        print("ERROR: could not read the posts (", type(e).__name__, ", ", getattr(e, "code", ""), "). Check the feed address or create a new token.")
        return 1
    newest = max((m.get("timestamp") or "" for m in media), default="")
    print(f"Feed returned {len(media)} posts, newest post time {newest or 'unknown'}.")
    tiles, keep = [], set()
    for m in media:
        if len(tiles) >= COUNT: break
        kind = m.get("media_type")
        src = m.get("src")
        if not src or not m.get("permalink") or kind not in ("IMAGE", "CAROUSEL_ALBUM", "VIDEO"): continue
        try:
            data = portrait(fetch(src, binary=True))
        except Exception as e:
            print("Skipped post", m.get("id"), "(", type(e).__name__, ")"); continue
        name = f"ig-{re.sub(r'[^A-Za-z0-9]', '', m['id'])}.webp"
        (SOCIAL).mkdir(parents=True, exist_ok=True)
        (SOCIAL / name).write_bytes(data); keep.add(name)
        date = (m.get("timestamp") or "")[:10]
        alt = clean_caption(m.get("caption")) or f"Instagram post {date}".strip()
        tiles.append({"image": f"social/{name}", "alt": alt, "url": m["permalink"], "type": {"VIDEO": "video", "CAROUSEL_ALBUM": "carousel"}.get(kind, "image")})
    if len(tiles) < 3:
        print(f"ERROR: only {len(tiles)} usable posts found; the gallery is left as it is.")
        return 1
    # 3. remove pictures that are no longer used
    for f in SOCIAL.glob("ig-*.webp"):
        if f.name not in keep: f.unlink()
    # 4. data file
    lines = ["# Home Instagram gallery. Written by tools/fetch_instagram.py (workflow Update Instagram gallery), do not edit by hand.",
             f"# Updated {datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M')} UTC from the Instagram feed.",
             "enabled: true", "tiles:"]
    for t in tiles:
        lines += [f"  - image: {json.dumps(t['image'])}", f"    alt: {json.dumps(t['alt'], ensure_ascii=False)}",
                  f"    url: {json.dumps(t['url'])}", f"    type: {t['type']}"]
    DATA.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Gallery updated with {len(tiles)} posts.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
