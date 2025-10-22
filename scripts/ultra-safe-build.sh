#!/bin/bash

# Ultra-safe Vercel build script that prevents any translation
set -e

echo "Building for Vercel with translation prevention..."

# Force strict English environment
export LC_ALL=C
export LANG=C
export LANGUAGE=en

if [ "$VERCEL_ENV" = "production" ] || [ "$NODE_ENV" = "production" ]; then
    echo "Production build detected"
    
    # Check DATABASE_URL
    if [ -z "$DATABASE_URL" ]; then
        echo "ERROR: DATABASE_URL environment variable not set"
        exit 1
    fi
    
    echo "DATABASE_URL is configured"
    
    # Create schema file using here-document with strict ASCII
    echo "Creating PostgreSQL schema..."
    
    # Write schema directly with printf to avoid any encoding issues
    printf 'generator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\nmodel Consultation {\n  id        Int      @id @default(autoincrement())\n  createdAt DateTime @default(now())\n  \n  name      String\n  age       Int?\n  gender    String\n  phone     String?\n  height    Int?\n  weight    Int?\n  \n  complaints String?\n  examinations String?\n  \n  chronicDiseases    String?\n  hasChronicDiseases Boolean @default(false)\n  medications        String?\n  takesMedications   Boolean @default(false)\n  \n  painLevel Int?\n  hasAllergy Boolean @default(false)\n  allergies  String?\n  \n  additionalNotes String?\n  \n  @@map("consultations")\n}\n' > prisma/schema.prisma
    
    echo "Schema written successfully"
    
    # Verify the content
    echo "Verifying schema content:"
    grep -E "(provider|url)" prisma/schema.prisma || echo "Could not verify"
    
else
    echo "Development build - keeping existing schema"
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Build Next.js
echo "Building Next.js application..."
npx next build

echo "Build completed successfully"