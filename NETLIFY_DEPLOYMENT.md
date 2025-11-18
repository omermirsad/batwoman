# Netlify Deployment Guide - Complete Single-Site Deployment

This guide explains how to deploy your **entire application** (frontend + backend) to **Netlify** using **Netlify Functions**. No separate backend deployment needed!

## 🎯 What Changed?

Previously, you needed **two separate deployments**:
- Frontend → Netlify
- Backend (Express) → Railway/Heroku

Now with this refactor, you only need **ONE deployment**:
- Everything → Netlify (Frontend + Serverless Functions)

## 📋 Prerequisites

Before deploying to Netlify, make sure you have:

1. **Netlify Account** - Free tier works perfectly
   - Sign up at: https://app.netlify.com/signup

2. **Gemini API Key** - Required for AI chat functionality
   - Get free API key at: https://ai.google.dev/
   - See `GEMINI_API_SETUP.md` for detailed instructions

3. **GitHub Repository** - Your code must be in a Git repository
   - Push your code to GitHub/GitLab/Bitbucket

4. **Optional Services** (for full features):
   - EmailJS account (for contact form)
   - Sentry account (for error tracking)

---

## 🚀 Quick Start Deployment

### Step 1: Prepare Your Repository

Make sure all changes are committed and pushed:

```bash
# Check git status
git status

# Add all files
git add .

# Commit changes
git commit -m "feat: Add Netlify Functions support for single-site deployment"

# Push to your main branch
git push origin main
```

### Step 2: Connect to Netlify

1. Go to https://app.netlify.com/
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Authorize Netlify to access your repositories
5. Select your **batwoman** repository

### Step 3: Configure Build Settings

Netlify should auto-detect these settings from `netlify.toml`, but verify:

```
Build command:    npm run build
Publish directory: dist
Functions directory: netlify/functions
```

**Important**: Click **"Show advanced"** to add environment variables before deploying.

### Step 4: Add Environment Variables

Click **"Add environment variable"** and add the following:

#### Required Variables

| Variable Name | Value | Where to Get |
|--------------|-------|--------------|
| `GEMINI_API_KEY` | Your Gemini API key | https://ai.google.dev/ |

#### Optional Variables (Recommended)

| Variable Name | Value | Purpose |
|--------------|-------|---------|
| `VITE_SENTRY_DSN` | Your Sentry DSN | Error tracking |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS Service ID | Contact form |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS Template ID | Contact form |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS Public Key | Contact form |
| `VITE_ENABLE_ANALYTICS` | `true` | Enable analytics |

**Note**: `VITE_API_URL` is **NOT needed** for Netlify deployment! The app will automatically use relative URLs to call Netlify Functions on the same domain.

### Step 5: Deploy!

1. Click **"Deploy [your-site-name]"**
2. Wait 2-3 minutes for the build to complete
3. You'll see a success message with your site URL: `https://random-name-123.netlify.app`

---

## ✅ Post-Deployment Verification

After deployment, test these features:

### 1. Basic Site Loading
- [ ] Visit your Netlify URL
- [ ] Home page loads correctly
- [ ] Navigation works (About, Services, Blog, Contact)
- [ ] No console errors (Press F12 → Console tab)

### 2. Test AI Chat
- [ ] Scroll to chat section
- [ ] Type a message (e.g., "What are bats?")
- [ ] Click Send
- [ ] You should see a streaming response
- [ ] No errors in console

### 3. Test SPA Routing
- [ ] Click on "About" or any other page
- [ ] Press F5 to refresh
- [ ] Page should still load (not 404)

### 4. Test Health Endpoint
```bash
curl https://your-site.netlify.app/health
```
Should return:
```json
{
  "status": "healthy",
  "timestamp": "2025-...",
  "environment": "production",
  "service": "netlify-functions"
}
```

### 5. Mobile Responsiveness
- [ ] Open on mobile or use Chrome DevTools mobile view
- [ ] All sections display correctly
- [ ] Chat works on mobile

---

## 🔧 Configuration Files Explained

### `netlify.toml`
The main configuration file for Netlify:

```toml
[build]
  command = "npm run build"           # Build frontend
  publish = "dist"                    # Serve from dist folder
  functions = "netlify/functions"     # Serverless functions location

[functions]
  node_bundler = "esbuild"            # Use esbuild for fast builds
  external_node_modules = ["@google/genai"]  # Don't bundle Gemini SDK
```

### Netlify Functions Structure
```
netlify/functions/
├── chat-stream.ts      # Streaming chat endpoint (/api/chat/stream)
├── chat.ts             # Non-streaming chat endpoint (/api/chat)
└── health.ts           # Health check endpoint (/health)
```

These replace the Express server (`api/server.ts`) with serverless functions.

---

## 🌐 Custom Domain Setup (Optional)

### Using Netlify Domain

By default, your site is at: `https://random-name-123.netlify.app`

To customize the Netlify subdomain:
1. Site settings → Domain management → Options
2. Click "Edit site name"
3. Enter your preferred name: `dark-echology.netlify.app`

