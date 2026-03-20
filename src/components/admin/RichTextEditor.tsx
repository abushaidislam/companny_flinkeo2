import { useState, useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import CharacterCount from '@tiptap/extension-character-count';
import { Mermaid } from '@syfxlin/tiptap-starter-kit';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Minus,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Maximize2,
  Minimize2,
  FileImage,
  Eye,
  Edit3,
  Columns,
  Monitor,
  Tablet,
  Smartphone,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Workflow
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';
import { HybridContent } from '@/components/HybridContent';
import { supabase } from '@/lib/supabase';
import { detectContentType } from '@/lib/content-utils';
import mermaid from 'mermaid';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  headline?: string;
  coverImage?: string;
  writer?: string;
  tag?: string;
  readingTime?: number;
}

type ViewMode = 'edit' | 'split' | 'preview';
type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const colors = [
  '#000000', '#1a1a1a', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#7c2d12', '#9a3412', '#7c3aed'
];

const highlightColors = [
  '#fef3c7', '#fde68a', '#fca5a5', '#fecaca', '#bbf7d0', '#86efac',
  '#bfdbfe', '#93c5fd', '#ddd6fe', '#c4b5fd', '#fbcfe8', '#f9a8d4',
  '#e5e7eb', '#d1d5db', '#9ca3af'
];

