"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { Container } from "@/app/components/common/Container";
import Button from "@/app/components/common/Button";

// 서비스 상세 mock 데이터
const services = [
  {
    id: "01",
    title: "아파트 인테리어",
    description: "거주자의 라이프스타일에 맞춘 아파트 전체 리모델링. 공간 효율과 심미성을 동시에 잡습니다.",
    details: ["설계 및 3D 렌더링", "전체 철거 및 시공", "자재 및 가구 선정", "1년 무상 AS"],
    price: "평당 150만원~",
    image: "/images/services/apartment.jpg",
  },
  {
    id: "02",
    title: "상업공간 설계",
    description: "카페, 레스토랑, 사무실 등 브랜드 아이덴티티를 공간으로 구현합니다.",
    details: ["브랜드 컨셉 설계", "인허가 대행", "시공 전 과정 관리", "준공 후 사후관리"],
    price: "평당 200만원~",
    image: "/images/services/commercial.jpg",
  },
  {
    id: "03",
    title: "부분 시공",
    description: "주방, 욕실, 바닥 등 원하는 공간만 선택적으로 리뉴얼합니다.",
    details: ["주방 리모델링", "욕실 리모델링", "바닥재 교체", "도배 및 페인트"],
    price: "공간별 별도 견적",
    image: "/images/services/partial.jpg",
  },
  {
    id: "04",
    title: "3D 설계 상담",
    description: "시공 전 3D 렌더링으로 완성된 공간을 미리 확인할 수 있습니다.",
    details: ["현장 실측", "3D 렌더링 제공", "자재 샘플 제안", "무제한 수정"],
    price: "무료 (시공 계약 시)",
    image: "/images/services/consulting.jpg",
  },
];

export default function ServicesPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeId, setActiveId] = useState(services[0].id);

  const activeService = services.find((s) => s.id === activeId) ?? services[0];

  return (
    <section ref={ref} className="pt-28 md:pt-40 pb-20 md:pb-32">
      <Container>

        {/* 페이지 헤더 */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-sm tracking-widest uppercase text-black/40 mb-4">Services</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">서비스 소개</h1>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-16">

          {/* 왼쪽: 서비스 목록 */}
          <div className="md:w-3/5 flex flex-col divide-y divide-black/10">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className="py-12 md:py-16"
                onViewportEnter={() => setActiveId(service.id)}
                viewport={{ margin: "-45% 0px -45% 0px" }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* 모바일 전용 이미지 (호버가 없어서 각자 자기 사진을 인라인으로) */}
                <div className="md:hidden relative w-full aspect-[4/3] mb-8 overflow-hidden bg-black/5">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>

                <p className="text-sm text-black/30 mb-4">{service.id}</p>
                <h2 className="text-xl md:text-2xl font-light mb-4">{service.title}</h2>
                <p className="text-sm text-black/50 leading-relaxed mb-6">{service.description}</p>
                <p className="text-sm font-medium mb-8">{service.price}</p>

                <ul className="grid grid-cols-2 gap-4 mb-8">
                  {service.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-3 text-sm text-black/60">
                      {/* 구분선 */}
                      <span className="w-4 h-px bg-black/30 shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>

                <Button label="견적 문의" href="/contact" variant="secondary" />
              </motion.div>
            ))}
          </div>

          {/* 오른쪽: 스티키 이미지 (데스크톱 전용, 왼쪽 호버에 따라 전환) */}
          <div className="hidden md:block md:w-2/5">
            <div className="sticky top-32 relative aspect-[3/4] overflow-hidden bg-black/5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService.id}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeService.image}
                    alt={activeService.title}
                    fill
                    className="object-cover"
                    sizes="40vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* 텍스트 가독성을 위한 하단 그라데이션 */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

              {/* 현재 보고 있는 서비스 라벨 */}
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xs tracking-widest uppercase opacity-70 mb-1">{activeService.id}</p>
                <p className="text-lg font-light">{activeService.title}</p>
              </div>
            </div>
          </div>

        </div>

      </Container>
    </section>
  );
}
