# 🚨 Vercel Environment Variables Setup Guide

## ❌ **Current Error:**
```
Environment variable not found: DATABASE_URL
```

## ✅ **Solution: Set Environment Variables on Vercel**

### 🎯 **Option 1: Quick Fix**
В Vercel Dashboard встановіть **одну з цих змінних**:

```bash
# ВАРІАНТ А: Основна змінна
DB_CONNECTION_STRING="postgresql://user:password@host:5432/database"

# ВАРІАНТ Б: Fallback змінна  
DATABASE_URL="postgresql://user:password@host:5432/database"
```

### 🎯 **Option 2: Complete Setup**
Встановіть **обидві змінні** для максимальної сумісності:

```bash
# Primary (modern approach)
DB_CONNECTION_STRING="postgresql://user:password@host:5432/database"

# Fallback (compatibility)
DATABASE_URL="postgresql://user:password@host:5432/database"
```

### 🔧 **How to Set Environment Variables:**

1. **Go to Vercel Dashboard** → Your Project
2. **Settings** → **Environment Variables**  
3. **Add Variable:**
   - **Name:** `DB_CONNECTION_STRING`
   - **Value:** Your PostgreSQL connection string
4. **Add Variable:**
   - **Name:** `DATABASE_URL` 
   - **Value:** Same PostgreSQL connection string
5. **Save** and **Redeploy**

### 📋 **PostgreSQL Connection String Format:**
```
postgresql://username:password@hostname:5432/database_name
```

### 🚀 **After Setting Variables:**
1. **Redeploy** your application
2. **Test** `/api/health` endpoint
3. **Check** if form submissions work

**Result:** Environment variables properly configured! 🎉