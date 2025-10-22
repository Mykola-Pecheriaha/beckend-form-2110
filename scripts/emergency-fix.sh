#!/bin/bash

# Emergency fix for DATABASE_URL translation issues
echo "🚨 Emergency fix: Ensuring DATABASE_URL is not translated"

# Force English locale
export LC_ALL=C
export LANG=C

echo "🔧 Creating clean schema file..."

# Create absolutely clean schema with only ASCII characters
cat > prisma/schema.prisma << 'SCHEMA_END'
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
SCHEMA_END

echo "✅ Clean schema created"
echo "📋 Verifying DATABASE_URL reference:"
grep "DATABASE_URL" prisma/schema.prisma

echo "📦 Generating Prisma client..."
npx prisma generate

echo "🏗️ Building application..."
npx next build

echo "✅ Emergency fix completed!"