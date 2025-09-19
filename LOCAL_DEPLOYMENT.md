# Local Deployment for FRND Rotation System

This guide explains how to set up and use the FRND Rotation System with local file deployment.

## Prerequisites

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Make the deployment script executable:
   ```bash
   chmod +x deploy-local.sh
   ```

## Setup

1. **Login to Netlify** (if not already logged in):
   ```bash
   netlify login
   ```

2. **Set Environment Variables** in your Netlify dashboard:
   - `NETLIFY_ACCESS_TOKEN`: Your Netlify API token
   - `URL`: Your stable URL (e.g., https://kaveri-mallu.netlify.app)

## How to Deploy

1. **Run the deployment script**:
   ```bash
   ./deploy-local.sh
   ```

2. The script will:
   - Deploy your current directory to a new Netlify site
   - Update the rotation system with the new URL
   - Print the deployment URL

## Automatic Rotation

The system will automatically rotate sites every 4 hours using the scheduled function.

## Manual Rotation

To trigger a manual rotation:
```bash
curl -X POST https://kaveri-mallu.netlify.app/.netlify/functions/manual-rotation
```

## Check Status

```bash
curl https://kaveri-mallu.netlify.app/.netlify/functions/rotation-status
```

## Troubleshooting

- If you get permission errors, make sure you're logged in with `netlify login`
- Check Netlify function logs in the dashboard for any errors
- Ensure all environment variables are set correctly
