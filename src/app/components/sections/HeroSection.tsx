"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/app/components/common/Button";
import { Container } from "@/app/components/common/Container";

const AUTO_ROTATE_MS = 5000;

export interface HeroSectionProps {
  slides: { id: number; image: string; focus: string }[];
  eyebrow: string;
  headline: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

export default function HeroSection({
  slides,
  eyebrow,
  headline,
  description,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: HeroSectionProps) {
  const headlineWords = headline.split(" ");
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

  // 관리자에서 슬라이드를 모두 지운 직후처럼 빈 배열이 들어올 수 있으니 방어
  if (slides.length === 0) {
    return (
      <section className="relative min-h-screen flex flex-col justify-center pt-24 bg-black">
        <Container>
          <p className="text-white/60 text-sm">
            관리자 &gt; 메인 페이지에서 배경 이미지를 등록해주세요.
          </p>
        </Container>
      </section>
    );
  }

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
          {eyebrow}
        </motion.p>

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight mb-8 flex flex-wrap gap-x-4 text-white"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {headlineWords.map((word, i) => (
            <span key={`${word}-${i}`} className="overflow-hidden">
              <motion.span className="inline-block" variants={wordVariants}>
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          className="text-base text-white/70 max-w-md mb-12 leading-relaxed whitespace-pre-line"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          {description}
        </motion.p>

        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
        >
          {/* 시공사례 보기: 검정 채움 / 견적 문의: 흰색 채움 */}
          <Button label={primaryCtaLabel} href={primaryCtaHref} variant="primary" />
          <Button
            label={secondaryCtaLabel}
            href={secondaryCtaHref}
            variant="secondary"
            className="bg-white border-white text-black hover:bg-white/90"
          />
        </motion.div>
      </Container>

      {/* 스크롤 안내 (중앙 하단, 모바일에서는 공간이 좁아 숨김) */}
      <div className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-3">
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