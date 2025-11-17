# Supabase Setup Guide (Optional)

## Do You Need Supabase?

**Current Project Status:** ✅ Your project is fully functional WITHOUT Supabase.

**You currently have:**
- ✅ Chat functionality (via Gemini API)
- ✅ Contact form (via EmailJS)
- ✅ Static blog posts (in `data/blogData.ts`)
- ✅ No user authentication required

**Consider adding Supabase if you want:**
- 🔐 User authentication (sign up, login, profiles)
- 💬 Save chat history per user
- 📝 Dynamic blog post management (CMS)
- 📊 Store form submissions
- 💾 File uploads (images, documents)
- 📧 Newsletter subscriber management
- 💬 User comments on blog posts

## Option 1: No Supabase (Current Setup)

If you don't need the features above, **skip this guide**. Your project is production-ready as-is.

## Option 2: Add Supabase (For Advanced Features)

### Step 1: Create Supabase Account

1. **Go to Supabase**
   - Visit: https://supabase.com/
   - Click "Start your project"
   - Sign up with GitHub (recommended)

2. **Create a New Project**
   - Click "New Project"
   - Organization: Select or create one
   - Project name: `dark-echology`
   - Database password: Generate strong password (save this!)
   - Region: Choose closest to your users (e.g., `us-east-1`)
   - Pricing plan: Free tier (500MB database, 1GB file storage)
   - Click "Create new project"
   - Wait 2-3 minutes for setup

3. **Get Your Project Credentials**

Go to: Settings → API

You'll need:
```bash
Project URL: https://your-project.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (keep secret!)
```

### Step 2: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Step 3: Configure Environment Variables

Add to `.env`:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Backend only (DO NOT expose in frontend)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 4: Create Supabase Client

Create `utils/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## Use Case Examples

### Use Case 1: User Authentication

**Setup:**

1. **Enable Email Authentication**
   - Supabase Dashboard → Authentication → Providers
   - Enable "Email" provider
   - Configure email templates (optional)

2. **Create Auth Components**

`components/Auth.tsx`:
```typescript
import { useState } from 'react';
import { supabase } from '../utils/supabase';

export function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for verification link!');
    }

    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          Sign In
        </button>
        <button type="button" onClick={handleSignUp} disabled={loading}>
          Sign Up
        </button>
      </form>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
```

### Use Case 2: Save Chat History

**Database Schema:**

1. **Create Table in Supabase**
   - Dashboard → Table Editor → New Table
   - Name: `chat_messages`
   - Columns:
     - `id` (uuid, primary key, default: uuid_generate_v4())
     - `created_at` (timestamp, default: now())
     - `user_id` (uuid, foreign key to auth.users)
     - `role` (text) - 'user' or 'model'
     - `message` (text)
     - `session_id` (uuid)

2. **Enable Row Level Security (RLS)**
```sql
-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can only see their own messages
CREATE POLICY "Users can view their own messages"
  ON chat_messages FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own messages
CREATE POLICY "Users can insert their own messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

3. **Save Messages in Chat Component**

```typescript
import { supabase } from '../utils/supabase';

// In your GeminiChat component
const saveMessage = async (role: 'user' | 'model', text: string) => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return; // Not logged in

  const { error } = await supabase
    .from('chat_messages')
    .insert({
      user_id: user.id,
      role,
      message: text,
      session_id: sessionId, // Generate session ID
    });

  if (error) {
    console.error('Error saving message:', error);
  }
};

// Load chat history
const loadChatHistory = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', user.id)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error loading history:', error);
    return [];
  }

  return data;
};
```

### Use Case 3: Dynamic Blog Posts (CMS)

**Database Schema:**

1. **Create Tables**

```sql
-- Blog posts table
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  cover_image text,
  author_id uuid REFERENCES auth.users(id),
  category text,
  tags text[],
  published boolean DEFAULT false,
  published_at timestamp
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts
CREATE POLICY "Anyone can view published posts"
  ON blog_posts FOR SELECT
  USING (published = true);

-- Only authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

2. **Fetch Blog Posts**

```typescript
// In your Blog component
const fetchBlogPosts = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data;
};
```

### Use Case 4: Store Contact Form Submissions

**Database Schema:**

```sql
CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamp DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'unread'
);

-- Only admins can view submissions
CREATE POLICY "Only admins can view submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'admin@darkechology.com'
    )
  );

-- Anyone can insert submissions
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  TO anon
  WITH CHECK (true);
```

**Save Submission:**

```typescript
// In Contact component
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  // Save to Supabase
  const { error } = await supabase
    .from('contact_submissions')
    .insert({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    });

  if (error) {
    console.error('Error saving submission:', error);
    setIsSubmitting(false);
    return;
  }

  // Still send email via EmailJS
  await emailjs.send(...);

  setIsSubmitting(false);
};
```

## Deployment Configuration

### Add to Netlify Environment Variables

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Update `.env.example`

```bash
# Supabase (Optional)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key
```

## Security Best Practices

### ✅ DO:
- Always use Row Level Security (RLS) on all tables
- Use `anon` key in frontend, `service_role` key only in backend
- Validate data before inserting into database
- Use TypeScript types for database schemas
- Enable email confirmation for new users
- Set up database backups (automatic in Supabase)

### ❌ DON'T:
- Never expose `service_role` key in frontend
- Never disable RLS unless you know what you're doing
- Never trust client-side data validation alone
- Never store sensitive data without encryption

## Supabase Features Overview

| Feature | Free Tier | Useful For |
|---------|-----------|------------|
| **Database** | 500MB | User data, chat history, blog posts |
| **Authentication** | Unlimited users | Sign up, login, profiles |
| **Storage** | 1GB | Images, PDFs, user uploads |
| **Edge Functions** | 500K invocations/month | Serverless functions |
| **Realtime** | 200 concurrent connections | Live chat, notifications |

## Pricing

- **Free Tier**: $0/month
  - 500MB database
  - 1GB file storage
  - 50K monthly active users
  - 2GB bandwidth

- **Pro Tier**: $25/month
  - 8GB database
  - 100GB file storage
  - 100K monthly active users
  - 250GB bandwidth

## Alternatives to Supabase

If Supabase doesn't fit your needs:

1. **Firebase** (Google) - Similar features, larger free tier
2. **PlanetScale** - MySQL database, generous free tier
3. **Neon** - Serverless Postgres, pay-as-you-go
4. **MongoDB Atlas** - NoSQL database, 512MB free
5. **Appwrite** - Self-hosted alternative to Supabase

## Resources

- **Supabase Docs**: https://supabase.com/docs
- **Dashboard**: https://app.supabase.com/
- **Pricing**: https://supabase.com/pricing
- **Auth Guide**: https://supabase.com/docs/guides/auth
- **Database Guide**: https://supabase.com/docs/guides/database
- **Storage Guide**: https://supabase.com/docs/guides/storage

---

## Recommendation

For your Dark Echology project:

**✅ Start WITHOUT Supabase** - Your current setup is sufficient

**Consider adding Supabase when:**
1. You want user accounts (save chat history, preferences)
2. You want to manage blog posts dynamically (CMS)
3. You need to store form submissions
4. You want to add user comments
5. You plan to add a newsletter feature

**Priority order (if adding features):**
1. **User Authentication** - Allow users to save chat history
2. **Chat History** - Save conversations per user
3. **Contact Form Storage** - Keep submissions in database
4. **Blog CMS** - Dynamic blog post management
5. **File Storage** - User-uploaded images/documents

Need help implementing any of these? Let me know which feature you want to add first!
