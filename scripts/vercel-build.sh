#!/bin/bash

# Vercel build script
# This script changes the database provider to PostgreSQL for production

if [ "$VERCEL_ENV" = "production" ] || [ "$NODE_ENV" = "production" ]; then
    echo "🚀 Production build detected - switching to PostgreSQL"
    
    # Replace SQLite with PostgreSQL in schema.prisma
    sed -i 's/provider = "sqlite"/provider = "postgresql"/g' prisma/schema.prisma
    
    echo "✅ Schema updated for PostgreSQL"
    cat prisma/schema.prisma | grep provider
fi

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Build Next.js
echo "🏗️ Building Next.js..."
npx next build