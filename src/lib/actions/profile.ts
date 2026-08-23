"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { requireSession } from "@/lib/auth-guard";

/** 마이페이지 - 로그인한 본인의 정보/비밀번호 관리 (role 무관, 본인만) */

export interface UpdateMyProfileInput {
  name: string;
  image?: string | null;
}

export async function updateMyProfile(input: UpdateMyProfileInput) {
  await requireSession();
  await auth.api.updateUser({
    body: {
      name: input.name,
      image: input.image ?? undefined,
    },
    headers: await headers(),
  });
  revalidatePath("/admin", "layout");
}

export interface ChangeMyPasswordInput {
  currentPassword: string;
  newPassword: string;
}

export async function changeMyPassword(input: ChangeMyPasswordInput) {
  await requireSession();
  await auth.api.changePassword({
    body: {
      currentPassword: input.currentPassword,
      newPassword: input.newPassword,
      revokeOtherSessions: true,
    },
    headers: await headers(),
  });
}
