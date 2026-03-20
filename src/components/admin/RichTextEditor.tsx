import { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import CharacterCount from '@tiptap/extension-character-count';
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
  FileImage
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

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

export function RichTextEditor({ content, onChange, placeholder = 'Write your blog content here...' }: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

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
    ],
    content,
    onUpdate: ({ editor }) => {
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

  const addImage = useCallback(async () => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const uploadImage = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && editor) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size should be less than 5MB');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          editor.chain().focus().setImage({ src: base64 }).run();
          toast.success('Image uploaded successfully');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [editor]);

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

  if (!editor) {
    return null;
  }

  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 bg-background'
    : 'border rounded-lg overflow-hidden bg-background';

  return (
    <div className={containerClasses}>
      <TooltipProvider>
        {/* Toolbar */}
        <div className="border-b p-2 flex flex-wrap gap-1 bg-muted/50 items-center">
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

        {/* Editor */}
        <div className={`relative ${isFullscreen ? 'h-[calc(100vh-120px)]' : ''}`}>
          <EditorContent 
            editor={editor} 
            className={`prose prose-sm max-w-none p-4 focus:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:min-h-[400px] [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none ${isFullscreen ? '[&_.ProseMirror]:min-h-full' : ''}`}
          />
        </div>

        {/* Footer with stats */}
        <div className="border-t p-2 bg-muted/50 flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex gap-4">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
          </div>
          <div className="flex gap-2">
            <span className="hidden sm:inline">
              Use <kbd className="px-1 py-0.5 bg-muted rounded border">Tab</kbd> for toolbar
            </span>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
