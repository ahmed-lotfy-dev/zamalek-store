"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { Star } from "lucide-react";
import { createReview } from "@/app/lib/actions/reviews";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({
  productId,
  onReviewSubmitted,
}: ReviewFormProps) {
  const t = useTranslations("Reviews");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error(t("selectRating"));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createReview(productId, rating, comment);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t("success"));
        setRating(0);
        setComment("");
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">{t("rating")}</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-colors"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`w-6 h-6 ${star <= (hoverRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/30"
                  }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="comment">{t("yourReview")}</Label>
        <Textarea
          id="comment"
          placeholder={t("placeholder")}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="min-h-[100px]"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || rating === 0}
      >
        {isSubmitting ? "Submitting..." : t("submit")}
      </Button>
    </form>
  );
}
