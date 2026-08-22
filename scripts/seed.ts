/**
 * 최초 관리자 계정 + 기존 mock 데이터를 DB로 옮기는 시드 스크립트.
 * 실행: pnpm db:seed
 * 이미 데이터가 있으면 건드리지 않음(멱등) - 반복 실행해도 안전.
 */
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import { db } from "../lib/db";
import {
  user,
  account,
  heroContent,
  heroSlides,
  services,
  aboutContent,
  teamMembers,
  companyHistory,
  works,
  faqs,
  reviews,
} from "../lib/db/schema";

async function seedAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "changeme123!";
  const name = process.env.SEED_ADMIN_NAME || "관리자";

  const [existing] = await db.select().from(user).where(eq(user.email, email)).limit(1);
  if (existing) {
    console.log(`[seed] admin user already exists: ${email}`);
    return;
  }

  const userId = randomUUID();
  const now = new Date();

  await db.insert(user).values({
    id: userId,
    name,
    email,
    emailVerified: true,
    role: "admin",
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(account).values({
    id: randomUUID(),
    accountId: userId,
    providerId: "credential",
    issuer: "local:credential",
    userId,
    password: await hashPassword(password),
    createdAt: now,
    updatedAt: now,
  });

  console.log(`[seed] created admin user: ${email} / ${password} (로그인 후 비밀번호를 변경하세요)`);
}

async function seedHero() {
  const existing = await db.select().from(heroContent).limit(1);
  if (existing.length > 0) return;

  await db.insert(heroContent).values({
    eyebrow: "Interior Design Studio",
    headline: "공간이 말하는 당신의 이야기",
    description:
      "15년의 시공 경험으로 완성된 공간,\n고객의 라이프스타일에 맞는 인테리어를 제안합니다.",
    primaryCtaLabel: "시공사례 보기",
    primaryCtaHref: "/works",
    secondaryCtaLabel: "견적 문의",
    secondaryCtaHref: "/contact",
  });

  await db.insert(heroSlides).values([
    { imageUrl: "/images/hero/hero-bg.jpg", focus: "center 35%", order: 0 },
    { imageUrl: "/images/hero/hero-bg-2.jpg", focus: "center 45%", order: 1 },
    { imageUrl: "/images/hero/hero-bg-3.jpg", focus: "center 50%", order: 2 },
  ]);

  console.log("[seed] hero content + slides");
}

async function seedServices() {
  const existing = await db.select().from(services).limit(1);
  if (existing.length > 0) return;

  await db.insert(services).values([
    {
      title: "아파트 인테리어",
      description: "거주자의 라이프스타일에 맞춘 아파트 전체 리모델링. 공간 효율과 심미성을 동시에 잡습니다.",
      details: ["설계 및 3D 렌더링", "전체 철거 및 시공", "자재 및 가구 선정", "1년 무상 AS"],
      price: "평당 150만원~",
      imageUrl: "/images/services/apartment.jpg",
      order: 0,
    },
    {
      title: "상업공간 설계",
      description: "카페, 레스토랑, 사무실 등 브랜드 아이덴티티를 공간으로 구현합니다.",
      details: ["브랜드 컨셉 설계", "인허가 대행", "시공 전 과정 관리", "준공 후 사후관리"],
      price: "평당 200만원~",
      imageUrl: "/images/services/commercial.jpg",
      order: 1,
    },
    {
      title: "부분 시공",
      description: "주방, 욕실, 바닥 등 원하는 공간만 선택적으로 리뉴얼합니다.",
      details: ["주방 리모델링", "욕실 리모델링", "바닥재 교체", "도배 및 페인트"],
      price: "공간별 별도 견적",
      imageUrl: "/images/services/partial.jpg",
      order: 2,
    },
    {
      title: "3D 설계 상담",
      description: "시공 전 3D 렌더링으로 완성된 공간을 미리 확인할 수 있습니다.",
      details: ["현장 실측", "3D 렌더링 제공", "자재 샘플 제안", "무제한 수정"],
      price: "무료 (시공 계약 시)",
      imageUrl: "/images/services/consulting.jpg",
      order: 3,
    },
  ]);

  console.log("[seed] services");
}

async function seedAbout() {
  const existingContent = await db.select().from(aboutContent).limit(1);
  if (existingContent.length === 0) {
    await db.insert(aboutContent).values({
      eyebrow: "Our Story",
      title: "공간을 바꾸면\n일상이 달라집니다",
      body:
        "저희는 단순한 시공을 넘어, 고객의 라이프스타일을 이해하고 그에 맞는 공간을 설계합니다. 상담부터 준공 후 사후관리까지 전 과정을 직접 책임지며, 신뢰할 수 있는 파트너가 되고자 합니다.",
      imageUrl: "/images/about/story.jpg",
      stats: [
        { number: "500+", label: "완료 프로젝트" },
        { number: "15Y", label: "시공 경력" },
        { number: "98%", label: "고객 만족도" },
      ],
    });
    console.log("[seed] about content");
  }

  const existingTeam = await db.select().from(teamMembers).limit(1);
  if (existingTeam.length === 0) {
    await db.insert(teamMembers).values([
      { name: "김도윤", role: "대표 디자이너", order: 0 },
      { name: "이서연", role: "시공 총괄", order: 1 },
      { name: "박지훈", role: "설계 디자이너", order: 2 },
      { name: "최민아", role: "고객 상담", order: 3 },
    ]);
    console.log("[seed] team members");
  }

  const existingHistory = await db.select().from(companyHistory).limit(1);
  if (existingHistory.length === 0) {
    await db.insert(companyHistory).values([
      { year: "2024", event: "누적 시공 500건 돌파", order: 0 },
      { year: "2022", event: "상업공간 전담팀 신설", order: 1 },
      { year: "2019", event: "서울 강남 스튜디오 오픈", order: 2 },
      { year: "2011", event: "회사 설립", order: 3 },
    ]);
    console.log("[seed] company history");
  }
}

async function seedWorks() {
  const existing = await db.select().from(works).limit(1);
  if (existing.length > 0) return;

  await db.insert(works).values([
    { title: "강남 아파트", category: "아파트", area: "84㎡", year: "2024", imageUrl: "/images/works/gangnam-apt.jpg", order: 0 },
    { title: "성수 오피스", category: "상업공간", area: "120㎡", year: "2024", imageUrl: "/images/works/seongsu-office.jpg", order: 1 },
    { title: "마포 주택", category: "주택", area: "65㎡", year: "2023", imageUrl: "/images/works/mapo-house.jpg", order: 2 },
    { title: "서초 아파트", category: "아파트", area: "115㎡", year: "2023", imageUrl: "/images/works/seocho-apt.jpg", order: 3 },
    { title: "홍대 카페", category: "상업공간", area: "45㎡", year: "2023", imageUrl: "/images/works/hongdae-cafe.jpg", order: 4 },
    { title: "용산 주택", category: "주택", area: "90㎡", year: "2022", imageUrl: "/images/works/yongsan-house.jpg", order: 5 },
  ]);

  console.log("[seed] works");
}

async function seedFaqs() {
  const existing = await db.select().from(faqs).limit(1);
  if (existing.length > 0) return;

  await db.insert(faqs).values([
    { category: "견적/비용", question: "견적은 어떻게 산정되나요?", answer: "평수, 시공 범위, 자재 등급에 따라 산정돼요. 현장 실측 후 3D 렌더링과 함께 상세 견적서를 무료로 제공해드립니다.", order: 0 },
    { category: "견적/비용", question: "계약금은 얼마인가요?", answer: "총 공사비의 30%를 계약금으로, 중도금 40%, 잔금 30%로 나누어 진행하는 것이 기본이며 상황에 따라 조정 가능합니다.", order: 1 },
    { category: "시공기간", question: "시공 기간은 얼마나 걸리나요?", answer: "84㎡ 아파트 전체 리모델링 기준 평균 4~6주가 소요돼요. 부분 시공은 범위에 따라 1~2주 내외입니다.", order: 2 },
    { category: "진행절차", question: "상담부터 시공까지 절차가 어떻게 되나요?", answer: "상담 및 현장 방문 → 설계 및 견적 → 계약 및 자재 선정 → 시공 → 준공 및 사후관리 순으로 진행돼요. 각 단계마다 담당자가 배정되어 소통합니다.", order: 3 },
    { category: "진행절차", question: "자재는 직접 고를 수 있나요?", answer: "네, 계약 후 자재 선정 단계에서 다양한 샘플과 옵션을 제안해드리고 고객님이 직접 선택하실 수 있어요.", order: 4 },
    { category: "AS/보증", question: "시공 후 하자보수는 어떻게 되나요?", answer: "준공 후 1년간 무상 AS를 제공하며, 하자 발생 시 접수 후 빠르게 방문해 조치해드립니다.", order: 5 },
  ]);

  console.log("[seed] faqs");
}

async function seedReviews() {
  const existing = await db.select().from(reviews).limit(1);
  if (existing.length > 0) return;

  await db.insert(reviews).values([
    { name: "김O정", category: "아파트", area: "84㎡", rating: 5, content: "상담부터 시공까지 꼼꼼하게 챙겨주셔서 만족스러운 결과물을 받았어요. 특히 3D 렌더링으로 미리 확인할 수 있어서 좋았습니다.", status: "published" },
    { name: "이O수", category: "상업공간", area: "45㎡", rating: 5, content: "카페 인테리어를 맡겼는데 브랜드 컨셉을 정확히 이해하고 공간으로 풀어내주셨어요. 오픈 후 손님들 반응도 정말 좋습니다.", status: "published" },
    { name: "박O영", category: "주택", area: "65㎡", rating: 4, content: "전체적으로 만족스러웠고, 일정 공유도 매일 해주셔서 진행 상황을 확인하기 편했어요.", status: "published" },
    { name: "최O아", category: "아파트", area: "115㎡", rating: 5, content: "견적이 투명해서 좋았고, 자재 선정 단계에서 다양한 옵션을 제안해주셔서 취향에 맞는 공간을 만들 수 있었습니다.", status: "published" },
    { name: "정O민", category: "상업공간", area: "120㎡", rating: 5, content: "사무실 리모델링이었는데 인허가 대행까지 한번에 처리해주셔서 신경쓸 일이 없었어요. 추천합니다.", status: "published" },
    { name: "한O진", category: "주택", area: "90㎡", rating: 4, content: "부분 시공으로 주방만 진행했는데 기존 공간과의 조화까지 고려해주셔서 만족했습니다.", status: "published" },
  ]);

  console.log("[seed] reviews");
}

async function main() {
  await seedAdminUser();
  await seedHero();
  await seedServices();
  await seedAbout();
  await seedWorks();
  await seedFaqs();
  await seedReviews();
  console.log("[seed] done");
  process.exit(0);
}

main().catch((err) => {
  console.error("[seed] failed", err);
  process.exit(1);
});
