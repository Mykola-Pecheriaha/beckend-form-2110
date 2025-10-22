#!/bin/bash

# 🚀 Автоматичне налаштування та тестування проекту

echo "🚀 Налаштування проекту beckend-form-2110..."
echo ""

# Перевірка залежностей
echo "📦 Перевірка залежностей..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не встановлений"
    exit 1
fi

if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn не встановлений"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ Yarn: $(yarn --version)"

# Встановлення залежностей
echo ""
echo "📥 Встановлення залежностей..."
yarn install

# Перевірка .env файлу
echo ""
echo "🔧 Перевірка конфігурації..."
if [ ! -f .env ]; then
    echo "📝 Створення .env файлу..."
    cp .env.example .env
    echo "✅ .env файл створений"
else
    echo "✅ .env файл існує"
fi

# Показати поточну конфігурацію
echo ""
echo "⚙️ Поточна конфігурація:"
echo "DATABASE_URL: $(grep DATABASE_URL .env | head -1)"

# Запуск build для перевірки
echo ""
echo "🔨 Тестування build..."
if yarn build; then
    echo "✅ Build успішний"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "🎉 Проект налаштований успішно!"
echo ""
echo "📋 Наступні кроки:"
echo "1. yarn dev - запустити dev server"
echo "2. Налаштувати DATABASE_URL в Vercel (див. SETUP_GUIDE.md)"
echo "3. ./test-local-api.sh - перевірити API локально"
echo ""
echo "📚 Корисні посилання:"
echo "- Supabase: https://supabase.com"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- Setup Guide: cat SETUP_GUIDE.md"