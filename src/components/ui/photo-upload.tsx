"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  label: string;
  description?: string;
  value?: string;
  onChange?: (file: File | null) => void;
  className?: string;
}

export function PhotoUpload({
  label,
  description,
  value,
  onChange,
  className,
}: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const inputId = `upload-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`;

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onChange?.(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-1">
        <label
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-blood"
          htmlFor={inputId}
        >
          {label}
        </label>
        {description && (
          <p className="font-body text-[10px] text-paper-mute italic">
            {description}
          </p>
        )}
      </div>

      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative h-64 w-full rounded-2xl border border-dashed border-white/10 bg-coal/50 overflow-hidden cursor-pointer transition-colors group",
          isDragging && "border-blood bg-blood/5",
          preview && "border-solid border-white/20",
        )}
        onClick={() => !preview && document.getElementById(inputId)?.click()}
      >
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <Image
                src={preview}
                alt="Preview"
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreview(null);
                    onChange?.(null);
                  }}
                  className="size-12 rounded-full bg-blood text-paper flex items-center justify-center hover:scale-110 transition-transform shadow-glow-blood"
                >
                  <X className="size-6" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
            >
              <div className="size-16 rounded-full bg-smoke flex items-center justify-center text-paper-mute group-hover:text-blood transition-colors group-hover:scale-110 duration-500">
                <Camera className="size-8" />
              </div>
              <div>
                <p className="font-display text-lg uppercase text-paper">
                  Déposer la photo <span className="text-blood">ici</span>
                </p>
                <p className="mt-2 text-paper-mute text-xs font-mono uppercase tracking-widest">
                  PNG, JPG ou WEBP • MAX 5MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          id={inputId}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </motion.div>
    </div>
  );
}
