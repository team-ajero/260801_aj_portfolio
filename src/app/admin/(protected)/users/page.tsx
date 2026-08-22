import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { listAdminUsers } from "@/lib/actions/users";
import { UsersManager } from "./UsersManager";

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user.role !== "admin") {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">관리자 계정</h1>
        <p className="text-sm text-muted-foreground">
          이 메뉴는 admin 권한 계정만 볼 수 있어요.
        </p>
      </div>
    );
  }

  const users = await listAdminUsers();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">관리자 계정</h1>
        <p className="text-sm text-muted-foreground mt-1">
          관리자/직원 계정을 추가하고 권한을 관리합니다. (공개 회원가입은 없어요)
        </p>
      </div>
      <UsersManager initialUsers={users} currentUserId={session.user.id} />
    </div>
  );
}
