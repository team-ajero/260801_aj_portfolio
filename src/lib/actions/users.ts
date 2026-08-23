"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { requireAdminRole } from "@/lib/auth-guard";

/** 관리자/직원 계정 관리 - admin role만 접근 가능 (공개 회원가입은 없음) */

export async function listAdminUsers() {
  await requireAdminRole();
  const result = await auth.api.listUsers({
    query: { sortBy: "createdAt", sortDirection: "desc", limit: 100 },
    headers: await headers(),
  });
  return result.users;
}

export interface CreateAdminUserInput {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

export async function createAdminUser(input: CreateAdminUserInput) {
  await requireAdminRole();
  await auth.api.createUser({
    body: {
      name: input.name,
      email: input.email,
      password: input.password,
      role: input.role,
    },
    headers: await headers(),
  });
  revalidatePath("/admin/users");
}

export async function setAdminUserRole(userId: string, role: "admin" | "user") {
  await requireAdminRole();
  await auth.api.setRole({
    body: { userId, role },
    headers: await headers(),
  });
  revalidatePath("/admin/users");
}

export async function banAdminUser(userId: string) {
  await requireAdminRole();
  await auth.api.banUser({
    body: { userId },
    headers: await headers(),
  });
  revalidatePath("/admin/users");
}

export async function unbanAdminUser(userId: string) {
  await requireAdminRole();
  await auth.api.unbanUser({
    body: { userId },
    headers: await headers(),
  });
  revalidatePath("/admin/users");
}

export async function removeAdminUser(userId: string) {
  const session = await requireAdminRole();
  if (session.user.id === userId) {
    throw new Error("본인 계정은 삭제할 수 없어요.");
  }
  await auth.api.removeUser({
    body: { userId },
    headers: await headers(),
  });
  revalidatePath("/admin/users");
}
