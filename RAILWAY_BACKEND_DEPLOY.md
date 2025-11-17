# Deploy Backend to Railway - Quick Start Guide

## Why Railway?

- ✅ **Free tier** - $5 credit/month (enough for small projects)
- ✅ **Zero configuration** - Automatically detects Node.js
- ✅ **Easy deployment** - Just push code
- ✅ **Environment variables** - Built-in secure storage
- ✅ **Automatic HTTPS** - SSL included
- ✅ **Auto-restart** - Keeps your server running

## Step 1: Create Railway Account (2 minutes)

1. Go to https://railway.app/
2. Click **"Login with GitHub"**
3. Authorize Railway to access your GitHub
4. Done! You're logged in

## Step 2: Create New Project (1 minute)

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your **batwoman** repository
4. Click **"Deploy Now"**

Railway will automatically:
- Detect it's a Node.js project
- Run `npm install`
- Look for a start script

## Step 3: Configure for Backend (2 minutes)

Your repo has both frontend and backend. We need to tell Railway to run only the backend.

1. **In Railway dashboard, click on your service**

2. **Go to "Settings" tab**

3. **Update these settings:**

   **Root Directory:**
   ```
   /
   ```
   (leave as root)

   **Build Command:**
   ```bash
   npm install && npm run build:server
   ```

   **Start Command:**
   ```bash
   node dist-server/api/server.js
   ```

   **Watch Paths:**
   ```
   api/**
   ```

4. **Click "Save"**

## Step 4: Set Environment Variables (2 minutes)

1. **Go to "Variables" tab**

2. **Click "New Variable"** and add these:

   ```bash
   GEMINI_API_KEY=your_actual_gemini_key_here
   ```
   Get from: https://makersuite.google.com/app/apikey

   ```bash
   NODE_ENV=production
   ```

   ```bash
   PORT=3000
   ```
   (Railway uses 3000 by default)

   ```bash
   ALLOWED_ORIGINS=https://your-netlify-site.netlify.app
   ```
   Replace with your actual Netlify URL (get it from Netlify dashboard)

3. **Click "Save"** after each variable

## Step 5: Get Your Backend URL (1 minute)

1. **Go to "Settings" tab**

2. **Scroll to "Domains"**

3. **Click "Generate Domain"**

4. **Copy the URL** (looks like: `https://your-app.railway.app`)

5. **Test it:**
   ```bash
   curl https://your-app.railway.app/health
   ```

   Should return:
   ```json
   {
     "status": "healthy",
     "timestamp": "2024-11-17T...",
     "uptime": 12.34,
     "geminiConfigured": true,
     "environment": "production"
   }
   ```

## Step 6: Connect Frontend to Backend (2 minutes)

1. **Go to your Netlify dashboard**

2. **Site settings → Environment variables**

3. **Add/Update:**
   ```bash
   VITE_API_URL=https://your-app.railway.app
   ```
   (Use the URL from Step 5)

4. **Important:** Go to **Deploys** tab and click **"Trigger deploy"**

   (Environment variables only take effect after redeploying)

## Step 7: Test Everything (1 minute)

1. **Wait for Netlify redeploy to finish** (1-2 minutes)

2. **Open your Netlify site**

3. **Scroll to Chat section**

4. **Type a message:** "Tell me about bats"

5. **✅ Success!** You should see AI response

---

## Troubleshooting

### Issue: Railway shows "Deployment Failed"

**Check deploy logs:**
1. Railway dashboard → Deployments tab
2. Click on failed deployment
3. Read the error

**Common fixes:**
- Make sure build command is: `npm install && npm run build:server`
- Make sure start command is: `node dist-server/api/server.js`
- Check that `GEMINI_API_KEY` is set

### Issue: /health returns 404

**Your backend isn't running.**

Check start command is:
```bash
node dist-server/api/server.js
```

### Issue: CORS Error in Browser Console

**Update `ALLOWED_ORIGINS` in Railway:**

```bash
ALLOWED_ORIGINS=https://your-site.netlify.app,https://your-site-preview.netlify.app
```

Include both production and preview URLs.

### Issue: "API_KEY_INVALID" Error

