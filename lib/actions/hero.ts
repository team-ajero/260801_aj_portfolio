"use server";

import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { heroContent, heroSlides } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth-guard";

export async function getHeroContent() {
  const [row] = await db.select().from(heroContent).limit(1);
  return row ?? null;
}

export async function getHeroSlides() {
  return db.select().from(heroSlides).orderBy(asc(heroSlides.order), asc(heroSlides.id));
}

export interface HeroContentInput {
  eyebrow: string;
  headline: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

/** 싱글턴 - 있으면 update, 없으면 insert */
export async function saveHeroContent(input: HeroContentInput) {
  await requireSession();
  const existing = await getHeroContent();

  if (existing) {
    await db
      .update(heroContent)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(heroContent.id, existing.id));
  } else {
    await db.insert(heroContent).values(input);
  }

  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export interface HeroSlideInput {
  imageUrl: string;
  focus: string;
  order: number;
}

export async function createHeroSlide(input: HeroSlideInput) {
  await requireSession();
  await db.insert(heroSlides).values(input);
  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export async function updateHeroSlide(id: number, input: HeroSlideInput) {
  await requireSession();
  await db.update(heroSlides).set(input).where(eq(heroSlides.id, id));
  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export async function deleteHeroSlide(id: number) {
  await requireSession();
  await db.delete(heroSlides).where(eq(heroSlides.id, id));
  revalidatePath("/admin/hero");
  revalidatePath("/");
}
