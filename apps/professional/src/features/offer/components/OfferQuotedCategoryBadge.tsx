"use client";

interface Props {
  category: string;
}

export function OfferQuotedCategoryBadge({ category }: Props) {
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
      {category}
    </span>
  );
}
