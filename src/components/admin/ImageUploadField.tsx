import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImage } from "@/lib/api";

/**
 * Combined upload + paste-a-URL control for a single image.
 * Uploads go to a public Supabase storage bucket; writes are admin-gated by
 * policies on storage.objects.
 */
export default function ImageUploadField({
  label,
  bucket,
  value,
  onChange,
  hint,
}: {
  label: string;
  bucket: string;
  value: string | null;
  onChange: (url: string | null) => void;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      onChange(await uploadImage(bucket, file));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>

      {value ? (
        <div className="relative rounded-xl border overflow-hidden bg-secondary/30">
          <img src={value} alt="Selected preview" className="w-full h-44 object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => onChange(null)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Remove
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center gap-2 h-44 rounded-xl border border-dashed bg-secondary/20 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Uploading…</span>
            </>
          ) : (
            <>
              <ImagePlus className="h-5 w-5" />
              <span className="text-sm font-medium">Upload an image</span>
              <span className="text-xs">JPEG, PNG, WebP or AVIF · max 5MB</span>
            </>
          )}
        </button>
      )}

      <Input
        placeholder="…or paste an image URL"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value.trim() || null)}
      />

      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
