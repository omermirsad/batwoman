# Quick Deployment Guide

## 🚀 Deploy to Netlify (5 Minutes)

Your site is experiencing build issues because dependencies aren't being installed correctly. Follow these steps to fix it:

### Option 1: Redeploy via Netlify Dashboard (Easiest)

1. **Go to your Netlify dashboard**: https://app.netlify.com/
2. **Find your site**: "jolly-scone-f7b135"
3. **Click "Site configuration" → "Build & deploy"**
4. **Scroll down and click "Trigger deploy" → "Clear cache and deploy site"**

This will:
- Clear any cached node_modules
- Run `npm install` fresh
- Build your site properly

### Option 2: Fix Build Settings

If the redeploy doesn't work, check your build settings:

1. **Go to Site configuration → Build & deploy → Build settings**
2. **Verify these settings:**
   ```
   Build command: npm run build
   Publish directory: dist
   Node version: 20
   ```

3. **If needed, add these commands:**
   ```
   Build command: npm ci && npm run build
   ```
   (Using `npm ci` ensures a clean install from package-lock.json)

### Option 3: Environment Variables

Make sure these are set in Netlify dashboard → Site configuration → Environment variables:

**Required:**
- `GEMINI_API_KEY` - Your Google Gemini API key

**Optional (for full functionality):**
- `VITE_SENTRY_DSN` - For error tracking
- `VITE_EMAILJS_SERVICE_ID` - For contact form
- `VITE_EMAILJS_TEMPLATE_ID` - For contact form
- `VITE_EMAILJS_PUBLIC_KEY` - For contact form

---

## 🔍 What Was Wrong?

The deployed site appeared "mixed up" because:

1. **Build was failing** - TypeScript couldn't find type definitions
2. **Reason**: `node_modules` weren't installed before build
3. **Result**: Netlify served an old/incomplete build

### How We Fixed It Locally:

```bash
npm install  # Installed all dependencies
npm run build  # Build succeeded ✓
```

### How to Fix on Netlify:

**Clear cache and redeploy** - This forces Netlify to reinstall everything fresh.

---

## ✅ Verify Deployment

After redeploying, check:

1. **Build logs show success:**
   ```
   ✓ built in X.XXs
   ```

2. **Site loads properly** at https://jolly-scone-f7b135.netlify.app/

3. **Check these features work:**
   - [ ] Navigation menu
   - [ ] All sections visible (About, Services, Blog)
   - [ ] AI Chat (if API key is set)
   - [ ] Contact form (if EmailJS is configured)

4. **Check browser console** (F12) - should be no red errors

---

## 🐛 Still Having Issues?

### Problem: "Mixed up" layout

**Cause**: CSS/JS not loading properly

**Fix**:
- Clear Netlify cache and redeploy
- Check build logs for errors
- Verify `dist/` folder is being published

### Problem: White/blank page

**Cause**: JavaScript errors preventing app from loading

**Fix**:
- Check browser console for errors
- Verify environment variables are set
- Check Netlify function logs

### Problem: API not working

**Cause**: Missing environment variables or CORS issues

**Fix**:
- Set `GEMINI_API_KEY` in Netlify dashboard
- Check Netlify Functions logs
- Verify functions are deployed (should see `/api/chat`, `/health`)

---

## 📞 Need Help?

1. **Check Netlify deploy logs**: Site → Deploys → Click on latest deploy → View logs
2. **Check function logs**: Site → Functions → Click function → View logs
3. **Check browser console**: F12 → Console tab

Common error messages and solutions are in [NETLIFY_TROUBLESHOOTING.md](NETLIFY_TROUBLESHOOTING.md)

---

## 🎯 Next Steps After Successful Deploy

1. **Set up custom domain** (optional)
   - Site configuration → Domain management
   - Add your domain
   - Update DNS records

2. **Enable monitoring**
   - Set up `VITE_SENTRY_DSN` for error tracking
   - Monitor Netlify Analytics
   - Set up uptime monitoring (UptimeRobot, etc.)

3. **Test all features**
   - Chat functionality
   - Contact form
   - Blog navigation
   - Mobile responsiveness

---

**Your current site:** https://jolly-scone-f7b135.netlify.app/

**Redeploy now** to fix the "mixed up" issue! 🚀
