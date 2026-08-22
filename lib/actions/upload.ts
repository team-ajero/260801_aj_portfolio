"use server";

import { put, del } from "@vercel/blob";
import { requireSession } from "@/lib/auth-guard";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/**
 * 관리자 화면의 이미지 업로드 공용 액션.
 * folder 예: "works" | "services" | "hero" | "about" | "team"
 */
export async function uploadImage(folder: string, formData: FormData) {
  await requireSession();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("업로드할 파일을 선택해주세요.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("파일 크기는 5MB 이하만 가능합니다.");
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("jpg, png, webp, avif 이미지만 업로드할 수 있습니다.");
  }

  const blob = await put(`${folder}/${crypto.randomUUID()}-${file.name}`, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return blob.url;
}

/** 이미지 교체/삭제 시 이전 Blob 파일 정리 (실패해도 무시 - 고아 파일보다 화면 에러가 더 치명적) */
export async function deleteImage(url: string) {
  await requireSession();
  try {
    await del(url);
  } catch {
    // no-op
  }
}
