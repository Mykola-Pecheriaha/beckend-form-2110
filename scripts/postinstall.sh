#!/bin/bash

# Post-install script that runs AFTER all dependencies are installed
# This ensures we generate the client with the correct schema

echo "🔧 Post-install: Ensuring correct Prisma schema..."

# Force English environment to prevent any translation
export LC_ALL=C
export LANG=C
export LANGUAGE=en

# Check if we're in Vercel environment
if [ "$VERCEL" = "1" ] || [ "$VERCEL_ENV" ]; then
    echo "🚀 Vercel environment detected"
    
    # Create the correct schema for production
    echo "📝 Creating production schema..."
    
    cat > prisma/schema.prisma << 'SCHEMA_EOF'
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
SCHEMA_EOF

    echo "✅ Production schema created with PostgreSQL"
    
else
    echo "🧪 Local environment - keeping existing schema"
fi

# Verify the schema content
echo "📋 Current schema provider:"
grep -A 2 "datasource db" prisma/schema.prisma

# Generate Prisma client with the correct schema
echo "📦 Generating Prisma client..."
npx prisma generate

echo "✅ Post-install completed successfully"