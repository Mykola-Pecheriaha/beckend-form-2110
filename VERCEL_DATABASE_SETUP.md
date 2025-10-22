# 🚨 VERCEL DATABASE SETUP: Виправляємо "Помилка підключення до бази даних"

## ❌ **Поточна проблема:**
```
❌ Помилка: Помилка підключення до бази даних
```

**Причина:** На Vercel не налаштований `DATABASE_URL`

## ✅ **ШВИДКЕ РІШЕННЯ (5 хвилин):**

### 🥇 **Варіант 1: Supabase (НАЙКРАЩИЙ)**

1. **Перейти на** https://supabase.com
2. **Увійти через GitHub**
3. **Створити новий проект:**
   - Project name: `medical-consultations`
   - Database password: `створіть надійний пароль`
   - Region: `eu-central-1` (близько до України)
4. **Дочекатися створення** (2-3 хвилини)
5. **Перейти в Settings → Database**
6. **Скопіювати Connection string (URI format)**

**Приклад connection string:**
```
postgresql://postgres.abcdefgh:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### 🥈 **Варіант 2: Neon (АЛЬТЕРНАТИВА)**

1. **Перейти на** https://neon.tech
2. **Увійти через GitHub**
3. **Створити database**
4. **Скопіювати connection string**

### 🚀 **Налаштування на Vercel:**

1. **Перейти в Vercel Dashboard** → Ваш проект
2. **Settings** → **Environment Variables**
3. **Додати змінну:**
   - **Name:** `DATABASE_URL`
   - **Value:** Ваш PostgreSQL connection string
   - **Environments:** Production, Preview, Development
4. **Save**
5. **Redeploy** проект

### 📋 **Створення таблиць:**

Після налаштування `DATABASE_URL` потрібно створити таблицю. 

**Опція А: SQL Query в Supabase/Neon Dashboard**
```sql
CREATE TABLE IF NOT EXISTS consultations (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Patient Information
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  gender VARCHAR(50),
  phone VARCHAR(100),
  height INTEGER,
  weight INTEGER,
  
  -- Medical Information
  complaints TEXT,
  examinations TEXT,
  
  -- Medical History
  chronic_diseases TEXT,
  has_chronic_diseases BOOLEAN DEFAULT FALSE,
  medications TEXT,
  takes_medications BOOLEAN DEFAULT FALSE,
  
  -- Additional Information
  pain_level INTEGER,
  has_allergy BOOLEAN DEFAULT FALSE,
  allergies TEXT,
  additional_notes TEXT
);
```

**Опція Б: Автоматично через API**
Перший POST запит до `/api/consultations` створить таблицю автоматично.

## 🧪 **Тестування:**

1. **Перевірити health endpoint:**
   ```
   https://your-app.vercel.app/api/health
   ```
   
2. **Очікуваний результат:**
   ```json
   {
     "status": "ok",
     "database": "postgresql",
     "connection": "direct-pg-client",
     "consultationsCount": 0
   }
   ```

3. **Тестувати форму** на головній сторінці

## ⚡ **Експрес-інструкція:**

```bash
# 1. Supabase.com → New project → Copy connection string
# 2. Vercel → Settings → Environment Variables → Add DATABASE_URL
# 3. Redeploy
# 4. Test /api/health
# 5. Submit form
```

## 🎯 **Результат:**

✅ **Стабільна база даних** без Prisma проблем  
✅ **Безкоштовний тариф** Supabase/Neon  
✅ **Automatic backups** та management UI  
✅ **Швидке налаштування** (5 хвилин)  

**Після цих кроків консультації будуть зберігатися успішно! 🎉**