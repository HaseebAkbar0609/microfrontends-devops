"use client";

import { MessagesSquare, Star } from "lucide-react";
import Image from "next/image";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CompanyDetail, CompanyReview } from "../types/company";
import { CompanyAccordionSection } from "./CompanyAccordionSection";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={20}
          className={
            star <= rating
              ? "fill-amber-500 text-amber-500"
              : "stroke-slate-300 text-transparent"
          }
          aria-hidden={true}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: CompanyReview }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs">
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Image
            src={review.reviewerAvatar || "/assets/images/Avatar.svg"}
            alt={review.reviewerName}
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <span className="font-sans text-sm font-semibold leading-5 tracking-normal text-slate-900">
            {review.reviewerName}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating rating={review.rating} />
          <span className="font-sans text-xs font-normal leading-4 tracking-normal text-right text-slate-500">
            {review.date}
          </span>
        </div>
      </div>

      {/* Review content */}
      <p className="mt-3 font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]">
        {review.reviewText}
      </p>

      {/* Company Reply (if any) */}
      {review.companyReply && (
        <div className="mt-4 border-t border-[#E5E5E5] pt-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F4F5] font-sans text-xs font-semibold text-slate-700 shrink-0">
                {review.companyReply.companyInitials}
              </span>
              <span className="font-sans text-sm font-semibold leading-5 tracking-normal text-slate-900">
                {review.companyReply.companyName}
              </span>
            </div>
            <span className="shrink-0 font-sans text-xs font-normal leading-4 tracking-normal text-right text-slate-500">
              {review.companyReply.date}
            </span>
          </div>
          <p className="mt-2 font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]">
            {review.companyReply.replyText}
          </p>
        </div>
      )}
    </div>
  );
}

interface Props {
  data: CompanyDetail;
}

export function CompanyOmdomeTab({ data }: Props) {
  const t = useTranslate();

  return (
    <div className="space-y-4">
      <CompanyAccordionSection
        title={t(localizationConstants.b2bCompanyOmdomeSection)}
        icon={<MessagesSquare className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </CompanyAccordionSection>
    </div>
  );
}
