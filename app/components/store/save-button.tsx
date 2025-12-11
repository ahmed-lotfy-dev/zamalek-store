"use client";

import { Button } from "@heroui/button";
import { Heart } from "lucide-react";
import { toggleSavedItem } from "@/app/lib/actions/saved-items";
import { useOptimistic, startTransition } from "react";
import { useRouter } from "next/navigation";

interface SaveButtonProps {
  productId: string;
  isSaved: boolean;
}

export default function SaveButton({ productId, isSaved }: SaveButtonProps) {
  const router = useRouter();
  const [optimisticIsSaved, setOptimisticIsSaved] = useOptimistic(
    isSaved,
    (state, newIsSaved: boolean) => newIsSaved
  );

  const handleToggle = async () => {
    startTransition(() => {
      setOptimisticIsSaved(!optimisticIsSaved);
    });

    try {
      await toggleSavedItem(productId);
      router.refresh();
    } catch (error) {
      // Revert on error (optional, but optimistic UI usually assumes success)
      console.error("Failed to toggle saved item", error);
      startTransition(() => {
        setOptimisticIsSaved(isSaved);
      });
    }
  };

  return (
    <Button
      isIconOnly
      onPress={handleToggle}
      className="bg-white/70 backdrop-blur-md hover:bg-white/90 text-danger"
      aria-label={optimisticIsSaved ? "Unsave" : "Save"}
    >
      <Heart className={`w-5 h-5 ${optimisticIsSaved ? "fill-current" : ""}`} />
    </Button>
  );
}
