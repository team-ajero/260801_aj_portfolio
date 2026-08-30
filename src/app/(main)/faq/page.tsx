import FAQPage from "@/app/components/sections/FAQPage";
import { getFaqs } from "@/lib/actions/faqs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "자주 묻는 질문",
  description:
    "견적, 시공 기간, 자재 선택, A/S 등 인테리어 상담 전 궁금한 점을 자주 묻는 질문으로 정리했습니다.",
  path: "/faq",
});

export default async function FAQ() {
    const faqs = await getFaqs();

    return (
        <div>
            <FAQPage faqs={faqs} />
        </div>
    );
}
