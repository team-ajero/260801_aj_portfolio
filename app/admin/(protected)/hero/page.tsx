import { getHeroContent, getHeroSlides } from "@/lib/actions/hero";
import { HeroManager } from "./HeroManager";

export default async function AdminHeroPage() {
  const [content, slides] = await Promise.all([getHeroContent(), getHeroSlides()]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">메인 페이지</h1>
        <p className="text-sm text-muted-foreground mt-1">
          메인 히어로의 배경 이미지와 텍스트를 관리합니다.
        </p>
      </div>
      <HeroManager initialContent={content} initialSlides={slides} />
    </div>
  );
}
