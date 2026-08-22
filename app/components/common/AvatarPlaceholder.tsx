import { cn } from "@/lib/utils";

// 프로필 사진이 없을 때 쓰는 기본 실루엣 (머리 + 어깨, 프레임 가득 채움)
export function AvatarPlaceholder({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("w-full h-full text-black/15", className)}
      aria-hidden="true"
    >
      {/* 머리 */}
      <circle cx="100" cy="80" r="42" fill="currentColor" />
      {/* 어깨 (하단은 프레임 밖으로 나가서 자연스럽게 잘림) */}
      <path d="M100 132c-58 0-94 38-94 78h188c0-40-36-78-94-78z" fill="currentColor" />
    </svg>
  );
}