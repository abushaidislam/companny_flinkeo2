---
name: shadcn-ui-skill
description: Building consistent UI with shadcn/ui components, Radix primitives, and Tailwind styling
---

## Use this skill for:
- Creating and customizing shadcn components
- Building form interfaces with validation
- Implementing dialogs, dropdowns, and overlays
- Consistent theming and design tokens
- Accessibility compliance

## Guidelines:

### Component Installation
- Use CLI to add components: `npx shadcn add <component>`
- Customize in `components/ui/` directory
- Extend rather than override base components

### Form Patterns
- Combine shadcn form components with React Hook Form
- Use Zod for schema validation
- Show clear error messages

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" {...form.register('email')} />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Dialog Patterns
- Use controlled open state
- Handle async operations with loading states
- Trap focus and handle escape key

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function ConfirmDialog({ 
  open, 
  onOpenChange, 
  onConfirm,
  title,
  description 
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### Styling Consistency
- Use CSS variables for theming
- Follow design system tokens
- Maintain consistent spacing

```css
/* Consistent spacing scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
```

### Accessibility
- Always include aria-labels for icon buttons
- Use semantic HTML elements
- Ensure keyboard navigation works
- Test with screen readers

```tsx
// Good - accessible icon button
<Button 
  variant="ghost" 
  size="icon"
  aria-label="Delete item"
  onClick={handleDelete}
>
  <Trash2 className="h-4 w-4" />
</Button>
```

### Toast Notifications
- Use sonner for toast notifications
- Provide meaningful messages
- Handle different toast types

```tsx
import { toast } from 'sonner';

// Success
toast.success('Blog post published successfully');

// Error
toast.error('Failed to save changes', {
  description: 'Please try again later',
});

// Loading with promise
toast.promise(saveBlog(blogData), {
  loading: 'Saving...',
  success: 'Saved successfully',
  error: 'Failed to save',
});
```

### Component Variants
- Use cva (class-variance-authority) for variant management
- Document all variants
- Provide sensible defaults

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
```