### Using Your Own Domain

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `darkechology.com`)
4. Follow DNS configuration instructions:

**Option A: Netlify DNS (Recommended)**
- Point your domain's nameservers to Netlify
- Netlify manages everything (SSL, DNS, etc.)

**Option B: External DNS**
- Add these records to your DNS provider:
  ```
  Type: A
  Name: @
  Value: 75.2.60.5

  Type: CNAME
  Name: www
  Value: your-site.netlify.app
  ```

5. Wait for DNS propagation (5 minutes - 48 hours)
6. Netlify automatically provisions SSL certificate

---

## 🐛 Troubleshooting

### Issue 1: Build Fails

**Symptom**: Deployment fails with build errors

**Check**:
1. View deploy log for specific error
2. Common issues:
   ```bash
   # Missing dependencies
   npm install

   # Type errors
   npm run typecheck

   # Build locally to test
   npm run build
   ```

**Fix**:
- Ensure all dependencies are in `package.json`
- Fix TypeScript errors shown in build log
- Test build locally before pushing

### Issue 2: Chat Not Working

**Symptom**: Chat sends message but gets error or no response

**Diagnosis**:
1. Open browser console (F12)
2. Look for errors in Console tab
3. Check Network tab for failed `/api/chat/stream` request

**Fixes**:

**A) Missing API Key**
- Go to Site settings → Environment variables
- Verify `GEMINI_API_KEY` is set correctly
- Trigger a new deploy after adding

**B) API Key Invalid**
- Test your API key at https://ai.google.dev/
- Generate a new key if needed
- Update in Netlify environment variables
- Redeploy

**C) Check Function Logs**
- Go to Netlify Dashboard → Functions
- Click on `chat-stream` function
- View logs for errors
- Common errors:
  - "API_KEY not configured" → Add `GEMINI_API_KEY`
  - "Invalid API key" → Check key is correct
  - "Quota exceeded" → Check Gemini API usage limits

### Issue 3: 404 on Page Refresh

**Symptom**: Refreshing non-home pages shows 404

**Fix**: This should be handled by `netlify.toml` redirect rules. If it's not working:

1. Verify `netlify.toml` is in repository root
2. Check it contains:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
     conditions = {path = "!=/api/*", path = "!=/health"}
   ```
3. Trigger a new deploy

### Issue 4: Environment Variables Not Working

**Symptom**: App behaves as if env vars aren't set

**Check**:
1. Netlify only reads env vars that start with `VITE_` for frontend
2. Backend vars (like `GEMINI_API_KEY`) don't need `VITE_` prefix
3. You **MUST redeploy** after changing environment variables

**Fix**:
1. Go to Site settings → Environment variables
2. Verify all variables are set
3. Click **Deploys** tab
4. Click **"Trigger deploy"** → **"Deploy site"**

### Issue 5: Functions Timeout

**Symptom**: Chat requests timeout after 10 seconds

**Reason**: Netlify Functions have a 10-second timeout on free tier, 26 seconds on Pro.

**Fix**:
- The streaming implementation should work within timeout
- If you still hit timeouts, consider:
  1. Upgrading to Netlify Pro ($19/mo)
  2. Using non-streaming endpoint (fallback is built-in)
  3. Deploying backend separately to Railway (see `RAILWAY_BACKEND_DEPLOY.md`)

### Issue 6: "Function Not Found"

**Symptom**: Console shows 404 for `/api/chat/stream`

**Fix**:
1. Check Functions tab in Netlify Dashboard
2. Verify functions are listed and deployed
3. Check build log for function bundling errors
4. Ensure `netlify/functions/` directory exists in repo
5. Redeploy

---

## 📊 Monitoring and Logs

### View Function Logs

1. Netlify Dashboard → Functions
2. Click on function name (e.g., `chat-stream`)
3. View real-time logs
4. Filter by time range

### View Deploy Logs

1. Netlify Dashboard → Deploys
2. Click on specific deploy
3. View full build log
4. Check for errors or warnings

### Enable Sentry Error Tracking

Add to environment variables:
```
VITE_SENTRY_DSN=your_sentry_dsn_here
```

Then view errors at: https://sentry.io/

---

## 🔄 Continuous Deployment

Netlify automatically deploys when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Netlify automatically:
# 1. Detects the push
# 2. Builds your site
# 3. Deploys if build succeeds
# 4. Sends you a notification
```

### Deploy Previews

Netlify creates preview deployments for pull requests:

```bash
# Create a new branch
git checkout -b feature/new-chat-ui

# Make changes and push
git push origin feature/new-chat-ui

# Create pull request on GitHub
# Netlify will automatically create a preview deployment
# Preview URL will be posted as a comment on the PR
```

---

## 💰 Pricing & Limits

### Netlify Free Tier Includes:
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ 125,000 function requests/month
- ✅ 100 hours function runtime/month
- ✅ Unlimited sites
- ✅ Automatic SSL
- ✅ Deploy previews
- ✅ 10-second function timeout

