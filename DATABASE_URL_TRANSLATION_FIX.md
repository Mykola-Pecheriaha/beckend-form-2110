# 🚨 Виправлення помилки перекладу DATABASE_URL

## ❌ Проблема:
```
url = env("URL_БАЗИ_ДАНИХ")
Код помилки: 'P1012'
```

Vercel автоматично перекладає `DATABASE_URL` на `URL_БАЗИ_ДАНИХ` під час збірки, що призводить до помилки.

## ✅ Виправлення:

### Варіант 1: Автоматичне виправлення (Рекомендований)
Новий скрипт збірки автоматично створює чистий PostgreSQL schema:

```bash
# У Vercel це відбудеться автоматично при деплої
./scripts/vercel-build.sh
```

### Варіант 2: Emergency Fix
Якщо проблема залишається:

```bash
# Запустіть emergency fix локально з PostgreSQL DATABASE_URL
export DATABASE_URL="postgresql://your-connection-string"
yarn build:emergency
```

### Варіант 3: Ручне виправлення в Vercel
1. У Vercel Dashboard → Settings → Environment Variables
2. Додайте змінну:
   ```
   PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=1
   ```
3. Перегенеруйте деплой

## 🔧 Що змінено:

1. **Новий build скрипт** - використовує заготовлені schema файли
2. **Emergency fix скрипт** - створює абсолютно чистий schema 
3. **Force English locale** - запобігає автоматичному перекладу
4. **Backup система** - зберігає оригінальні файли

## 📋 Перевірка після виправлення:

### 1. Health Check:
```
https://your-domain.vercel.app/api/health
```

Повинен показати:
```json
{
  "status": "ok",
  "database": "connected",
  "consultationsCount": 0
}
```

### 2. Тест створення консультації:
```bash
curl -X POST https://your-domain.vercel.app/api/consultations \
  -H "Content-Type: application/json" \
  -d '{"name": "Тест", "gender": "Чоловік"}'
```

## 🎯 Основні зміни в build процесі:

### Старий спосіб (проблемний):
- ❌ Використання sed для заміни тексту
- ❌ Українські коментарі в schema
- ❌ Динамічна генерація schema

### Новий спосіб (надійний):
- ✅ Заготовлені schema файли
- ✅ Тільки англійські символи
- ✅ Простий copy операції замість sed
- ✅ Force English locale

## 🚀 Результат:
- ✅ Автоматичний деплой без помилок P1012
- ✅ Правильний DATABASE_URL у всіх середовищах  
- ✅ Стабільна збірка на Vercel
- ✅ Backup система для безпеки