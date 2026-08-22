"use server";

import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth-guard";

export async function getServices() {
  return db.select().from(services).orderBy(asc(services.order), asc(services.id));
}

export interface ServiceInput {
  title: string;
  description: string;
  details: string[];
  price: string;
  imageUrl: string;
  order: number;
}

export async function createService(input: ServiceInput) {
  await requireSession();
  await db.insert(services).values(input);
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/"); // 홈 서비스 티저도 같은 테이블을 보여주므로 함께 갱신
}

export async function updateService(id: number, input: ServiceInput) {
  await requireSession();
  await db
    .update(services)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(services.id, id));
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/"); // 홈 서비스 티저도 같은 테이블을 보여주므로 함께 갱신
}

export async function deleteService(id: number) {
  await requireSession();
  await db.delete(services).where(eq(services.id, id));
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/"); // 홈 서비스 티저도 같은 테이블을 보여주므로 함께 갱신
}
