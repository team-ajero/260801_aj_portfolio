import { getAllReviews } from "@/lib/actions/reviews";
import { ReviewsManager } from "./ReviewsManager";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">고객후기</h1>
        <p className="text-sm text-muted-foreground mt-1">
          고객이 직접 남긴 후기를 승인·수정·삭제합니다. 승인 전까지는 사이트에 노출되지 않아요.
        </p>
      </div>
      <ReviewsManager initialReviews={reviews} />
    </div>
  );
}
