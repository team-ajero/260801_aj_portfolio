"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/app/components/ui/card";
import { Container } from "@/app/components/common/Container";
import { services as servicesTable } from "@/lib/db/schema";

type Service = typeof servicesTable.$inferSelect;

export default function ServicesSection({ services }: { services: Service[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 md:py-32  bg-black text-white">
      <Container>

        {/* 섹션 헤더 */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-sm tracking-widest uppercase text-white/40 mb-4">Services</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight">서비스 소개</h2>
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
                <p className="text-sm text-white/30 mb-6">{String(index + 1).padStart(2, "0")}</p>
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