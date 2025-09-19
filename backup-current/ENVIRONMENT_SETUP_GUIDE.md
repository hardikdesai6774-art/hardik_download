# 🔧 Environment Variables Setup Guide

## Step 1: Get Your Netlify API Token

1. **Go to Netlify Personal Access Tokens**:
   👉 https://app.netlify.com/user/applications#personal-access-tokens

2. **Click "New access token"**

3. **Name it**: `FRND Rotation System`

4. **Copy the token** (you'll only see it once!)

## Step 2: Set Environment Variables

1. **Go to your site's environment variables**:
   👉 https://app.netlify.com/projects/vimala-panel/settings/env

2. **Add these 4 variables**:

### Variable 1: NETLIFY_ACCESS_TOKEN
- **Key**: `NETLIFY_ACCESS_TOKEN`
- **Value**: `[Paste your token from Step 1]`

### Variable 2: GITHUB_REPO
- **Key**: `GITHUB_REPO`
- **Value**: `hardikdesai6774-art/hardik_download`

### Variable 3: GITHUB_BRANCH
- **Key**: `GITHUB_BRANCH`
- **Value**: `main`

### Variable 4: URL
- **Key**: `URL`
- **Value**: `https://vimala-panel.netlify.app`

## Step 3: Save and Deploy

After adding all variables:
1. Click "Save"
2. The site will automatically redeploy with the new environment variables

## Step 4: Test the System

Once the redeploy is complete (about 1-2 minutes), test:

```bash
# Trigger first rotation
curl -X POST https://vimala-panel.netlify.app/.netlify/functions/manual-rotation

# Check status
curl https://vimala-panel.netlify.app/.netlify/functions/rotation-status
```

## 🎯 Expected Result

After the first rotation, you should see:
- A new site created from your GitHub repo
- The redirect URL updated
- Status showing the new active site

## 🚨 Important Notes

- Keep your API token secure
- The token has full access to your Netlify account
- You can revoke it anytime from the same page where you created it
- The system will create/delete sites automatically, so make sure you're okay with that

## ✅ Verification Checklist

- [ ] API token created
- [ ] All 4 environment variables set
- [ ] Site redeployed
- [ ] First rotation triggered
- [ ] System status shows active site

Once complete, your rotation system will be fully operational! 🚀
