"use client";

import { motion } from "framer-motion";
import { useState } from "react"; // 필터 상태 관리용
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Badge } from "@/app/components/ui/badge";
import { Container } from "@/app/components/common/Container";
import { works as worksTable } from "@/lib/db/schema";

type Work = typeof worksTable.$inferSelect;

// 카테고리 필터 목록
const categories = ["전체", "아파트", "주택", "상업공간"];

export default function WorksGallery({ works }: { works: Work[] }) {
  // 선택된 카테고리 상태 (기본값: 전체)
  const [activeCategory, setActiveCategory] = useState("전체");

  // 카테고리에 따라 필터링
  const filtered = activeCategory === "전체"
    ? works
    : works.filter((w) => w.category === activeCategory);

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
        <p className="text-sm tracking-widest uppercase text-black/40 mb-4">Works</p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">시공사례</h1>
      </motion.div>

      {/* 카테고리 필터 */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-16">
        <TabsList className="bg-transparent p-0 h-auto gap-6 justify-start">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="text-sm tracking-wide px-1.5 py-[3px] h-auto rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:opacity-100 opacity-30 hover:opacity-60 transition-opacity duration-300"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-16">
          {/* 시공사례 그리드 (균일한 그리드 정렬, 스크롤 인뷰 시 가벼운 페이드인만 적용) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
            {filtered.map((work, index) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
              >
                <div className="group cursor-pointer">
                  <div className="relative w-full aspect-video mb-6 overflow-hidden bg-black/5">
                    <Image
                      src={work.imageUrl}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-black/40 border-black/20 rounded-none px-0 border-0 text-xs tracking-widest uppercase mb-2"
                  >
                    {work.category}
                  </Badge>
                  <h3 className="text-lg font-light mb-4">{work.title}</h3>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="rounded-none text-xs text-black/40 bg-black/5">
                      {work.area}
                    </Badge>
                    <Badge variant="secondary" className="rounded-none text-xs text-black/40 bg-black/5">
                      {work.year}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      </Container>
    </section>
  );
}