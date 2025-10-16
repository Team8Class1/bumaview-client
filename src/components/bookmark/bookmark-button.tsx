"use client";

import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useBookmarkStatus,
  useToggleBookmarkMutation,
} from "@/hooks/use-bookmark-queries";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  interviewId: number;
  className?: string;
  size?: "sm" | "icon" | "lg";
  variant?: "ghost" | "outline" | "default";
}

export function BookmarkButton({
  interviewId,
  className,
  size = "icon",
  variant = "ghost",
}: BookmarkButtonProps) {
  const { isBookmarked } = useBookmarkStatus(interviewId);
  const toggleBookmarkMutation = useToggleBookmarkMutation();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log(
      `🖱️ 북마크 버튼 클릭: interviewId=${interviewId}, 현재상태=${isBookmarked}`,
    );

    toggleBookmarkMutation.mutate(interviewId);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={toggleBookmarkMutation.isPending}
      className={cn(className)}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
    >
      <Bookmark
        className={cn(
          "h-5 w-5",
          isBookmarked ? "fill-primary text-primary" : "text-muted-foreground",
          toggleBookmarkMutation.isPending && "opacity-50",
        )}
      />
    </Button>
  );
}
