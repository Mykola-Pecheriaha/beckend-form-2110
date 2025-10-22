#!/bin/bash

# Ultimate fix: Create schema and generate client in one atomic operation
set -e

echo "🔥 Ultimate Vercel fix starting..."

# Force absolute English environment
export LC_ALL=C
export LANG=C
export LANGUAGE=en_US.UTF-8

# Detect environment
IS_PRODUCTION=0
if [ "$VERCEL_ENV" = "production" ] || [ "$NODE_ENV" = "production" ]; then
    IS_PRODUCTION=1
fi

echo "Environment detection:"
echo "  VERCEL_ENV: $VERCEL_ENV"
echo "  NODE_ENV: $NODE_ENV"
echo "  IS_PRODUCTION: $IS_PRODUCTION"

if [ $IS_PRODUCTION -eq 1 ]; then
    echo "🚀 Production build - creating PostgreSQL schema"
    
    # Validate DATABASE_URL
    if [ -z "$DATABASE_URL" ]; then
        echo "❌ ERROR: DATABASE_URL not set"
        exit 1
    fi
    
    echo "✅ DATABASE_URL present"
    
    # Remove any existing generated files
    rm -rf node_modules/.prisma 2>/dev/null || true
    rm -rf node_modules/@prisma/client 2>/dev/null || true
    
    # Create PostgreSQL schema with binary write to avoid any encoding issues
    echo "📝 Writing PostgreSQL schema..."
    
    # Use printf with explicit newlines to ensure exact content
    printf '%s\n' \
        'generator client {' \
        '  provider = "prisma-client-js"' \
        '}' \
        '' \
        'datasource db {' \
        '  provider = "postgresql"' \
        '  url      = env("DATABASE_URL")' \
        '}' \
        '' \
        'model Consultation {' \
        '  id        Int      @id @default(autoincrement())' \
        '  createdAt DateTime @default(now())' \
        '  ' \
        '  name      String' \
        '  age       Int?' \
        '  gender    String' \
        '  phone     String?' \
        '  height    Int?' \
        '  weight    Int?' \
        '  ' \
        '  complaints String?' \
        '  examinations String?' \
        '  ' \
        '  chronicDiseases    String?' \
        '  hasChronicDiseases Boolean @default(false)' \
        '  medications        String?' \
        '  takesMedications   Boolean @default(false)' \
        '  ' \
        '  painLevel Int?' \
        '  hasAllergy Boolean @default(false)' \
        '  allergies  String?' \
        '  ' \
        '  additionalNotes String?' \
        '  ' \
        '  @@map("consultations")' \
        '}' > prisma/schema.prisma.temp
    
    # Atomic replace
    mv prisma/schema.prisma.temp prisma/schema.prisma
    
    echo "✅ PostgreSQL schema written"
    
else
    echo "🧪 Development build - keeping SQLite schema"
fi

# Verify schema content is correct
echo "📋 Schema verification:"
echo "  Provider: $(grep 'provider.*=' prisma/schema.prisma | head -2)"
echo "  URL: $(grep 'url.*=' prisma/schema.prisma)"

# Check for any translation artifacts
if grep -q "URL_БАЗИ_ДАНИХ\|постачальник\|схема.призма" prisma/schema.prisma; then
    echo "❌ ERROR: Translation artifacts found in schema!"
    cat prisma/schema.prisma
    exit 1
fi

echo "✅ Schema is clean - no translation artifacts"

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Verify client was generated correctly
if [ ! -f "node_modules/@prisma/client/index.js" ]; then
    echo "❌ ERROR: Prisma client not generated"
    exit 1
fi

echo "✅ Prisma client generated successfully"

# Build Next.js
echo "🏗️ Building Next.js..."
npx next build

echo "🎉 Ultimate fix completed successfully!"