<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Dark Echology - Production-Ready Chiropterology Platform

[![CI/CD](https://github.com/yourusername/batwoman/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/batwoman/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, **enterprise-grade** web application showcasing bat ecology research, conservation services, and educational content. Built with React, TypeScript, and Vite, featuring AI-powered chat, comprehensive testing, monitoring, and production-ready infrastructure.

[View Demo](https://your-demo-url.com) · [Report Bug](https://github.com/yourusername/batwoman/issues) · [Request Feature](https://github.com/yourusername/batwoman/issues)

---

## ✨ Features

### Core Functionality
- 🦇 **AI-Powered Chat** - Interactive Q&A about bat ecology using Google Gemini AI
- 📝 **Blog System** - Educational articles with search, filtering, and SEO optimization
- 📧 **Contact Form** - Integrated with EmailJS for direct communication
- 🎨 **Modern UI/UX** - Responsive design with smooth animations and accessibility
- 🌙 **Dark Theme** - Eye-friendly dark color scheme optimized for readability

### Production-Ready Infrastructure
- 🔒 **Secure API Proxy** - Backend server protects API keys and implements rate limiting
- 📊 **Error Tracking** - Sentry integration for real-time error monitoring
- 📈 **Performance Monitoring** - Web Vitals tracking and analytics
- ✅ **Comprehensive Testing** - Unit, integration, and E2E tests with 70%+ coverage
- 🚀 **CI/CD Pipeline** - Automated testing, building, and deployment
- 🔐 **Security Best Practices** - CORS, rate limiting, input validation, and error handling
- 📱 **PWA Support** - Installable app with offline capabilities
- 🎯 **Type Safety** - Full TypeScript with strict mode and runtime validation

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI framework |
| **TypeScript** | 5.8.2 | Type safety |
| **Vite** | 6.2.0 | Build tool |
| **Tailwind CSS** | Latest (CDN) | Styling |
| **Sentry** | 8.40.0 | Error tracking |
| **Web Vitals** | 4.2.4 | Performance monitoring |
| **EmailJS** | 4.4.1 | Contact form |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Express** | 4.21.2 | API server |
| **Google Gemini AI** | 1.16.0 | AI chat |
| **Helmet** | 8.0.0 | Security headers |
| **CORS** | 2.8.5 | Cross-origin requests |
| **Express Rate Limit** | 7.5.0 | Rate limiting |

### Testing & Quality
| Tool | Purpose |
|------|---------|
| **Vitest** | Unit testing |
| **Playwright** | E2E testing |
| **Testing Library** | Component testing |
| **ESLint** | Linting |
| **Husky** | Git hooks |
| **Lint-staged** | Pre-commit checks |

---

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Gemini API Key** from [Google AI Studio](https://ai.google.dev/)
- **Git** for version control

### Optional (for full features)
- **Sentry Account** for error tracking
- **EmailJS Account** for contact form
- **Vercel/Netlify Account** for hosting

---

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/batwoman.git
cd batwoman

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your API keys
# Required:
#   - GEMINI_API_KEY (for backend)
#   - VITE_API_URL (API server URL)
# Optional:
#   - VITE_SENTRY_DSN
#   - VITE_EMAILJS_* credentials
```

See [.env.example](.env.example) for full configuration options.

### 3. Development

```bash
# Start frontend (port 3000)
npm run dev

# Start backend API server (port 3001)
npm run dev:server

# Open browser
open http://localhost:3000
```

---

## 📦 Available Scripts

### Development
```bash
npm run dev              # Start frontend dev server
npm run dev:server       # Start backend API server with hot reload
```

### Building
```bash
npm run build           # Build frontend for production
npm run build:server    # Build backend for production
npm run preview         # Preview production build locally
```

### Testing
```bash
npm test                # Run unit tests
npm run test:ui         # Run tests with UI
npm run test:coverage   # Generate coverage report
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui     # Run E2E tests with UI
```

### Quality Checks
```bash
npm run lint            # Check code quality
npm run lint:fix        # Fix linting issues
npm run typecheck       # TypeScript type checking
```

---

## 🏗️ Project Structure

```
batwoman/
├── api/                      # Backend API server
│   └── server.ts             # Express server with Gemini proxy
├── components/               # React components
│   ├── ErrorBoundary.tsx     # Global error boundary
│   ├── GeminiChat.tsx        # AI chat interface
│   ├── Contact.tsx           # Contact form with EmailJS
│   └── ...                   # Other components
├── config/                   # Configuration
│   └── env.ts                # Environment validation (Zod)
├── services/                 # Business logic
│   ├── geminiService.ts      # Development Gemini client
│   └── geminiService.production.ts  # Production API proxy client
├── utils/                    # Utilities
│   ├── apiClient.ts          # HTTP client with retry logic
│   ├── logger.ts             # Structured logging
│   ├── monitoring.ts         # Web Vitals tracking
│   └── sentry.ts             # Sentry configuration
├── tests/                    # Test files
│   ├── components/           # Component tests
│   ├── utils/                # Utility tests
│   ├── e2e/                  # End-to-end tests
│   └── setup.ts              # Test configuration
├── .github/                  # GitHub Actions
│   └── workflows/
│       └── ci.yml            # CI/CD pipeline
├── .husky/                   # Git hooks
│   └── pre-commit            # Pre-commit checks
├── vite.config.ts            # Vite + PWA configuration
├── vitest.config.ts          # Vitest configuration
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json             # TypeScript config (client)
├── tsconfig.server.json      # TypeScript config (server)
├── DEPLOYMENT.md             # Deployment guide
└── README.md                 # This file
```

---

## 🔒 Security

### API Key Protection
- ✅ **Backend Proxy**: Gemini API key is **never** exposed to the client
- ✅ **Rate Limiting**: 100 requests per 15 minutes per IP
- ✅ **CORS Protection**: Whitelist-based origin control
- ✅ **Input Validation**: All user inputs are validated and sanitized

### Best Practices
- ✅ **HTTPS Only**: All production traffic uses SSL/TLS
- ✅ **Security Headers**: Helmet.js implements security headers
- ✅ **Error Handling**: No sensitive data in error messages
- ✅ **Dependencies**: Regular security audits with `npm audit`

### Recommended: Google Cloud Console Settings
1. Enable API key restrictions (HTTP referrers)
2. Set usage quotas to prevent abuse
3. Monitor usage in Google Cloud Console

---

## 📊 Testing

### Unit Tests (Vitest)
```bash
npm test                 # Run all tests
npm run test:coverage    # With coverage report
```

Coverage thresholds: 70% for lines, functions, branches, and statements.

### E2E Tests (Playwright)
```bash
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Interactive mode
```

Tests cover:
- Homepage navigation
- Contact form submission
- AI chat functionality
- Mobile responsiveness

### Pre-commit Checks
Husky automatically runs before each commit:
- ESLint
- TypeScript type check
- Related tests

---

## 🚀 Deployment

### Quick Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### Comprehensive Deployment Guide

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for detailed instructions on:
- ✅ Pre-deployment checklist
- 📦 Deploying to Vercel, Netlify, or custom servers
- 🔧 Environment configuration
- 🏥 Health checks and monitoring
- 🔄 Rollback procedures

### Environment Variables for Production

#### Frontend
```bash
VITE_API_URL=https://your-api-domain.com
VITE_SENTRY_DSN=https://xxx@sentry.io/yyy
VITE_EMAILJS_SERVICE_ID=service_xxx
VITE_EMAILJS_TEMPLATE_ID=template_xxx
VITE_EMAILJS_PUBLIC_KEY=xxx
VITE_ENABLE_ANALYTICS=true
```

#### Backend
```bash
GEMINI_API_KEY=your_gemini_api_key
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 📈 Monitoring & Analytics

### Error Tracking (Sentry)
- Real-time error reporting
- Performance monitoring
- Release tracking
- User feedback integration

### Performance (Web Vitals)
- Core Web Vitals tracking
- Custom performance metrics
- Automatic reporting to Sentry

### Logging
- Structured logging with log levels
- API request/response logging
- User action tracking
- Performance metrics

---

## 🧪 Code Quality

### ESLint Configuration
- TypeScript ESLint recommended rules
- React and React Hooks plugins
- Custom rules for code consistency
- No unused variables, explicit `any`, etc.

### TypeScript
- Strict mode enabled
- No implicit any
- Strict null checks
- Comprehensive type coverage

### Git Hooks
- **Pre-commit**: Lint, type check, and test related files
- **Pre-push**: Full test suite (optional)

---

## 🎨 Customization

### Styling
- Edit Tailwind classes in components
- Modify color scheme in component files
- Update theme in `vite.config.ts` PWA manifest

### Content
- Blog posts: `data/blogData.ts`
- Services: `components/Services.tsx`
- About section: `components/About.tsx`

### AI Behavior
- System instruction: `services/geminiService.production.ts`
- Model selection: Change `gemini-2.5-flash` to other models

---

## 🐛 Troubleshooting

### Common Issues

**"API key not configured"**
- Ensure `GEMINI_API_KEY` is set in backend `.env`
- Restart backend server after changing environment variables

**CORS errors**
- Add your frontend URL to `ALLOWED_ORIGINS` in backend `.env`
- Restart backend server

**Tests failing**
- Run `npm install` to ensure all dependencies are installed
- Check that `tests/setup.ts` is configured correctly

**Build errors**
- Run `npm run typecheck` to find type errors
- Ensure all environment variables are set

See **[DEPLOYMENT.md](DEPLOYMENT.md#troubleshooting)** for more solutions.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test && npm run test:e2e`)
5. Commit with conventional commits (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Commit Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test changes
- `refactor:` Code refactoring
- `chore:` Maintenance tasks

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Maha Salameh**
- Email: darkechology@gmail.com
- Website: [darkechology.com](https://darkechology.com)
- LinkedIn: [@darkechology](https://linkedin.com/in/darkechology)

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powering the chat functionality
- **React Team** for the amazing framework
- **Vite Team** for the blazing-fast build tool
- **Open Source Community** for all the incredible tools

---

## 📞 Support

- 📧 Email: darkechology@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/batwoman/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/batwoman/discussions)

---

<div align="center">

**Made with ❤️ by Maha Salameh**

Star ⭐ this repository if you find it helpful!

</div>
