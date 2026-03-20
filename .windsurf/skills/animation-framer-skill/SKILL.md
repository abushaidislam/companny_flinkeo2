---
name: animation-framer-skill
description: Creating smooth animations and interactions with Framer Motion
---

## Use this skill for:
- Page transitions and entrance animations
- Scroll-triggered animations
- Interactive hover/tap effects
- Gesture-based interactions
- Layout animations
- Staggered children animations

## Guidelines:

### Entrance Animations
- Use consistent timing (0.3-0.5s typical)
- Prefer ease-out for entrances
- Include reduced motion support

```tsx
import { motion } from 'framer-motion';

// Fade up entrance
const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  }
};

function AnimatedCard() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUpVariants}
    >
      <Card>Content</Card>
    </motion.div>
  );
}
```

### Staggered Lists
- Stagger children for polished feel
- Keep delay small (0.05-0.1s between items)

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

function AnimatedList({ items }: { items: Item[] }) {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
    >
      {items.map((item) => (
        <motion.li key={item.id} variants={itemVariants}>
          {item.content}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### Hover & Tap Interactions
- Scale on hover (1.02-1.05 typical)
- Use spring physics for natural feel

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  whileFocus={{ scale: 1.02 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>
```

### Page Transitions
- Wrap routes with AnimatePresence
- Use unique keys for proper exit animations

```tsx
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, Routes, Route } from 'react-router-dom';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
```

### Scroll Progress Animations
- Use useScroll and useTransform hooks
- Map scroll position to animation values

```tsx
import { useScroll, useTransform, motion } from 'framer-motion';

function ParallaxHero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <motion.div style={{ y, opacity }}>
      <h1>Hero Content</h1>
    </motion.div>
  );
}
```

### Accessibility
- Respect prefers-reduced-motion
- Disable animations for users who prefer reduced motion

```tsx
function AnimatedComponent() {
  const prefersReducedMotion = 
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;

  return (
    <motion.div
      initial={prefersReducedMotion ? false : "hidden"}
      animate="visible"
      variants={fadeUpVariants}
    >
      Content
    </motion.div>
  );
}
```

### Layout Animations
- Use layout prop for automatic layout transitions
- Helpful for expanding cards, reordering lists

```tsx
<motion.div
  layout
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
  className="card"
>
  {isExpanded && <ExpandedContent />}
</motion.div>
```

### Performance
- Use will-change sparingly
- Prefer transform and opacity for animations
- Avoid animating layout properties (width, height)
- Use GPU-accelerated properties
