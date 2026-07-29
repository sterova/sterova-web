import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImage } from "@/lib/api";
import { friendlyError } from "@/lib/cms-errors";
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/data/admin-constants";
import { cn } from "@/lib/utils";

/**
 * Square photo picker with an immediate local preview, client-side type/size
 * validation and an upload progress indicator. The uploaded public URL is
 * pushed up through `onChange`; the caller decides when to persist it.
 */
export default function PhotoUploadField({
  label,
  bucket,
  value,
  onChange,
  hint,
  onBusyChange,
}: {
  label: string;
  bucket: string;
  value: string | null;
  onChange: (url: string | null) => void;
  hint?: string;
  onBusyChange?: (busy: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const setBusy = (busy: boolean) => {
    setUploading(busy);
    onBusyChange?.(busy);
  };

  const handleFile = async (file: File) => {
    setError(null);

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Unsupported file type. Use JPEG, PNG, WebP, AVIF or GIF.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError(`Image is too large. Maximum size is ${MAX_UPLOAD_BYTES / 1024 / 1024}MB.`);
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setBusy(true);
    setProgress(8);

    // supabase-js does not surface upload progress, so this is a paced
    // indicator that completes only when the request resolves.
    const timer = window.setInterval(
      () => setProgress((p) => (p < 90 ? p + Math.max(1, (90 - p) / 8) : p)),
      160,
    );

    try {
      const url = await uploadImage(bucket, file);
      setProgress(100);
      onChange(url);
    } catch (err) {
      setError(friendlyError(err));
      setPreview(null);
    } finally {
      window.clearInterval(timer);
      setBusy(false);
      window.setTimeout(() => setProgress(0), 600);
    }
  };

  const shown = preview ?? value;

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>

      <div className="flex items-start gap-4">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/40">
          {shown ? (
            <img src={shown} alt="Selected preview" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-muted-foreground">
              <ImagePlus className="h-6 w-6" aria-hidden="true" />
            </div>
          )}
          {uploading ? (
            <div className="absolute inset-0 grid place-items-center bg-background/70">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              <UploadCloud className="h-3.5 w-3.5 mr-1.5" />
              {shown ? "Replace photo" : "Upload photo"}
            </Button>
            {shown ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={uploading}
                onClick={() => {
                  setPreview(null);
                  onChange(null);
                }}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Remove
              </Button>
            ) : null}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void handleFile(file);
            }}
          />

          <Input
            value={value ?? ""}
            placeholder="…or paste an image URL"
            onChange={(e) => {
              setPreview(null);
              onChange(e.target.value.trim() || null);
            }}
            className="h-9 text-xs"
          />

          {progress > 0 ? (
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Upload progress"
            >
              <div
                className={cn("h-full rounded-full bg-primary transition-all")}
                style={{ width: `${progress}%` }}
              />
            </div>
          ) : null}

          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
