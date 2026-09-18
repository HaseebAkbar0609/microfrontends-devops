import Image from "next/image";
import {
	Globe,
	Languages,
	Mail,
	MessageSquare,
	MoreHorizontal,
	Phone,
	Star,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { DiscountPartner } from "../types/discount.types";
import { DiscountContactRow } from "./DiscountContactRow";

interface DiscountPartnerCardProps {
	partner: DiscountPartner;
	/** Placeholder handlers until the messaging module is wired up (TFS-1044). */
	onMessage?: () => void;
	onMoreActions?: () => void;
}

const RATING_STARS = 5;

export function DiscountPartnerCard({
	partner,
	onMessage,
	onMoreActions,
}: DiscountPartnerCardProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-col gap-6 overflow-hidden rounded-xl bg-white px-6 pb-0 pt-6 shadow-sm">
			<div className="flex flex-col gap-3">
				<div className="flex justify-center">
					<div className="relative">
						<div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[#E4E4E7] bg-[#E4E4E7]">
							{partner.avatarUrl ? (
								<Image
									src={partner.avatarUrl}
									alt={partner.name}
									fill
									className="object-contain p-2"
								/>
							) : (
								<span className="text-2xl font-bold leading-none text-[#111721]">
									{partner.initials}
								</span>
							)}
						</div>
						{partner.isOnline && (
							<div className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-white bg-[#00C950]" />
						)}
					</div>
				</div>

				<div className="flex flex-wrap justify-center gap-1.5">
					{partner.isVerified && (
						<span className="rounded-lg border border-[#B9F8CF] bg-[#F0FDF4] px-2 py-0.5 text-xs font-medium text-[#008236]">
							<Translate text={localizationConstants.discountPartnerVerified} />
						</span>
					)}
					{partner.isTopSupplier && (
						<span className="rounded-lg border border-[rgba(255,129,0,0.2)] bg-[rgba(255,129,0,0.1)] px-2 py-0.5 text-xs font-medium text-[#FF8100]">
							<Translate
								text={localizationConstants.discountPartnerTopSupplier}
							/>
						</span>
					)}
				</div>

				<div className="flex flex-col gap-1">
					<h2 className="text-center text-xl font-semibold leading-tight tracking-tight text-[#0A0A0A]">
						{partner.name}
					</h2>
					<p className="text-sm text-slate-500">
						{[partner.category, partner.location].filter(Boolean).join(" • ")}
					</p>
				</div>

				<div className="flex items-center gap-1.5">
					<div className="flex items-center gap-0.5">
						{Array.from({ length: RATING_STARS }).map((_, index) => (
							<Star
								key={index}
								className="h-4 w-4 fill-[#FFB800] text-[#FFB800]"
							/>
						))}
					</div>
					<span className="text-sm font-semibold text-[#0A0A0A]">
						{(partner.rating ?? 0).toFixed(1)}
					</span>
					<span className="text-sm text-slate-500">
						({partner.reviewCount ?? 0}{" "}
						<Translate
							text={localizationConstants.discountPartnerReviewCount}
						/>
						)
					</span>
				</div>

				<div className="mt-2 flex gap-2">
					<button
						type="button"
						onClick={onMessage}
						className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-black/10 bg-white text-sm font-medium text-[#0A0A0A] transition-colors hover:bg-slate-50"
					>
						<MessageSquare className="h-4 w-4" />
						<Translate text={localizationConstants.discountPartnerMessage} />
					</button>
					<button
						type="button"
						onClick={onMoreActions}
						aria-label={t(localizationConstants.discountPartnerMoreActions)}
						className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white transition-colors hover:bg-slate-50"
					>
						<MoreHorizontal className="h-4 w-4 text-[#0A0A0A]" />
					</button>
				</div>
			</div>

			<div className="flex flex-col gap-3 border-t border-[#E2E8F0] pb-6 pt-6">
				<DiscountContactRow
					icon={<Phone className="h-4.5 w-4.5 text-slate-400" />}
					label={localizationConstants.discountPartnerLabelPhone}
					value={partner.phone}
				/>
				<DiscountContactRow
					icon={<Mail className="h-4.5 w-4.5 text-slate-400" />}
					label={localizationConstants.discountPartnerLabelEmail}
					value={partner.email}
				/>
				<DiscountContactRow
					icon={<Globe className="h-4.5 w-4.5 text-slate-400" />}
					label={localizationConstants.discountPartnerLabelWebsite}
					value={partner.website}
					isLink
				/>
				<DiscountContactRow
					icon={<Languages className="h-4.5 w-4.5 text-slate-400" />}
					label={localizationConstants.discountPartnerLabelLanguage}
					value={partner.languages}
				/>
				<DiscountContactRow
					icon={<div className="h-4.5 w-4.5 rounded-full bg-[#00C950]" />}
					label={localizationConstants.discountPartnerLabelAvailability}
					value={partner.lastActive}
				/>
			</div>
		</div>
	);
}
