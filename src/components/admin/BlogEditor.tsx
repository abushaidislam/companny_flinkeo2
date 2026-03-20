import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ArrowLeft, Save, Eye, X } from 'lucide-react';
import { toast } from 'sonner';

function TagInput({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <Label>Tags</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 hover:text-destructive transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add tag..."
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
        />
        <Button onClick={addTag} type="button" variant="outline">
          Add
        </Button>
      </div>
    </div>
  );
}

export function AdminBlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    headline: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    tag: '',
    tags: [] as string[],
    writer: '',
    writer_avatar: '',
    reading_time: 5,
    status: 'draft',
    published_at: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isReadingTimeAuto, setIsReadingTimeAuto] = useState(true);

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadBlog = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data && isMountedRef.current) {
        setFormData({
          headline: data.headline,
          slug: data.slug,
          excerpt: data.excerpt || '',
          content: data.content,
          cover_image: data.cover_image || '',
          tag: data.tag || '',
          tags: data.tags || [],
          writer: data.writer,
          writer_avatar: data.writer_avatar || '',
          reading_time: data.reading_time || 5,
          status: data.status,
          published_at: data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : '',
        });
        setIsReadingTimeAuto(false); // existing value is user-controlled for edits
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error('Error loading blog:', error);
        toast.error('Failed to load blog');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!isEditMode) return;
    loadBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, id]);

  const normalizeSlug = (value: string) => {
    const normalized = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    // Prevent empty slug from special characters-only input
    return normalized || 'post';
  };

  const estimateReadingTimeMinutes = (html: string) => {
    if (!html) return 1;
    // Strip tags roughly (we just need a good estimate for UX)
    const text = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const words = text ? text.split(' ').filter(Boolean).length : 0;
    const wpm = 200; // common heuristic
    return Math.max(1, Math.ceil(words / wpm));
  };

  const countWordsFromHtml = (html: string) => {
    if (!html) return 0;
    const text = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return text ? text.split(' ').filter(Boolean).length : 0;
  };

  useEffect(() => {
    if (!isReadingTimeAuto) return;
    const wordCount = countWordsFromHtml(formData.content);
    if (wordCount === 0) return;
    const minutes = estimateReadingTimeMinutes(formData.content);
    setFormData(prev => ({ ...prev, reading_time: minutes }));
  }, [formData.content, isReadingTimeAuto]);

  const generateSlug = (headline: string) => {
    return headline
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleHeadlineChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      headline: value,
      slug: prev.slug || generateSlug(value),
    }));
  };

  const handleSave = async (publish = false) => {
    const headline = formData.headline.trim();
    const slug = normalizeSlug(formData.slug);
    const writer = formData.writer.trim();
    const wordCount = countWordsFromHtml(formData.content);

    if (!headline) return toast.error('Headline is required');
    if (!slug) return toast.error('Slug is required');
    if (!writer) return toast.error('Writer is required');
    if (!formData.content || wordCount < 20) return toast.error('Content is required (minimum ~20 words)');

    setIsSaving(true);
    try {
      const saveData = {
        ...formData,
        headline,
        slug,
        status: publish ? 'published' : 'draft',
        published_at: publish ? new Date().toISOString() : null,
      };

      if (isEditMode) {
        const { error } = await supabase
          .from('blogs')
          .update(saveData)
          .eq('id', id);
        if (error) throw error;
        toast.success(publish ? 'Blog published!' : 'Blog updated!');
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([saveData]);
        if (error) throw error;
        toast.success(publish ? 'Blog published!' : 'Blog saved as draft!');
      }

      navigate('/admin');
    } catch (error) {
      if (isMountedRef.current) {
        console.error('Error saving blog:', error);
        // Common case: slug already exists (unique constraint)
        toast.error(error instanceof Error && error.message.includes('unique') ? 'Slug already exists. Please choose another.' : 'Failed to save blog');
      }
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold">
                {isEditMode ? 'Edit Blog' : 'New Blog'}
              </h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSave(false)}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSave(true)}
                disabled={isSaving}
              >
                <Eye className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="headline">Headline *</Label>
              <Input
                id="headline"
                value={formData.headline}
                onChange={(e) => handleHeadlineChange(e.target.value)}
                placeholder="Enter blog headline"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="blog-post-url-slug"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief summary of the blog post..."
              rows={3}
            />
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tag">Tag</Label>
              <Input
                id="tag"
                value={formData.tag}
                onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                placeholder="e.g., Technology"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="writer">Writer *</Label>
              <Input
                id="writer"
                value={formData.writer}
                onChange={(e) => setFormData(prev => ({ ...prev, writer: e.target.value }))}
                placeholder="Author name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reading_time">Reading Time (minutes)</Label>
              <Input
                id="reading_time"
                type="number"
                value={formData.reading_time}
                onChange={(e) => setFormData(prev => ({ ...prev, reading_time: parseInt(e.target.value) || 5 }))}
              />
            </div>
          </div>

          {/* Tags Input */}
          <TagInput
            tags={formData.tags}
            onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
          />

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cover_image">Cover Image URL</Label>
              <Input
                id="cover_image"
                value={formData.cover_image}
                onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="writer_avatar">Writer Avatar URL</Label>
              <Input
                id="writer_avatar"
                value={formData.writer_avatar}
                onChange={(e) => setFormData(prev => ({ ...prev, writer_avatar: e.target.value }))}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          {/* Content Editor with Integrated Preview */}
          <div className="space-y-2">
            <Label>Content *</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              headline={formData.headline}
              coverImage={formData.cover_image}
              writer={formData.writer}
              tag={formData.tag}
              readingTime={formData.reading_time}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
