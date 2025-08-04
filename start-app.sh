#!/bin/bash

# Script to start the entire HR Management application

echo "🚀 Starting HR Management Application..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if network exists, create if not
if ! docker network ls | grep -q "app-network"; then
    echo "📡 Creating Docker network..."
    docker network create app-network
fi

echo "🗄️  Starting Backend (Database + API)..."
cd backend
docker compose up --build -d
echo "✅ Backend started on http://localhost:5000"
echo "🔍 Database admin panel available on http://localhost:8080"

echo ""
echo "🌐 Starting Frontend..."
cd ../frontend
docker compose up --build -d
echo "✅ Frontend started on http://localhost:3000"

echo ""
echo "🎉 Application is now running!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000" 
echo "🗄️  Database Admin: http://localhost:8080"
echo ""
echo "To stop the application, run: ./stop-app.sh"
echo "To view logs, run: docker compose logs -f (in respective directories)"
