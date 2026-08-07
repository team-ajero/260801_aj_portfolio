"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Button from "@/app/components/common/Button";

// 서비스 상세 mock 데이터
const services = [
  {
    id: "01",
    title: "아파트 인테리어",
    description: "거주자의 라이프스타일에 맞춘 아파트 전체 리모델링. 공간 효율과 심미성을 동시에 잡습니다.",
    details: ["설계 및 3D 렌더링", "전체 철거 및 시공", "자재 및 가구 선정", "1년 무상 AS"],
    price: "평당 150만원~",
  },
  {
    id: "02",
    title: "상업공간 설계",
    description: "카페, 레스토랑, 사무실 등 브랜드 아이덴티티를 공간으로 구현합니다.",
    details: ["브랜드 컨셉 설계", "인허가 대행", "시공 전 과정 관리", "준공 후 사후관리"],
    price: "평당 200만원~",
  },
  {
    id: "03",
    title: "부분 시공",
    description: "주방, 욕실, 바닥 등 원하는 공간만 선택적으로 리뉴얼합니다.",
    details: ["주방 리모델링", "욕실 리모델링", "바닥재 교체", "도배 및 페인트"],
    price: "공간별 별도 견적",
  },
  {
    id: "04",
    title: "3D 설계 상담",
    description: "시공 전 3D 렌더링으로 완성된 공간을 미리 확인할 수 있습니다.",
    details: ["현장 실측", "3D 렌더링 제공", "자재 샘플 제안", "무제한 수정"],
    price: "무료 (시공 계약 시)",
  },
];

export default function ServicesPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="pt-40 pb-32">

      {/* 페이지 헤더 */}
      <motion.div
        className="mb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <p className="text-sm tracking-widest uppercase text-black/40 mb-4">Services</p>
        <h1 className="text-5xl font-light tracking-tight">서비스 소개</h1>
      </motion.div>

      {/* 서비스 목록 */}
      <div className="flex flex-col divide-y divide-black/10">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            className="py-16 flex flex-col md:flex-row gap-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* 왼쪽: 번호 + 제목 */}
            <div className="md:w-1/3">
              <p className="text-sm text-black/30 mb-4">{service.id}</p>
              <h2 className="text-2xl font-light mb-4">{service.title}</h2>
              <p className="text-sm text-black/50 leading-relaxed mb-6">{service.description}</p>
              <p className="text-sm font-medium">{service.price}</p>
            </div>

            {/* 오른쪽: 상세 항목 + 버튼 */}
            <div className="md:w-2/3 flex flex-col justify-between">
              <ul className="grid grid-cols-2 gap-4 mb-12">
                {service.details.map((detail) => (
                  <li key={detail} className="flex items-center gap-3 text-sm text-black/60">
                    {/* 구분선 */}
                    <span className="w-4 h-px bg-black/30 shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
              <Button label="견적 문의" href="/contact" variant="secondary" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}