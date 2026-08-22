"use client"

import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import Button from "@/app/components/common/Button";
import { Container } from "@/app/components/common/Container";
import { works as worksTable } from "@/lib/db/schema";

type Work = typeof worksTable.$inferSelect;

export default function WorksSection({ works }: { works: Work[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // 현재 마우스를 올리고 있는 항목 (플로팅 미리보기 표시용)
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const hoveredWork = works.find((w) => w.id === hoveredId);

  // 마우스 위치를 부드럽게(스프링) 따라가는 플로팅 박스 좌표
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

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

        {/* 시공사례 카드 목록 */}
        <div
          className="relative flex flex-col divide-y divide-black/10"
          onMouseMove={handleMouseMove}
        >
          {works.map((work, index) => (
            <motion.div
              key={work.id}
              className="flex items-center justify-between py-8 group cursor-pointer"
              onMouseEnter={() => setHoveredId(work.id)}
              onMouseLeave={() => setHoveredId(null)}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* 프로젝트 번호 + 제목 */}
              <div className="flex items-center gap-8">
                <span className="text-sm text-black/30">0{index + 1}</span>
                <h3 className="text-xl font-light group-hover:opacity-50 transition-opacity duration-300">
                  {work.title}
                </h3>
              </div>

              {/* 프로젝트 정보 */}
              <div className="flex gap-12 text-sm text-black/40">
                <span>{work.category}</span>
                <span>{work.area}</span>
                <span>{work.year}</span>
              </div>
            </motion.div>
          ))}

          {/* 마우스를 따라다니는 플로팅 이미지 미리보기 (데스크톱 전용, 호버 없는 터치기기는 자동 비활성) */}
          <AnimatePresence>
            {hoveredWork && (
              <motion.div
                className="hidden md:block absolute top-0 left-0 z-10 w-64 h-80 -ml-32 -mt-40 pointer-events-none overflow-hidden bg-black/5"
                style={{ x: springX, y: springY }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Image
                  src={hoveredWork.imageUrl}
                  alt={hoveredWork.title}
                  fill
                  className="object-cover"
                  sizes="256px"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}