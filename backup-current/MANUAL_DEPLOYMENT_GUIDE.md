# 🚀 Manual Deployment Guide - FRND Stable Site

Since we're having CLI issues with the old site ID, let's deploy manually through the Netlify dashboard.

## Step 1: Create New Site in Your Account

1. **Go to**: https://app.netlify.com/teams/hardikdesai6774/sites
2. **Click**: "Add new site" → "Deploy manually"
3. **Drag and drop** the folder: `/Users/akshaykukadiya/Documents/frnd-pixel-perfect-main/frnd-stable-site`

## Step 2: Configure the Site

After deployment:

1. **Go to Site Settings** → **General** → **Site details**
2. **Change site name** to: `frnd-stable-redirect` (or any name you prefer)
3. **Note the new URL** (e.g., `https://frnd-stable-redirect.netlify.app`)

## Step 3: Set Environment Variables

1. **Go to**: Site Settings → **Environment variables**
2. **Add these 4 variables**:

```
NETLIFY_ACCESS_TOKEN = [Get from: https://app.netlify.com/user/applications#personal-access-tokens]
GITHUB_REPO = hardikdesai6774-art/hardik_download
GITHUB_BRANCH = main
URL = [Your new site URL from step 2]
```

## Step 4: Get API Token

1. **Go to**: https://app.netlify.com/user/applications#personal-access-tokens
2. **Create new token**: "FRND Rotation System"
3. **Copy token** and use as `NETLIFY_ACCESS_TOKEN`

## Step 5: Test the System

After setting environment variables:

```bash
# Replace with your actual site URL
curl -X POST https://your-new-site.netlify.app/.netlify/functions/manual-rotation
```

## Alternative: Use Existing Site

If you want to use an existing site in your account:

1. **Go to**: https://app.netlify.com/teams/hardikdesai6774/sites
2. **Choose any existing site**
3. **Go to Deploys** → **Deploy settings** → **Deploy folder**
4. **Drag and drop**: `/Users/akshaykukadiya/Documents/frnd-pixel-perfect-main/frnd-stable-site`

## Files Ready for Upload

The complete system is in: `/Users/akshaykukadiya/Documents/frnd-pixel-perfect-main/frnd-stable-site/`

This includes:
- ✅ Static HTML pages
- ✅ Edge Functions
- ✅ Serverless Functions  
- ✅ Configuration files
- ✅ Admin dashboard

## What Happens Next

Once deployed with environment variables:
1. **Stable URL** will be your permanent link
2. **First rotation** will create a site from your GitHub repo
3. **Every 4 hours** new sites will be created automatically
4. **Old sites** will be cleaned up automatically

Let me know the new site URL once you've deployed it manually, and I'll help test the rotation system! 🚀
