#!/bin/bash

# Minimal build script that doesn't touch schema files
set -e

echo "🚀 Minimal Vercel build"
echo "Environment: $VERCEL_ENV"
echo "NODE_ENV: $NODE_ENV"

# Just verify DATABASE_URL exists in production
if [ "$VERCEL_ENV" = "production" ] || [ "$NODE_ENV" = "production" ]; then
    if [ -z "$DATABASE_URL" ]; then
        echo "❌ ERROR: DATABASE_URL not set in production"
        exit 1
    fi
    echo "✅ DATABASE_URL configured for production"
fi

# Don't modify any files - let Prisma client handle database selection
echo "📦 Generating Prisma client..."
npx prisma generate

echo "🏗️ Building Next.js..."
npx next build

echo "✅ Build completed"