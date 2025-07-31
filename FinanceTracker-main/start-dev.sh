#!/bin/bash

# Finance Tracker Development Starter Script

echo "🚀 Starting Finance Tracker Development Environment..."
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   mongod"
    echo ""
    exit 1
fi

echo "✅ MongoDB is running"
echo ""

# Function to start backend
start_backend() {
    echo "🔧 Starting Backend Server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    echo "✅ Backend started on http://localhost:5000"
    echo ""
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting Frontend Server..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    echo "✅ Frontend started on http://localhost:3000"
    echo ""
}

# Start both servers
start_backend
sleep 3
start_frontend

echo "🎉 Finance Tracker is now running!"
echo ""
echo "📍 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   Health:   http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait
