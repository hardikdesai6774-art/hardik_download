#!/bin/bash

# Exit on error
set -e

# Configuration
STABLE_URL="https://kaveri-mallu.netlify.app"

echo "🚀 Starting deployment..."

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI is not installed. Installing..."
    npm install -g netlify-cli@latest
fi

# Login if needed
if ! netlify status &> /dev/null; then
    echo "🔐 Please log in to Netlify..."
    netlify login
fi

# Deploy the site
echo "🌐 Deploying site..."
DEPLOY_OUTPUT=$(netlify deploy --prod --dir=. --json 2>&1)

# Check if the output is valid JSON
if ! echo "$DEPLOY_OUTPUT" | jq -e . >/dev/null 2>&1; then
    echo "❌ Failed to parse deployment output:"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

# Extract values safely
DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | jq -r '.deploy_url // empty')
SITE_ID=$(echo "$DEPLOY_OUTPUT" | jq -r '.site_id // empty')

if [ -z "$DEPLOY_URL" ]; then
    echo "❌ Deployment failed!"
    echo "Debug info:"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

echo "✅ Deployment successful!"
echo "🌍 Site URL: $DEPLOY_URL"
echo "🆔 Site ID: $SITE_ID"

# Update the rotation system with the new URL
echo "🔄 Updating rotation system..."
UPDATE_RESPONSE=$(curl -s -X POST "$STABLE_URL/.netlify/functions/update-rotation" \
    -H "Content-Type: application/json" \
    -d "{\"url\":\"$DEPLOY_URL\",\"siteId\":\"$SITE_ID\"}")

echo "$UPDATE_RESPONSE" | grep -q '"success":true'
if [ $? -eq 0 ]; then
    echo "✅ Rotation system updated successfully!"
    echo "🔗 Stable URL: $STABLE_URL"
    echo "🔄 Next rotation: In 4 hours"
else
    echo "⚠️  Failed to update rotation system:"
    echo "$UPDATE_RESPONSE"
    echo "Trying alternative method..."
    
    # Try alternative method using Netlify API directly
    if [ -n "$NETLIFY_ACCESS_TOKEN" ]; then
        echo "🔑 Using Netlify API to update rotation..."
        # This is a fallback method if the function call fails
        curl -X POST "https://api.netlify.com/api/v1/sites/$SITE_ID/metadata" \
            -H "Authorization: Bearer $NETLIFY_ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -d "{\"rotation_site\":\"$DEPLOY_URL\"}"
    fi
fi

echo "✨ Deployment and rotation update complete!"
