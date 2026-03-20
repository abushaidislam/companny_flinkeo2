---
description: Step-by-step workflow for creating a new page with routing and navigation
---

## Creating a New Page

1. **Create Page Component**
   ```bash
   // Create file at src/pages/PageName.tsx
   ```

2. **Add Route in App.tsx**
   ```tsx
   import PageName from './pages/PageName';
   
   <Route path="/new-path" element={<PageName />} />
   ```

3. **Update Navigation (if needed)**
   - Add link in Navbar component
   - Update mobile menu if applicable

4. **Add SEO Meta Tags**
   ```tsx
   import { Helmet } from 'react-helmet-async';
   
   <Helmet>
     <title>Page Title | Flinke</title>
     <meta name="description" content="Page description" />
   </Helmet>
   ```

## Page Template

```tsx
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/landing/Navbar';
import { Footer } from '@/components/ui/footer-section';
import { motion } from 'framer-motion';

export default function PageName() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Page Title | Flinke</title>
        <meta name="description" content="Page description for SEO" />
      </Helmet>
      
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Page Title
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Page subtitle or description
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Page content */}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
```

## Adding Protected Routes

```tsx
// For admin pages
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/auth/login" replace />;
  
  return children;
}

// Usage in App.tsx
<Route 
  path="/admin/*" 
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

## Testing the Page

1. Verify route works: `npm run dev`
2. Check responsive design
3. Test navigation links
4. Validate SEO meta tags
