import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extensions/placeholder";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { uploadImage } from "@/lib/api";
import { STORAGE_BUCKETS } from "@/data/admin-constants";
import { cn } from "@/lib/utils";

type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

function ToolbarButton({ onClick, active, disabled, label, icon: Icon }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        "h-8 w-8 inline-flex items-center justify-center rounded-md transition-colors disabled:opacity-40 disabled:pointer-events-none",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-border mx-0.5" aria-hidden="true" />;
}

function Toolbar({ editor, imageBucket }: { editor: Editor; imageBucket: StorageBucket }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImage(imageBucket, file);
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (err) {
      setUploadError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const toggleLink = useCallback(() => {
    const existing = editor.getAttributes("link").href as string | undefined;
    if (existing) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt("Link URL", "https://");
    if (!url) return;
    // Only allow safe schemes — never javascript:
    if (!/^(https?:\/\/|mailto:|\/)/i.test(url)) {
      setUploadError("Links must start with http://, https://, mailto: or /");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const isLinkActive = editor.isActive("link");

  return (
    <div className="border-b bg-secondary/40">
      <div className="flex flex-wrap items-center gap-0.5 p-1.5">
        <ToolbarButton
          label="Bold"
          icon={Bold}
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="Italic"
          icon={Italic}
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="Underline"
          icon={UnderlineIcon}
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolbarButton
          label="Strikethrough"
          icon={Strikethrough}
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />

        <Divider />

        <ToolbarButton
          label="Heading 2"
          icon={Heading2}
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          label="Heading 3"
          icon={Heading3}
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />

        <Divider />

        <ToolbarButton
          label="Bullet list"
          icon={List}
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="Numbered list"
          icon={ListOrdered}
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          label="Blockquote"
          icon={Quote}
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          label="Code block"
          icon={Code}
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        />
        <ToolbarButton
          label="Horizontal rule"
          icon={Minus}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />

        <Divider />

        <ToolbarButton
          label="Align left"
          icon={AlignLeft}
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        />
        <ToolbarButton
          label="Align center"
          icon={AlignCenter}
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        />
        <ToolbarButton
          label="Align right"
          icon={AlignRight}
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        />

        <Divider />

        <ToolbarButton
          label={isLinkActive ? "Remove link" : "Add link"}
          icon={isLinkActive ? Link2Off : Link2}
          active={isLinkActive}
          onClick={toggleLink}
        />
        <ToolbarButton
          label={uploading ? "Uploading image…" : "Insert image"}
          icon={uploading ? Loader2 : ImagePlus}
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        />

        <Divider />

        <ToolbarButton
          label="Undo"
          icon={Undo2}
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolbarButton
          label="Redo"
          icon={Redo2}
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleImageUpload(file);
            e.target.value = "";
          }}
        />
      </div>

      {uploadError && (
        <p role="alert" className="px-3 pb-2 text-xs text-destructive">
          {uploadError}
        </p>
      )}
    </div>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Tell the story…",
  compact = false,
  imageBucket = STORAGE_BUCKETS.blog,
  ariaLabel = "Rich text editor",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  compact?: boolean;
  imageBucket?: StorageBucket;
  ariaLabel?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        // Link and Underline ship inside StarterKit in Tiptap v3, so they are
        // configured here rather than registered as separate extensions.
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: {
            rel: "noopener noreferrer",
            target: "_blank",
          },
        },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-xl" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: `prose prose-slate dark:prose-invert max-w-none ${compact ? "min-h-[280px]" : "min-h-[420px]"} px-5 py-4 focus:outline-none`,
        "aria-label": ariaLabel,
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  // Sync external value changes (e.g. after loading a post) without clobbering
  // the cursor while the user is actively typing.
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // Intentionally keyed on `value` only — including `editor` would re-run on
    // every keystroke and fight the user's caret.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border bg-background",
          compact ? "min-h-[340px]" : "min-h-[480px]",
        )}
      >
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-background overflow-hidden focus-within:border-primary/50 transition-colors">
      <Toolbar editor={editor} imageBucket={imageBucket} />
      <EditorContent editor={editor} />
    </div>
  );
}
