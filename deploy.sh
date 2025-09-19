#!/bin/bash

# Exit on error
set -e

SITE_NAME="kaveri-mallu"
SITE_URL="https://$SITE_NAME.netlify.app"

echo "🚀 Starting deployment for $SITE_NAME..."

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Login to Netlify if not already logged in
if ! netlify whoami &> /dev/null; then
  echo "🔑 Logging in to Netlify..."
  netlify login
fi

# Check if site exists, create if it doesn't
if ! netlify sites:list --name "$SITE_NAME" 2>&1 | grep -q "$SITE_NAME"; then
  echo "🌐 Creating new Netlify site: $SITE_NAME..."
  netlify sites:create "$SITE_NAME"
  
  # Link the site to the current directory
  echo "🔗 Linking site to current directory..."
  netlify link --name "$SITE_NAME"
else
  echo "🔗 Site $SITE_NAME already exists, linking..."
  netlify link --name "$SITE_NAME"
fi

# Deploy to Netlify
echo "🚀 Deploying to Netlify..."
netlify deploy --prod --site "$SITE_NAME"

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your site is live at: $SITE_URL"
echo ""
echo "To update the site in the future, simply run:"
echo "  ./deploy.sh"
