"use client";

import { useState } from "react";
import { MessageSquare, ChevronUp, Star } from "lucide-react";
import Image from "next/image";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CompanyDetail, CompanyReview } from "../types/company";

function AccordionSection({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-2 text-slate-600">
          {icon}
          <span className="text-sm font-semibold text-zinc-900">{title}</span>
        </div>
        <ChevronUp
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${open ? "" : "rotate-180"}`}
          aria-hidden={true}
        />
      </button>
      {open && <div className="border-t border-slate-100 px-5 py-4">{children}</div>}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
          aria-hidden={true}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: CompanyReview }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/images/Avatar.svg"
            alt={review.reviewerName}
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full"
          />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-zinc-900">{review.reviewerName}</span>
            <StarRating rating={review.rating} />
          </div>
        </div>
        <span className="shrink-0 text-xs text-slate-400">{review.date}</span>
      </div>
      <p className="mt-3 text-sm text-zinc-700">{review.reviewText}</p>

      {review.companyReply && (
        <div className="mt-3 rounded-md bg-slate-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-slate-700 text-xs font-bold text-white">
                {review.companyReply.companyInitials}
              </div>
              <span className="text-xs font-semibold text-zinc-900">{review.companyReply.companyName}</span>
            </div>
            <span className="shrink-0 text-xs text-slate-400">{review.companyReply.date}</span>
          </div>
          <p className="mt-2 text-xs text-zinc-600">{review.companyReply.replyText}</p>
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
      <AccordionSection title={t(localizationConstants.b2bCompanyOmdomeSection)} icon={<MessageSquare size={18} />}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </AccordionSection>
    </div>
  );
}
