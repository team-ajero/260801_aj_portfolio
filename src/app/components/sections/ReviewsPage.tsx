"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { Container } from "@/app/components/common/Container";
import { AvatarPlaceholder } from "@/app/components/common/AvatarPlaceholder";
import { reviews as reviewsTable } from "@/lib/db/schema";
import { ReviewForm } from "./ReviewForm";

type Review = typeof reviewsTable.$inferSelect;

// 카테고리 필터 목록
const categories = ["전체", "아파트", "주택", "상업공간"];

// 정렬 옵션
const sortOptions = [
  { value: "latest", label: "최신순" },
  { value: "rating-desc", label: "별점 높은순" },
  { value: "rating-asc", label: "별점 낮은순" },
] as const;
type SortValue = (typeof sortOptions)[number]["value"];

// TODO: 리뷰 테이블에 imageUrl 필드가 생기기 전까지, public/images/works의 기존 시공사례
// 사진을 카테고리에 맞춰 임시로 붙여서 보여주기 위한 매핑
const CATEGORY_IMAGES: Record<string, string[]> = {
  아파트: ["/images/works/gangnam-apt.jpg", "/images/works/seocho-apt.jpg"],
  주택: ["/images/works/mapo-house.jpg", "/images/works/yongsan-house.jpg"],
  상업공간: ["/images/works/hongdae-cafe.jpg", "/images/works/seongsu-office.jpg"],
};

function getReviewImage(review: Review, index: number) {
  const pool = CATEGORY_IMAGES[review.category] ?? ["/images/reviews/case-study.jpg"];
  return pool[index % pool.length];
}

export default function ReviewsPage({ reviews }: { reviews: Review[] }) {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [sortBy, setSortBy] = useState<SortValue>("latest");

  const filtered = activeCategory === "전체"
    ? reviews
    : reviews.filter((r) => r.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "rating-desc") return b.rating - a.rating;
    if (sortBy === "rating-asc") return a.rating - b.rating;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "-";

  return (
    <section className="pt-28 md:pt-40 pb-20 md:pb-32">
      <Container>

      {/* 페이지 헤더 */}
      <motion.div
        className="mb-16 flex items-end justify-between gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div>
          <p className="text-sm tracking-widest uppercase text-black/40 mb-4">Reviews</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">고객후기</h1>
        </div>
        <ReviewForm />
      </motion.div>

      {/* 통계 요약 */}
      <motion.div
        className="flex gap-12 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
      >
        <div>
          <p className="text-2xl md:text-3xl font-light mb-1">{average}</p>
          <p className="text-xs tracking-widest uppercase text-black/40">평균 평점</p>
        </div>
        <div>
          <p className="text-2xl md:text-3xl font-light mb-1">{reviews.length}+</p>
          <p className="text-xs tracking-widest uppercase text-black/40">고객 후기</p>
        </div>
        <div>
          <p className="text-2xl md:text-3xl font-light mb-1">98%</p>
          <p className="text-xs tracking-widest uppercase text-black/40">재추천 의향</p>
        </div>
      </motion.div>

      {/* 카테고리 필터 + 정렬 */}
      <motion.div
        className="flex flex-wrap items-center gap-3 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
      >
        <Select value={activeCategory} onValueChange={setActiveCategory}>
          <SelectTrigger className="w-36 rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortValue)}>
          <SelectTrigger className="w-36 rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* 후기 리스트 (박스 없이 아바타 + 이름 + 별점 + 후기를 한 줄씩) */}
      <div className="flex flex-col divide-y divide-black/10">
        {sorted.map((review, index) => (
              <motion.div
                key={review.id}
                className="flex flex-col sm:flex-row gap-6 sm:gap-8 py-10 first:pt-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
              >
                {/* 시공 사진 */}
                <div className="relative w-full sm:w-48 aspect-[4/3] sm:aspect-square overflow-hidden bg-black/5 shrink-0">
                  <Image
                    src={getReviewImage(review, index)}
                    alt={`${review.category} 시공 사진`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 192px"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 mb-3">
                    <div className="flex items-center gap-3">
                      {/* 아바타 */}
                      <div className="size-9 rounded-full overflow-hidden bg-black/5 shrink-0">
                        <AvatarPlaceholder />
                      </div>
                      <p className="text-base font-medium">{review.name}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-3.5 ${i < review.rating ? "fill-black text-black" : "fill-black/10 text-black/10"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="rounded-none text-xs text-black/40 bg-black/5">
                        {review.category}
                      </Badge>
                      <Badge variant="secondary" className="rounded-none text-xs text-black/40 bg-black/5">
                        {review.area}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-base text-black/60 leading-relaxed">
                    &ldquo;{review.content}&rdquo;
                  </p>
                </div>
              </motion.div>
        ))}
      </div>
      </Container>
    </section>
  );
}
