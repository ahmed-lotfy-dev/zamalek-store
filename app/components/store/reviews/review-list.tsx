import { Star } from "lucide-react";
import {
  getProductReviews,
  getProductRatingSummary,
} from "@/app/lib/actions/reviews";
import { getTranslations } from "next-intl/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReviewListProps {
  productId: string;
}

export default async function ReviewList({ productId }: ReviewListProps) {
  const reviews = await getProductReviews(productId);
  const { averageRating, totalReviews } = await getProductRatingSummary(
    productId
  );
  const t = await getTranslations("Reviews");

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="bg-muted/30 p-6 rounded-lg border border-border">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex gap-1 justify-center my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= Math.round(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/30"
                    }`}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              {totalReviews} {totalReviews === 1 ? t("review") : t("reviews")}
            </div>
          </div>

          <div className="flex-1 w-full space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter((r) => r.rating === rating).length;
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-12 text-sm text-foreground">
                    <span className="font-medium">{rating}</span>
                    <Star className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-right text-sm text-muted-foreground">
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
          <div className="text-center py-8 text-muted-foreground">
            {t("noReviews")}
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-border pb-6 last:border-0"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border border-border">
                    <AvatarImage src={review.user.image || ""} alt={review.user.name} />
                    <AvatarFallback className="font-bold bg-muted text-muted-foreground">
                      {review.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{review.user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                        }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-foreground mt-2">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
