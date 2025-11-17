# Netlify Deployment Troubleshooting Guide

## Quick Diagnostic Checklist

Before diving into fixes, gather this information:

### 1. What's the exact problem?
- [ ] Blank/white screen
- [ ] 404 errors on page refresh
- [ ] Specific features not working (chat, contact form, etc.)
- [ ] Styling issues
- [ ] Console errors

### 2. Build Status
- [ ] Check Netlify deploy log for errors
- [ ] Note the build time (should be ~1-2 minutes)
- [ ] Check if "Deploy succeeded" message appears

### 3. Browser Console Errors
- [ ] Open site and press F12
- [ ] Check Console tab for red errors
- [ ] Check Network tab for failed requests

---

## Common Issues & Fixes

### Issue 1: Blank White Screen ⬜

**Symptoms:**
- Site loads but shows only white screen
- No errors visible
- Spinner might appear briefly then disappear

**Diagnosis:**
```bash
# Open browser console (F12) and check for:
- Uncaught TypeError
- Failed to fetch
- Module import errors
```

**Fix A: Missing Environment Variables**

1. Go to Netlify Dashboard → Site settings → Environment variables
2. Add these **REQUIRED** variables:

```bash
VITE_API_URL=https://your-backend-api-url.com
```

Optional but recommended:
```bash
VITE_SENTRY_DSN=your_sentry_dsn
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

3. **Important:** After adding variables, you MUST redeploy:
   - Go to Deploys tab
   - Click "Trigger deploy" → "Deploy site"

**Fix B: Build Configuration**

Verify build settings:
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `20`

---

### Issue 2: 404 on Page Refresh 🔄

**Symptoms:**
- Home page works
- Clicking links works
- Refreshing on any route except "/" shows "Page Not Found"

**Diagnosis:**
This is a Single Page Application (SPA) routing issue.

**Fix: Verify `netlify.toml` is deployed**

1. Check if `netlify.toml` exists in your repo root
2. It should contain:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

3. If missing, the file is already in your repo. Just commit and push:

```bash
git add netlify.toml
git commit -m "Add Netlify SPA redirect config"
git push origin main
```

---

### Issue 3: Chat Not Working 💬

**Symptoms:**
- Everything loads fine
- Chat section appears
- Typing and sending messages doesn't work or shows errors

**Diagnosis:**
```bash
# Browser console will show:
- "Failed to fetch"
- "Network error"
- "CORS error"
```

**Fix A: Backend API Not Deployed**

The chat requires a backend server. You need to:

1. **Deploy backend API** to Railway/Heroku/Render:

```bash
# Using Railway (recommended)
npm install -g @railway/cli
railway login
railway init
railway up

# Set environment variable
railway variables set GEMINI_API_KEY=your_actual_key
railway variables set ALLOWED_ORIGINS=https://your-netlify-site.netlify.app
```

2. **Get your backend URL**
   - Railway: `https://your-app.railway.app`
   - Copy this URL

3. **Add to Netlify environment variables:**
   - Variable: `VITE_API_URL`
   - Value: `https://your-app.railway.app`

4. **Redeploy Netlify site** (Trigger deploy button)

**Fix B: CORS Error**

If you see "CORS policy" error:

1. Check your backend `.env` file has:
```bash
ALLOWED_ORIGINS=https://your-netlify-site.netlify.app
```

2. If you have multiple domains (with/without www):
```bash
ALLOWED_ORIGINS=https://your-site.netlify.app,https://www.yoursite.com,https://yoursite.com
```

3. Restart your backend server

**Fix C: Missing Gemini API Key (Backend)**

Your backend server needs the Gemini API key:

```bash
# On Railway/Heroku/Render dashboard:
GEMINI_API_KEY=your_actual_api_key_here
```

**Test backend is working:**
```bash
curl https://your-backend-url.railway.app/health
# Should return: {"status":"healthy",...}
```

---

### Issue 4: Contact Form Not Working 📧

**Symptoms:**
- Form appears
- Can type in fields
- Submit button doesn't work or shows error

**Diagnosis:**
Contact form uses EmailJS - check browser console for EmailJS errors.

**Fix: Add EmailJS Credentials**

1. Sign up at https://www.emailjs.com/
2. Get your credentials
3. Add to Netlify environment variables:

```bash
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

4. Redeploy site

**Alternative:** Contact form will show a message that it's not configured, but site will still work.

---

### Issue 5: Build Errors ⚠️

**Symptoms:**
- Deploy fails with error
- Build log shows red errors
- Site shows "Deploy failed"

**Common Build Errors:**

#### Error: "command not found: npm"

**Fix:** Set Node version in Netlify:
1. Site settings → Build & deploy → Environment
2. Add environment variable:
   - Key: `NODE_VERSION`
   - Value: `20`

#### Error: "Module not found"

**Fix:** Check if dependencies are in `package.json`:
```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

#### Error: "Out of memory"

**Fix:** The build might be too large.
1. Go to Site settings → Build & deploy → Build settings
2. Add environment variable:
   - Key: `NODE_OPTIONS`
   - Value: `--max-old-space-size=4096`

---

### Issue 6: Styling Issues 🎨

**Symptoms:**
- Site loads but looks broken
- CSS not applied
- Images missing

**Fix A: Check Asset Paths**

If images/fonts aren't loading, check browser console Network tab.

**Fix B: Clear Netlify Cache**

1. Go to Deploys tab
2. Click "Trigger deploy" → "Clear cache and deploy site"

---

### Issue 7: Service Worker Issues 🔧

