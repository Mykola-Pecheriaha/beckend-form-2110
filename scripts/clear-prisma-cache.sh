#!/bin/bash

# Script to clear VS Code Prisma cache and fix phantom file errors

echo "🧹 Clearing VS Code Prisma cache..."

# Clear Prisma cache
if [ -d "node_modules/.prisma" ]; then
    rm -rf node_modules/.prisma
    echo "✅ Cleared node_modules/.prisma"
fi

# Regenerate Prisma client
echo "📦 Regenerating Prisma client..."
npx prisma generate

# Clear VS Code workspace cache
if [ -d ".vscode" ]; then
    echo "🗑️ Clearing VS Code workspace cache..."
    # Clear any cached diagnostic information
    if [ -f ".vscode/settings.json.backup" ]; then
        rm .vscode/settings.json.backup
    fi
fi

echo "✅ Cache cleared! Please restart VS Code or run:"
echo "   - Ctrl+Shift+P → 'Prisma: Restart Language Server'"
echo "   - Ctrl+Shift+P → 'Developer: Reload Window'"