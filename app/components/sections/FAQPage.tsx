"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { Container } from "@/app/components/common/Container";
import Button from "@/app/components/common/Button";

// 카테고리 필터 목록
const categories = ["전체", "견적/비용", "시공기간", "진행절차", "AS/보증"];

// FAQ mock 데이터
const faqs = [
  {
    id: "01",
    category: "견적/비용",
    question: "견적은 어떻게 산정되나요?",
    answer: "평수, 시공 범위, 자재 등급에 따라 산정돼요. 현장 실측 후 3D 렌더링과 함께 상세 견적서를 무료로 제공해드립니다.",
  },
  {
    id: "02",
    category: "견적/비용",
    question: "계약금은 얼마인가요?",
    answer: "총 공사비의 30%를 계약금으로, 중도금 40%, 잔금 30%로 나누어 진행하는 것이 기본이며 상황에 따라 조정 가능합니다.",
  },
  {
    id: "03",
    category: "시공기간",
    question: "시공 기간은 얼마나 걸리나요?",
    answer: "84㎡ 아파트 전체 리모델링 기준 평균 4~6주가 소요돼요. 부분 시공은 범위에 따라 1~2주 내외입니다.",
  },
  {
    id: "04",
    category: "진행절차",
    question: "상담부터 시공까지 절차가 어떻게 되나요?",
    answer: "상담 및 현장 방문 → 설계 및 견적 → 계약 및 자재 선정 → 시공 → 준공 및 사후관리 순으로 진행돼요. 각 단계마다 담당자가 배정되어 소통합니다.",
  },
  {
    id: "05",
    category: "진행절차",
    question: "자재는 직접 고를 수 있나요?",
    answer: "네, 계약 후 자재 선정 단계에서 다양한 샘플과 옵션을 제안해드리고 고객님이 직접 선택하실 수 있어요.",
  },
  {
    id: "06",
    category: "AS/보증",
    question: "시공 후 하자보수는 어떻게 되나요?",
    answer: "준공 후 1년간 무상 AS를 제공하며, 하자 발생 시 접수 후 빠르게 방문해 조치해드립니다.",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("전체");

  const filtered = activeCategory === "전체"
    ? faqs
    : faqs.filter((f) => f.category === activeCategory);

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
          <p className="text-sm tracking-widest uppercase text-black/40 mb-4">FAQ</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">자주 묻는 질문</h1>
        </motion.div>

        {/* 카테고리 필터 */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="bg-transparent p-0 h-auto gap-6 justify-start flex-wrap">
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

          <TabsContent value={activeCategory} className="mt-8 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Accordion type="single" collapsible className="flex flex-col">
                {filtered.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border-black/10">
                    <AccordionTrigger className="py-6 text-base md:text-lg font-light hover:no-underline [&>svg]:text-black/40">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-black/50 leading-relaxed pb-8">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-black/50 mb-8">더 궁금한 점이 있으신가요?</p>
          <Button label="견적 문의하기" href="/contact" variant="primary" />
        </motion.div>

      </Container>
    </section>
  );
}
