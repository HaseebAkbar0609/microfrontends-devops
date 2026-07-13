"use client";

import { useState, useMemo } from "react";
import { Star, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type {
  SupplierReview,
  StarBreakdown,
  PopularTag,
} from "@/types/tools-suppliers";

type SortOption = "latest" | "highest";
type RatingFilter = 1 | 2 | 3 | 4 | 5 | null;

interface ReviewsTabProps {
  reviews: SupplierReview[];
  starBreakdown: StarBreakdown[];
  popularTags: PopularTag[];
}

export function ReviewsTab({
  reviews,
  starBreakdown,
  popularTags,
}: ReviewsTabProps) {
  const t = useTranslate();
  const [sort, setSort] = useState<SortOption>("latest");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const totalReviews = starBreakdown.reduce((sum, b) => sum + b.count, 0);

  const averageRating = useMemo(() => {
    if (totalReviews === 0) return "0.0";
    const totalStars = starBreakdown.reduce((sum, b) => sum + b.stars * b.count, 0);
    return (totalStars / totalReviews).toFixed(1);
  }, [starBreakdown, totalReviews]);

  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => (ratingFilter ? r.rating === ratingFilter : true))
      .filter((r) =>
        searchQuery
          ? r.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true,
      )
      .sort((a, b) =>
        sort === "highest" ? b.rating - a.rating : b.timestamp - a.timestamp,
      );
  }, [reviews, ratingFilter, searchQuery, sort]);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6">
      {/* Left column: filters + review list */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {/* Filter controls */}
        <div className="flex flex-col gap-3">
          {/* Sort + rating filter container */}
          <div className="flex flex-col gap-3">
            {/* Sort row */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm text-slate-500 shrink-0">
                {t(localizationConstants.supplierSortLabel)}
              </span>
              <Button
                variant={sort === "latest" ? "secondary" : "outline"}
                onClick={() => setSort("latest")}
                className={cn("h-8")}
              >
                {t(localizationConstants.supplierSortLatest)}
              </Button>
              <Button
                variant={sort === "highest" ? "secondary" : "outline"}
                onClick={() => setSort("highest")}
                className={cn("h-8")}
              >
                {t(localizationConstants.supplierSortHighestRating)}
              </Button>

              <div className="w-px h-6 bg-slate-200 mx-1 shrink-0" />
            </div>

            {/* Rating filter row */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm text-slate-500 shrink-0">
                {t(localizationConstants.supplierRatingFilterLabel)}
              </span>
              {([5, 4, 3, 2, 1] as const).map((star) => (
                <Button
                  key={star}
                  onClick={() =>
                    setRatingFilter(ratingFilter === star ? null : star)
                  }
                  className={cn(
                    "flex items-center gap-1 px-3 h-[31.5px] rounded-md text-[13px] font-medium leading-[19.5px] transition-colors",
                    ratingFilter === star
                      ? "bg-[#1E293B] text-white"
                      : "bg-[#F7F8FA] text-slate-500 hover:bg-slate-100",
                  )}
                >
                  {star}
                  <Star
                    className={cn(
                      "w-3 h-3",
                      ratingFilter === star
                        ? "fill-white text-white"
                        : "fill-[#FFB800] text-[#FFB800]",
                    )}
                  />
                </Button>
              ))}
            </div>
          </div>

          {/* Search input */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(
                localizationConstants.supplierSearchReviewsPlaceholder,
              )}
              className="w-full h-9 bg-[#F3F3F5] rounded-lg pl-9 pr-3 text-sm text-[#0A0A0A] placeholder:text-[#717182] border-0 outline-none focus:ring-2 focus:ring-slate-300 transition-shadow"
            />
          </div>
        </div>

        {/* Review cards */}
        <div className="flex flex-col gap-4">
          {filteredReviews.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              {t(localizationConstants.supplierNoReviewsFound)}
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className="border border-slate-200 rounded-lg p-5 flex gap-4 bg-white"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-[#E5E7EB] shrink-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-slate-600">
                    {review.initials}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-semibold text-[#0A0A0A] leading-6 tracking-tight">
                        {review.name}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({
                          length: 5,
                        }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3.5 h-3.5",
                              i < review.rating
                                ? "fill-[#FFB800] text-[#FFB800]"
                                : "fill-slate-200 text-slate-200",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[13px] text-slate-500 leading-[19.5px] shrink-0">
                      {review.date}
                    </span>
                  </div>

                  {/* Review text */}
                  <p className="text-sm text-slate-500 leading-[22.75px] tracking-tight">
                    {review.text}
                  </p>

                  {/* Tags */}
                  {review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {review.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs font-medium text-slate-500 bg-[#F7F8FA] border border-slate-200 rounded-lg leading-4"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right column: summary panel */}
      <div className="w-full lg:w-[320px] shrink-0 border border-slate-200 rounded-lg self-start bg-white">
        {/* Header */}
        <div className="px-6 pt-6 pb-0">
          <h3 className="text-base font-semibold text-[#0A0A0A] tracking-tight">
            {t(localizationConstants.supplierSummaryTitle)}
          </h3>
        </div>

        {/* Big rating display */}
        <div className="px-6 pt-5">
          <div className="bg-[#F7F8FA] rounded-lg px-5 pt-5 pb-4 flex flex-col items-center gap-2">
            <span className="text-[48px] font-bold text-[#0A0A0A] leading-[48px]">
              {averageRating}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => {
                const ratingVal = parseFloat(averageRating);
                const isFilled = ratingVal >= i + 1;
                const isPartial = !isFilled && ratingVal > i;
                const partialPercentage = isPartial
                  ? (ratingVal - i) * 100
                  : 0;

                return (
                  <span key={i} className="relative block w-[18px] h-[18px] shrink-0">
                    <Star
                      className={cn(
                        "w-[18px] h-[18px] text-[#FFB800] absolute inset-0",
                        isFilled ? "fill-[#FFB800]" : "fill-transparent",
                      )}
                    />
                    {isPartial && (
                      <span
                        className="absolute inset-y-0 left-0 overflow-hidden block"
                        style={{ width: `${partialPercentage}%` }}
                      >
                        <Star className="w-[18px] h-[18px] text-[#FFB800] fill-[#FFB800] absolute inset-0" />
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
            <span className="text-sm text-slate-500 tracking-tight">
              {t(localizationConstants.supplierTotalReviews, {
                count: totalReviews,
              })}
            </span>
          </div>
        </div>

        {/* Star breakdown bars */}
        <div className="px-6 pt-5 flex flex-col gap-3">
          {starBreakdown.map(({ stars, count, pct }) => (
            <div key={stars} className="flex items-center gap-3 h-5">
              <div className="flex items-center gap-1 w-[52px] shrink-0">
                <span className="text-[13px] font-medium text-[#0A0A0A] leading-[19.5px]">
                  {stars}
                </span>
                <Star className="w-3 h-3 fill-[#FFB800] text-[#FFB800]" />
              </div>
              <div className="flex-1 h-2 bg-[#F7F8FA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FFB800] rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[13px] text-slate-500 leading-[19.5px] w-7 text-right shrink-0">
                {count}
              </span>
            </div>
          ))}
        </div>

        {/* Separation line */}
        <div className="h-px bg-slate-200 mx-6 mt-3" />

        {/* Popular tags */}
        <div className="px-6 pt-5 pb-6 flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-[#0A0A0A] tracking-tight">
            {t(localizationConstants.supplierPopularTagsTitle)}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {popularTags.map(({ label, count, isPopular }) => (
              <span
                key={label}
                className={cn(
                  "px-2 py-0.5 text-xs font-medium rounded-lg leading-4",
                  isPopular
                    ? "bg-[rgba(255,129,0,0.1)] border border-[rgba(255,129,0,0.2)] text-[#FF8100]"
                    : "bg-[#F7F8FA] border border-slate-200 text-slate-500",
                )}
              >
                {label} ({count})
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
