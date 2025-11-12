<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Dark Echology - Professional Chiropterology Portfolio

A modern, production-ready web application showcasing bat ecology research, conservation services, and educational content. Built with React, TypeScript, Vite, and powered by Google's Gemini AI for interactive chat functionality.

View your app in AI Studio: https://ai.studio/apps/drive/1sVj6x48mGWaJclFrruU7OEBecpC09SPc

## Features

- 🦇 **Interactive AI Chat** - Ask questions about bat ecology powered by Google Gemini AI
- 📝 **Blog System** - Educational articles with search functionality and individual post pages
- 🎨 **Modern UI** - Responsive design with Tailwind CSS and smooth animations
- 🔍 **SEO Optimized** - Rich metadata and Schema.org structured data
- ⚡ **Fast Performance** - Built with Vite, optimized bundles, and code splitting
- 🔒 **Type Safe** - Full TypeScript with strict mode enabled
- ✨ **Code Quality** - ESLint configured with React and TypeScript best practices

## Tech Stack

- **Frontend Framework:** React 19.1.1
- **Language:** TypeScript 5.8.2
- **Build Tool:** Vite 6.2.0
- **Styling:** Tailwind CSS (via CDN)
- **AI Integration:** Google Gemini AI (@google/genai)
- **Markdown:** react-markdown with GitHub-flavored markdown support
- **Code Quality:** ESLint with TypeScript and React plugins

## Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Gemini API Key** from [Google AI Studio](https://ai.google.dev/)

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory (use `.env.example` as a template):

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Get your API key:** Visit [Google AI Studio](https://ai.google.dev/) to obtain a free API key.

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

The production build will be created in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Auto-fix linting issues |

## Production Deployment

### Deployment Platforms

This app can be deployed to any static hosting platform:

#### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Add `GEMINI_API_KEY` to Environment Variables in Vercel dashboard
4. Deploy: `vercel --prod`

#### Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify init`
3. Add `GEMINI_API_KEY` to Environment Variables in Netlify dashboard
4. Deploy: `netlify deploy --prod`

#### GitHub Pages

1. Update `base` in `vite.config.ts` to your repo name
2. Run: `npm run build`
3. Deploy `dist/` folder to `gh-pages` branch

### Environment Variables for Production

Make sure to set the following environment variable in your hosting platform:

- `GEMINI_API_KEY` - Your Google Gemini API key

## Security Considerations

⚠️ **IMPORTANT: API Key Security**

The current implementation embeds the Gemini API key in the client-side JavaScript bundle. This is suitable for:
- Personal portfolios with low traffic
- Development and testing
- Demos and prototypes

**For production with higher traffic, consider:**

1. **Backend Proxy (Recommended)**
   - Create a backend API endpoint that handles Gemini requests
   - Keep the API key on the server side
   - Implement rate limiting and authentication

2. **API Key Restrictions**
   - Restrict your API key by domain in Google Cloud Console
   - Set usage quotas to prevent abuse
   - Monitor API usage regularly

3. **Contact Form**
   - The contact form currently displays a local alert
   - For production, integrate with:
     - [EmailJS](https://www.emailjs.com/)
     - [Formspree](https://formspree.io/)
     - [SendGrid](https://sendgrid.com/)
     - Custom backend endpoint

## Project Structure

```
batwoman/
├── components/          # React components
│   ├── About.tsx       # Professional bio section
│   ├── Blog.tsx        # Blog listing with search
│   ├── BlogPostPage.tsx # Individual blog post view
│   ├── Contact.tsx     # Contact form
│   ├── Footer.tsx      # Site footer
│   ├── GeminiChat.tsx  # AI chat interface
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Landing section
│   ├── Services.tsx    # Services showcase
│   └── icons/          # SVG icon components
├── data/
│   └── blogData.ts     # Blog post content
├── hooks/
│   └── useOnScreen.ts  # Intersection Observer hook
├── services/
│   └── geminiService.ts # Gemini API integration
├── App.tsx             # Main app component
├── index.tsx           # React entry point
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── eslint.config.js    # ESLint configuration
└── package.json        # Dependencies and scripts
```

## Code Quality

This project includes:

- **TypeScript Strict Mode** - Full type safety with strict compiler options
- **ESLint** - Configured for React, TypeScript, and React Hooks best practices
- **Code Splitting** - Automatic chunk splitting for optimal loading
- **Tree Shaking** - Unused code elimination in production builds
- **Minification** - Terser minification for smaller bundle sizes

## Browser Support

- Modern browsers with ES2022 support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This is a personal portfolio project. For bug reports or suggestions, please create an issue.

## License

All rights reserved. This is a private portfolio project.

## Author

**Maha Salameh** - Chiropterologist
Website: [darkechology.com](https://darkechology.com)
Email: darkechology@gmail.com

## Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Google Gemini AI](https://ai.google.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Built with [Vite](https://vitejs.dev/)
