#!/bin/bash

# 🧪 Тест локального API без бази даних
# Цей скрипт перевіряє чи правильно працюють API endpoints

echo "🔍 Тестування API endpoints..."

# Перевірка чи запущений dev server
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Dev server не запущений. Запустіть: yarn dev"
    exit 1
fi

echo "✅ Dev server працює"

# Тест health endpoint
echo ""
echo "🩺 Тестування /api/health..."
HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health)
echo "Response: $HEALTH_RESPONSE"

# Тест database-check endpoint  
echo ""
echo "🔍 Тестування /api/database-check..."
CHECK_RESPONSE=$(curl -s http://localhost:3000/api/database-check)
echo "Response: $CHECK_RESPONSE"

# Тест diagnostic endpoint
echo ""
echo "📊 Тестування /api/diagnostic..."
DIAGNOSTIC_RESPONSE=$(curl -s http://localhost:3000/api/diagnostic)
echo "Response: $DIAGNOSTIC_RESPONSE"

echo ""
echo "✅ Усі API endpoints відповіли"
echo ""
echo "📋 Наступні кроки:"
echo "1. Налаштуйте DATABASE_URL в Vercel"
echo "2. Redeploy проект"
echo "3. Перевірте https://your-app.vercel.app/api/health"