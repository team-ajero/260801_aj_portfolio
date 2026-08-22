"use client";

import { motion } from "framer-motion";
import { useState } from "react"; // 필터 상태 관리용
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

// 카테고리 필터 목록
const categories = ["전체", "아파트", "주택", "상업공간"];

// 시공사례 mock 데이터
const works = [
  { id: 1, title: "강남 아파트", category: "아파트", area: "84㎡", year: "2024", image: "/images/works/gangnam-apt.jpg" },
  { id: 2, title: "성수 오피스", category: "상업공간", area: "120㎡", year: "2024", image: "/images/works/seongsu-office.jpg" },
  { id: 3, title: "마포 주택", category: "주택", area: "65㎡", year: "2023", image: "/images/works/mapo-house.jpg" },
  { id: 4, title: "서초 아파트", category: "아파트", area: "115㎡", year: "2023", image: "/images/works/seocho-apt.jpg" },
  { id: 5, title: "홍대 카페", category: "상업공간", area: "45㎡", year: "2023", image: "/images/works/hongdae-cafe.jpg" },
  { id: 6, title: "용산 주택", category: "주택", area: "90㎡", year: "2022", image: "/images/works/yongsan-house.jpg" },
];

export default function WorksGallery() {
  // 선택된 카테고리 상태 (기본값: 전체)
  const [activeCategory, setActiveCategory] = useState("전체");

  // 카테고리에 따라 필터링
  const filtered = activeCategory === "전체"
    ? works
    : works.filter((w) => w.category === activeCategory);

  return (
    <section className="pt-28 md:pt-40 pb-20 md:pb-32">

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
              className="text-sm tracking-wide px-0 py-0 h-auto rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:opacity-100 opacity-30 hover:opacity-60 transition-opacity duration-300"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-16">
          {/* 시공사례 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10">
            {filtered.map((work, index) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="rounded-none border-none shadow-none bg-white p-10 gap-0 hover:bg-black/5 transition-colors duration-300 cursor-pointer">
                  <div className="relative w-full aspect-video mb-6 overflow-hidden bg-black/5">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      className="object-cover"
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
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}