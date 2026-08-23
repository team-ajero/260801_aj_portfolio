import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ProfileManager } from "./ProfileManager";

export default async function AdminProfilePage() {
  // AdminLayout에서 이미 세션을 검증하지만, role/최신 사용자 정보를 함께 내려주기 위해 다시 조회한다.
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">마이페이지</h1>
        <p className="text-sm text-muted-foreground mt-1">
          내 정보와 비밀번호를 관리합니다.
        </p>
      </div>
      <ProfileManager user={session!.user} />
    </div>
  );
}
