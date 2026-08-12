"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/app/components/ui/card";
import { Container } from "@/app/components/common/Container";

// 서비스 목록 mock 데이터
const services = [
  {
    id: "01",
    title: "아파트 인테리어",
    description: "거주자의 라이프스타일에 맞춘 아파트 전체 리모델링. 공간 효율과 심미성을 동시에 잡습니다.",
  },
  {
    id: "02",
    title: "상업공간 설계",
    description: "카페, 레스토랑, 사무실 등 브랜드 아이덴티티를 공간으로 구현합니다.",
  },
  {
    id: "03",
    title: "부분 시공",
    description: "주방, 욕실, 바닥 등 원하는 공간만 선택적으로 리뉴얼합니다.",
  },
  {
    id: "04",
    title: "3D 설계 상담",
    description: "시공 전 3D 렌더링으로 완성된 공간을 미리 확인할 수 있습니다.",
  },
];

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 bg-black text-white">
      <Container>

        {/* 섹션 헤더 */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-sm tracking-widest uppercase text-white/40 mb-4">Services</p>
          <h2 className="text-4xl font-light tracking-tight">서비스 소개</h2>
        </motion.div>

        {/* 서비스 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="rounded-none border-none shadow-none gap-0 p-10 bg-black text-white hover:bg-white/5 transition-colors duration-300">
                {/* 서비스 번호 */}
                <p className="text-sm text-white/30 mb-6">{service.id}</p>
                {/* 서비스 제목 */}
                <h3 className="text-xl font-light mb-4">{service.title}</h3>
                {/* 서비스 설명 */}
                <p className="text-sm text-white/50 leading-relaxed">{service.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}