"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Star } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Container } from "@/app/components/common/Container";

// 카테고리 필터 목록
const categories = ["전체", "아파트", "주택", "상업공간"];

// 고객후기 mock 데이터
const reviews = [
  {
    id: 1,
    name: "김O정",
    category: "아파트",
    area: "84㎡",
    rating: 5,
    content: "상담부터 시공까지 꼼꼼하게 챙겨주셔서 만족스러운 결과물을 받았어요. 특히 3D 렌더링으로 미리 확인할 수 있어서 좋았습니다.",
  },
  {
    id: 2,
    name: "이O수",
    category: "상업공간",
    area: "45㎡",
    rating: 5,
    content: "카페 인테리어를 맡겼는데 브랜드 컨셉을 정확히 이해하고 공간으로 풀어내주셨어요. 오픈 후 손님들 반응도 정말 좋습니다.",
  },
  {
    id: 3,
    name: "박O영",
    category: "주택",
    area: "65㎡",
    rating: 4,
    content: "전체적으로 만족스러웠고, 일정 공유도 매일 해주셔서 진행 상황을 확인하기 편했어요.",
  },
  {
    id: 4,
    name: "최O아",
    category: "아파트",
    area: "115㎡",
    rating: 5,
    content: "견적이 투명해서 좋았고, 자재 선정 단계에서 다양한 옵션을 제안해주셔서 취향에 맞는 공간을 만들 수 있었습니다.",
  },
  {
    id: 5,
    name: "정O민",
    category: "상업공간",
    area: "120㎡",
    rating: 5,
    content: "사무실 리모델링이었는데 인허가 대행까지 한번에 처리해주셔서 신경쓸 일이 없었어요. 추천합니다.",
  },
  {
    id: 6,
    name: "한O진",
    category: "주택",
    area: "90㎡",
    rating: 4,
    content: "부분 시공으로 주방만 진행했는데 기존 공간과의 조화까지 고려해주셔서 만족했습니다.",
  },
];

export default function ReviewsPage() {
  const [activeCategory, setActiveCategory] = useState("전체");

  const filtered = activeCategory === "전체"
    ? reviews
    : reviews.filter((r) => r.category === activeCategory);

  const average = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="pt-28 md:pt-40 pb-20 md:pb-32">
      <Container>

      {/* 페이지 헤더 */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <p className="text-sm tracking-widest uppercase text-black/40 mb-4">Reviews</p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">고객후기</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10">
            {filtered.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="rounded-none border-none shadow-none bg-white p-10 gap-0 h-full">
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
          </div>
        </TabsContent>
      </Tabs>
      </Container>
    </section>
  );
}
