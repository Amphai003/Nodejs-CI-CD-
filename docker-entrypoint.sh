#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ] && [ "$SKIP_DB_MIGRATIONS" != "true" ]; then
  echo "Running database migrations..."
  npx prisma migrate deploy
else
  echo "Skipping database migrations."
fi

echo "Starting application..."
exec "$@"
