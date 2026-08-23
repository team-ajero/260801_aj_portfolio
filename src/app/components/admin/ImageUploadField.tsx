"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ImageUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { uploadImage } from "@/lib/actions/upload";

interface ImageUploadFieldProps {
  label?: string;
  folder: string; // 업로드 경로 prefix (예: "works")
  value: string;
  onChange: (url: string) => void;
}

export function ImageUploadField({ label = "이미지", folder, value, onChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 업로드 완료 전에도 즉시 로컬 미리보기
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      try {
        const url = await uploadImage(folder, formData);
        onChange(url);
        setPreview(url);
        toast.success("이미지가 업로드됐어요.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "업로드에 실패했어요.");
        setPreview(value);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <div className="relative w-28 h-28 rounded-md overflow-hidden bg-muted shrink-0 border">
          {preview ? (
            <Image src={preview} alt={label} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ImageUp className="size-6" />
            </div>
          )}
          {isPending && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="size-5 animate-spin text-white" />
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          이미지 선택
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
