"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Container } from "@/app/components/common/Container";
import { Card } from "@/app/components/ui/card";
import { AvatarPlaceholder } from "@/app/components/common/AvatarPlaceholder";
import Button from "@/app/components/common/Button";
import { aboutContent, teamMembers, companyHistory } from "@/lib/db/schema";

type AboutContent = typeof aboutContent.$inferSelect;
type TeamMember = typeof teamMembers.$inferSelect;
type CompanyHistory = typeof companyHistory.$inferSelect;

interface AboutPageProps {
  content: AboutContent | null;
  team: TeamMember[];
  history: CompanyHistory[];
}

export default function AboutPage({ content, team, history }: AboutPageProps) {
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
        <div className="flex flex-col md:flex-row md:items-center gap-16 mb-32">
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-sm tracking-widest uppercase text-black/40 mb-4">
              {content?.eyebrow ?? "Our Story"}
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light leading-snug tracking-tight mb-8 whitespace-pre-line">
              {content?.title ?? "공간을 바꾸면\n일상이 달라집니다"}
            </h2>
            <p className="text-base text-black/50 leading-relaxed mb-6">
              {content?.body ??
                "상담부터 설계, 시공, 준공 후 관리까지 전 과정을 체계적으로 진행합니다. 고객의 라이프스타일과 공간의 쓰임을 함께 고민하며, 신뢰할 수 있는 인테리어를 완성합니다."}
            </p>

            <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 mt-12">
              {(content?.stats ?? [
                { title: "체계적 프로세스", description: "상담부터 준공, 사후관리까지" },
                { title: "맞춤형 설계", description: "고객 라이프스타일에 맞춘 공간 설계" },
                { title: "꼼꼼한 시공관리", description: "전 과정 품질 점검" },
              ]).map((stat) => (
                <div key={stat.title} className="sm:flex-1">
                  <p className="text-base md:text-lg font-normal mb-1">{stat.title}</p>
                  <p className="text-xs text-black/40 leading-relaxed">{stat.description}</p>
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
            <div className="relative w-full aspect-[8/9] overflow-hidden bg-black/5">
              <Image
                src={content?.imageUrl ?? "/images/about/story.jpg"}
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
                  {/* 프로필 사진 (없으면 플레이스홀더) */}
                  <div className="relative w-full aspect-square bg-black/5 mb-6 overflow-hidden">
                    {member.imageUrl ? (
                      <Image src={member.imageUrl} alt={member.name} fill className="object-cover" />
                    ) : (
                      <AvatarPlaceholder />
                    )}
                  </div>
                  <p className="text-xs text-black/30 mb-2">{String(index + 1).padStart(2, "0")}</p>
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
                key={item.id}
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