**Your Gemini API key is wrong or expired.**

1. Get new key from: https://makersuite.google.com/app/apikey
2. Update `GEMINI_API_KEY` in Railway variables
3. Railway will auto-redeploy

### Issue: Backend Keeps Crashing

**Check Railway logs:**
1. Railway dashboard → Deployments
2. Click on latest deployment
3. View logs

**Common issues:**
- Missing environment variables
- Port conflict (use `PORT=3000`)
- Out of memory (upgrade plan or optimize code)

---

## Railway Free Tier Limits

- **$5 credit/month**
- **500 hours execution** (enough for 24/7 small apps)
- **100GB outbound bandwidth**
- **Automatic sleep** after 5 minutes of inactivity (free plan only)

**When does it sleep?**
- After 5 minutes of no requests
- Wakes up automatically on next request
- First request after sleep: ~5 seconds delay
- Subsequent requests: normal speed

**Upgrade to prevent sleep:**
- Hobby plan: $5/month (no sleep)
- Pro plan: $20/month (more resources)

---

## Alternative: Keep It Awake (Free Plan)

If you want to keep it awake on free plan:

**Option 1: Use Uptime Monitor**

1. Sign up for free at: https://uptimerobot.com/
2. Add your Railway URL: `https://your-app.railway.app/health`
3. Set check interval: 5 minutes
4. Your backend will never sleep

**Option 2: Cron Job**

Use a free cron service to ping your backend:
- https://cron-job.org/
- Ping `https://your-app.railway.app/health` every 5 minutes

---

## Monitoring Your Backend

### Check if Backend is Running

```bash
# Quick health check
curl https://your-app.railway.app/health

# Test chat endpoint
curl -X POST https://your-app.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "text": "Hello"}],
    "systemInstruction": "You are helpful."
  }'
```

### View Logs

1. Railway dashboard → Your service
2. Click "Deployments" tab
3. Click on active deployment
4. View real-time logs

### View Metrics

1. Railway dashboard → Your service
2. Click "Metrics" tab
3. See CPU, Memory, Network usage

---

## Cost Estimation

**Free Plan ($5/month credit):**
- Small site (< 1000 visits/month): **$0**
- Medium site (< 5000 visits/month): **$0-2**
- Large site (> 5000 visits/month): **$3-5**

**If you exceed free tier:**
- Railway will email you
- You can upgrade or optimize
- No surprise charges

---

## Production Checklist

Before going live, verify:

- [ ] Backend deployed and accessible
- [ ] Health check works: `curl https://your-app.railway.app/health`
- [ ] `GEMINI_API_KEY` set in Railway
- [ ] `ALLOWED_ORIGINS` includes your Netlify URL
- [ ] `NODE_ENV=production` set
- [ ] Frontend `VITE_API_URL` points to Railway URL
- [ ] Chat works on Netlify site
- [ ] No errors in browser console
- [ ] CORS working (no errors)

---

## Quick Commands Reference

```bash
# Test backend health
curl https://your-app.railway.app/health

# Test chat endpoint
curl -X POST https://your-app.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","text":"test"}]}'

# View Railway logs (requires CLI)
railway logs

# Deploy manually (requires CLI)
railway up
```

---

## Railway CLI (Optional)

For advanced users:

```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs

# Set variables
railway variables set GEMINI_API_KEY=your_key

# Deploy
railway up
```

---

## Next Steps

After deploying:

1. ✅ Test chat on your Netlify site
2. ✅ Set up uptime monitoring
3. ✅ Monitor Railway usage in dashboard
4. ✅ Consider custom domain (optional)
5. ✅ Set up alerts for downtime

---

## Support

- **Railway Docs**: https://docs.railway.app/
- **Railway Discord**: https://discord.gg/railway
- **Status Page**: https://status.railway.app/

---

## Summary

**Total time:** ~10 minutes
**Cost:** $0 (free tier)
**Difficulty:** Easy

After deploying:
1. Your backend runs on Railway
2. Your frontend runs on Netlify
3. Chat feature works end-to-end
4. Both are automatically HTTPS
5. Both auto-deploy on git push

**Done!** 🎉
