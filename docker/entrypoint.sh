#!/bin/sh
set -e

export PORT="${PORT:-8080}"
envsubst '${PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/http.d/default.conf

php artisan config:cache
php artisan route:cache
php artisan migrate --force

if [ "$FILESYSTEM_DISK" = "local" ]; then
    php artisan storage:link || true
fi

exec /usr/bin/supervisord -c /etc/supervisord.conf
