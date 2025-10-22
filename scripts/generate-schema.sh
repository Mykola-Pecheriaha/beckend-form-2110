#!/bin/bash

# 🚀 Dynamic Schema Generation Script
# Generates schema.prisma with the first available environment variable

echo "🔍 Detecting available database environment variables..."

# Check for available environment variables in order of preference
if [ ! -z "$DB_CONNECTION_STRING" ]; then
    DB_VAR="DB_CONNECTION_STRING"
    DB_URL="$DB_CONNECTION_STRING"
    echo "✅ Using DB_CONNECTION_STRING"
elif [ ! -z "$DATABASE_URL" ]; then
    DB_VAR="DATABASE_URL"
    DB_URL="$DATABASE_URL"
    echo "✅ Using DATABASE_URL"
elif [ ! -z "$POSTGRES_PRISMA_URL" ]; then
    DB_VAR="POSTGRES_PRISMA_URL"
    DB_URL="$POSTGRES_PRISMA_URL"
    echo "✅ Using POSTGRES_PRISMA_URL"
elif [ ! -z "$POSTGRES_URL" ]; then
    DB_VAR="POSTGRES_URL"
    DB_URL="$POSTGRES_URL"
    echo "✅ Using POSTGRES_URL"
else
    DB_VAR="DATABASE_URL"
    DB_URL="file:./dev.db"
    echo "⚠️  No database URL found, using DATABASE_URL as default"
fi

# Determine provider based on URL
if [[ "$DB_URL" == postgresql* ]] || [[ "$DB_URL" == postgres* ]]; then
    PROVIDER="postgresql"
    echo "🐘 Detected PostgreSQL database"
elif [[ "$DB_URL" == file* ]]; then
    PROVIDER="sqlite"
    echo "📁 Detected SQLite database"
else
    PROVIDER="postgresql"
    echo "🔧 Unknown URL format, defaulting to PostgreSQL"
fi

echo "📝 Generating schema.prisma with provider=$PROVIDER and env(\"$DB_VAR\")"

# Generate schema.prisma with the detected environment variable and provider
cat > prisma/schema.prisma << EOF
// Auto-generated Prisma schema
// Provider: $PROVIDER, Env: $DB_VAR

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "$PROVIDER"
  url      = env("$DB_VAR")
}

model Consultation {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  
  name      String
  age       Int?
  gender    String
  phone     String?
  height    Int?
  weight    Int?
  
  complaints String?
  examinations String?
  
  chronicDiseases    String?
  hasChronicDiseases Boolean @default(false)
  medications        String?
  takesMedications   Boolean @default(false)
  
  painLevel Int?
  hasAllergy Boolean @default(false)
  allergies  String?
  
  additionalNotes String?
  
  @@map("consultations")
}
EOF

echo "✅ Schema generated with provider=$PROVIDER and env(\"$DB_VAR\")"