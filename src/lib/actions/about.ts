"use server";

import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { aboutContent, teamMembers, companyHistory } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth-guard";

export async function getAboutContent() {
  const [row] = await db.select().from(aboutContent).limit(1);
  return row ?? null;
}

export async function getTeamMembers() {
  return db.select().from(teamMembers).orderBy(asc(teamMembers.order), asc(teamMembers.id));
}

export async function getCompanyHistory() {
  return db.select().from(companyHistory).orderBy(asc(companyHistory.order), asc(companyHistory.id));
}

export interface AboutContentInput {
  eyebrow: string;
  title: string;
  body: string;
  imageUrl: string;
  stats: { title: string; description: string }[];
}

export async function saveAboutContent(input: AboutContentInput) {
  await requireSession();
  const existing = await getAboutContent();

  if (existing) {
    await db
      .update(aboutContent)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(aboutContent.id, existing.id));
  } else {
    await db.insert(aboutContent).values(input);
  }

  revalidatePath("/admin/about");
  revalidatePath("/about");
}

export interface TeamMemberInput {
  name: string;
  role: string;
  imageUrl: string | null;
  order: number;
}

export async function createTeamMember(input: TeamMemberInput) {
  await requireSession();
  await db.insert(teamMembers).values(input);
  revalidatePath("/admin/about");
  revalidatePath("/about");
}

export async function updateTeamMember(id: number, input: TeamMemberInput) {
  await requireSession();
  await db.update(teamMembers).set(input).where(eq(teamMembers.id, id));
  revalidatePath("/admin/about");
  revalidatePath("/about");
}

export async function deleteTeamMember(id: number) {
  await requireSession();
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
  revalidatePath("/admin/about");
  revalidatePath("/about");
}

export interface CompanyHistoryInput {
  year: string;
  event: string;
  order: number;
}

export async function createCompanyHistory(input: CompanyHistoryInput) {
  await requireSession();
  await db.insert(companyHistory).values(input);
  revalidatePath("/admin/about");
  revalidatePath("/about");
}

export async function updateCompanyHistory(id: number, input: CompanyHistoryInput) {
  await requireSession();
  await db.update(companyHistory).set(input).where(eq(companyHistory.id, id));
  revalidatePath("/admin/about");
  revalidatePath("/about");
}

export async function deleteCompanyHistory(id: number) {
  await requireSession();
  await db.delete(companyHistory).where(eq(companyHistory.id, id));
  revalidatePath("/admin/about");
  revalidatePath("/about");
}
