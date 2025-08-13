#!/bin/bash

# Check if script is being sourced
if [[ "${BASH_SOURCE[0]}" != "${0}" ]]; then
    echo "Please run this script directly, not with 'source':"
    echo "  ./start-healthcore.sh"
    return 1
fi

echo "🚀 Starting HealthCore..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    if check_port $port; then
        echo -e "${YELLOW}Port $port is in use. Killing existing process...${NC}"
        lsof -ti:$port | xargs kill -9 2>/dev/null
        sleep 1
    fi
}

# Check if poetry is available for backend
if command -v poetry &> /dev/null; then
    echo -e "${GREEN}Poetry found, will use Poetry environment for backend${NC}"
    USE_POETRY=true
else
    echo -e "${YELLOW}Poetry not found, using system Python${NC}"
    USE_POETRY=false
    # Check which python command is available
    if command -v python3 &> /dev/null; then
        PYTHON_CMD="python3"
    elif command -v python &> /dev/null; then
        PYTHON_CMD="python"
    else
        echo -e "${RED}Error: Python is not installed or not in PATH${NC}"
        echo -e "${YELLOW}Please install Python 3 and ensure it's in your PATH${NC}"
        exit 1
    fi
    echo -e "${GREEN}Using Python command: $PYTHON_CMD${NC}"
fi

# Clean up ports
echo -e "${YELLOW}Cleaning up existing processes...${NC}"
kill_port 8000
kill_port 5173
kill_port 5174
kill_port 5175

sleep 2

# Start backend
echo -e "\n${GREEN}Starting Backend API...${NC}"
cd backend
if [ "$USE_POETRY" = true ]; then
    nohup poetry run uvicorn main:app --reload --port 8000 > ../backend.log 2>&1 &
else
    nohup $PYTHON_CMD -m uvicorn main:app --reload --port 8000 > ../backend.log 2>&1 &
fi
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
for i in {1..10}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend started successfully${NC}"
        break
    fi
    if [ $i -eq 10 ]; then
        echo -e "${RED}✗ Backend failed to start. Check backend.log for errors.${NC}"
        exit 1
    fi
    sleep 1
done

# Start frontend
echo -e "\n${GREEN}Starting Frontend...${NC}"
cd ../frontend

# Start the dev server and capture output to find the actual port
# Use nohup to prevent tty issues
nohup npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait a moment for the server to start
sleep 3

# Try to find the actual port from the log
FRONTEND_PORT=$(grep -o "http://localhost:[0-9]*" ../frontend.log | head -1 | grep -o "[0-9]*$")
if [ -z "$FRONTEND_PORT" ]; then
    FRONTEND_PORT="5173"
fi

# Wait for frontend to start on the detected port
echo "Waiting for frontend to start on port $FRONTEND_PORT..."
for i in {1..20}; do
    if curl -s http://localhost:$FRONTEND_PORT > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend started successfully on port $FRONTEND_PORT${NC}"
        break
    fi
    if [ $i -eq 20 ]; then
        echo -e "${RED}✗ Frontend failed to start. Check frontend.log for errors.${NC}"
        exit 1
    fi
    echo -n "."
    sleep 1
done

echo -e "\n${GREEN}============================================${NC}"
echo -e "${GREEN}HealthCore is running!${NC}"
echo -e "${GREEN}============================================${NC}"
echo -e "Frontend: ${YELLOW}http://localhost:$FRONTEND_PORT${NC}"
echo -e "Backend API: ${YELLOW}http://localhost:8000${NC}"
echo -e "API Docs: ${YELLOW}http://localhost:8000/docs${NC}"
echo -e "\nLogs:"
echo -e "Backend: ${YELLOW}tail -f backend.log${NC}"
echo -e "Frontend: ${YELLOW}tail -f frontend.log${NC}"
echo -e "\nPress Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping services...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    
    # Also try to kill by port in case PIDs are stale
    kill_port 8000
    kill_port 5173
    kill_port 5174
    kill_port 5175
    
    echo -e "${GREEN}Services stopped${NC}"
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup INT

# Keep script running
while true; do
    sleep 1
done