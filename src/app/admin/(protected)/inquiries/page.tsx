import { getInquiries } from "@/lib/actions/inquiries";
import { InquiriesManager } from "./InquiriesManager";

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">견적 문의</h1>
        <p className="text-sm text-muted-foreground mt-1">
          고객이 남긴 견적 문의를 조회·처리 상태 변경·삭제합니다.
        </p>
      </div>
      <InquiriesManager initialInquiries={inquiries} />
    </div>
  );
}
