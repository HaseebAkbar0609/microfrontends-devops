"use client";

import { Star } from "lucide-react";

export function StarRating({
  rating,
  max = 5,
  filledClassName = "text-amber-500",
  emptyClassName = "text-slate-200",
  sizeClassName = "h-4 w-4",
}: {
  rating: number;
  max?: number;
  filledClassName?: string;
  emptyClassName?: string;
  sizeClassName?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, index) => {
        const isFilled = index < rating;
        return (
          <Star
            key={index}
            className={`${sizeClassName} ${isFilled ? filledClassName : emptyClassName}`}
            fill={isFilled ? "currentColor" : "none"}
          />
        );
      })}
    </div>
  );
}
