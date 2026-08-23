import { getWorks } from "@/lib/actions/works";
import { WorksManager } from "./WorksManager";

export default async function AdminWorksPage() {
  const works = await getWorks();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">포트폴리오</h1>
        <p className="text-sm text-muted-foreground mt-1">
          시공사례를 등록·수정·삭제합니다.
        </p>
      </div>
      <WorksManager initialWorks={works} />
    </div>
  );
}
