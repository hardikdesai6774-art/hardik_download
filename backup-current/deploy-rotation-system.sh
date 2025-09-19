#!/bin/bash

# FRND Site Rotation System Deployment Script
# This script helps deploy the stable dummy site and set up the rotation system

set -e

echo "🚀 FRND Site Rotation System Deployment"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "ROTATION_SETUP.md" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    exit 1
fi

echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${YELLOW}Netlify CLI not found. Installing...${NC}"
    npm install -g netlify-cli
fi

echo -e "${GREEN}✓ Prerequisites checked${NC}"

echo -e "${BLUE}Step 2: Preparing dummy site...${NC}"

# Navigate to dummy site directory
cd dummy-site

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    echo "Installing dummy site dependencies..."
    npm install
fi

echo -e "${GREEN}✓ Dummy site prepared${NC}"

echo -e "${BLUE}Step 3: Deploying dummy site to Netlify...${NC}"

# Deploy the dummy site
echo "Deploying dummy site (this will be your stable URL)..."
netlify deploy --prod --dir=.

echo -e "${GREEN}✓ Dummy site deployed${NC}"

echo -e "${BLUE}Step 4: Configuration needed...${NC}"

echo -e "${YELLOW}IMPORTANT: You need to set these environment variables in your Netlify dashboard:${NC}"
echo ""
echo "1. Go to your Netlify site dashboard"
echo "2. Navigate to Site settings > Environment variables"
echo "3. Add these variables:"
echo ""
echo -e "${GREEN}NETLIFY_ACCESS_TOKEN${NC} = your_netlify_api_token"
echo -e "${GREEN}GITHUB_REPO${NC} = hardikdesai6774-art/hardik_download"
echo -e "${GREEN}GITHUB_BRANCH${NC} = main"
echo -e "${GREEN}URL${NC} = https://your-dummy-site.netlify.app"
echo ""
echo -e "${YELLOW}To get your Netlify API token:${NC}"
echo "1. Go to https://app.netlify.com/user/applications#personal-access-tokens"
echo "2. Create a new Personal Access Token"
echo "3. Copy the token and use it as NETLIFY_ACCESS_TOKEN"
echo ""

read -p "Press Enter after you've set the environment variables..."

echo -e "${BLUE}Step 5: Testing the system...${NC}"

# Get the site URL from Netlify CLI
SITE_URL=$(netlify status --json | grep -o '"url":"[^"]*' | cut -d'"' -f4)

if [ -z "$SITE_URL" ]; then
    echo -e "${YELLOW}Could not automatically detect site URL. Please check manually.${NC}"
    read -p "Enter your dummy site URL (e.g., https://your-site.netlify.app): " SITE_URL
fi

echo "Testing rotation status endpoint..."
curl -s "$SITE_URL/.netlify/functions/rotation-status" || echo -e "${YELLOW}Status endpoint not ready yet (this is normal for new deployments)${NC}"

echo ""
echo -e "${GREEN}✓ Deployment completed!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Your stable URL is: $SITE_URL"
echo "2. Test manual rotation: curl -X POST $SITE_URL/.netlify/functions/manual-rotation"
echo "3. Check status: curl $SITE_URL/.netlify/functions/rotation-status"
echo "4. The system will automatically rotate every 4 hours"
echo ""
echo -e "${GREEN}🎉 Your site rotation system is ready!${NC}"
echo -e "${BLUE}Share this URL with users: $SITE_URL${NC}"

# Go back to project root
cd ..
