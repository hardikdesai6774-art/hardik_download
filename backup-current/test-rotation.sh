#!/bin/bash

# Test script for the FRND Site Rotation System

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Testing FRND Site Rotation System${NC}"
echo "===================================="

# Get site URL from user
read -p "Enter your dummy site URL (e.g., https://your-site.netlify.app): " SITE_URL

if [ -z "$SITE_URL" ]; then
    echo -e "${RED}Error: Site URL is required${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Testing rotation system endpoints...${NC}"

echo ""
echo -e "${YELLOW}1. Testing rotation status:${NC}"
curl -s "$SITE_URL/.netlify/functions/rotation-status" | jq . || echo -e "${RED}Status endpoint failed${NC}"

echo ""
echo -e "${YELLOW}2. Testing main redirect (should return 302):${NC}"
curl -I "$SITE_URL/" | head -n 5

echo ""
echo -e "${YELLOW}3. Triggering manual rotation:${NC}"
curl -s -X POST "$SITE_URL/.netlify/functions/manual-rotation" | jq . || echo -e "${RED}Manual rotation failed${NC}"

echo ""
echo -e "${YELLOW}4. Checking status after rotation:${NC}"
sleep 2
curl -s "$SITE_URL/.netlify/functions/rotation-status" | jq . || echo -e "${RED}Status check failed${NC}"

echo ""
echo -e "${GREEN}✓ Testing completed!${NC}"
echo ""
echo -e "${BLUE}Monitoring commands:${NC}"
echo "Status: curl $SITE_URL/.netlify/functions/rotation-status"
echo "Manual rotation: curl -X POST $SITE_URL/.netlify/functions/manual-rotation"
echo "Test redirect: curl -I $SITE_URL/"
