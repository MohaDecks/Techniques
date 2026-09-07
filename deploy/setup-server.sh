#!/usr/bin/env bash
set -euo pipefail

# Run ON the VPS as root:
#   sudo bash /var/www/html/Techniques/deploy/setup-server.sh

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NGINX_DST="/etc/nginx/sites-available/techniques.dirshay.com"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo bash deploy/setup-server.sh"
  exit 1
fi

cat > "$NGINX_DST" <<'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name techcustomer.dirshay.com;

    client_max_body_size 20m;

    location / {
        proxy_pass http://127.0.0.1:1010;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    listen [::]:80;
    server_name techadmin.dirshay.com;

    client_max_body_size 20m;

    location / {
        proxy_pass http://127.0.0.1:2020;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

ln -sfn "$NGINX_DST" /etc/nginx/sites-enabled/techniques.dirshay.com
nginx -t
systemctl reload nginx
echo "==> nginx domains ready: techcustomer.dirshay.com techadmin.dirshay.com"

cd "$ROOT"
pm2 delete techni-customer techni-admin 2>/dev/null || true
npm run build
test -f apps/customer/.next/BUILD_ID
test -f apps/admin/.next/BUILD_ID
pm2 start ecosystem.config.cjs --update-env
pm2 save

if command -v certbot >/dev/null 2>&1; then
  certbot --nginx --non-interactive --agree-tos --keep-until-expiring \
    --redirect --register-unsafely-without-email \
    -d techcustomer.dirshay.com \
    -d techadmin.dirshay.com \
    --expand || true
  nginx -t && systemctl reload nginx
fi

echo
echo "Open:"
echo "  http://techcustomer.dirshay.com"
echo "  http://techadmin.dirshay.com"
pm2 status