**Symptoms:**
- Old version of site keeps loading
- Changes don't appear
- "Service Worker registration failed" in console

**Fix: Force Refresh**

For users:
1. Press `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)
2. Or: DevTools → Application → Service Workers → Unregister

For you (developer):
1. Increment version in `package.json`
2. Redeploy

---

## Step-by-Step Deploy Process

### First-Time Deployment

1. **Prepare Repository**
```bash
# Make sure all files are committed
git status
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

2. **Deploy Backend First** (Railway/Heroku)
```bash
# See GEMINI_API_SETUP.md Step 5
# Get backend URL: https://your-app.railway.app
```

3. **Connect to Netlify**
   - Go to https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your repository
   - Click "Deploy site"

4. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Show advanced" → "New variable"

5. **Add Environment Variables**
```bash
VITE_API_URL=https://your-backend-url.railway.app
```

6. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes
   - Site will be live at: `https://random-name-123.netlify.app`

7. **Test Everything**
   - [ ] Home page loads
   - [ ] Navigation works
   - [ ] Chat works (try sending a message)
   - [ ] Contact form appears
   - [ ] Blog posts load
   - [ ] Page refresh works (try going to /about and refreshing)

8. **Custom Domain** (Optional)
   - Site settings → Domain management
   - Add custom domain
   - Follow DNS instructions

---

## Advanced Debugging

### Check Netlify Function Logs

```bash
# If using Netlify Functions
netlify dev
netlify logs:function your-function-name
```

### Test Production Build Locally

```bash
# Build for production
npm run build

# Serve locally
npx serve dist

# Open http://localhost:3000
# This should match your Netlify site exactly
```

### Check Environment Variables in Build

Add to `netlify.toml`:
```toml
[build]
  command = "echo VITE_API_URL=$VITE_API_URL && npm run build"
```

This will show if env vars are being passed correctly.

---

## Netlify CLI Debugging

Install Netlify CLI for local testing:

```bash
# Install
npm install -g netlify-cli

# Login
netlify login

# Link to your site
netlify link

# Test build locally
netlify build

# Test deploy locally
netlify dev

# View deploy log
netlify watch
```

---

## Quick Fixes Checklist

Try these in order:

- [ ] **Clear cache and redeploy**
  - Deploys tab → Trigger deploy → Clear cache and deploy site

- [ ] **Verify environment variables**
  - Site settings → Environment variables
  - At minimum: `VITE_API_URL`

- [ ] **Check build log**
  - Deploys tab → Latest deploy → Deploy log
  - Look for errors (red text)

- [ ] **Test production build locally**
  - `npm run build && npx serve dist`
  - Should match Netlify site

- [ ] **Check browser console**
  - F12 → Console tab
  - Note any red errors

- [ ] **Verify netlify.toml exists**
  - Should be in repo root
  - Contains SPA redirect rules

- [ ] **Test backend API**
  - `curl https://your-backend-url/health`
  - Should return JSON

- [ ] **Check CORS configuration**
  - Backend `ALLOWED_ORIGINS` includes Netlify URL

---

## Still Having Issues?

### Get Help

1. **Share these details:**
   - Netlify site URL
   - Error message from browser console (F12)
   - Error from Netlify deploy log
   - What specifically isn't working

2. **Check these logs:**
   - Netlify deploy log (Deploys tab)
   - Browser console (F12)
   - Network tab (F12 → Network)
   - Backend server logs (Railway/Heroku dashboard)

3. **Useful Commands:**
```bash
# Test backend
curl https://your-backend-url/health

# Test frontend build
npm run build

# Check environment
echo $VITE_API_URL

# View git status
git status
```

---

## Common Environment Variable Mistakes

❌ **Wrong:**
```bash
# In Netlify
API_URL=http://localhost:3001  # This won't work in production!
```

✅ **Correct:**
```bash
# In Netlify
VITE_API_URL=https://your-backend-url.railway.app
```

❌ **Wrong:**
```bash
# Forgetting VITE_ prefix
API_URL=https://backend.com  # Vite won't see this
```

✅ **Correct:**
```bash
VITE_API_URL=https://backend.com  # Vite can access this
```

---

## Production Checklist

Before going live, verify:

- [ ] All environment variables set in Netlify
- [ ] Backend API deployed and accessible
- [ ] `ALLOWED_ORIGINS` includes Netlify URL
- [ ] Gemini API key set in backend
- [ ] Custom domain configured (if using)
- [ ] SSL certificate active (automatic in Netlify)
- [ ] All pages accessible and working
- [ ] Chat functionality working
- [ ] Forms working (or gracefully disabled)
- [ ] No console errors on any page
- [ ] Mobile responsive (test on phone)
- [ ] Page refresh works on all routes

---

## Quick Reference

| What | Where | How |
|------|-------|-----|
| Set env vars | Netlify Dashboard → Settings → Environment variables | Add `VITE_API_URL` |
| Redeploy | Netlify Dashboard → Deploys → Trigger deploy | Clear cache and deploy |
| View logs | Netlify Dashboard → Deploys → Latest deploy | Click on deploy |
| Test backend | Terminal | `curl https://backend-url/health` |
| Test build | Terminal | `npm run build && npx serve dist` |
| Clear cache | Browser | `Ctrl+Shift+R` or `Cmd+Shift+R` |

---

## Support Resources

- **Netlify Docs**: https://docs.netlify.com/
- **Netlify Support**: https://answers.netlify.com/
- **Vite Docs**: https://vitejs.dev/
- **Project Docs**: See `GEMINI_API_SETUP.md` and `DEPLOYMENT.md`
