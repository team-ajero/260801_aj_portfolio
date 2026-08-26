"use client"

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Button from "@/app/components/common/Button";
import { Container } from "@/app/components/common/Container";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { works as worksTable } from "@/lib/db/schema";

type Work = typeof worksTable.$inferSelect;

export default function WorksSection({ works }: { works: Work[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 md:py-32">
      <Container>

        {/* 섹션 헤더 */}
        <motion.div
          className="flex items-end justify-between mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div>
            <p className="text-sm tracking-widest uppercase text-black/40 mb-4">Works</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight">시공사례</h2>
          </div>
          <Button label="전체 보기" href="/works" variant="secondary" />
        </motion.div>

        {/* 시공사례 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {works.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group rounded-none border border-black/10 shadow-none bg-white p-0 gap-0 overflow-hidden cursor-pointer">
                {/* 프로젝트 이미지 (4:5 세로 비율) */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-black/5">
                  <Image
                    src={work.imageUrl}
                    alt={work.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* 제목 + 메타 정보 */}
                <div className="p-6">
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
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
