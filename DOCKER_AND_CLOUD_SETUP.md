# 🐋 DOCKER SETUP GUIDE

## 📦 **Docker Installation (Ubuntu/Debian):**

```bash
# Встановлення Docker
sudo apt update
sudo apt install docker.io docker-compose
sudo usermod -aG docker $USER
# Перезавантажте термінал або систему

# Перевірка
docker --version
docker-compose --version
```

## 🚀 **Local Development with Docker:**

```bash
# 1. Запустити PostgreSQL
docker-compose up -d

# 2. Перевірити статус
docker-compose ps

# 3. Переглянути логи
docker-compose logs postgres

# 4. Підключитися до бази
docker-compose exec postgres psql -U postgres -d medical_consultations

# 5. Зупинити
docker-compose down
```

## 🔗 **Connection String для Docker:**
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/medical_consultations"
```

## ☁️ **АЛЬТЕРНАТИВА: Cloud Database (без Docker)**

### 🥇 **Supabase (Рекомендується):**

1. **Зайти на** https://supabase.com
2. **Створити новий проект** 
3. **Отримати connection string:**
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   ```
4. **Встановити в .env:**
   ```bash
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
   ```

### 🥈 **Neon Database:**

1. **Зайти на** https://neon.tech
2. **Створити database**
3. **Скопіювати connection string**
4. **Додати в .env**

### 🥉 **Railway:**

1. **Зайти на** https://railway.app
2. **Add PostgreSQL service**
3. **Copy connection URL**
4. **Set in environment variables**

## ✅ **Переваги cloud підходу:**

- ✅ **Без Docker** - працює одразу
- ✅ **Безкоштовні тарифи** - достатньо для розробки
- ✅ **Automatic backups** - не втратите дані
- ✅ **Vercel integration** - один connection string
- ✅ **No environment translation bugs** - стабільна робота

## 🎯 **Рекомендація:**

**Для швидкого старту:** Використовуйте **Supabase** (5 хвилин setup)  
**Для learning:** Використовуйте **Docker** (після встановлення)  
**Для production:** Будь-який cloud provider підійде