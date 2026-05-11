"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { StarRating } from "@/components/common/StarRating";
import { referenceReviewCards } from "@/features/leads/management/constants/quoteReferencesTab";
import Image from "next/image";
export function QuoteReferencesReviewSection() {
  return (
    <div className="space-y-4">
      <div className="text-xl font-semibold text-slate-900">
        <Translate text={localizationConstants.customerReviewTitle} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {referenceReviewCards.map((card) => (
          <div
            key={card.id}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full border border-slate-200">
                <Image
                height={100}
                width={100}
                  src={card.avatar}
                  alt={card.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {card.name}
                </div>
                <div className="text-sm text-slate-500">
                  <Translate text={card.textKey} />
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <StarRating
                rating={card.rating}
                filledClassName="text-amber-500"
                emptyClassName="text-slate-200"
              />
              <div className="text-xs text-slate-400">
                <Translate text={card.memberSinceKey} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
