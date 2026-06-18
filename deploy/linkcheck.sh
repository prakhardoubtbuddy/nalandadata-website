#!/usr/bin/env bash
BASE="https://nalandadata.ai"; DIR=/var/www/nalandadata/static-pages
links=$(grep -rhoE 'href="/[^"#]*"' "$DIR"/*.html | sed -E 's/href="//; s/"$//' | sort -u)
fail=0
echo "Internal links found across the static pages:"
for l in $links; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$l")
  if [ "$code" = "200" ]; then echo "  [OK  $code] $l"; else echo "  [!!  $code] $l"; fail=$((fail+1)); fi
done
echo ""
[ "$fail" = "0" ] && echo "All internal links resolve (200)." || echo "$fail link(s) not 200 - see above."
