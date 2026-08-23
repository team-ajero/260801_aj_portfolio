import HeroSection from "@/app/components/sections/HeroSection";
import AboutSection from "@/app/components/sections/AboutSection";
import WorksSection from "@/app/components/sections/WorksSection";
import ServicesSection from "@/app/components/sections/ServicesSection";
import ProcessSection from "@/app/components/sections/ProcessSection";
import CTASection from "@/app/components/sections/CTASection";
import { getHeroContent, getHeroSlides } from "@/lib/actions/hero";
import { getAboutContent } from "@/lib/actions/about";
import { getWorks } from "@/lib/actions/works";
import { getServices } from "@/lib/actions/services";

const FALLBACK_HERO = {
  eyebrow: "Interior Design Studio",
  headline: "공간이 말하는 당신의 이야기",
  description: "15년의 시공 경험으로 완성된 공간,\n고객의 라이프스타일에 맞는 인테리어를 제안합니다.",
  primaryCtaLabel: "시공사례 보기",
  primaryCtaHref: "/works",
  secondaryCtaLabel: "견적 문의",
  secondaryCtaHref: "/contact",
};

export default async function Home() {
  const [heroContent, heroSlides, aboutContent, works, services] = await Promise.all([
    getHeroContent(),
    getHeroSlides(),
    getAboutContent(),
    getWorks(),
    getServices(),
  ]);

  return (
    <div>
      <HeroSection
        {...(heroContent ?? FALLBACK_HERO)}
        slides={heroSlides.map((s) => ({ id: s.id, image: s.imageUrl, focus: s.focus }))}
      />
      <AboutSection content={aboutContent} />
      <WorksSection works={works.slice(0, 3)} />
      <ServicesSection services={services} />
      <ProcessSection />
      <CTASection />
    </div>
  );
}