#!/bin/bash

# 🧪 Testing de APIs de EcoNexo
echo "🔌 Testing de APIs de EcoNexo"
echo "=============================="

BASE_URL="http://localhost:3000"
API_ENDPOINTS=(
    "/api/projects"
    "/api/events"
    "/api/volunteers"
    "/api/messages"
    "/api/profiles"
)

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Función para testear endpoint
test_endpoint() {
    local endpoint=$1
    local method=${2:-GET}
    
    echo -e "${BLUE}Testing $method $endpoint${NC}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "%{http_code}" -o /tmp/response.json "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "%{http_code}" -o /tmp/response.json -X "$method" \
            -H "Content-Type: application/json" \
            -d '{"test":"data"}' \
            "$BASE_URL$endpoint")
    fi
    
    http_code="${response: -3}"
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✅ $endpoint - Status: $http_code${NC}"
        if [ -f /tmp/response.json ]; then
            echo "   Response: $(cat /tmp/response.json | head -c 100)..."
        fi
    else
        echo -e "${RED}❌ $endpoint - Status: $http_code${NC}"
    fi
    echo ""
}

# Testear todos los endpoints
for endpoint in "${API_ENDPOINTS[@]}"; do
    test_endpoint "$endpoint" "GET"
done

# Testear POST en endpoints que lo soportan
test_endpoint "/api/projects" "POST"
test_endpoint "/api/events" "POST"
test_endpoint "/api/volunteers" "POST"

echo -e "${BLUE}📊 Resumen de Testing de APIs${NC}"
echo "================================"

# Contar endpoints exitosos
successful=0
total=${#API_ENDPOINTS[@]}

for endpoint in "${API_ENDPOINTS[@]}"; do
    response=$(curl -s -w "%{http_code}" -o /dev/null "$BASE_URL$endpoint")
    http_code="${response: -3}"
    if [ "$http_code" = "200" ]; then
        ((successful++))
    fi
done

echo "Endpoints funcionando: $successful/$total"

if [ $successful -eq $total ]; then
    echo -e "${GREEN}🎉 Todas las APIs están funcionando correctamente!${NC}"
else
    echo -e "${YELLOW}⚠️  Algunas APIs necesitan atención${NC}"
fi

echo ""
echo "🔌 Testing de APIs completado - $(date)"
