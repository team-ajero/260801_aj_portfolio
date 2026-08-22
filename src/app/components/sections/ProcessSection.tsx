"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/app/components/common/Container";

// 프로세스 단계 mock 데이터
const steps = [
  {
    id: "01",
    title: "상담 및 현장 방문",
    description: "고객의 요구사항을 파악하고 현장을 직접 방문해 공간을 분석합니다.",
  },
  {
    id: "02",
    title: "설계 및 견적",
    description: "3D 설계안과 상세 견적서를 제공합니다. 수정 요청은 무제한으로 반영합니다.",
  },
  {
    id: "03",
    title: "계약 및 자재 선정",
    description: "계약 후 고객과 함께 자재, 색상, 마감재를 선정합니다.",
  },
  {
    id: "04",
    title: "시공",
    description: "숙련된 전문 팀이 일정에 맞춰 시공을 진행합니다. 진행 상황을 매일 공유합니다.",
  },
  {
    id: "05",
    title: "준공 및 사후관리",
    description: "최종 점검 후 인도합니다. 시공 후 1년간 무상 AS를 제공합니다.",
  },
];

export default function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 md:py-32">
      <Container>

        {/* 섹션 헤더 */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-sm tracking-widest uppercase text-black/40 mb-4">Process</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight">시공 프로세스</h2>
        </motion.div>

        {/* 프로세스 단계 목록 */}
        <div className="flex flex-col divide-y divide-black/10">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="flex gap-12 py-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* 단계 번호 */}
              <p className="text-sm text-black/30 w-8 shrink-0 pt-1">{step.id}</p>
              <div>
                {/* 단계 제목 */}
                <h3 className="text-xl font-light mb-3">{step.title}</h3>
                {/* 단계 설명 */}
                <p className="text-sm text-black/50 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}