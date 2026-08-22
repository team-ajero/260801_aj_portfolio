"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { heroContent, heroSlides } from "@/lib/db/schema";
import {
  saveHeroContent,
  createHeroSlide,
  deleteHeroSlide,
  type HeroContentInput,
} from "@/lib/actions/hero";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ImageUploadField } from "@/app/components/admin/ImageUploadField";
import { DeleteConfirmButton } from "@/app/components/admin/DeleteConfirmButton";

type HeroContent = typeof heroContent.$inferSelect;
type HeroSlide = typeof heroSlides.$inferSelect;

const emptyContent: HeroContentInput = {
  eyebrow: "Interior Design Studio",
  headline: "",
  description: "",
  primaryCtaLabel: "시공사례 보기",
  primaryCtaHref: "/works",
  secondaryCtaLabel: "견적 문의",
  secondaryCtaHref: "/contact",
};

export function HeroManager({
  initialContent,
  initialSlides,
}: {
  initialContent: HeroContent | null;
  initialSlides: HeroSlide[];
}) {
  const [content, setContent] = useState<HeroContentInput>(initialContent ?? emptyContent);
  const [slides, setSlides] = useState(initialSlides);
  const [newSlideUrl, setNewSlideUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSaveContent = () => {
    if (!content.headline.trim() || !content.description.trim()) {
      toast.error("헤드라인과 설명을 입력해주세요.");
      return;
    }
    startTransition(async () => {
      try {
        await saveHeroContent(content);
        toast.success("저장됐어요.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "저장에 실패했어요.");
      }
    });
  };

  const handleAddSlide = () => {
    if (!newSlideUrl) {
      toast.error("먼저 이미지를 업로드해주세요.");
      return;
    }
    startTransition(async () => {
      try {
        await createHeroSlide({ imageUrl: newSlideUrl, focus: "center", order: slides.length });
        toast.success("슬라이드를 추가했어요.");
        setNewSlideUrl("");
        window.location.reload();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "추가에 실패했어요.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">텍스트</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>eyebrow (작은 라벨)</Label>
            <Input
              value={content.eyebrow}
              onChange={(e) => setContent((c) => ({ ...c, eyebrow: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>헤드라인</Label>
            <Input
              value={content.headline}
              onChange={(e) => setContent((c) => ({ ...c, headline: e.target.value }))}
              placeholder="예: 공간이 말하는 당신의 이야기"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>설명</Label>
            <Textarea
              value={content.description}
              onChange={(e) => setContent((c) => ({ ...c, description: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>기본 버튼 텍스트</Label>
              <Input
                value={content.primaryCtaLabel}
                onChange={(e) => setContent((c) => ({ ...c, primaryCtaLabel: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>기본 버튼 링크</Label>
              <Input
                value={content.primaryCtaHref}
                onChange={(e) => setContent((c) => ({ ...c, primaryCtaHref: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>보조 버튼 텍스트</Label>
              <Input
                value={content.secondaryCtaLabel}
                onChange={(e) => setContent((c) => ({ ...c, secondaryCtaLabel: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>보조 버튼 링크</Label>
              <Input
                value={content.secondaryCtaHref}
                onChange={(e) => setContent((c) => ({ ...c, secondaryCtaHref: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveContent} disabled={isPending}>
              저장
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">배경 이미지 (캐러셀)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {slides.map((slide) => (
              <div key={slide.id} className="relative aspect-video rounded-md overflow-hidden border group">
                <Image src={slide.imageUrl} alt="" fill className="object-cover" />
                <div className="absolute top-1 right-1">
                  <DeleteConfirmButton
                    description="이 배경 이미지를 삭제할까요?"
                    onConfirm={async () => {
                      await deleteHeroSlide(slide.id);
                      setSlides((prev) => prev.filter((s) => s.id !== slide.id));
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-end gap-4 pt-2 border-t">
            <ImageUploadField label="새 배경 이미지" folder="hero" value={newSlideUrl} onChange={setNewSlideUrl} />
            <Button onClick={handleAddSlide} disabled={isPending || !newSlideUrl}>
              <Plus className="size-4" />
              슬라이드 추가
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
