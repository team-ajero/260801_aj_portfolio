"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion"; 
import { useRef } from "react";            

export default function AboutSection() {
  const ref = useRef(null);
  // once: true → 한 번 등장하면 다시 애니메이션 안 함
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 flex flex-col md:flex-row gap-20">

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
        <h2 className="text-4xl font-light leading-snug tracking-tight mb-8">
          공간을 바꾸면<br />일상이 달라집니다
        </h2>
        <p className="text-base text-black/50 leading-relaxed mb-6">
          저희는 단순한 시공을 넘어, 고객의 삶의 방식을 이해하고 
          그에 맞는 공간을 설계합니다. 15년간 500개 이상의 프로젝트를 
          통해 쌓은 노하우로 최적의 결과물을 만들어냅니다.
        </p>

        <div className="flex gap-12 mt-12">
          {[
            { number: "500+", label: "완료 프로젝트" },
            { number: "15Y", label: "시공 경력" },
            { number: "98%", label: "고객 만족도" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-light mb-1">{stat.number}</p>
              <p className="text-xs tracking-widest uppercase text-black/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}