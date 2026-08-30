"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/app/components/common/Container";
import { aboutContent } from "@/lib/db/schema";

type AboutContent = typeof aboutContent.$inferSelect;

const FALLBACK = {
  title: "공간을 바꾸면\n일상이 달라집니다",
  body: "상담부터 설계, 시공, 준공 후 관리까지 전 과정을 체계적으로 진행합니다. 고객의 라이프스타일과 공간의 쓰임을 함께 고민하며, 신뢰할 수 있는 인테리어를 완성합니다.",
  stats: [
    { title: "체계적 프로세스", description: "상담부터 준공, 사후관리까지" },
    { title: "맞춤형 설계", description: "고객 라이프스타일에 맞춘 공간 설계" },
    { title: "꼼꼼한 시공관리", description: "전 과정 품질 점검" },
  ],
};

export default function AboutSection({ content }: { content: AboutContent | null }) {
  const { title, body, stats } = content ?? FALLBACK;
  const ref = useRef(null);
  // once: true → 한 번 등장하면 다시 애니메이션 안 함
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 md:py-32">
      <Container className="flex flex-col md:flex-row gap-20">

        <motion.div
          className="md:w-1/3"
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-sm tracking-widest uppercase text-black/40">
            About
          </p>
        </motion.div>

        <motion.div
          className="md:w-2/3"
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light leading-snug tracking-tight mb-8 whitespace-pre-line">
            {title}
          </h2>
          <p className="text-base text-black/50 leading-relaxed mb-6">
            {body}
          </p>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 mt-12">
            {stats.map((stat) => (
              <div key={stat.title} className="sm:flex-1">
                <p className="text-base md:text-lg font-normal mb-1">{stat.title}</p>
                <p className="text-xs text-black/40 leading-relaxed">{stat.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}