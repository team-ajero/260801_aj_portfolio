import ReviewsPage from "@/app/components/sections/ReviewsPage";
import { getPublishedReviews } from "@/lib/actions/reviews";

export default async function Reviews() {
    const reviews = await getPublishedReviews();

    return (
        <div>
            <ReviewsPage reviews={reviews} />
        </div>
    );
}
