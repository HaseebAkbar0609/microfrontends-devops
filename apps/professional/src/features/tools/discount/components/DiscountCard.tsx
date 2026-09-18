import Link from "next/link";
import { CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { formatValidityDate } from "../utils/discountDates";
import type { Discount } from "../types/discount.types";
import { DiscountStatusBadge } from "./DiscountStatusBadge";

interface DiscountCardProps {
	discount: Discount;
}

export function DiscountCard({ discount }: DiscountCardProps) {
	const validityKey =
		discount.status === "upcoming"
			? localizationConstants.discountsValidFrom
			: localizationConstants.discountsValidUntil;

	return (
		<article className="relative flex w-full max-w-[320px] flex-col gap-3 rounded-[12px] border border-slate-200 bg-white p-3 transition-shadow hover:shadow-md">
			{/* Discount badge — pinned to the top-right corner of the card */}
			<div className="absolute right-0 top-0 flex w-[93px] flex-col items-center rounded-bl-[12px] rounded-tr-[12px] bg-[#FF8100] p-3">
				<span className="text-[30px] font-bold leading-9 text-white">
					{discount.discountPct}%
				</span>
				<span className="text-lg font-medium leading-7 text-white">
					<Translate text={localizationConstants.discountsOff} />
				</span>
			</div>

			{/* Thumbnail — narrower than the card so it clears the badge */}
			<div className="h-[172px] w-[191px] flex-shrink-0 overflow-hidden rounded-lg bg-[#E2E8F0]">
				{discount.thumbnailUrl && (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={discount.thumbnailUrl}
						alt={discount.name}
						className="h-full w-full object-cover"
					/>
				)}
			</div>

			{/* Supplier logo, or the supplier name when no logo is supplied */}
			{discount.logoUrl ? (
				<div className="flex h-[28px] items-center">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={discount.logoUrl}
						alt={discount.supplier}
						className="max-h-[28px] w-auto object-contain"
					/>
				</div>
			) : (
				<div className="flex h-[26px] w-fit items-center justify-center rounded bg-slate-200 px-2">
					<span className="select-none text-xs font-bold uppercase tracking-widest text-slate-500">
						{discount.supplier}
					</span>
				</div>
			)}

			<div className="flex flex-wrap items-center gap-2">
				<DiscountStatusBadge status={discount.status} />
				<span className="text-xs font-medium text-slate-500">
					{discount.category}
				</span>
			</div>

			<h3 className="text-xl font-bold leading-7 text-slate-800">
				{discount.name}
			</h3>

			<p className="flex-1 text-sm leading-5 text-slate-700">
				{discount.description}
			</p>

			<div className="flex items-center gap-1.5 text-xs text-slate-500">
				<CalendarRange className="h-3.5 w-3.5 shrink-0" />
				<Translate
					text={validityKey}
					values={{
						from: formatValidityDate(discount.validFrom),
						to: formatValidityDate(discount.validTo),
					}}
				/>
			</div>

			<Button
				asChild
				className="h-9 w-fit rounded-[6px] border-0 bg-[#F4F4F5] px-4 py-2 text-sm font-medium text-[#09090B] shadow-sm hover:bg-[#E4E4E7]"
			>
				<Link href={`/tools/discount/${discount.partnerId}`}>
					<Translate text={localizationConstants.discountsViewOffer} />
				</Link>
			</Button>
		</article>
	);
}
