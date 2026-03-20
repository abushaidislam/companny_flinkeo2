---
description: Complete Tailwind CSS styling guide for consistent design
---

## Tailwind CSS Guidelines

### Color Palette

Use CSS variables for theming (already in `index.css`):

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --border: 240 5.9% 90%;
}
```

### Common Patterns

**Container:**
```tsx
<div className="container mx-auto px-4 md:px-6 lg:px-8">
```

**Section Spacing:**
```tsx
<section className="py-16 md:py-24">
```

**Typography:**
```tsx
<h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold">
<p className="text-base md:text-lg text-muted-foreground">
```

**Cards:**
```tsx
<div className="rounded-xl border bg-card p-6 shadow-sm">
```

**Buttons:**
```tsx
<Button className="w-full sm:w-auto">
```

**Responsive Grid:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
```

### Animation Classes

```tsx
// Fade in
<div className="animate-fade-in">

// Slide up
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

### Custom Utilities

Add to `tailwind.config.ts`:

```ts
extend: {
  fontFamily: {
    display: ['Plus Jakarta Sans', 'sans-serif'],
  },
  animation: {
    'fade-in': 'fadeIn 0.5s ease-out',
    'slide-up': 'slideUp 0.5s ease-out',
  },
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    slideUp: {
      '0%': { opacity: '0', transform: 'translateY(20px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' },
    },
  },
}
```

### Dark Mode

Use `dark:` prefix:

```tsx
<div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
```

### Spacing Scale

| Class | Size |
|-------|------|
| `p-1` | 0.25rem (4px) |
| `p-2` | 0.5rem (8px) |
| `p-4` | 1rem (16px) |
| `p-6` | 1.5rem (24px) |
| `p-8` | 2rem (32px) |
| `p-16` | 4rem (64px) |

### Best Practices

1. Use `rem` based spacing (default in Tailwind)
2. Prefer `max-w` over fixed widths
3. Use `aspect-ratio` for images
4. Leverage `gap` for spacing in flex/grid
5. Use `truncate` or `line-clamp` for text overflow
