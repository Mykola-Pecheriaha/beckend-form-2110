#!/bin/bash

# Deploy database migrations to production
echo "🚀 Deploying Prisma migrations to production database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable not set"
    echo "Please set your PostgreSQL connection string:"
    echo "export DATABASE_URL='postgresql://username:password@host:port/database'"
    exit 1
fi

echo "✅ DATABASE_URL is configured"
echo "Database type: $(echo $DATABASE_URL | cut -d: -f1)"

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Deploy migrations (this will create tables if they don't exist)
echo "📋 Deploying migrations to production database..."
npx prisma migrate deploy

# Show migration status
echo "📊 Current migration status:"
npx prisma migrate status

echo "✅ Migration deployment completed!"
echo ""
echo "🔗 You can now test your API endpoints:"
echo "- Health: https://your-domain.vercel.app/api/health"
echo "- Consultations: https://your-domain.vercel.app/api/consultations"