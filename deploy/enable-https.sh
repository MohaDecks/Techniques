#!/usr/bin/env bash
set -euo pipefail

# Run ON the production VPS:
#   sudo bash deploy/enable-https.sh

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NGINX_SRC="$ROOT/deploy/nginx/techniques.conf"
NGINX_DST="/etc/nginx/sites-available/techniques.dirshay.com"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo bash deploy/enable-https.sh"
  exit 1
fi

if [[ ! -f "$NGINX_SRC" ]]; then
  echo "Missing nginx config: $NGINX_SRC"
  exit 1
fi

if ! command -v nginx >/dev/null 2>&1; then
  apt-get update
  apt-get install -y nginx
fi

if ! command -v certbot >/dev/null 2>&1; then
  apt-get update
  apt-get install -y certbot python3-certbot-nginx
fi

cp "$NGINX_SRC" "$NGINX_DST"
ln -sfn "$NGINX_DST" /etc/nginx/sites-enabled/techniques.dirshay.com

nginx -t
systemctl reload nginx

echo "==> Issuing Let's Encrypt certs"
certbot --nginx --non-interactive --agree-tos --keep-until-expiring \
  --redirect \
  --register-unsafely-without-email \
  -d techcustomer.dirshay.com \
  -d techadmin.dirshay.com \
  --expand

nginx -t
systemctl reload nginx

echo
echo "Open:"
echo "  https://techcustomer.dirshay.com"
echo "  https://techadmin.dirshay.com"
