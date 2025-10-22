#!/bin/bash

# Vercel build script with better error handling
set -e  # Exit on any error

echo "🚀 Starting Vercel build process..."
echo "Environment: $VERCEL_ENV"
echo "Node environment: $NODE_ENV"

# Check if we're in production environment
if [ "$VERCEL_ENV" = "production" ] || [ "$NODE_ENV" = "production" ]; then
    echo "🚀 Production build detected"
    
    # Check DATABASE_URL
    if [ -z "$DATABASE_URL" ]; then
        echo "❌ ERROR: DATABASE_URL environment variable not set for production"
        exit 1
    fi
    
    # Show DATABASE_URL format (hide credentials)
    echo "✅ DATABASE_URL is configured"
    echo "Database type: $(echo $DATABASE_URL | cut -d: -f1)"
    
    # Update schema for PostgreSQL
    echo "📝 Updating schema for PostgreSQL..."
    
    # Create a safe temporary schema file
    cat > prisma/schema.temp.prisma << 'EOF'
// Production Prisma schema file
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Consultation {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  
  // Інформація про пацієнта
  name      String
  age       Int?
  gender    String
  phone     String?
  height    Int?     // см
  weight    Int?     // кг
  
  // Скарги пацієнта
  complaints String?
  
  // Обстеження
  examinations String? // JSON string з обстеженнями
  
  // Медична історія
  chronicDiseases    String? // хронічні хвороби
  hasChronicDiseases Boolean @default(false)
  medications        String? // ліки
  takesMedications   Boolean @default(false)
  
  // Рівень болю та алергії
  painLevel Int?      // 0-10
  hasAllergy Boolean @default(false)
  allergies  String?
  
  // Додаткові коментарі
  additionalNotes String?
  
  @@map("consultations")
}
EOF
    
    # Replace the original schema
    cp prisma/schema.prisma prisma/schema.sqlite.backup
    mv prisma/schema.temp.prisma prisma/schema.prisma
    
    echo "✅ Schema updated for PostgreSQL"
    
else
    echo "🧪 Development/Preview build - using SQLite"
fi

# Verify schema file
echo "📋 Current schema configuration:"
grep -A 3 "datasource db" prisma/schema.prisma || echo "⚠️ Could not read schema"

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Build Next.js
echo "🏗️ Building Next.js..."
npx next build

echo "✅ Build completed successfully!"