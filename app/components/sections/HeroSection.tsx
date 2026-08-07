"use client"; 

import { motion, Variants } from "framer-motion"; 
import Button from "@/app/components/common/Button";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 60, skewY: 3 },
  visible: {
    opacity: 1, 
    y: 0,
    skewY: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  const headline = ["공간이", "말하는", "당신의", "이야기"];
  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 60, skewY: 3 },
    visible: {
      opacity: 1,
      y: 0,
      skewY: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  return (
    // min-h-screen: 화면 전체 높이 / 수직 중앙 정렬
    <section className="min-h-screen flex flex-col justify-center pt-24">

      {/* 텍스트가 아래에서 위로 올라오며 등장하는 애니메이션 */}
      <motion.p
        className="text-sm tracking-widest uppercase text-black/40 mb-6"
        initial={{ opacity: 0 }}   // 시작: 투명 + 40px 아래
        animate={{ opacity: 1 }}    // 끝: 불투명 + 원위치
        transition={{ duration: 1, delay: 0.2 }}
      >
        Interior Design Studio
      </motion.p>

      <motion.h1
        className="text-6xl font-light leading-tight tracking-tight mb-8 flex flex-wrap gap-x-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >   
        {headline.map((word) => (
          <span key={word} className="overflow-hidden">
            <motion.span className="inline-block" variants={wordVariants}>
              {word}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      <motion.p
        className="text-base text-black/50 max-w-md mb-12 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
      >
        15년의 시공 경험으로 완성된 공간,<br />
        고객의 라이프스타일에 맞는 인테리어를 제안합니다.
      </motion.p>

      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1 }}
      >
        <Button label="시공사례 보기" href="/works" variant="primary" />
        <Button label="견적 문의" href="/contact" variant="secondary" />
      </motion.div>

    </section>
  );
}