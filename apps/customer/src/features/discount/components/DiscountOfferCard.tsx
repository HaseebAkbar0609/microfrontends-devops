"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { TicketPercent, BadgePercent, Check } from "lucide-react";
import type { DiscountOffer } from "../types/types";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

interface DiscountOfferCardProps {
	offer: DiscountOffer;
}

export function DiscountOfferCard({ offer }: DiscountOfferCardProps) {
	const images = offer.galleryImages ?? [];
	const [copied, setCopied] = useState(false);
	const hasDiscountCode = Boolean(offer.discountCode && offer.discountCode.trim());
	const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
		};
	}, []);

	const handleCopy = async () => {
		if (!hasDiscountCode || !offer.discountCode) return;
		try {
			await navigator.clipboard.writeText(offer.discountCode);
			setCopied(true);
			if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
			copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
		} catch {
			// Fallback if clipboard API fails
		}
	};

	return (
		<div className="border border-[#E2E8F0] rounded-lg p-5 flex flex-col gap-4 bg-white">
			{/* Header: title left, category tag right */}
			<div className="flex items-center justify-between gap-2">
				<h3 className="text-xl font-semibold text-[#0A0A0A] leading-6 tracking-tight">
					{offer.title}
				</h3>
				<span className="text-sm font-medium text-[#FF8100] shrink-0">
					{offer.categoryTag}
				</span>
			</div>

			{/* Content row: large image | small grid | description + code */}
			<div className="flex gap-3 items-start">
				{/* Large image */}
				<div className="relative w-35.5 h-47.25 bg-[#F3F4F6] rounded-lg shrink-0 overflow-hidden">
					{images[0] && (
						<Image src={images[0]} alt={offer.title} fill className="object-cover" />
					)}
				</div>

				{/* Small 2×2 grid — up to 3 images, bottom-right empty */}
				<div className="grid grid-cols-2 gap-x-3 gap-y-7.5 shrink-0">
					{images.slice(1, 4).map((src, i) => (
						<div
							key={i}
							className="relative w-17.75 h-17.75 bg-[#F3F4F6] rounded-lg overflow-hidden"
						>
							<Image src={src} alt="" fill className="object-cover" />
						</div>
					))}
					{images.length >= 2 && <div className="w-17.75 h-17.75" />}
				</div>

				{/* Description + discount code — fills remaining width, pinned to large image height */}
				<div className="flex-1 min-w-0 flex flex-col justify-between h-47.25">
					<p className="text-sm font-medium text-black">{offer.description}</p>

					{/* Discount code bar */}
					<div className="flex items-center gap-2 border border-dashed border-[#CBD5E1] bg-[#F8FAFC] rounded-md p-2">
						<div className="flex items-center gap-2 flex-1 min-w-0">
							<TicketPercent className="w-5 h-5 text-[#999DA2] shrink-0" />
							<span className="text-sm font-semibold text-[#1E293B] truncate">
								{offer.discountCode || "-"}
							</span>
						</div>
						<button
							onClick={handleCopy}
							disabled={!hasDiscountCode}
							className="flex items-center gap-2 bg-[#18181B] text-white text-sm font-medium px-4 h-9 rounded-md hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#18181B] transition-colors shrink-0 shadow-sm"
						>
							{copied ? (
								<>
									<Check className="w-4 h-4 text-green-400" />
									<span>Copied</span>
								</>
							) : (
								<>
									<BadgePercent className="w-4 h-4" />
									<Translate text={localizationConstants.discountOpenQR} />
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
