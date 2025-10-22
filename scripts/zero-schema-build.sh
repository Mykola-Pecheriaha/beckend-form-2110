#!/bin/bash

# Zero-schema build: Complete bypass of Prisma schema files
set -e

echo "🚀 ZERO-SCHEMA BUILD STARTING"
echo "============================="

# Diagnostic info
echo "Environment:"
echo "  VERCEL: $VERCEL"
echo "  VERCEL_ENV: $VERCEL_ENV"
echo "  NODE_ENV: $NODE_ENV"
echo "  DATABASE_URL exists: $([ -n "$DATABASE_URL" ] && echo "YES" || echo "NO")"

# Set strict English environment
export LC_ALL=C
export LANG=C
export LANGUAGE=en_US.UTF-8

# Production validation
if [ "$VERCEL_ENV" = "production" ] || [ "$NODE_ENV" = "production" ]; then
    if [ -z "$DATABASE_URL" ]; then
        echo "❌ CRITICAL: DATABASE_URL not set in production"
        exit 1
    fi
    echo "✅ Production environment validated"
fi

# DO NOT TOUCH SCHEMA FILES AT ALL
echo "📋 Current schema status:"
if [ -f "prisma/schema.prisma" ]; then
    echo "  Schema file exists"
    echo "  Provider: $(grep 'provider.*=' prisma/schema.prisma | head -1)"
    echo "  URL: $(grep 'url.*=' prisma/schema.prisma | head -1)"
    
    # Check for translation issues
    if grep -q "URL_БАЗИ_ДАНИХ\|постачальник" prisma/schema.prisma; then
        echo "⚠️  WARNING: Translation artifacts detected in schema!"
        echo "  This build will rely on programmatic Prisma client"
    else
        echo "✅ Schema appears clean"
    fi
else
    echo "  No schema file found"
fi

# Try to generate Prisma client anyway
echo "📦 Attempting Prisma client generation..."
if npx prisma generate; then
    echo "✅ Prisma client generated successfully"
else
    echo "⚠️  Prisma client generation failed - will rely on programmatic approach"
fi

# Build Next.js (this will use our programmatic Prisma client)
echo "🏗️ Building Next.js application..."
npx next build

echo "✅ ZERO-SCHEMA BUILD COMPLETED"