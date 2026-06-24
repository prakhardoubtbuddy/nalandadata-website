#!/usr/bin/env python3
"""Regenerate the hardcoded fallback rows in benchmarks.html from the live HF
leaderboard, so the static fallback (shown if HF is unreachable at runtime) never
drifts out of date and always includes all models.

Run at deploy time (before copying benchmarks.html to the live folder):
    HF_TOKEN=hf_xxx python3 deploy/regen_fallback.py

It rewrites two regions in deploy/static-pages/benchmarks.html, matched by id:
  - <tbody id="drishti-lb-body" ...> ... </tbody>   (the leaderboard table rows)
  - <div id="teds-bars"> ... </div>                  (the TEDS bar chart, top 6)

Idempotent and safe: only the inner content of those two containers is replaced.
If the HF fetch fails, the file is left untouched (non-zero exit).
"""
import os
import re
import sys
import json
import urllib.request

REPO = "Nalandadata/DrishtiTable"
URL = f"https://huggingface.co/datasets/{REPO}/resolve/main/benchmark/leaderboard.jsonl"
HTML = os.path.join(os.path.dirname(__file__), "static-pages", "benchmarks.html")


def fetch_rows():
    token = os.environ.get("HF_TOKEN", "")
    req = urllib.request.Request(URL, headers={"User-Agent": "regen/1.0"})
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=20) as r:
        text = r.read().decode("utf-8")
    rows = []
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            d = json.loads(line)
        except json.JSONDecodeError:
            continue
        if d.get("teds") is not None:
            rows.append(d)
    rows.sort(key=lambda x: x["teds"], reverse=True)
    return rows


def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def build_table_rows(rows):
    top = rows[0]["teds"]
    out = []
    for i, r in enumerate(rows):
        ours = r.get("category") == "fine-tuned" or "DrishtiTable" in (r.get("model") or "")
        delta = "&mdash;" if i == 0 else f'<span class="dneg">&minus;{top - r["teds"]:.1f}</span>'
        name = esc(r["model"]) + (' <span class="badge">ours</span>' if ours else "")
        teds = f'{r["teds"]:.1f}%'
        steds = f'{r["steds"]:.1f}%' if r.get("steds") is not None else "&mdash;"
        cls = ' class="best"' if ours else ""
        out.append(
            f'              <tr{cls}><th>{name}</th>'
            f'<td>{esc(r.get("method",""))}</td>'
            f'<td style="text-align:right">{teds}</td>'
            f'<td style="text-align:right">{steds}</td>'
            f'<td style="text-align:right">{delta}</td></tr>'
        )
    return "\n".join(out)


def build_bars(rows):
    top = rows[:6]
    mx = top[0]["teds"] or 100
    out = []
    for r in top:
        ours = r.get("category") == "fine-tuned" or "DrishtiTable" in (r.get("model") or "")
        pct = max(2.0, (r["teds"] / mx) * 100)
        label = "DrishtiTable (ours)" if ours else esc(r["model"])
        cls = "bar-row ours" if ours else "bar-row"
        out.append(
            f'          <div class="{cls}"><span class="bar-label">{label}</span>'
            f'<span class="bar-track"><span class="bar-fill" style="width:{pct:.1f}%"></span></span>'
            f'<span class="bar-val">{r["teds"]:.1f}%</span></div>'
        )
    return "\n".join(out)


def replace_between(html, open_pat, close_marker, inner, indent="            "):
    """Replace content between an opening tag (regex) and a specific close marker
    string. close_marker must be a unique literal that follows the region."""
    m = re.search(open_pat, html)
    if not m:
        raise RuntimeError(f"open pattern not found: {open_pat}")
    start = m.end()
    end = html.index(close_marker, start)
    return html[:start] + "\n" + inner + "\n" + indent + html[end:]


def main():
    try:
        rows = fetch_rows()
    except Exception as exc:
        print(f"[regen_fallback] HF fetch failed, leaving file unchanged: {exc}", file=sys.stderr)
        return 1
    if not rows:
        print("[regen_fallback] no rows from HF; unchanged", file=sys.stderr)
        return 1

    html = open(HTML, encoding="utf-8").read()
    # 1. table rows: between <tbody id=...> and </tbody> (rows are <tr>, no </tbody> inside)
    html = replace_between(
        html, r'<tbody id="drishti-lb-body"[^>]*>', "</tbody>", build_table_rows(rows)
    )
    # 2. bars: between <div id="teds-bars"> and its closing </div> (the one right
    #    before <p class="cb-note">). Bars are nested <div>, so we locate the
    #    cb-note first, then back up to the </div> immediately before it.
    note_pos = html.index('<p class="cb-note">TEDS')
    close_div = html.rindex("</div>", 0, note_pos)  # the </div> closing teds-bars
    m = re.search(r'<div id="teds-bars">', html)
    if not m:
        raise RuntimeError("teds-bars open tag not found")
    start = m.end()
    html = html[:start] + "\n" + build_bars(rows) + "\n          " + html[close_div:]

    open(HTML, "w", encoding="utf-8").write(html)
    print(f"[regen_fallback] updated fallback with {len(rows)} models (top={rows[0]['model']} {rows[0]['teds']}%)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
