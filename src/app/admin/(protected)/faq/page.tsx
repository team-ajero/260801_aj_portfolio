import { getFaqs } from "@/lib/actions/faqs";
import { FaqManager } from "./FaqManager";

export default async function AdminFaqPage() {
  const faqs = await getFaqs();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">FAQ</h1>
        <p className="text-sm text-muted-foreground mt-1">
          자주 묻는 질문을 등록·수정·삭제합니다.
        </p>
      </div>
      <FaqManager initialFaqs={faqs} />
    </div>
  );
}
