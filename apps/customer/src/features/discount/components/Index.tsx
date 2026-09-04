"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { getDiscountDetailAPIAction } from "@/api-actions/discount/getDetail";
import type { DiscountPartner, DiscountOffer, BannerSlide } from "../types/types";
import { DISCOUNT_DETAIL_BREADCRUMBS } from "../constants";
import { DiscountPartnerCard } from "./DiscountPartnerCard";
import { DiscountOfferCard } from "./DiscountOfferCard";
import { DiscountBannerSlider } from "./DiscountBannerSlider";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

interface DiscountDetailFeatureProps {
	partnerId: string;
}

export function DiscountDetailFeature({ partnerId }: DiscountDetailFeatureProps) {
	const router = useRouter();
	const [partner, setPartner] = useState<DiscountPartner | null>(null);
	const [offers, setOffers] = useState<DiscountOffer[]>([]);
	const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;
		setPartner(null);
		setOffers([]);
		setBannerSlides([]);
		setError(null);
		setLoading(true);

		getDiscountDetailAPIAction(partnerId).then((result) => {
			if (!isMounted) return;
			if (result.success && result.data) {
				setPartner(result.data.partner ?? null);
				setOffers(result.data.offers ?? []);
				setBannerSlides(result.data.bannerSlides ?? []);
				setError(null);
			} else {
				setError(result.error || "Failed to load discount details");
			}
			setLoading(false);
		});

		return () => {
			isMounted = false;
		};
	}, [partnerId]);

	return (
		<div className="flex flex-col flex-1">
			<PageHeader
				title={localizationConstants.discounts}
				breadcrumbs={DISCOUNT_DETAIL_BREADCRUMBS}
			/>

			<div className="flex flex-1 flex-col gap-6 p-6 bg-slate-50/50">
				{/* Back button + title */}
				<div className="flex flex-row items-start gap-1.5">
					<button
						onClick={() => router.back()}
						className="flex items-center justify-center w-6 h-6 shrink-0 mt-0.5 text-slate-900 hover:text-slate-700 transition-colors"
					>
						<ChevronLeft className="w-6 h-6" />
					</button>
					<div className="flex flex-col gap-1.5">
						<h1 className="text-2xl font-semibold text-[#020617] leading-none tracking-tight">
							{partner?.name ?? ""}
						</h1>
						<p className="text-sm font-normal text-[#64748B] leading-5">
							<Translate text={localizationConstants.discountDetailSubtitle} />
						</p>
					</div>
				</div>

				{loading ? (
					<p className="py-12 text-center text-sm text-slate-400">
						<Translate text={localizationConstants.discountsLoading} />
					</p>
				) : error ? (
					<p className="py-12 text-center text-sm text-red-500">
						{error}
					</p>
				) : !partner ? (
					<p className="py-12 text-center text-sm text-slate-400">
						<Translate text={localizationConstants.discountsNotFound} />
					</p>
				) : (
					<div className="flex flex-col xl:flex-row gap-6 items-start">
						<div className="w-full xl:w-90 xl:shrink-0 xl:sticky xl:top-6">
							<DiscountPartnerCard partner={partner} />
						</div>
						<div className="flex-1 min-w-0 flex flex-col gap-4">
							{bannerSlides.length > 0 && <DiscountBannerSlider slides={bannerSlides} />}
							{offers.map((offer) => (
								<DiscountOfferCard key={offer.id} offer={offer} />
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
