import Link from "next/link";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { Discount } from "../constants";

interface DiscountCardProps {
  discount: Discount;
}

export function DiscountCard({ discount }: DiscountCardProps) {
  return (
    <div className="relative w-[320px] rounded-[12px] border border-slate-200 bg-white p-3 flex flex-col gap-3">
      {/* Discount badge — absolute top-right, border-radius: 0 12px 0 12px */}
      <div className="absolute top-0 right-0 w-[93px] rounded-tr-[12px] rounded-bl-[12px] bg-[#FF8100] p-3 flex flex-col items-center">
        <span className="text-[30px] font-bold leading-9 text-white">
          {discount.discountPct}%
        </span>
        <span className="text-lg font-medium leading-7 text-white">
          <Translate text={localizationConstants.discountsOff} />
        </span>
      </div>

      {/* Thumbnail — 191×172px, leaves space for the 93px badge on the right */}
      <div className="h-[172px] w-[191px] flex-shrink-0 rounded-lg overflow-hidden bg-[#E2E8F0]">
        {discount.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={discount.thumbnailUrl}
            alt={discount.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Supplier logo */}
      {discount.logoUrl ? (
        <div className="h-[28px] flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={discount.logoUrl}
            alt={discount.supplier}
            className="max-h-[28px] w-auto object-contain"
          />
        </div>
      ) : (
        <div className="h-[26px] w-[138px] flex items-center justify-center rounded bg-slate-200 px-2">
          <span className="text-xs font-bold tracking-widest text-slate-500 uppercase select-none">
            {discount.supplier}
          </span>
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-800 leading-7">
        {discount.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-700 leading-5 flex-1">
        {discount.description}
      </p>

      {/* Button */}
      <Button asChild className="w-fit h-9 px-4 py-2 bg-[#F4F4F5] text-[#09090B] hover:bg-[#E4E4E7] shadow-sm border-0 text-sm font-medium rounded-[6px]">
        <Link href={`/discounts/${discount.id}`}>
          <Translate text={localizationConstants.discountsViewOffer} />
        </Link>
      </Button>
    </div>
  );
}
