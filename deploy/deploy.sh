#!/usr/bin/env bash
#
# Deploy Nalandadata static redesign pages (homepage + research + about/solutions/contact).
# SAFE: backs up nginx config, gates on `nginx -t`, auto-rolls-back on failure.
# Run as root from the extracted bundle directory:  sudo bash deploy.sh
#
set -euo pipefail

TS=$(date +%Y%m%d-%H%M%S)
STATIC_DIR=/var/www/nalandadata/static-pages
NGINX_CONF=/etc/nginx/sites-available/nalandadata.ai
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MARK_START="# >>> nalanda-static-pages >>>"
MARK_END="# <<< nalanda-static-pages <<<"

echo "==> 1. Placing static files in $STATIC_DIR"
mkdir -p "$STATIC_DIR"
cp "$SCRIPT_DIR/static-pages/"*.html "$STATIC_DIR/"
chmod 755 "$STATIC_DIR"
chmod 644 "$STATIC_DIR"/*.html
chown -R www-data:www-data "$STATIC_DIR" 2>/dev/null || true
BUILD_DIR=/var/www/nalandadata/frontend/build
if [ -f "$SCRIPT_DIR/lead-capture.js" ] && [ -d "$BUILD_DIR" ]; then
  cp "$SCRIPT_DIR/lead-capture.js" "$BUILD_DIR/lead-capture.js"
  chmod 644 "$BUILD_DIR/lead-capture.js"
  chown www-data:www-data "$BUILD_DIR/lead-capture.js" 2>/dev/null || true
  echo "    lead-capture.js -> $BUILD_DIR/lead-capture.js"
fi
echo "    done."

echo "==> 2. Backing up nginx config -> ${NGINX_CONF}.bak-${TS}"
cp "$NGINX_CONF" "${NGINX_CONF}.bak-${TS}"

echo "==> 3. Installing/refreshing location blocks"
if grep -qF "$MARK_START" "$NGINX_CONF"; then
  sed -i "/$MARK_START/,/$MARK_END/d" "$NGINX_CONF"
fi
SNIPPET=$(mktemp)
cat > "$SNIPPET" <<'EOF'
    # >>> nalanda-static-pages >>>
    #  New static redesign pages. Each serves one HTML file at a clean URL.
    #  No add_header here on purpose, so server-level security headers
    #  (HSTS / CSP / etc.) are inherited unchanged.
    location = / {
        root /var/www/nalandadata/static-pages;
        try_files /homepage.html =404;
    }
    location = /research {
        root /var/www/nalandadata/static-pages;
        try_files /research.html =404;
    }
    location = /research/nalandabench {
        root /var/www/nalandadata/static-pages;
        try_files /nalandabench.html =404;
    }
    location = /research/nalanda-image-vl {
        root /var/www/nalandadata/static-pages;
        try_files /nalanda-image-vl.html =404;
    }
    location = /research/drishtitable {
        root /var/www/nalandadata/static-pages;
        try_files /drishtitable.html =404;
    }
    location = /benchmarks {
        return 404;
    }
    location = /about {
        root /var/www/nalandadata/static-pages;
        try_files /about.html =404;
    }
    location = /solutions {
        root /var/www/nalandadata/static-pages;
        try_files /solutions.html =404;
    }
    location = /contact {
        root /var/www/nalandadata/static-pages;
        try_files /contact.html =404;
    }
    # <<< nalanda-static-pages <<<
EOF
sed -i "/^[[:space:]]*index[[:space:]]\+index\.html;/r $SNIPPET" "$NGINX_CONF"
rm -f "$SNIPPET"

echo "==> 4. Testing nginx config"
if nginx -t; then
  systemctl reload nginx
  echo ""
  echo "DONE - nginx reloaded. Live now:"
  echo "     https://nalandadata.ai/                          (homepage)"
  echo "     https://nalandadata.ai/research                  (research index)"
  echo "     https://nalandadata.ai/research/nalandabench"
  echo "     https://nalandadata.ai/research/nalanda-image-vl"
  echo "     https://nalandadata.ai/research/drishtitable"
  echo "     https://nalandadata.ai/about                     (new)"
  echo "     https://nalandadata.ai/solutions                 (new)"
  echo "     https://nalandadata.ai/contact                   (new)"
  echo ""
  echo "   Rollback if needed:"
  echo "     sudo cp ${NGINX_CONF}.bak-${TS} ${NGINX_CONF} && sudo systemctl reload nginx"
else
  echo ""
  echo "nginx -t FAILED - restoring backup, no changes applied to live config."
  cp "${NGINX_CONF}.bak-${TS}" "$NGINX_CONF"
  exit 1
fi
