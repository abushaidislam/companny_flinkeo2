# Flinke - Digital Agency Website

A modern, premium digital agency website built with React, TypeScript, and Tailwind CSS. Features a complete blog system with admin panel, contact forms, portfolio showcase, and dynamic animations.

![Flinke Preview](public/favicon.svg)

## Features

### Landing Page Sections
- **Hero Section** - Animated hero with gradient background, statistics, and dashboard preview
- **Trust Badges** - Client logos and trust indicators
- **Portfolio** - Showcase of completed projects with filtering
- **Features** - Service offerings with icons and descriptions
- **How It Works** - Process timeline explanation
- **Testimonials** - Client reviews and ratings
- **Pricing** - Service packages and pricing tiers
- **FAQ** - Frequently asked questions with accordion
- **Blog** - Latest blog posts preview
- **Newsletter** - Email subscription form
- **Tech Stack** - Technologies and tools used
- **Cost Calculator** - Interactive pricing estimator
- **Contact Form** - Multi-step contact form

### Blog System
- Blog listing page with search and filtering
- Individual blog post pages with rich content
- Supabase backend for content management
- Admin panel for blog creation and editing
- Reading time estimation
- Writer profiles and avatars

### Admin Panel
- Secure login system
- Blog management dashboard
- Rich text editor with TipTap
- Cover image upload
- Draft and publish workflow

### Additional Pages
- **Team Page** - Team members showcase
- **Contact Page** - Contact form with validation
- **FAQ Page** - Detailed FAQ section

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui + Radix UI primitives
- **Animation**: Framer Motion
- **Backend**: Supabase
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Rich Text**: TipTap Editor
- **Icons**: Lucide React
- **Testing**: Vitest + Playwright

## Project Structure

```
src/
├── app/                    # App-specific components
├── assets/                 # Static assets (images, fonts)
├── components/
│   ├── admin/             # Admin panel components
│   ├── landing/           # Landing page sections
│   └── ui/                # Reusable UI components (shadcn)
├── contexts/              # React contexts
├── data/                  # Static data files
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions & configurations
│   ├── supabase.ts       # Supabase client setup
│   └── utils.ts          # Helper utilities
├── pages/                 # Route-level page components
│   ├── Index.tsx         # Landing page
│   ├── BlogList.tsx      # Blog listing
│   ├── BlogDetail.tsx    # Blog post detail
│   ├── Contact.tsx       # Contact page
│   ├── Team.tsx          # Team page
│   ├── AdminLogin.tsx    # Admin authentication
│   └── ...
├── App.tsx               # Main app with routing
└── main.tsx              # Entry point
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd companny_flinkeo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials
```

### Environment Variables

Create a `.env` file with the following:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### Build for Production

```bash
# Build the project
npm run build

# Preview production build locally
npm run preview
```

## Deployment

### Vercel (Recommended)

1. Push repository to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy

Build settings:
- **Install Command**: `npm install`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Other Platforms

The `dist` folder contains the static build output ready for deployment on any static hosting platform.

## Database Schema

The project uses Supabase with the following main tables:

### blogs
- `id` (uuid, primary key)
- `slug` (text, unique)
- `headline` (text)
- `excerpt` (text)
- `content` (jsonb)
- `cover_image` (text)
- `tag` (text)
- `reading_time` (integer)
- `writer` (text)
- `writer_avatar` (text)
- `status` (enum: draft, published)
- `published_at` (timestamp)
- `created_at` (timestamp)
- `updated_at` (timestamp)

See `supabase/schema.sql` for complete schema definition.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## Key Dependencies

- **@radix-ui/*** - Headless UI primitives
- **@supabase/supabase-js** - Supabase client
- **@tanstack/react-query** - Server state management
- **@tiptap/*** - Rich text editor
- **framer-motion** - Animation library
- **lucide-react** - Icon library
- **react-hook-form** - Form management
- **tailwindcss** - CSS framework
- **zod** - Schema validation

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is private and proprietary. All rights reserved.

---

Built with by the Flinke Team
