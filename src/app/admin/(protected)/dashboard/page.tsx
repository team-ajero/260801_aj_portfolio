import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { works, services, faqs, reviews, inquiries } from "@/lib/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

async function getStats() {
  const [worksCount] = await db.select({ value: count() }).from(works);
  const [servicesCount] = await db.select({ value: count() }).from(services);
  const [faqsCount] = await db.select({ value: count() }).from(faqs);
  const [pendingReviewsCount] = await db
    .select({ value: count() })
    .from(reviews)
    .where(eq(reviews.status, "pending"));
  const [newInquiriesCount] = await db
    .select({ value: count() })
    .from(inquiries)
    .where(eq(inquiries.status, "new"));

  return {
    works: worksCount.value,
    services: servicesCount.value,
    faqs: faqsCount.value,
    pendingReviews: pendingReviewsCount.value,
    newInquiries: newInquiriesCount.value,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "등록된 포트폴리오", value: stats.works, href: "/admin/works" },
    { label: "등록된 서비스", value: stats.services, href: "/admin/services" },
    { label: "등록된 FAQ", value: stats.faqs, href: "/admin/faq" },
    { label: "승인 대기 리뷰", value: stats.pendingReviews, href: "/admin/reviews" },
    { label: "신규 견적 문의", value: stats.newInquiries, href: "/admin/inquiries" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">대시보드</h1>
        <p className="text-sm text-muted-foreground mt-1">
          사이트 콘텐츠 현황을 한눈에 확인하세요.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal text-muted-foreground">
                  {card.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{card.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
