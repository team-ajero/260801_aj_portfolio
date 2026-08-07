"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Button from "@/app/components/common/Button";

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-40 flex flex-col items-center text-center">

      {/* 섹션 라벨 */}
      <motion.p
        className="text-sm tracking-widest uppercase text-black/40 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Contact
      </motion.p>

      {/* 메인 카피 */}
      <motion.h2
        className="text-5xl font-light tracking-tight leading-tight mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
      >
        새로운 공간을<br />시작할 준비가 됐나요?
      </motion.h2>

      {/* 서브 카피 */}
      <motion.p
        className="text-base text-black/50 mb-12 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
      >
        무료 상담부터 시작하세요. 부담 없이 문의해 주세요.
      </motion.p>

      {/* CTA 버튼 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
      >
        <Button label="무료 견적 문의" href="/contact" variant="primary" />
      </motion.div>

    </section>
  );
}