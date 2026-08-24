"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Container } from "@/app/components/common/Container";
import { reviews as reviewsTable } from "@/lib/db/schema";
import { ReviewForm } from "./ReviewForm";

const GRID_COLUMNS = 3; // lg:grid-cols-3 기준

type Review = typeof reviewsTable.$inferSelect;

// 카테고리 필터 목록
const categories = ["전체", "아파트", "주택", "상업공간"];

export default function ReviewsPage({ reviews }: { reviews: Review[] }) {
  const [activeCategory, setActiveCategory] = useState("전체");

  const filtered = activeCategory === "전체"
    ? reviews
    : reviews.filter((r) => r.category === activeCategory);

  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "-";

  // 마지막 줄이 그리드를 다 채우지 못할 때, 남는 칸(예전엔 회색 배경만 보이던 자리)에 이미지를 채워넣기 위한 개수
  const remainder = filtered.length % GRID_COLUMNS;
  const fillerCount = filtered.length > 0 && remainder !== 0 ? GRID_COLUMNS - remainder : 0;

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

      {/* 카테고리 필터 */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-16">
        <TabsList className="bg-transparent p-0 h-auto gap-6 justify-start">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="text-sm tracking-wide px-0 py-0 h-auto rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:opacity-100 opacity-30 hover:opacity-60 transition-opacity duration-300"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-16">
          {/* 후기 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (index % GRID_COLUMNS) * 0.05 }}
              >
                <Card className="rounded-none border border-black/10 shadow-none bg-white p-10 gap-0 h-full">
                  {/* 별점 */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${i < review.rating ? "fill-black text-black" : "fill-black/10 text-black/10"}`}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-black/60 leading-relaxed mb-8">
                    &ldquo;{review.content}&rdquo;
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-black/10">
                    <p className="text-sm font-medium">{review.name}</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="rounded-none text-xs text-black/40 bg-black/5">
                        {review.category}
                      </Badge>
                      <Badge variant="secondary" className="rounded-none text-xs text-black/40 bg-black/5">
                        {review.area}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* 마지막 줄에 빈 칸이 남으면(예전엔 회색 배경만 보이던 자리) 이미지를 채워 넣음 */}
            {Array.from({ length: fillerCount }).map((_, i) => (
              <motion.div
                key={`filler-${i}`}
                className="relative w-full h-full min-h-64 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (filtered.length % GRID_COLUMNS) * 0.05 }}
              >
                <Image
                  src="/images/reviews/case-study.jpg"
                  alt="시공사례"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      </Container>
    </section>
  );
}
