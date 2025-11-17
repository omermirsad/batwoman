# Deployment Guide

## Table of Contents
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Setup](#environment-setup)
- [Deployment Options](#deployment-options)
  - [Vercel (Recommended)](#vercel-recommended)
  - [Netlify](#netlify)
  - [Custom Server](#custom-server)
- [Post-Deployment](#post-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying to production, ensure you have completed the following:

### 1. API Key Security ✅
- [ ] Backend API server is deployed and running
- [ ] `GEMINI_API_KEY` is set in backend environment variables (server-side only)
- [ ] API key is **NOT** exposed in client-side code
- [ ] Domain restrictions are enabled in Google Cloud Console

### 2. Environment Variables ✅
- [ ] All required environment variables are configured
- [ ] Production API URL is set (`VITE_API_URL`)
- [ ] Sentry DSN is configured (optional but recommended)
- [ ] EmailJS credentials are set up (optional)

### 3. Testing ✅
- [ ] All unit tests pass (`npm test`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] Code coverage meets thresholds (70%+)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run typecheck`)

### 4. Performance ✅
- [ ] Build size is optimized
- [ ] Lighthouse score is 90+ for all metrics
- [ ] Web Vitals are within "good" thresholds

### 5. Security ✅
- [ ] npm audit shows no high/critical vulnerabilities
- [ ] CORS origins are properly configured
- [ ] Rate limiting is enabled on backend
- [ ] Security headers are configured

---

## Environment Setup

### Required Environment Variables

#### Backend (.env or hosting platform)
```bash
GEMINI_API_KEY=your_actual_api_key
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (Netlify/Vercel/hosting platform)
```bash
VITE_API_URL=https://your-api-domain.com
VITE_SENTRY_DSN=https://xxx@yyy.ingest.sentry.io/zzz
VITE_EMAILJS_SERVICE_ID=service_xxx
VITE_EMAILJS_TEMPLATE_ID=template_xxx
VITE_EMAILJS_PUBLIC_KEY=xxx
VITE_ENABLE_ANALYTICS=true
VITE_APP_VERSION=1.0.0
```

---

## Deployment Options

### Netlify (Recommended)

#### Prerequisites
- Netlify account
- GitHub repository connected to Netlify
- Backend API deployed separately (see Custom Server section)

#### Option 1: Deploy via GitHub (Recommended)

1. **Connect Repository to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `20`

3. **Configure Environment Variables**
   - Go to Site settings → Environment variables
   - Add all `VITE_*` variables:
     - `VITE_API_URL`
     - `VITE_SENTRY_DSN`
     - `VITE_EMAILJS_SERVICE_ID`
     - `VITE_EMAILJS_TEMPLATE_ID`
     - `VITE_EMAILJS_PUBLIC_KEY`

4. **Configure Redirects & Headers**
   - Netlify will automatically use the `netlify.toml` configuration file
   - This handles SPA routing and security headers

5. **Enable Automatic Deployments**
   - Netlify will auto-deploy on push to main branch
   - Preview deployments created for pull requests

#### Option 2: Manual Deployment via CLI

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build the Project**
```bash
npm run build
```

3. **Deploy**
```bash
# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod --dir=dist

# When prompted, follow the setup wizard
```

4. **Configure Custom Domain** (optional)
   - Go to Netlify dashboard → Domain management
   - Add your custom domain
   - Update DNS records as instructed
   - SSL certificate will be automatically provisioned

#### GitHub Actions Integration

The CI/CD pipeline (`.github/workflows/ci.yml`) is already configured for Netlify:
- Automatic deployments on merge to main
- Preview deployments for pull requests
- Required secrets:
  - `NETLIFY_AUTH_TOKEN`: Get from Netlify dashboard → User settings → Applications
  - `NETLIFY_SITE_ID`: Get from Site settings → General → Site details

---

### Vercel

#### Option 1: Deploy via GitHub

1. **Connect Repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project" → "Import Git Repository"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Configure Environment Variables**
   - Add all `VITE_*` variables in project settings
   - Vercel will auto-deploy on push to main branch

#### Option 2: Manual Deployment via CLI

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

3. **Configure Environment Variables**
   - Set via Vercel dashboard or CLI
   - Add all `VITE_*` variables

---

### Custom Server

#### Backend API Server

1. **Choose a hosting provider**
   - Railway.app (recommended for Node.js)
   - Heroku
   - DigitalOcean App Platform
   - AWS EC2/ECS
   - Google Cloud Run

2. **Deploy Backend**
```bash
# Example for Railway
npm install -g @railway/cli
railway login
railway init
railway up

# Set environment variables in Railway dashboard
```

3. **Configure Environment**
   - Set `GEMINI_API_KEY`
   - Set `PORT` (usually auto-assigned)
   - Set `ALLOWED_ORIGINS` to your frontend domain
   - Set `NODE_ENV=production`

4. **Health Check**
   - Verify `https://your-api-domain.com/health` returns 200 OK

#### Frontend (Static Hosting)

1. **Build the Project**
```bash
VITE_API_URL=https://your-api-domain.com npm run build
```

2. **Deploy to Static Host**
   - **AWS S3 + CloudFront**
   - **Google Cloud Storage + CDN**
   - **Cloudflare Pages**
   - **GitHub Pages**

3. **Configure DNS**
   - Point your domain to the CDN/hosting provider
   - Enable HTTPS (Let's Encrypt or provider's SSL)

---

## Post-Deployment

### 1. Verify Deployment ✅

```bash
# Check frontend is accessible
curl -I https://yourdomain.com

# Check backend health
curl https://your-api-domain.com/health

# Test API endpoint
curl -X POST https://your-api-domain.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","text":"test"}],"systemInstruction":""}'
```

### 2. Enable Monitoring ✅

1. **Sentry**
   - Verify errors are being tracked
   - Set up alerts for critical errors
   - Configure release tracking

2. **Web Vitals**
   - Monitor Core Web Vitals in Sentry or Google Analytics
   - Set up alerts for poor performance

3. **Uptime Monitoring**
   - Use UptimeRobot, Pingdom, or similar
   - Monitor both frontend and backend

### 3. Performance Optimization ✅

1. **Enable CDN**
   - Use Cloudflare, AWS CloudFront, or hosting provider's CDN
   - Configure caching headers

2. **Enable Compression**
   - Gzip/Brotli compression should be enabled by default on most platforms

3. **Enable HTTP/2**
   - Should be enabled by default on modern hosting platforms

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Error rate in Sentry < 1%
- [ ] API response time < 1s
- [ ] No critical security alerts

### Weekly Checks
- [ ] Review Sentry errors and trends
- [ ] Check Web Vitals performance
- [ ] Review backend logs for anomalies

### Monthly Checks
- [ ] Update dependencies (`npm outdated`, `npm audit`)
- [ ] Review and optimize bundle size
- [ ] Review and update documentation

### Quarterly Checks
- [ ] Security audit (`npm audit`, Snyk scan)
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit (WCAG 2.1 AA)

---

## Troubleshooting

### Frontend Not Loading
```bash
# Check if build succeeded
npm run build

# Check if all environment variables are set
echo $VITE_API_URL

# Check browser console for errors
# Common issues: missing environment variables, CORS errors
```

### Backend API Errors
```bash
# Check backend logs
# Vercel: vercel logs
# Railway: railway logs
# Heroku: heroku logs --tail

# Test health endpoint
curl https://your-api-domain.com/health

# Check environment variables are set
```

### CORS Errors
```bash
# Verify ALLOWED_ORIGINS is set correctly on backend
# Should include your frontend domain

# Example:
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Rate Limiting Issues
```bash
# Check rate limit configuration
# Adjust RATE_LIMIT_MAX_REQUESTS if needed
# Default: 100 requests per 15 minutes

# Monitor rate limit hits in backend logs
```

### SSL/HTTPS Issues
```bash
# Ensure hosting provider has SSL enabled
# Verify domain DNS is correct
# Check for mixed content warnings (http resources on https page)
```

### Performance Issues
```bash
# Run Lighthouse audit
npm install -g lighthouse
lighthouse https://yourdomain.com

# Check bundle size
npm run build
# Look for warnings about chunk size

# Optimize images and assets
# Consider lazy loading for heavy components
```

---

## Rollback Procedure

If deployment fails or critical issues are discovered:

### Vercel
```bash
# List deployments
vercel list

# Rollback to previous deployment
vercel rollback <deployment-url>
```

### Netlify
```bash
# Rollback via dashboard
# Deploys → Previous Deploys → Publish
```

### Custom Server
```bash
# Revert to previous git commit
git revert HEAD
git push origin main

# Or rollback Docker image/container
docker pull your-image:previous-tag
docker-compose up -d
```

---

## Support & Resources

- **Documentation**: See [README.md](README.md) for development setup
- **CI/CD**: See [.github/workflows/ci.yml](.github/workflows/ci.yml) for automation
- **Monitoring**: [Sentry Dashboard](https://sentry.io/)
- **Backend Logs**: Check your hosting provider's dashboard

For issues or questions, create an issue in the GitHub repository.
