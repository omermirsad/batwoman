# Google Gemini API Setup Guide

## Overview

Your Dark Echology project uses Google's Gemini AI for the chat functionality. The Gemini API is accessed through a secure backend server to keep your API key safe.

## Step 1: Get Your Gemini API Key

### Option A: Google AI Studio (Recommended - Free Tier)

1. **Go to Google AI Studio**
   - Visit: https://makersuite.google.com/app/apikey
   - Or: https://aistudio.google.com/app/apikey

2. **Sign in with your Google Account**

3. **Create API Key**
   - Click "Create API Key"
   - Choose "Create API key in new project" or select existing project
   - Copy your API key (starts with `AIza...`)

4. **Important Security Notes**
   - ⚠️ Never commit API keys to git
   - ⚠️ Never expose API keys in client-side code
   - ⚠️ Use environment variables only

### Option B: Google Cloud Console (For Production)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click project dropdown → "New Project"
   - Name it (e.g., "dark-echology-prod")

3. **Enable Gemini API**
   - Go to APIs & Services → Library
   - Search for "Generative Language API"
   - Click "Enable"

4. **Create Credentials**
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "API Key"
   - Copy your API key

5. **Restrict API Key (Recommended for Production)**
   - Click on your API key
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose "Generative Language API"
   - Under "Application restrictions":
     - Set IP address restrictions for your backend server
   - Click "Save"

## Step 2: Configure API Key Locally

### For Local Development

1. **Create `.env` file in project root** (if not exists)
```bash
# In /home/user/batwoman directory
touch .env
```

2. **Add your API key to `.env`**
```bash
# Backend Configuration
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

3. **Verify `.env` is in `.gitignore`**
```bash
# Check if .env is ignored
grep -q "^\.env$" .gitignore || echo ".env" >> .gitignore
```

## Step 3: Configure Frontend Environment

1. **Create `.env` file for frontend variables**
```bash
# Frontend Configuration
VITE_API_URL=http://localhost:3001
VITE_SENTRY_DSN=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

## Step 4: Test Your Setup

### Start the Backend Server

```bash
# Terminal 1 - Start backend API server
npm run dev:server
```

Expected output:
```
🚀 Server running on port 3001
📝 Environment: development
🔒 CORS enabled for: http://localhost:5173,http://localhost:3000
✅ Gemini API key configured
🏥 Health check available at /health
```

### Start the Frontend

```bash
# Terminal 2 - Start frontend dev server
npm run dev
```

### Test the Chat

1. Open your browser to `http://localhost:5173`
2. Scroll to the "Chat with Dark Echology" section
3. Send a test message: "Tell me about bats"
4. You should see a response from Gemini AI

### Test the API Directly

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test chat endpoint
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "text": "What are bats?"}],
    "systemInstruction": "You are an expert on bats."
  }'
```

## Step 5: Deploy to Production

### Backend Deployment (Railway/Heroku/etc.)

1. **Choose a backend hosting provider:**
   - **Railway.app** (Recommended) - Easy Node.js deployment
   - **Heroku** - Mature platform
   - **Google Cloud Run** - Serverless, scales to zero
   - **Render** - Free tier available

2. **Deploy Backend (Example: Railway)**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Set environment variables
railway variables set GEMINI_API_KEY=your_actual_key
railway variables set NODE_ENV=production
railway variables set ALLOWED_ORIGINS=https://yourdomain.com

# Deploy
railway up
```

3. **Get your backend URL**
   - Example: `https://your-app.railway.app`
   - Test: `curl https://your-app.railway.app/health`

### Frontend Deployment (Netlify)

1. **Set Environment Variables in Netlify**

Go to: Netlify Dashboard → Site settings → Environment variables

```bash
VITE_API_URL=https://your-backend-url.railway.app
VITE_SENTRY_DSN=your_sentry_dsn_optional
```

2. **Deploy**
```bash
# Via GitHub (automatic)
# Just push to main branch

# Or manual
netlify deploy --prod
```

## API Usage Limits & Pricing

