# AI Rules for Dark Echology

## Tech Stack Overview

- **React 19.1.1 + TypeScript 5.8.2** - Core frontend framework with strict type safety
- **Vite 6.2.0** - Build tool and development server with hot reload
- **Tailwind CSS** - Utility-first CSS framework for styling (via CDN)
- **Google Gemini AI** - AI chat functionality through secure backend proxy
- **Express.js** - Backend API server for secure API key handling
- **Netlify Functions** - Serverless functions for production deployment
- **Sentry** - Error tracking and performance monitoring
- **EmailJS** - Contact form handling without backend
- **Vitest + Playwright** - Testing framework (unit + E2E)
- **React Markdown** - Markdown rendering for blog content

## Library Usage Rules

### ✅ MUST USE These Libraries For:

**UI Components & Styling:**
- **Tailwind CSS** for all styling and responsive design
- **shadcn/ui components** for pre-built, accessible UI components
- **Lucide React** for icons (already installed)

**State Management:**
- **React useState/useEffect** for local component state
- **React Context** for global app state when needed
- **NO Redux/Zustand** - Keep it simple with built-in React patterns

**API & Data Fetching:**
- **Axios** for HTTP requests (already configured with retry logic)
- **Custom API Client** (`utils/apiClient.ts`) for all external requests
- **Backend Express Server** (`api/server.ts`) for Gemini API calls

**Forms & Validation:**
- **EmailJS** for contact form submissions
- **Zod** for runtime validation (already installed)
- **React controlled components** for form state

**Error Handling:**
- **Sentry** for production error tracking
- **Custom ErrorBoundary** for React error catching
- **Structured Logger** (`utils/logger.ts`) for all logging

### 🚫 DO NOT USE These Libraries:

**State Management:**
- ❌ Redux, Zustand, MobX - Overkill for this app
- ❌ React Query/TanStack Query - Not needed for current data requirements

**UI Frameworks:**
- ❌ Material-UI, Ant Design, Chakra UI - Use shadcn/ui instead
- ❌ Bootstrap, Foundation - Use Tailwind CSS exclusively

**Styling:**
- ❌ Styled Components, Emotion - Use Tailwind CSS classes
- ❌ SASS/LESS - Use Tailwind's utility classes
- ❌ CSS Modules - Not needed with Tailwind

**Build & Tooling:**
- ❌ Webpack - Use Vite configuration only
- ❌ Create React App - Already using Vite
- ❌ Babel - Use TypeScript compiler directly

### 🔄 Development Patterns:

**Component Structure:**
- Use functional components with TypeScript interfaces
- Keep components small and focused (Single Responsibility)
- Use custom hooks for reusable logic
- Follow the existing file structure pattern

**File Organization:**
- `components/` - Reusable UI components
- `pages/` - Page-level components (mapped to routes)
- `services/` - Business logic and API calls
- `utils/` - Utility functions and helpers
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions

**Code Quality:**
- Always use TypeScript with strict mode
- Follow ESLint rules (already configured)
- Write tests for new features
- Use the existing logger for all console output

### 🎯 Specific Implementation Rules:

**AI Chat:**
- Use `services/geminiService.production.ts` for production
- Stream responses using Server-Sent Events (SSE)
- Never expose API keys in client-side code

**Styling:**
- Use Tailwind classes exclusively
- Follow the existing color scheme (`#111121`, `#1a1a2e`, indigo accents)
- Maintain dark theme consistency

**Deployment:**
- Use Netlify for frontend + functions
- Environment variables must be set in Netlify dashboard
- Follow the deployment checklist in `DEPLOYMENT.md`

**Testing:**
- Write unit tests with Vitest for utilities
- Write component tests with Testing Library
- Write E2E tests with Playwright for critical user flows

### 📦 Package Management:

**Adding New Dependencies:**
1. Check if functionality exists in current stack
2. Prefer smaller, focused libraries
3. Ensure TypeScript support
4. Update documentation if adding major functionality
5. Consider bundle size impact

**Security:**
- Never commit API keys or secrets
- Use environment variables for configuration
- Validate all user input with Zod
- Follow rate limiting patterns in backend

This ruleset ensures consistency, maintainability, and optimal performance while leveraging the existing investment in the current tech stack.