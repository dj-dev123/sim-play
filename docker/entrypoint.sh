#!/bin/sh
set -e

export PORT="${PORT:-8080}"
envsubst '${PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/http.d/default.conf

# A Railway Volume mounted at storage/app/public arrives root-owned at
# runtime, overriding the www-data ownership baked into the image at build
# time. Re-apply it here, after the volume is attached, so PHP-FPM can
# actually write uploaded files.
chown -R www-data:www-data storage bootstrap/cache

php artisan config:cache
php artisan route:cache
php artisan migrate --force

if [ "$FILESYSTEM_DISK" = "local" ]; then
    php artisan storage:link || true
fi

exec /usr/bin/supervisord -c /etc/supervisord.conf
