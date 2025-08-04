#!/bin/bash

# Script to stop the entire HR Management application

echo "🛑 Stopping HR Management Application..."
echo ""

echo "🌐 Stopping Frontend..."
cd frontend
docker compose down
echo "✅ Frontend stopped"

echo ""
echo "🗄️  Stopping Backend..."
cd ../backend
docker compose down
echo "✅ Backend stopped"

echo ""
echo "🎉 Application stopped successfully!"
echo ""
echo "To start the application again, run: ./start-app.sh"
echo "To remove all data (including database), run: docker compose down -v (in backend directory)"
