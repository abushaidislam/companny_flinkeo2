import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ArrowLeft, Save, Eye, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';

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
    writer: '',
    writer_avatar: '',
    reading_time: 5,
    status: 'draft',
    published_at: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isReadingTimeAuto, setIsReadingTimeAuto] = useState(true);

  const loadBlog = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          headline: data.headline,
          slug: data.slug,
          excerpt: data.excerpt || '',
          content: data.content,
          cover_image: data.cover_image || '',
          tag: data.tag || '',
          writer: data.writer,
          writer_avatar: data.writer_avatar || '',
          reading_time: data.reading_time || 5,
          status: data.status,
          published_at: data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : '',
        });
        setIsReadingTimeAuto(false); // existing value is user-controlled for edits
      }
    } catch (error) {
      console.error('Error loading blog:', error);
      toast.error('Failed to load blog');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isEditMode) return;
    loadBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, id]);

  const normalizeSlug = (value: string) => {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
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

  const processedPreviewContent = useMemo(() => {
    if (!formData.content) return '';
    if (typeof window === 'undefined') return '';

    const sanitized = DOMPurify.sanitize(formData.content);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitized;

    const usedIds = new Set<string>();
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4');

    headings.forEach((heading) => {
      const text = heading.textContent || '';
      let id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);

      if (!id) id = 'section';
      let dedup = id;
      let i = 2;
      while (usedIds.has(dedup)) {
        dedup = `${id}-${i++}`;
      }
      id = dedup;
      usedIds.add(id);

      heading.id = id;

      const wrapper = document.createElement('span');
      wrapper.className = 'heading-anchor';

      while (heading.firstChild) {
        wrapper.appendChild(heading.firstChild);
      }

      const anchor = document.createElement('a');
      anchor.href = `#${id}`;
      anchor.className = 'anchor-icon';
      anchor.setAttribute('aria-label', `Link to ${text}`);
      anchor.innerHTML =
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;

      wrapper.appendChild(anchor);
      heading.appendChild(wrapper);
    });

    // Enhance UX: make sure inline links/images render nicely in the preview
    tempDiv.querySelectorAll('a').forEach((a) => {
      const href = (a as HTMLAnchorElement).getAttribute('href') || '';
      const isHttp = href.startsWith('http://') || href.startsWith('https://');
      if (isHttp) {
        (a as HTMLAnchorElement).setAttribute('target', '_blank');
        (a as HTMLAnchorElement).setAttribute('rel', 'noopener noreferrer');
      }
    });

    tempDiv.querySelectorAll('img').forEach((img) => {
      const el = img as HTMLImageElement;
      el.loading = 'lazy';
      el.decoding = 'async';
    });

    return tempDiv.innerHTML;
  }, [formData.content]);

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
      console.error('Error saving blog:', error);
      // Common case: slug already exists (unique constraint)
      toast.error(error instanceof Error && error.message.includes('unique') ? 'Slug already exists. Please choose another.' : 'Failed to save blog');
    } finally {
      setIsSaving(false);
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

          {/* Content Editor */}
          <div className="space-y-2">
            <Label>Content *</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
            />
          </div>

          {/* Live Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <Label>Live Preview</Label>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Rendered like the public blog view
              </div>
            </div>
            <div className="blog-content border rounded-lg bg-card p-5 max-h-[60vh] overflow-auto">
              {processedPreviewContent ? (
                <div dangerouslySetInnerHTML={{ __html: processedPreviewContent }} />
              ) : (
                <p className="text-sm text-muted-foreground">Start writing to see your blog preview here.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
