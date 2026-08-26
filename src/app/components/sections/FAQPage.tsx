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
import { faqs as faqsTable } from "@/lib/db/schema";

type Faq = typeof faqsTable.$inferSelect;

// 카테고리 필터 목록
const categories = ["전체", "견적/비용", "시공기간", "진행절차", "AS/보증"];

export default function FAQPage({ faqs }: { faqs: Faq[] }) {
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
                className="text-sm tracking-wide px-1.5 py-[3px] h-auto rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:opacity-100 opacity-30 hover:opacity-60 transition-opacity duration-300"
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
                  <AccordionItem key={faq.id} value={String(faq.id)} className="border-black/10">
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
