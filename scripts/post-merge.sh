#!/bin/bash
set -euo pipefail

pnpm install --frozen-lockfile=false

pnpm prisma generate

if [ -n "${DATABASE_URL:-}" ]; then
  pnpm prisma migrate deploy
else
  echo "post-merge: DATABASE_URL not set, skipping prisma migrate deploy"
fi
