# 🧪 QUICK TEST: Database alternatives without Docker

## 🚀 **Option 1: Supabase (5 minutes setup)**

```bash
# 1. Go to https://supabase.com
# 2. Sign up with GitHub
# 3. Create new project
# 4. Wait 2 minutes for database provisioning
# 5. Go to Settings > Database
# 6. Copy "Connection string" (URI format)
# 7. Replace [YOUR-PASSWORD] with your project password
```

**Example connection string:**
```bash
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
```

## 🚀 **Option 2: Neon (3 minutes setup)**

```bash
# 1. Go to https://neon.tech
# 2. Sign up with GitHub
# 3. Create database
# 4. Copy connection string from dashboard
```

**Example connection string:**
```bash
DATABASE_URL="postgresql://username:password@ep-blue-morning-123456.eu-central-1.aws.neon.tech/dbname?sslmode=require"
```

## 🚀 **Option 3: Railway (2 minutes setup)**

```bash
# 1. Go to https://railway.app
# 2. Login with GitHub
# 3. New Project > Add PostgreSQL
# 4. Copy DATABASE_URL from Variables tab
```

## 🧪 **Testing Steps:**

1. **Get any PostgreSQL connection string** from above
2. **Set in .env:**
   ```bash
   DATABASE_URL="your_postgresql_connection_string_here"
   ```
3. **Test connection:**
   ```bash
   yarn dev
   # Visit http://localhost:3000/api/health
   ```
4. **Check console** for connection success
5. **Test form submission** on main page

## ✅ **Expected Results:**

- `/api/health` returns `"database": "postgresql"` 
- `consultationsCount` shows real count
- Form submissions work
- No Prisma translation errors

## 🎯 **После успішного тесту:**

Deploy на Vercel з **тим самим connection string** в environment variables - проблема з translation зникне!