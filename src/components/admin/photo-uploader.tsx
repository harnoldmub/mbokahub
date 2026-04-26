"use client";

import { useCallback, useId, useRef, useState } from "react";

type PhotoUploaderProps = {
  name: string;
  defaultUrls?: string[];
  multiple?: boolean;
  label?: string;
  helpText?: string;
  maxFiles?: number;
  /** Show "Faire la couverture" badge/button (first photo = profile photo). */
  enableCoverActions?: boolean;
};

type UploadedFile = { url: string; name: string; size: number; type: string };

export function PhotoUploader({
  name,
  defaultUrls = [],
  multiple = true,
  label,
  helpText,
  maxFiles = 12,
  enableCoverActions = false,
}: PhotoUploaderProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState<string[]>(defaultUrls);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const upload = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (list.length === 0) return;

      const remaining = maxFiles - urls.length;
      const toSend = multiple ? list.slice(0, remaining) : list.slice(0, 1);
      if (toSend.length === 0) {
        setError(`Maximum ${maxFiles} fichier${maxFiles > 1 ? "s" : ""}`);
        return;
      }

      setBusy(true);
      setError(null);
      setWarnings([]);

      const formData = new FormData();
      for (const f of toSend) formData.append("files", f);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Échec de l'envoi");
          return;
        }
        const newUrls = (data.files as UploadedFile[]).map((f) => f.url);
        setUrls((prev) => (multiple ? [...prev, ...newUrls] : newUrls));
        if (data.warnings) setWarnings(data.warnings as string[]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur réseau");
      } finally {
        setBusy(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [urls.length, multiple, maxFiles],
  );

  const removeAt = (idx: number) => {
    setUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const makeCover = (idx: number) => {
    setUrls((prev) => {
      if (idx <= 0 || idx >= prev.length) return prev;
      const next = [...prev];
      const [chosen] = next.splice(idx, 1);
      next.unshift(chosen);
      return next;
    });
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) {
      upload(e.dataTransfer.files);
    }
  };

  const reachedMax = urls.length >= maxFiles;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-xs text-muted-foreground">{label}</span>
      )}

      {/* Hidden input that carries the URLs to the server action */}
      {multiple ? (
        <input type="hidden" name={name} value={urls.join("\n")} />
      ) : (
        <input type="hidden" name={name} value={urls[0] ?? ""} />
      )}

      {/* Previews grid */}
      {urls.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {urls.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className={`group relative aspect-square overflow-hidden rounded-lg border bg-black/40 ${
                enableCoverActions && i === 0
                  ? "border-red-500/60 ring-2 ring-red-500/40"
                  : "border-white/10"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`upload ${i + 1}`}
                className="h-full w-full object-cover"
              />

              {enableCoverActions && i === 0 && (
                <span className="absolute left-1 top-1 rounded-full bg-red-500 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white shadow">
                  Couverture
                </span>
              )}

              {enableCoverActions && i > 0 && (
                <button
                  type="button"
                  onClick={() => makeCover(i)}
                  aria-label={`Faire de la photo ${i + 1} la couverture`}
                  className="absolute bottom-1 left-1 rounded-full bg-black/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white opacity-0 transition focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 group-hover:opacity-100 hover:bg-red-500"
                >
                  Faire la couverture
                </button>
              )}

              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="Retirer cette photo"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white text-xs opacity-0 transition group-hover:opacity-100 hover:bg-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {!reachedMax && (
        <label
          htmlFor={inputId}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-white/15 bg-black/20 px-4 py-6 text-center transition hover:border-red-500/50 hover:bg-red-500/5 ${
            busy ? "opacity-50" : ""
          }`}
        >
          <span className="text-2xl">📸</span>
          <span className="text-foreground text-sm font-medium">
            {busy
              ? "Envoi en cours…"
              : multiple
                ? "Glisse tes photos ici ou clique"
                : "Glisse une photo ou clique"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            JPG, PNG, WebP, GIF ou HEIC (iPhone) · 15 Mo max{multiple ? ` · jusqu'à ${maxFiles} photos` : ""}
          </span>
          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            multiple={multiple}
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.gif,.heic,.heif"
            disabled={busy}
            onChange={(e) => {
              if (e.target.files) upload(e.target.files);
            }}
            className="sr-only"
          />
        </label>
      )}

      {reachedMax && (
        <p className="text-[11px] text-amber-300">
          Limite atteinte ({maxFiles}). Retire une photo pour en ajouter une autre.
        </p>
      )}

      {helpText && (
        <p className="text-[11px] text-muted-foreground">{helpText}</p>
      )}

      {error && (
        <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-300 text-xs">
          {error}
        </p>
      )}
      {warnings.length > 0 && (
        <ul className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-amber-200 text-xs">
          {warnings.map((w, i) => (
            <li key={i}>· {w}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
