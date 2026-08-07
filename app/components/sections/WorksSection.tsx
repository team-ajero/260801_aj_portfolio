"use client"

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Button from "@/app/components/common/Button";

const works = [
    { id: 1, title: "강남 아파트", category: "아파트", area: "84㎡", year: "2024" },
    { id: 2, title: "성수 오피스", category: "상업공간", area: "120㎡", year: "2024" },
    { id: 3, title: "마포 주택", category: "주택", area: "65㎡", year: "2023" },
];

export default function WorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32">

      {/* 섹션 헤더 */}
      <motion.div
        className="flex items-end justify-between mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div>
          <p className="text-sm tracking-widest uppercase text-black/40 mb-4">Works</p>
          <h2 className="text-4xl font-light tracking-tight">시공사례</h2>
        </div>
        <Button label="전체 보기" href="/works" variant="secondary" />
      </motion.div>

      {/* 시공사례 카드 목록 */}
      <div className="flex flex-col divide-y divide-black/10">
        {works.map((work, index) => (
          <motion.div
            key={work.id}
            className="flex items-center justify-between py-8 group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* 프로젝트 번호 + 제목 */}
            <div className="flex items-center gap-8">
              <span className="text-sm text-black/30">0{work.id}</span>
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
      </div>
    </section>
  );
}