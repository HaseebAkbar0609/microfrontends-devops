import type { ReactNode } from "react";
import Image from "next/image";
import { Phone, Mail, Globe, Languages, Star, MessageSquare, MoreHorizontal } from "lucide-react";
import type { DiscountPartner } from "../types/types";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

interface DiscountPartnerCardProps {
	partner: DiscountPartner;
}

export function DiscountPartnerCard({ partner }: DiscountPartnerCardProps) {
	return (
		<div className="bg-white rounded-xl shadow-sm flex flex-col gap-6 overflow-hidden pt-6 px-6 pb-0">
			{/* Top section */}
			<div className="flex flex-col gap-3">
				{/* Avatar centered */}
				<div className="flex justify-center">
					<div className="relative">
						<div className="relative w-20 h-20 bg-[#E4E4E7] rounded-full flex items-center justify-center border border-[#E4E4E7] overflow-hidden">
							{partner.avatarUrl ? (
								<Image
									src={partner.avatarUrl}
									alt={partner.name}
									fill
									className="object-contain p-2"
								/>
							) : (
								<span className="text-[#111721] text-2xl font-bold leading-none">
									{partner.initials}
								</span>
							)}
						</div>
						{partner.isOnline && (
							<div className="absolute bottom-0 right-0 w-6 h-6 bg-[#00C950] rounded-full border-2 border-white" />
						)}
					</div>
				</div>

				{/* Status badges */}
				<div className="flex gap-1.5 flex-wrap justify-center">
					{partner.isVerified && (
						<span className="px-2 py-0.5 text-xs font-medium text-[#008236] bg-[#F0FDF4] border border-[#B9F8CF] rounded-lg">
							<Translate text={localizationConstants.supplierVerified} />
						</span>
					)}
					{partner.isTopSupplier && (
						<span className="px-2 py-0.5 text-xs font-medium text-[#FF8100] bg-[rgba(255,129,0,0.1)] border border-[rgba(255,129,0,0.2)] rounded-lg">
							<Translate text={localizationConstants.supplierTopSupplier} />
						</span>
					)}
				</div>

				{/* Name + category */}
				<div className="flex flex-col gap-1">
					<h2 className="text-xl font-semibold text-[#0A0A0A] tracking-tight leading-tight text-center">
						{partner.name}
					</h2>
					<p className="text-sm text-slate-500">
						{partner.category} • {partner.location}
					</p>
				</div>

				{/* Star rating */}
				<div className="flex items-center gap-1.5">
					<div className="flex items-center gap-0.5">
						{Array.from({ length: 5 }).map((_, i) => (
							<Star key={i} className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
						))}
					</div>
					<span className="text-sm font-semibold text-[#0A0A0A]">
						{partner.rating.toFixed(1)}
					</span>
					<span className="text-sm text-slate-500">
						({partner.reviewCount}{" "}
						<Translate text={localizationConstants.supplierReviewCount} />)
					</span>
				</div>

				{/* Action buttons */}
				<div className="flex gap-2 mt-2">
					<button className="flex-1 h-9 bg-white border border-black/10 rounded-lg text-sm font-medium text-[#0A0A0A] hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
						<MessageSquare className="w-4 h-4" />
						<Translate text={localizationConstants.supplierMessage} />
					</button>
					<button className="w-9 h-9 bg-white border border-black/10 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0">
						<MoreHorizontal className="w-4 h-4 text-[#0A0A0A]" />
					</button>
				</div>
			</div>

			{/* Contact info */}
			<div className="flex flex-col gap-3 border-t border-[#E2E8F0] pt-6.25 pb-6">
				<ContactRow
					icon={<Phone className="w-4.5 h-4.5 text-slate-400" />}
					label={localizationConstants.supplierLabelPhone}
					value={partner.phone}
				/>
				<ContactRow
					icon={<Mail className="w-4.5 h-4.5 text-slate-400" />}
					label={localizationConstants.supplierLabelEmail}
					value={partner.email}
				/>
				<ContactRow
					icon={<Globe className="w-4.5 h-4.5 text-slate-400" />}
					label={localizationConstants.supplierLabelWebsite}
					value={partner.website}
					isLink
				/>
				<ContactRow
					icon={<Languages className="w-4.5 h-4.5 text-slate-400" />}
					label={localizationConstants.supplierLabelLanguage}
					value={partner.languages}
				/>
				<ContactRow
					icon={<div className="w-4.5 h-4.5 rounded-full bg-[#00C950]" />}
					label={localizationConstants.supplierLabelAvailability}
					value={partner.lastActive}
				/>
			</div>
		</div>
	);
}

function ContactRow({
	icon,
	label,
	value,
	isLink = false,
}: {
	icon: ReactNode;
	label: string;
	value: string;
	isLink?: boolean;
}) {
	return (
		<div className="flex items-start gap-4.5">
			<div className="shrink-0 mt-0.5">{icon}</div>
			<div className="min-w-0">
				<p className="text-xs text-slate-500">
					<Translate text={label} />
				</p>
				{isLink ? (
					<a
						href={value.includes("://") ? value : `//${value}`}
						className="text-sm text-[#FF8100] hover:underline break-all"
						target="_blank"
						rel="noopener noreferrer"
					>
						{value}
					</a>
				) : (
					<p className="text-sm text-[#0A0A0A] break-all">{value}</p>
				)}
			</div>
		</div>
	);
}
