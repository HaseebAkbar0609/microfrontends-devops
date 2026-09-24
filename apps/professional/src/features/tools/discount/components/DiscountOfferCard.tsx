"use client";

import Image from "next/image";
import { BadgePercent, Check, TicketPercent } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import type { DiscountOffer } from "../types/discount.types";

interface DiscountOfferCardProps {
	offer: DiscountOffer;
}

/** Images shown beside the hero image in the 2x2 thumbnail grid. */
const GRID_IMAGE_COUNT = 3;

const CODE_FALLBACK = "-";

export function DiscountOfferCard({ offer }: DiscountOfferCardProps) {
	const { copied, copy } = useCopyToClipboard();
	const images = offer.galleryImages ?? [];
	const code = offer.discountCode?.trim() ?? "";
	const hasCode = code.length > 0;

	return (
		<div className="flex flex-col gap-4 rounded-lg border border-[#E2E8F0] bg-white p-5">
			<div className="flex items-center justify-between gap-2">
				<h3 className="text-xl font-semibold leading-6 tracking-tight text-[#0A0A0A]">
					{offer.title}
				</h3>
				<span className="shrink-0 text-sm font-medium text-[#FF8100]">
					{offer.categoryTag}
				</span>
			</div>

			<div className="flex flex-col items-start gap-3 lg:flex-row">
				{/* Hero image */}
				<div className="relative h-47.25 w-full shrink-0 overflow-hidden rounded-lg bg-[#F3F4F6] lg:w-35.5">
					{images[0] && (
						<Image
							src={images[0]}
							alt={offer.title}
							fill
							className="object-cover"
						/>
					)}
				</div>

				{/* Supporting thumbnails — 2x2 grid with the last cell left open */}
				{images.length > 1 && (
					<div className="grid shrink-0 grid-cols-2 gap-x-3 gap-y-7.5">
						{images.slice(1, 1 + GRID_IMAGE_COUNT).map((src, index) => (
							<div
								key={src}
								className="relative h-17.75 w-17.75 overflow-hidden rounded-lg bg-[#F3F4F6]"
							>
								<Image
									src={src}
									alt={`${offer.title} ${index + 2}`}
									fill
									className="object-cover"
								/>
							</div>
						))}
					</div>
				)}

				<div className="flex min-w-0 flex-1 flex-col justify-between gap-4 lg:h-47.25">
					<p className="text-sm font-medium text-black">{offer.description}</p>

					<div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-2">
						<div className="flex min-w-0 flex-1 items-center gap-2">
							<TicketPercent className="h-5 w-5 shrink-0 text-[#999DA2]" />
							<span className="truncate text-sm font-semibold text-[#1E293B]">
								{hasCode ? code : CODE_FALLBACK}
							</span>
						</div>
						<button
							type="button"
							onClick={() => copy(code)}
							disabled={!hasCode}
							className="flex h-9 shrink-0 items-center gap-2 rounded-md bg-[#18181B] px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#18181B]"
						>
							{copied ? (
								<>
									<Check className="h-4 w-4 text-green-400" />
									<Translate text={localizationConstants.discountCodeCopied} />
								</>
							) : (
								<>
									<BadgePercent className="h-4 w-4" />
									<Translate text={localizationConstants.discountCopyCode} />
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
