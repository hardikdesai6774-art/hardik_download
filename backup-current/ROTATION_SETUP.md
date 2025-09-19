# FRND Site Rotation System

This system creates a stable "dummy" site that automatically redirects users to rotating fresh deployments every 4 hours.

## How It Works

1. **Stable Dummy Site**: A permanent URL that users always visit
2. **Edge Function**: Handles 302 redirects to the current active site
3. **Netlify Blobs**: Stores the current active site URL
4. **Scheduled Function**: Runs every 4 hours to create new sites and clean up old ones
5. **Automatic Rotation**: Creates fresh sites, updates redirect target, deletes old sites

## Architecture

```
User visits stable URL
       ↓
Edge Function reads current URL from Blobs
       ↓
302 Redirect to current active site
       ↓
User sees the fresh rotating site

Every 4 hours:
Scheduled Function → Create new site → Update Blobs → Delete old site
```

## Setup Instructions

### 1. Deploy the Dummy Site

The dummy site should be deployed as a separate Netlify site that will serve as your stable URL.

```bash
cd dummy-site
# Deploy this directory as a new Netlify site
```

### 2. Environment Variables

Set these in your Netlify dashboard for the dummy site:

```
NETLIFY_ACCESS_TOKEN=your_netlify_api_token
GITHUB_REPO=hardikdesai6774-art/hardik_download
GITHUB_BRANCH=main
URL=https://your-dummy-site.netlify.app
```

### 3. Get Netlify API Token

1. Go to [Netlify User Settings](https://app.netlify.com/user/applications#personal-access-tokens)
2. Create a new Personal Access Token
3. Copy the token and add it as `NETLIFY_ACCESS_TOKEN` environment variable

### 4. Configure Scheduled Functions

The system is configured to run every 4 hours with this cron expression:
```
0 */4 * * *
```

This runs at: 00:00, 04:00, 08:00, 12:00, 16:00, 20:00 UTC daily.

### 5. Initial Setup

After deploying the dummy site, trigger the first rotation manually:

```bash
curl -X POST https://your-dummy-site.netlify.app/.netlify/functions/manual-rotation
```

## API Endpoints

### Check Rotation Status
```bash
GET /.netlify/functions/rotation-status
```

### Manual Rotation Trigger
```bash
POST /.netlify/functions/manual-rotation
```

### Direct Rotation (Internal)
```bash
POST /.netlify/functions/rotate-site
```

## File Structure

```
dummy-site/
├── index.html                 # Simple loading page with fallback
├── netlify.toml              # Netlify configuration
└── package.json              # Dependencies

netlify/
├── edge-functions/
│   └── redirect.ts           # Edge function for 302 redirects
└── functions/
    ├── rotate-site.ts        # Core rotation logic
    ├── scheduled-rotation.ts # Scheduled trigger
    ├── manual-rotation.ts    # Manual trigger
    └── rotation-status.ts    # Status checker
```

## How to Use

1. **Deploy the dummy site** to get your stable URL
2. **Set environment variables** in Netlify dashboard
3. **Trigger initial rotation** to set up the first active site
4. **Share the dummy site URL** with users - this never changes
5. **Monitor via status endpoint** to ensure rotations are working

## Monitoring

Check rotation status:
```bash
curl https://your-dummy-site.netlify.app/.netlify/functions/rotation-status
```

Example response:
```json
{
  "currentSiteUrl": "https://frnd-rotation-1695123456789.netlify.app",
  "currentSiteId": "abc123def456",
  "lastRotation": "2023-09-19T12:00:00.000Z",
  "nextRotation": "2023-09-19T16:00:00.000Z",
  "systemTime": "2023-09-19T14:30:00.000Z",
  "rotationInterval": "Every 4 hours (0 */4 * * *)"
}
```

## Troubleshooting

### Edge Function Not Working
- Check that the edge function is deployed correctly
- Verify Netlify Blobs has the current site URL stored
- Check browser network tab for redirect responses

### Scheduled Function Not Running
- Verify the cron expression in netlify.toml
- Check function logs in Netlify dashboard
- Ensure environment variables are set correctly

### API Rate Limits
- Netlify API allows ~3 deploys/minute and ~100/day
- The 4-hour interval should stay well within limits
- Monitor API usage in Netlify dashboard

### Manual Testing
```bash
# Test manual rotation
curl -X POST https://your-dummy-site.netlify.app/.netlify/functions/manual-rotation

# Check status
curl https://your-dummy-site.netlify.app/.netlify/functions/rotation-status

# Test redirect (should return 302)
curl -I https://your-dummy-site.netlify.app/
```

## Security Notes

- Keep your Netlify API token secure
- The rotation functions include error handling and fallbacks
- Old sites are automatically deleted to prevent accumulation
- All functions include proper logging for debugging

## Customization

- **Rotation Interval**: Change the cron expression in `netlify.toml`
- **Site Naming**: Modify the naming pattern in `rotate-site.ts`
- **Fallback URL**: Update the fallback URL in `redirect.ts` and `index.html`
- **Repository**: Change `GITHUB_REPO` environment variable

This system ensures your public URL never changes while providing fresh deployments every 4 hours automatically!
