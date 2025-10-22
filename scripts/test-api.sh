#!/bin/bash

echo "🔍 Testing API endpoints locally..."

# Start development server in background
echo "📡 Starting development server..."
yarn dev &
DEV_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

echo ""
echo "=== Health Check ==="
curl -s http://localhost:3000/api/health | jq '.'

echo ""
echo "=== Get Consultations ==="
curl -s http://localhost:3000/api/consultations | jq '.'

echo ""
echo "=== Create Test Consultation ==="
curl -s -X POST http://localhost:3000/api/consultations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Тест API",
    "age": 30,
    "gender": "Чоловік",
    "phone": "+380123456789",
    "height": 180,
    "weight": 75,
    "complaints": "API тест",
    "examinations": ["Огляд"],
    "hasChronicDiseases": false,
    "takesMedications": false,
    "painLevel": 3,
    "hasAllergy": false,
    "additionalNotes": "Тестова консультація з API"
  }' | jq '.'

echo ""
echo "=== Get Consultations After Create ==="
curl -s http://localhost:3000/api/consultations | jq '.'

# Stop development server
echo ""
echo "🛑 Stopping development server..."
kill $DEV_PID

echo "✅ API test completed!"