import { getAboutContent, getTeamMembers, getCompanyHistory } from "@/lib/actions/about";
import { AboutManager } from "./AboutManager";

export default async function AdminAboutPage() {
  const [content, team, history] = await Promise.all([
    getAboutContent(),
    getTeamMembers(),
    getCompanyHistory(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">회사소개</h1>
        <p className="text-sm text-muted-foreground mt-1">
          스토리, 팀 소개, 연혁을 관리합니다.
        </p>
      </div>
      <AboutManager initialContent={content} initialTeam={team} initialHistory={history} />
    </div>
  );
}
