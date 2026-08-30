import ContactPage from "@/app/components/sections/ContactPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "견적 문의",
  description:
    "시공 범위와 예산, 일정에 맞춰 상담을 도와드립니다. 간단한 정보만 남기면 3D 설계 상담과 무료 견적 안내를 받아보실 수 있습니다.",
  path: "/contact",
});

export default function Contact() {
    return (
        <div>
            <ContactPage />
        </div>
    );
}
