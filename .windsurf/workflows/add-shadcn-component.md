---
description: Complete guide for adding new shadcn/ui components with proper setup and customization
---

## Adding a New shadcn Component

1. **Install the Component**
   ```bash
   // turbo
   npx shadcn add <component-name>
   ```
   
2. **Review the Component Files**
   - Check `src/components/ui/<component>.tsx`
   - Review exported props and variants
   - Note any required dependencies

3. **Customize if Needed**
   - Edit styling in the component file
   - Add project-specific variants using cva
   - Update default props

4. **Export from Index (Optional)**
   - Add to `src/components/ui/index.ts` if exists

## Example: Adding a Dialog

```bash
// turbo
npx shadcn add dialog
```

Usage:
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function MyDialog() {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
```

## Available Components

Run `npx shadcn add --help` to see all available components or visit:
https://ui.shadcn.com/docs/components

## Customization Tips

- Use `class-variance-authority` for variant management
- Follow existing component patterns in the project
- Maintain accessibility standards
- Test with keyboard navigation
