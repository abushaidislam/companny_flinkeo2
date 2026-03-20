---
description: Complete deployment workflow for Vercel with environment setup
---

## Deploy to Vercel

### 1. Prepare for Deployment

```bash
// turbo
# Run build locally to verify
npm run build

# Preview production build
npm run preview
```

### 2. Environment Variables

Set these in Vercel Dashboard:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Build Settings

In Vercel Project Settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Deploy

```bash
// turbo
# Using Vercel CLI
vercel --prod
```

Or push to GitHub and Vercel will auto-deploy.

### 5. Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] All pages accessible
- [ ] Blog posts display correctly
- [ ] Admin login works
- [ ] Forms submit successfully
- [ ] Images load properly
- [ ] Responsive on mobile
- [ ] Check console for errors

### 6. Custom Domain (Optional)

1. Go to Vercel Dashboard → Domains
2. Add your custom domain
3. Update DNS records as instructed

### 7. Enable Analytics (Optional)

```bash
// turbo
vercel analytics enable
```

### Troubleshooting

**Build Fails:**
- Check for TypeScript errors: `npm run lint`
- Verify all imports resolve
- Check for missing environment variables

**Runtime Errors:**
- Check browser console
- Verify Supabase connection
- Confirm RLS policies allow public access where needed

**404 Errors:**
- Add `vercel.json` for SPA routing:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
