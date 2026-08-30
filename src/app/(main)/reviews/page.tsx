import ReviewsPage from "@/app/components/sections/ReviewsPage";
import { getPublishedReviews } from "@/lib/actions/reviews";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "고객후기",
  description:
    "실제 시공을 맡겨주신 고객들이 남긴 후기를 모았습니다. 상담부터 완공까지의 과정과 만족도를 확인해 보세요.",
  path: "/reviews",
});

export default async function Reviews() {
    const reviews = await getPublishedReviews();

    return (
        <div>
            <ReviewsPage reviews={reviews} />
        </div>
    );
}
