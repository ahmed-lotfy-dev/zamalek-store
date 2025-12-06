import { Avatar } from "@heroui/avatar";
import { Progress } from "@heroui/progress";
import { Star } from "lucide-react";
import {
  getProductReviews,
  getProductRatingSummary,
} from "@/app/lib/actions/reviews";

interface ReviewListProps {
  productId: string;
}

export default async function ReviewList({ productId }: ReviewListProps) {
  const reviews = await getProductReviews(productId);
  const { averageRating, totalReviews } = await getProductRatingSummary(
    productId
  );

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="bg-default-50 p-6 rounded-lg border border-divider">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex gap-1 justify-center my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-default-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-default-500">
              {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
            </div>
          </div>

          <div className="flex-1 w-full space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter((r) => r.rating === rating).length;
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-12">
                    <span className="font-medium">{rating}</span>
                    <Star className="w-3 h-3 fill-default-500 text-default-500" />
                  </div>
                  <Progress
                    value={percentage}
                    color="primary"
                    size="sm"
                    className="flex-1"
                  />
                  <div className="w-12 text-right text-sm text-default-500">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-default-500">
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-divider pb-6 last:border-0"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={review.user.image || undefined}
                    name={review.user.name}
                    className="w-10 h-10"
                  />
                  <div>
                    <div className="font-semibold">{review.user.name}</div>
                    <div className="text-xs text-default-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-default-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-default-600 mt-2">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