### When to Upgrade to Pro ($19/mo):
- Need 26-second function timeout (for longer AI responses)
- Need more bandwidth (400 GB)
- Need more function requests (2M)
- Need background functions

### Gemini API (Google):
- ✅ Free tier: 15 requests/minute, 1M tokens/day
- For higher limits, see: https://ai.google.dev/pricing

---

## 🔒 Security Best Practices

### API Key Protection
✅ **Correct**: Store `GEMINI_API_KEY` in Netlify environment variables
- Never exposed to client
- Only accessible to Netlify Functions
- Encrypted at rest

❌ **Wrong**: Hardcoding API keys in code
```javascript
// NEVER DO THIS!
const apiKey = "AIzaSyC..."; // Exposed in bundle
```

### CORS Configuration
- Netlify Functions have CORS enabled by default
- Headers are set in function files
- No additional configuration needed

### Rate Limiting
- Gemini API has built-in rate limits (15 req/min free tier)
- Netlify Functions are rate-limited by default
- Consider adding custom rate limiting if needed

---

## 📈 Performance Optimization

### Build Performance
```toml
# Already configured in netlify.toml
[functions]
  node_bundler = "esbuild"  # Fast builds
```

### Caching Strategy
Headers in `netlify.toml` set optimal caching:
- Static assets: 1 year cache
- Service worker: No cache
- HTML: No cache (for SPA routing)

### Bundle Size
Current optimizations:
- Code splitting for vendor chunks
- Tree shaking
- Minification in production
- Lazy loading for components

---

## 🆚 Comparison: Netlify vs. Separate Backend

### Old Setup (Two Deployments)
```
Frontend (Netlify) → Backend (Railway) → Gemini API
                      ↑
                 Needs CORS
             Needs env var sync
           Two separate deploys
```

**Cons**:
- Two deployments to manage
- CORS configuration needed
- Two sets of environment variables
- Separate monitoring
- Higher complexity

### New Setup (Single Deployment)
```
Frontend (Netlify) → Netlify Functions → Gemini API
        ↑____________/
     Same deployment
```

**Pros**:
- ✅ Single deployment
- ✅ No CORS issues (same origin)
- ✅ Simpler environment management
- ✅ Unified logs and monitoring
- ✅ Free tier includes everything
- ✅ Automatic HTTPS
- ✅ Global CDN

**Cons**:
- 10-second timeout on free tier (vs unlimited on Railway)
- Cold starts for infrequent function calls

---

## 🔄 Migration from Express Backend

If you were using the Express backend (`api/server.ts`), here's what changed:

### What Stays the Same
- ✅ Same Gemini API integration
- ✅ Same error handling
- ✅ Same validation logic
- ✅ Same streaming support
- ✅ Same endpoints (`/api/chat`, `/api/chat/stream`)

### What Changed
- ❌ Express server → Netlify Functions
- ❌ `ALLOWED_ORIGINS` env var → Auto-handled by Netlify
- ❌ Manual CORS setup → Built into functions
- ❌ Port configuration → Not needed
- ❌ Separate deployment → Deployed with frontend

### Code Changes
The frontend automatically detects the deployment type:
```typescript
// Automatically uses relative URLs on Netlify
const apiUrl = import.meta.env.VITE_API_URL || '';
const endpoint = apiUrl ? `${apiUrl}/api/chat/stream` : '/api/chat/stream';
```

---

## 📚 Additional Resources

### Official Documentation
- **Netlify Functions**: https://docs.netlify.com/functions/overview/
- **Netlify Deployment**: https://docs.netlify.com/site-deploys/overview/
- **Environment Variables**: https://docs.netlify.com/environment-variables/overview/

### Project Documentation
- `GEMINI_API_SETUP.md` - How to get Gemini API key
- `NETLIFY_TROUBLESHOOTING.md` - Detailed troubleshooting guide
- `DEPLOYMENT.md` - General deployment guide (all platforms)
- `README.md` - Project overview and features

### Support
- 📧 Email: darkechology@gmail.com
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

---

## 🎉 Success Checklist

Before considering deployment complete:

- [ ] Site loads at Netlify URL
- [ ] All pages accessible (Home, About, Services, Blog, Contact)
- [ ] Chat functionality works (send/receive messages)
- [ ] Page refresh works (no 404s)
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Health endpoint returns 200
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic)
- [ ] Environment variables set correctly
- [ ] Sentry error tracking configured (optional)
- [ ] EmailJS contact form working (optional)

---

## 🚀 Next Steps

1. **Test thoroughly** - Try all features on the live site
2. **Set up custom domain** - Use your own domain name
3. **Enable monitoring** - Set up Sentry for error tracking
4. **Configure analytics** - Track user behavior
5. **Set up email alerts** - Get notified of deploy failures
6. **Create staging site** - Deploy from a separate branch for testing
7. **Optimize performance** - Use Netlify Analytics to identify bottlenecks

---

**Congratulations!** 🎉 Your Dark Echology site is now live on Netlify with serverless backend functions!

For questions or issues, see `NETLIFY_TROUBLESHOOTING.md` or contact support.
