import { useMemo, useState } from 'react';
import { Edit2, Eye, EyeOff, Plus, Search, Tag, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { slugifyCategoryName } from '@/lib/blog-categories';
import type { BlogCategory } from '@/types/blog';

export interface CategoryEditorValues {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

interface CategoryManagementSectionProps {
  categories: BlogCategory[];
  searchQuery: string;
  isSaving: boolean;
  linkedBlogCountByCategory: Record<string, number>;
  onDeleteCategory: (category: BlogCategory) => Promise<void>;
  onSaveCategory: (categoryId: string | null, values: CategoryEditorValues) => Promise<void>;
  onSearchQueryChange: (value: string) => void;
  onToggleCategoryActive: (category: BlogCategory) => Promise<void>;
}

const emptyFormState: CategoryEditorValues = {
  name: '',
  slug: '',
  description: '',
  is_active: true,
};

export function CategoryManagementSection({
  categories,
  searchQuery,
  isSaving,
  linkedBlogCountByCategory,
  onDeleteCategory,
  onSaveCategory,
  onSearchQueryChange,
  onToggleCategoryActive,
}: CategoryManagementSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [formValues, setFormValues] = useState<CategoryEditorValues>(emptyFormState);
  const [hasCustomSlug, setHasCustomSlug] = useState(false);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter((category) =>
      [category.name, category.slug, category.description || '']
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [categories, searchQuery]);

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormValues(emptyFormState);
    setHasCustomSlug(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: BlogCategory) => {
    setEditingCategory(category);
    setFormValues({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      is_active: category.is_active,
    });
    setHasCustomSlug(true);
    setIsDialogOpen(true);
  };

  const handleNameChange = (value: string) => {
    setFormValues((current) => ({
      ...current,
      name: value,
      slug: hasCustomSlug ? current.slug : slugifyCategoryName(value),
    }));
  };

  const handleSave = async () => {
    await onSaveCategory(editingCategory?.id || null, formValues);
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormValues(emptyFormState);
    setHasCustomSlug(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-xl flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      {filteredCategories.length === 0 ? (
        <Card className="p-8 text-center">
          <Tag className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No categories found</p>
          {searchQuery ? (
            <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search</p>
          ) : (
            <Button variant="outline" className="mt-4" onClick={openCreateDialog}>
              Create your first category
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.map((category) => {
            const linkedCount = linkedBlogCountByCategory[category.id] || 0;

            return (
              <Card key={category.id} className="border-border/70">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <Badge variant={category.is_active ? 'default' : 'secondary'}>
                          {category.is_active ? 'Active' : 'Hidden'}
                        </Badge>
                      </div>
                      <CardDescription>/{category.slug}</CardDescription>
                    </div>
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/40 px-3 py-2 text-sm">
                    <span className="text-muted-foreground">Linked posts</span>
                    <span className="font-medium text-foreground">{linkedCount}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="min-h-12 text-sm leading-6 text-muted-foreground">
                    {category.description || 'No description added yet.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(category)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleCategoryActive(category)}
                    >
                      {category.is_active ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Show
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => onDeleteCategory(category)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit category' : 'Create category'}</DialogTitle>
            <DialogDescription>
              Categories power blog filtering, related content, and admin organization.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                value={formValues.name}
                onChange={(event) => handleNameChange(event.target.value)}
                placeholder="Design Systems"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-slug">Slug</Label>
              <Input
                id="category-slug"
                value={formValues.slug}
                onChange={(event) => {
                  setHasCustomSlug(true);
                  setFormValues((current) => ({
                    ...current,
                    slug: slugifyCategoryName(event.target.value),
                  }));
                }}
                placeholder="design-systems"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                value={formValues.description}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Short helper text for editors and future filtering."
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/70 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Visible on the public blog</p>
                <p className="text-sm text-muted-foreground">
                  Hidden categories stay available in admin but disappear from public filters.
                </p>
              </div>
              <Switch
                checked={formValues.is_active}
                onCheckedChange={(checked) =>
                  setFormValues((current) => ({ ...current, is_active: checked }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {editingCategory ? 'Save changes' : 'Create category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