### Free Tier (Google AI Studio)
- **60 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**
- Perfect for development and small-scale production

### Paid Tier (Google Cloud)
- Pay-as-you-go pricing
- Gemini 2.0 Flash: $0.075 per 1M input tokens
- Gemini 2.0 Flash: $0.30 per 1M output tokens
- No daily limits

**Monitor your usage:**
- Google AI Studio: https://makersuite.google.com/app/apikey
- Google Cloud Console: APIs & Services → Dashboard

## Troubleshooting

### Error: "API key not configured"

**Check backend logs:**
```bash
npm run dev:server
# Should show: "✅ Gemini API key configured"
```

**Verify .env file:**
```bash
cat .env | grep GEMINI_API_KEY
```

### Error: "API_KEY_INVALID"

- Your API key is incorrect or expired
- Get a new key from Google AI Studio
- Update your `.env` file
- Restart the server

### Error: "CORS Error"

**Update `ALLOWED_ORIGINS` in backend `.env`:**
```bash
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

### Error: "429 Too Many Requests"

- You've hit the rate limit
- Free tier: 60 requests/min, 1500 requests/day
- Solutions:
  1. Wait and try again
  2. Upgrade to paid tier
  3. Implement user-side rate limiting
  4. Add caching for common queries

### Error: "Network error" or timeout

- Check if backend server is running
- Verify `VITE_API_URL` in frontend `.env`
- Test backend health endpoint: `curl http://localhost:3001/health`

## Security Best Practices

### ✅ DO:
- Keep API keys in `.env` files (not committed to git)
- Use backend server to proxy API requests
- Set up rate limiting (already configured)
- Restrict API keys in Google Cloud Console
- Monitor API usage regularly
- Rotate API keys periodically

### ❌ DON'T:
- Never commit `.env` files to git
- Never expose API keys in client-side code
- Never share API keys in screenshots/logs
- Never use the same key for dev and production
- Never disable CORS protection
- Never skip rate limiting

## Advanced Configuration

### Use Different Models

Edit `api/server.ts`:

```typescript
// Change model
const modelName = 'gemini-2.5-flash';  // Fast, good for chat
// const modelName = 'gemini-2.0-pro';  // More capable, slower
```

### Adjust System Instructions

Edit `services/geminiService.production.ts`:

```typescript
const DEFAULT_SYSTEM_INSTRUCTION = `
You are an AI assistant for Dark Echology...
[Customize your AI's personality and expertise here]
`;
```

### Modify Rate Limits

Edit `.env`:

```bash
RATE_LIMIT_WINDOW_MS=900000       # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100       # 100 requests per window
```

## Support & Resources

- **Gemini API Docs**: https://ai.google.dev/docs
- **Google AI Studio**: https://makersuite.google.com/
- **Pricing**: https://ai.google.dev/pricing
- **Rate Limits**: https://ai.google.dev/gemini-api/docs/quota

---

## Quick Reference

### Environment Variables

| Variable | Location | Required | Example |
|----------|----------|----------|---------|
| `GEMINI_API_KEY` | Backend `.env` | ✅ Yes | `AIzaSyC...` |
| `VITE_API_URL` | Frontend `.env` | ✅ Yes | `http://localhost:3001` |
| `PORT` | Backend `.env` | ❌ No | `3001` |
| `NODE_ENV` | Backend `.env` | ❌ No | `development` |
| `ALLOWED_ORIGINS` | Backend `.env` | ✅ Yes | `http://localhost:5173` |

### Commands

```bash
# Development
npm run dev:server    # Start backend (Terminal 1)
npm run dev           # Start frontend (Terminal 2)

# Production Build
npm run build:server  # Build backend
npm run build         # Build frontend

# Testing
curl http://localhost:3001/health           # Health check
curl -X POST http://localhost:3001/api/chat # Test chat
```

### Helpful Links
- Get API Key: https://makersuite.google.com/app/apikey
- API Dashboard: https://console.cloud.google.com/apis/dashboard
- Usage Metrics: https://console.cloud.google.com/apis/dashboard
