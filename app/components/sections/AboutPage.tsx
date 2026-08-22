"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Container } from "@/app/components/common/Container";
import { Card } from "@/app/components/ui/card";
import { AvatarPlaceholder } from "@/app/components/common/AvatarPlaceholder";
import Button from "@/app/components/common/Button";

// 팀 멤버 mock 데이터
const team = [
  { id: "01", name: "김도윤", role: "대표 디자이너" },
  { id: "02", name: "이서연", role: "시공 총괄" },
  { id: "03", name: "박지훈", role: "설계 디자이너" },
  { id: "04", name: "최민아", role: "고객 상담" },
];

// 연혁 mock 데이터
const history = [
  { year: "2024", event: "누적 시공 500건 돌파" },
  { year: "2022", event: "상업공간 전담팀 신설" },
  { year: "2019", event: "서울 강남 스튜디오 오픈" },
  { year: "2011", event: "회사 설립" },
];

export default function AboutPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
          <p className="text-sm tracking-widest uppercase text-black/40 mb-4">Company</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">회사소개</h1>
        </motion.div>

        {/* 스토리 + 통계 */}
        <div className="flex flex-col md:flex-row gap-16 mb-32">
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-sm tracking-widest uppercase text-black/40 mb-4">Our Story</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light leading-snug tracking-tight mb-8">
              공간을 바꾸면<br />일상이 달라집니다
            </h2>
            <p className="text-base text-black/50 leading-relaxed mb-6">
              저희는 단순한 시공을 넘어, 고객의 라이프스타일을 이해하고
              그에 맞는 공간을 설계합니다. 상담부터 준공 후 사후관리까지
              전 과정을 직접 책임지며, 신뢰할 수 있는 파트너가 되고자 합니다.
            </p>

            <div className="flex gap-12 mt-12">
              {[
                { number: "500+", label: "완료 프로젝트" },
                { number: "15Y", label: "시공 경력" },
                { number: "98%", label: "고객 만족도" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl md:text-3xl font-light mb-1">{stat.number}</p>
                  <p className="text-xs tracking-widest uppercase text-black/40">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 스토리 대표 이미지 */}
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative w-full aspect-[4/5] overflow-hidden bg-black/5">
              <Image
                src="/images/about/story.jpg"
                alt="회사 소개 이미지"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>
        </div>

        {/* 팀 소개 */}
        <div className="mb-32">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-sm tracking-widest uppercase text-black/40 mb-4">Team</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight">함께하는 사람들</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/10">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="rounded-none border-none shadow-none bg-white p-10 gap-0 h-full">
                  {/* 프로필 사진 자리 (실제 팀원 사진 확보 시 Image로 교체) */}
                  <div className="w-full aspect-square bg-black/5 mb-6 overflow-hidden">
                    <AvatarPlaceholder />
                  </div>
                  <p className="text-xs text-black/30 mb-2">{member.id}</p>
                  <h3 className="text-lg font-light mb-1">{member.name}</h3>
                  <p className="text-sm text-black/50">{member.role}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 연혁 */}
        <div className="mb-32">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-sm tracking-widest uppercase text-black/40 mb-4">History</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight">걸어온 길</h2>
          </motion.div>

          <div className="flex flex-col divide-y divide-black/10">
            {history.map((item, index) => (
              <motion.div
                key={item.year}
                className="flex gap-12 py-8"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <p className="text-sm text-black/30 w-16 shrink-0 pt-1">{item.year}</p>
                <p className="text-base text-black/60">{item.event}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-black/50 mb-8">함께 만들어갈 공간이 궁금하신가요?</p>
          <Button label="견적 문의하기" href="/contact" variant="primary" />
        </motion.div>

      </Container>
    </section>
  );
}