"use client";

import { Heart } from "lucide-react";
import { toggleSavedItem } from "@/app/lib/actions/saved-items";
import { useOptimistic, startTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
      console.error("Failed to toggle saved item", error);
      startTransition(() => {
        setOptimisticIsSaved(isSaved);
      });
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleToggle}
      className="bg-white/70 backdrop-blur-md hover:bg-white/90 text-destructive rounded-full h-8 w-8"
      aria-label={optimisticIsSaved ? "Unsave" : "Save"}
    >
      <Heart className={`w-4 h-4 ${optimisticIsSaved ? "fill-current" : ""}`} />
    </Button>
  );
}
