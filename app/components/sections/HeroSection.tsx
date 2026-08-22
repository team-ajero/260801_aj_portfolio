"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/app/components/common/Button";
import { Container } from "@/app/components/common/Container";

// 롤링 배너 슬라이드 (5초마다 자동 전환). focus는 사진마다 핵심 피사체 위치가 달라서 개별 지정
const slides = [
  { id: 1, image: "/images/hero/hero-bg.jpg", focus: "center 35%" },
  { id: 2, image: "/images/hero/hero-bg-2.jpg", focus: "center 45%" },
  { id: 3, image: "/images/hero/hero-bg-3.jpg", focus: "center 50%" },
];

const AUTO_ROTATE_MS = 5000;

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

  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent((index + slides.length) % slides.length);
  }, []);

  // 5초마다 자동으로 다음 슬라이드로 전환
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    // min-h-screen: 화면 전체 높이 / 수직 중앙 정렬
    <section className="relative min-h-screen flex flex-col justify-center pt-24 overflow-hidden">

      {/* 배경 이미지 롤링 배너 (크로스페이드) */}
      <div className="absolute inset-0 -z-10">
        <AnimatePresence>
          <motion.div
            key={slides[current].id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            {/* 확대 애니메이션은 별도 레이어에 적용 (페이드와 스케일 타이밍이 달라서 분리) */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: AUTO_ROTATE_MS / 1000 + 1, ease: "linear" }}
            >
              <Image
                src={slides[current].image}
                alt=""
                fill
                priority={current === 0}
                className="object-cover"
                style={{ objectPosition: slides[current].focus }}
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* 슬라이드 인디케이터 (얇은 숫자 카운터, 좌측 하단) */}
      <div className="absolute bottom-10 left-6 md:left-10 lg:left-24 z-10 flex items-center gap-3 text-white/60">
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          aria-label="이전 이미지"
          className="hover:text-white transition-colors duration-300"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm tracking-widest tabular-nums">
          {String(current + 1).padStart(2, "0")} — {String(slides.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => goTo(current + 1)}
          aria-label="다음 이미지"
          className="hover:text-white transition-colors duration-300"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <Container>

        {/* 텍스트가 아래에서 위로 올라오며 등장하는 애니메이션 */}
        <motion.p
          className="text-sm tracking-widest uppercase text-white/60 mb-6"
          initial={{ opacity: 0 }}   // 시작: 투명
          animate={{ opacity: 1 }}    // 끝: 불투명
          transition={{ duration: 1, delay: 0.2 }}
        >
          Interior Design Studio
        </motion.p>

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight mb-8 flex flex-wrap gap-x-4 text-white"
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
          className="text-base text-white/70 max-w-md mb-12 leading-relaxed"
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
          <Button
            label="견적 문의"
            href="/contact"
            variant="secondary"
            className="bg-transparent border-white text-white hover:bg-white hover:text-black"
          />
        </motion.div>
      </Container>

      {/* 스크롤 안내 (중앙 하단) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <div className="w-px h-10 bg-white/25 relative overflow-hidden">
          <motion.span
            className="absolute left-0 top-0 w-px h-3 bg-white"
            animate={{ y: [0, 28, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <span className="text-[10px] tracking-widest uppercase text-white/60">Scroll</span>
      </div>
    </section>
  );
}