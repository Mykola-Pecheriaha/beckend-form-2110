# 🛠️ FIX TRANSLATION BUG: Custom Environment Variable

## ❌ **Проблема:**
Vercel перекладає `DATABASE_URL` → `URL_БАЗИ_ДАНИХ` в schema.prisma

## ✅ **Рішення:**
Використовуємо **custom environment variable** `DB_CONNECTION_STRING`

## 🚀 **Vercel Environment Variables:**

**В Vercel Dashboard встановіть:**

```bash
# ОСНОВНА змінна (замість DATABASE_URL)
DB_CONNECTION_STRING="postgresql://user:password@host:5432/database"

# FALLBACK для сумісності
DATABASE_URL="postgresql://user:password@host:5432/database"
```

## 📝 **Переваги цього підходу:**

✅ **Vercel не перекладає** `DB_CONNECTION_STRING`  
✅ **Fallback на DATABASE_URL** для сумісності  
✅ **Простий і надійний** - без складних обходів  
✅ **Працює локально і на Vercel** однаково  

## 🎯 **Deployment Steps:**

1. **Set environment variables** в Vercel:
   - `DB_CONNECTION_STRING` = PostgreSQL URL
   - `DATABASE_URL` = Same PostgreSQL URL (fallback)

2. **Redeploy** на Vercel

3. **Test** `/api/health` endpoint

**Результат:** Environment variable bug bypassed! 🎉