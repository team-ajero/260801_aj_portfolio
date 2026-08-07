import HeroSection from "@/app/components/sections/HeroSection";
import AboutSection from "@/app/components/sections/AboutSection";
import WorksSection from "@/app/components/sections/WorksSection";
import ServicesSection from "@/app/components/sections/ServicesSection";
import ProcessSection from "@/app/components/sections/ProcessSection";
import CTASection from "@/app/components/sections/CTASection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <WorksSection />
      <ServicesSection />
      <ProcessSection />
      <CTASection />
    </div>
  );
}