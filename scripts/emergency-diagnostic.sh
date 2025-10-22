#!/bin/bash

# Emergency diagnostic script to understand what's happening on Vercel
echo "🔍 EMERGENCY DIAGNOSTIC"
echo "======================"

echo "Environment Variables:"
echo "VERCEL: $VERCEL"
echo "VERCEL_ENV: $VERCEL_ENV" 
echo "NODE_ENV: $NODE_ENV"
echo "DATABASE_URL exists: $([ -n "$DATABASE_URL" ] && echo "YES" || echo "NO")"

if [ -n "$DATABASE_URL" ]; then
    echo "DATABASE_URL prefix: $(echo $DATABASE_URL | cut -c1-20)..."
fi

echo ""
echo "Current working directory: $(pwd)"
echo "Files in prisma/:"
ls -la prisma/ || echo "No prisma directory"

echo ""
echo "Current schema.prisma content:"
echo "=============================="
if [ -f "prisma/schema.prisma" ]; then
    cat prisma/schema.prisma
else
    echo "No schema.prisma file found"
fi

echo ""
echo "Checking for any .prisma files:"
find . -name "*.prisma" -type f 2>/dev/null || echo "No .prisma files found"

echo ""
echo "Environment locale:"
echo "LC_ALL: $LC_ALL"
echo "LANG: $LANG"
echo "LANGUAGE: $LANGUAGE"

echo ""
echo "System info:"
echo "Platform: $(uname -a)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

echo ""
echo "Package.json scripts:"
grep -A 10 '"scripts"' package.json || echo "Could not read package.json"

echo ""
echo "🔍 DIAGNOSTIC COMPLETE"