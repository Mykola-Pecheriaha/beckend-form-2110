#!/bin/bash

# Simple and reliable Vercel build script
set -e

echo "🚀 Starting Vercel build..."
echo "Environment: $VERCEL_ENV"

if [ "$VERCEL_ENV" = "production" ] || [ "$NODE_ENV" = "production" ]; then
    echo "🚀 Production build - using PostgreSQL"
    
    if [ -z "$DATABASE_URL" ]; then
        echo "❌ ERROR: DATABASE_URL not set"
        exit 1
    fi
    
    echo "✅ DATABASE_URL configured"
    
    # Use production schema
    cp prisma/schema.prisma prisma/schema.dev.backup
    cp prisma/schema.production.prisma prisma/schema.prisma
    
    echo "✅ Using PostgreSQL schema"
else
    echo "🧪 Development build - using SQLite"
fi

echo " Generating Prisma client..."
npx prisma generate

echo "🏗️ Building Next.js..."
npx next build

echo "✅ Build completed!"