function ToolbarButton({ 
  onClick, 
  isActive, 
  icon: Icon, 
  tooltip,
  disabled = false 
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  icon: React.ElementType;
  tooltip: string;
  disabled?: boolean;
}) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClick}
          disabled={disabled}
          className={`h-8 w-8 p-0 ${isActive ? 'bg-accent text-accent-foreground' : ''}`}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = 'Write your blog content here...',
  headline = '',
  coverImage = '',
  writer = '',
  tag = '',
  readingTime = 5
}: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [splitPaneWidth, setSplitPaneWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  type CodeMode = 'visual' | 'html' | 'mdx';
  const [codeMode, setCodeMode] = useState<CodeMode>(() => {
    return detectContentType(content) === 'markdown' ? 'mdx' : 'visual';
  });
  const codeModeRef = useRef<CodeMode>(codeMode);
  const [selection, setSelection] = useState<{ text: string; rect: DOMRect | null }>({ text: '', rect: null });
  const editorRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const codeViewRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    codeModeRef.current = codeMode;
  }, [codeMode]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        horizontalRule: false,
      }),
      Image.configure({
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Underline,
      Strike,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      HorizontalRule,
      Subscript,
      Superscript,
      CharacterCount.configure({
        mode: 'textSize',
      }),
      Mermaid,
    ],
    content,
    onUpdate: ({ editor }) => {
      // In MDX mode we edit via textarea (no TipTap sync).
      // Guard against overwriting `content` when TipTap updates internally.
      if (codeModeRef.current === 'mdx') return;

      onChange(editor.getHTML());
      setCharCount(editor.storage.characterCount.characters());
      setWordCount(editor.storage.characterCount.words());
    },
  });

  useEffect(() => {
    if (editor) {
      setCharCount(editor.storage.characterCount.characters());
      setWordCount(editor.storage.characterCount.words());
    }
  }, [editor]);

  // Keep counters in sync for MDX mode where we bypass TipTap.
  useEffect(() => {
    if (codeMode !== 'mdx') return;
    const text = (content || '').trim();
    setCharCount(text.length);
    setWordCount(text ? text.split(/\s+/).filter(Boolean).length : 0);
  }, [content, codeMode]);

  // Render Mermaid diagrams in preview
  useEffect(() => {
    if (!previewRef.current) return;
    if (viewMode !== 'preview' && viewMode !== 'split') return;
    if (codeModeRef.current === 'mdx') return;
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!previewRef.current) return;
      if (codeModeRef.current === 'mdx') return;
      
      // Initialize mermaid
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
      });
      
      // Run mermaid on all elements with .mermaid class
      mermaid.run({
        querySelector: '.mermaid',
        nodes: previewRef.current.querySelectorAll('.mermaid'),
      }).catch((error) => {
        console.error('Mermaid rendering error:', error);
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [content, viewMode]);

  // Bidirectional sync scrolling between editor and preview
  const syncScroll = useCallback((source: 'editor' | 'preview') => {
    if (viewMode !== 'split') return;
    
    const editorEl = editorRef.current?.querySelector('.ProseMirror');
    const previewEl = previewRef.current;
    
    if (!editorEl || !previewEl) return;

    const editorScrollable = editorEl as HTMLElement;
    const previewScrollable = previewEl as HTMLElement;
    
    if (source === 'editor') {
      const scrollRatio = editorScrollable.scrollTop / (editorScrollable.scrollHeight - editorScrollable.clientHeight);
      previewScrollable.scrollTop = scrollRatio * (previewScrollable.scrollHeight - previewScrollable.clientHeight);
    } else {
      const scrollRatio = previewScrollable.scrollTop / (previewScrollable.scrollHeight - previewScrollable.clientHeight);
      editorScrollable.scrollTop = scrollRatio * (editorScrollable.scrollHeight - editorScrollable.clientHeight);
    }
  }, [viewMode]);

  const handleEditorScroll = useCallback(() => syncScroll('editor'), [syncScroll]);
  const handlePreviewScroll = useCallback(() => syncScroll('preview'), [syncScroll]);

  // Text selection handler for preview
  const handlePreviewMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      setSelection({ text: '', rect: null });
      return;
    }
    
    const text = sel.toString().trim();
    if (!text) {
      setSelection({ text: '', rect: null });
      return;
    }
    
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setSelection({ text, rect });
  }, []);

  // Apply style to selected text in preview (updates editor content)
  const applyStyleToSelection = useCallback((style: 'bold' | 'italic' | 'underline') => {
    if (!editor || !selection.text) return;
    if (codeModeRef.current === 'mdx') return;
    
    const html = editor.getHTML();
    const selectedText = selection.text;
    
    // Find and wrap the selected text with appropriate tag
    let styledHtml = html;
    const tagMap = { bold: 'strong', italic: 'em', underline: 'u' };
    const tag = tagMap[style];
    
    // Simple replacement (this is a basic implementation)
    const regex = new RegExp(`(${selectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g');
    styledHtml = html.replace(regex, `<${tag}>$1</${tag}>`);
    
    editor.commands.setContent(styledHtml);
    onChange(styledHtml);
    setSelection({ text: '', rect: null });
    window.getSelection()?.removeAllRanges();
  }, [editor, selection.text, onChange]);

  // Handle code view changes
  const handleCodeChange = useCallback((newCode: string) => {
    onChange(newCode);
    if (editor && codeModeRef.current === 'html') {
      editor.commands.setContent(newCode);
    }
  }, [onChange, editor]);

  // Resize handlers for split pane
  const handleResizeStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    // Constrain between 20% and 80%
    setSplitPaneWidth(Math.max(20, Math.min(80, percentage)));
  }, [isDragging]);

  const handleResizeEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleResizeMove, handleResizeEnd]);

  const processedPreviewContent = useCallback(() => {
    if (!content) return '';
    if (typeof window === 'undefined') return '';

    const sanitized = DOMPurify.sanitize(content);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitized;

    // Add IDs to headings for anchor links
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

      // Add anchor wrapper
      const wrapper = document.createElement('span');
      wrapper.className = 'heading-anchor';

      while (heading.firstChild) {
        wrapper.appendChild(heading.firstChild);
      }
      heading.appendChild(wrapper);
    });

    // Convert mermaid code blocks to mermaid containers
    // The HTML from TipTap may have code blocks as: <p>```</p><p>flowchart...</p><p>```</p>
    let htmlContent = tempDiv.innerHTML;
    
    // Pattern 1: Handle paragraph-based code blocks (from markdown paste)
    // Look for: <p>```</p> followed by content followed by <p>```</p>
    const paragraphCodePattern = /<p>```<\/p>([\s\S]*?)<p>```<\/p>/gi;
    htmlContent = htmlContent.replace(paragraphCodePattern, (match, content) => {
      // Extract text content from between paragraph tags
      const code = content
        .replace(/<p>/gi, '')
        .replace(/<\/p>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .trim();
      
      const isMermaid = 
        code.startsWith('flowchart') ||
        code.startsWith('graph ') ||
        code.startsWith('sequenceDiagram') ||
        code.startsWith('xychart') ||
        code.startsWith('pie') ||
        code.startsWith('gantt') ||
        code.startsWith('classDiagram') ||
        code.startsWith('erDiagram') ||
        code.startsWith('journey') ||
        code.startsWith('gitGraph') ||
        code.startsWith('mindmap') ||
        code.startsWith('timeline') ||
        code.startsWith('quadrantChart');
      
      if (isMermaid) {
        return `<div class="mermaid">${code}</div>`;
      }
      return `<pre><code>${code}</code></pre>`;
    });
    
    tempDiv.innerHTML = htmlContent;

    // External links open in new tab
    tempDiv.querySelectorAll('a').forEach((a) => {
      const href = (a as HTMLAnchorElement).getAttribute('href') || '';
      const isHttp = href.startsWith('http://') || href.startsWith('https://');
      if (isHttp) {
        (a as HTMLAnchorElement).setAttribute('target', '_blank');
        (a as HTMLAnchorElement).setAttribute('rel', 'noopener noreferrer');
      }
    });

    // Lazy load images
    tempDiv.querySelectorAll('img').forEach((img) => {
      const el = img as HTMLImageElement;
      el.loading = 'lazy';
      el.decoding = 'async';
    });

    return tempDiv.innerHTML;
  }, [content]);

  const addImage = useCallback(async () => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  // Handle image upload to Supabase storage
  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const loadingToast = toast.loading('Uploading image...');

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      // Insert image into editor
      editor.chain().focus().setImage({ src: publicUrl }).run();
      toast.success('Image uploaded successfully', { id: loadingToast });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Using base64 fallback...', { id: loadingToast });
      
      // Fallback to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        editor.chain().focus().setImage({ src: base64 }).run();
      };
      reader.readAsDataURL(file);
    }
  }, [editor]);

  const uploadImage = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && editor) {
        await handleImageUpload(file);
      }
    };
    input.click();
  }, [editor, handleImageUpload]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile && editor) {
      await handleImageUpload(imageFile);
    }
  }, [editor, handleImageUpload]);

  // Handle paste - detect markdown and images
  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find(item => item.type.startsWith('image/'));
    const textData = e.clipboardData.getData('text/plain');

    // Check for markdown patterns in pasted text
    const markdownPattern = /^#{1,6}\s|^\s*[-*+]\s|^\s*\d+\.\s|^\[.*?\]\(.*?\)|\*\*.*?\*|__.*?__|`[^`]+`|```/m;
    const isMarkdown = markdownPattern.test(textData);

    // If markdown is detected and no image, let TipTap handle it (it has markdown support)
    if (imageItem && editor) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) {
        await handleImageUpload(file);
      }
    }
    // If it's markdown, let the editor handle it - TipTap will convert markdown automatically
    // No need to prevent default for markdown text
  }, [editor, handleImageUpload]);

  const setLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);
    
    if (url === null) return;
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const setColor = useCallback((color: string) => {
    if (!editor) return;
    editor.chain().focus().setColor(color).run();
  }, [editor]);

  const setHighlight = useCallback((color: string) => {
    if (!editor) return;
    editor.chain().focus().toggleHighlight({ color }).run();
  }, [editor]);

  const insertMermaid = useCallback(() => {
    if (!editor) return;
    const mermaidCode = `flowchart TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    B -->|No| D[End]`;
    editor.chain().focus().insertContent(`\n\n\`\`\`mermaid\n${mermaidCode}\n\`\`\`\n\n`).run();
    toast.success('Mermaid diagram inserted!');
  }, [editor]);

  if (!editor) {
    return null;
  }

  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 bg-background'
    : 'border rounded-lg overflow-hidden bg-background';

  const showEditor = viewMode === 'edit' || viewMode === 'split';
  const showPreview = viewMode === 'preview' || viewMode === 'split';

  const deviceWidthClass = {
    desktop: 'w-full',
    tablet: 'max-w-[768px] mx-auto',
    mobile: 'max-w-[375px] mx-auto'
  }[deviceMode];

  return (
    <div className={containerClasses}>
      <TooltipProvider>
        {/* Main Toolbar */}
        <div className="border-b p-2 flex flex-wrap gap-1 bg-muted/50 items-center">
          {/* View Mode Toggle */}
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(v) => v && setViewMode(v as ViewMode)}
            className="bg-background border rounded-md p-0.5"
          >
            <ToggleGroupItem value="edit" aria-label="Edit only" className="h-7 px-2 text-xs">
              <Edit3 className="h-3.5 w-3.5 mr-1" />
              Edit
            </ToggleGroupItem>
            <ToggleGroupItem value="split" aria-label="Split view" className="h-7 px-2 text-xs">
              <Columns className="h-3.5 w-3.5 mr-1" />
              Split
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Content Format Toggle (only in edit mode) */}
          {viewMode === 'edit' && (
            <>
              <Separator orientation="vertical" className="h-6 mx-2" />
              <ToggleGroup 
                type="single" 
                value={codeMode}
                onValueChange={(v) => v && setCodeMode(v as CodeMode)}
                className="bg-background border rounded-md p-0.5"
              >
                <ToggleGroupItem value="visual" aria-label="Visual Editor" className="h-7 px-2 text-xs">
                  <Edit3 className="h-3.5 w-3.5 mr-1" />
                  Visual
                </ToggleGroupItem>
                <ToggleGroupItem value="html" aria-label="HTML Code View" className="h-7 px-2 text-xs">
                  <Code className="h-3.5 w-3.5 mr-1" />
                  HTML
                </ToggleGroupItem>
                <ToggleGroupItem value="mdx" aria-label="MDX Code View" className="h-7 px-2 text-xs">
                  <Code className="h-3.5 w-3.5 mr-1" />
                  MDX
                </ToggleGroupItem>
              </ToggleGroup>
            </>
          )}

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Device Preview Toggle (only in preview modes) */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <>
              <ToggleGroup 
                type="single" 
                value={deviceMode} 
                onValueChange={(v) => v && setDeviceMode(v as DeviceMode)}
                className="bg-background border rounded-md p-0.5"
              >
                <ToggleGroupItem value="desktop" aria-label="Desktop" className="h-7 w-7 p-0">
                  <Monitor className="h-3.5 w-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem value="tablet" aria-label="Tablet" className="h-7 w-7 p-0">
                  <Tablet className="h-3.5 w-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem value="mobile" aria-label="Mobile" className="h-7 w-7 p-0">
                  <Smartphone className="h-3.5 w-3.5" />
                </ToggleGroupItem>
              </ToggleGroup>
              <Separator orientation="vertical" className="h-6 mx-2" />
            </>
          )}

          {/* Text Style */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            icon={Bold}
            tooltip="Bold (Ctrl+B)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            icon={Italic}
            tooltip="Italic (Ctrl+I)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            icon={UnderlineIcon}
            tooltip="Underline (Ctrl+U)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            icon={Strikethrough}
            tooltip="Strikethrough"
          />

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Text Color */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="h-4 w-4 border-2 border-current rounded-sm" style={{ background: 'linear-gradient(135deg, #ef4444 25%, #22c55e 50%, #3b82f6 75%)' }} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
              <div className="space-y-2">
                <p className="text-xs font-medium">Text Color</p>
                <div className="grid grid-cols-8 gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setColor(color)}
                      className="w-6 h-6 rounded-sm border border-border hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <p className="text-xs font-medium mt-3">Highlight</p>
                <div className="grid grid-cols-8 gap-1">
                  {highlightColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setHighlight(color)}
                      className="w-6 h-6 rounded-sm border border-border hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Alignment */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            icon={AlignLeft}
            tooltip="Align Left"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            icon={AlignCenter}
            tooltip="Align Center"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            icon={AlignRight}
            tooltip="Align Right"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            icon={AlignJustify}
            tooltip="Justify"
          />

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Headings */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            icon={Heading1}
            tooltip="Heading 1"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            icon={Heading2}
            tooltip="Heading 2"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            icon={Heading3}
            tooltip="Heading 3"
          />

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon={List}
            tooltip="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon={ListOrdered}
            tooltip="Numbered List"
          />

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Blocks */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            icon={Quote}
            tooltip="Quote"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            icon={Code}
            tooltip="Code Block"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            isActive={false}
            icon={Minus}
            tooltip="Horizontal Rule"
          />
          <ToolbarButton
            onClick={insertMermaid}
            isActive={false}
            icon={Workflow}
            tooltip="Insert Mermaid Diagram"
          />

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Script */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            isActive={editor.isActive('subscript')}
            icon={SubscriptIcon}
            tooltip="Subscript"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            isActive={editor.isActive('superscript')}
            icon={SuperscriptIcon}
            tooltip="Superscript"
          />

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Links & Images */}
          <ToolbarButton
            onClick={setLink}
            isActive={editor.isActive('link')}
            icon={LinkIcon}
            tooltip="Add Link"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={addImage}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Image URL
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={uploadImage}
                >
                  <FileImage className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* History */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            isActive={false}
            icon={Undo}
            tooltip="Undo (Ctrl+Z)"
            disabled={!editor.can().chain().focus().undo().run()}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            isActive={false}
            icon={Redo}
            tooltip="Redo (Ctrl+Y)"
            disabled={!editor.can().chain().focus().redo().run()}
          />

          <div className="flex-1" />

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 px-2"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-4 w-4 mr-1" />
                <span className="text-xs">Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-4 w-4 mr-1" />
                <span className="text-xs">Fullscreen</span>
              </>
            )}
          </Button>
        </div>

        {/* Content Area */}
        <div 
          ref={containerRef}
          className={`flex ${viewMode === 'split' ? 'flex-row' : 'flex-col'} ${isFullscreen ? 'h-[calc(100vh-120px)]' : ''} relative`}
        >
          {/* Editor */}
          {showEditor && (
            <div 
              ref={editorRef}
              className={`${viewMode === 'split' ? 'border-r' : 'w-full'} ${viewMode === 'edit' && !isFullscreen ? 'min-h-[400px]' : 'h-full'} overflow-auto`}
              style={{ width: viewMode === 'split' ? `${splitPaneWidth}%` : '100%' }}
              onScroll={handleEditorScroll}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onPaste={handlePaste}
            >
              {codeMode !== 'visual' ? (
                <textarea
                  ref={codeViewRef}
                  value={content}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className="w-full h-full min-h-[400px] p-4 font-mono text-sm bg-background resize-none focus:outline-none"
                  spellCheck={false}
                />
              ) : (
                <EditorContent 
                  editor={editor} 
                  className="prose prose-sm max-w-none p-4 focus:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:min-h-[400px] [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror]:h-full [&_.ProseMirror]:overflow-auto"
                />
              )}
            </div>
          )}

          {/* Resize Handle - Only in split mode */}
          {viewMode === 'split' && (
            <div
              className={`absolute top-0 bottom-0 w-4 cursor-col-resize z-10 flex items-center justify-center group ${isDragging ? 'bg-primary/20' : 'hover:bg-primary/10'} transition-colors`}
              style={{ left: `calc(${splitPaneWidth}% - 8px)` }}
              onMouseDown={handleResizeStart}
            >
              <div className={`w-1 h-8 rounded-full ${isDragging ? 'bg-primary' : 'bg-border group-hover:bg-primary/50'} transition-colors`}>
                <GripVertical className="w-3 h-3 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Preview */}
          {showPreview && (
            <div 
              ref={previewRef}
              className="bg-muted/30 overflow-auto relative"
              style={{ width: viewMode === 'split' ? `${100 - splitPaneWidth}%` : '100%' }}
              onScroll={handlePreviewScroll}
              onMouseUp={handlePreviewMouseUp}
            >
              {/* Floating Toolbar for text selection (HTML/Visual mode only) */}
              {codeMode !== 'mdx' && selection.rect && selection.text && (
                <div 
                  className="fixed z-50 bg-popover border rounded-lg shadow-lg p-1 flex gap-1"
                  style={{ 
                    top: (selection.rect.top - 45),
                    left: (selection.rect.left + selection.rect.width / 2 - 60)
                  }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0"
                    onClick={() => applyStyleToSelection('bold')}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0"
                    onClick={() => applyStyleToSelection('italic')}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0"
                    onClick={() => applyStyleToSelection('underline')}
                  >
                    <UnderlineIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className={`${deviceWidthClass} bg-background min-h-full`}>
                {/* Blog Header */}
                {(headline || coverImage) && (
                  <div className="border-b">
                    {coverImage && (
                      <div className="w-full h-48 md:h-64 overflow-hidden">
                        <img 
                          src={coverImage} 
                          alt={headline}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {tag && (
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3">
                          {tag}
                        </span>
                      )}
                      {headline && (
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                          {headline}
                        </h1>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {writer && <span>By {writer}</span>}
                        {readingTime > 0 && <span>{readingTime} min read</span>}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Blog Content */}
                <div className="p-6">
                  {content ? (
                    codeMode === 'mdx' ? (
                      <HybridContent content={content} />
                    ) : (
                      <div 
                        className="blog-content prose prose-sm md:prose-base max-w-none"
                        dangerouslySetInnerHTML={{ __html: processedPreviewContent() }}
                      />
                    )
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Eye className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Start writing to see your blog preview here.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with stats */}
        <div className="border-t p-2 bg-muted/50 flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex gap-4">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
            {readingTime > 0 && <span>{readingTime} min read</span>}
          </div>
          <div className="flex gap-2">
            <span className="hidden sm:inline">
              View: <kbd className="px-1 py-0.5 bg-muted rounded border">{viewMode}</kbd>
            </span>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
