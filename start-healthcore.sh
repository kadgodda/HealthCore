#!/bin/bash

echo "🚀 Starting HealthCore..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to kill process on port
kill_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}Port $port is in use. Killing existing process...${NC}"
        lsof -ti:$port | xargs kill -9 2>/dev/null
        sleep 1
    fi
}

# Clean up ports
kill_port 8000
kill_port 5173
kill_port 5174
kill_port 5175

# Start services using the test script
./test-integration.sh