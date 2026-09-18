"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { DISCOUNT_DETAIL_BREADCRUMBS } from "../constants";
import { getDiscountPartnerDetail } from "../services/discountService";
import type { DiscountPartnerDetail } from "../types/discount.types";
import { DiscountBannerSlider } from "./DiscountBannerSlider";
import { DiscountOfferCard } from "./DiscountOfferCard";
import { DiscountPartnerCard } from "./DiscountPartnerCard";

interface DiscountDetailPageProps {
	partnerId: string;
}

const EMPTY_DETAIL: DiscountPartnerDetail = {
	partner: null,
	offers: [],
	bannerSlides: [],
};

export function DiscountDetailPage({ partnerId }: DiscountDetailPageProps) {
	const router = useRouter();
	const t = useTranslate();
	const [detail, setDetail] = useState<DiscountPartnerDetail>(EMPTY_DETAIL);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;
		setDetail(EMPTY_DETAIL);
		setError(null);
		setLoading(true);

		getDiscountPartnerDetail(partnerId).then((result) => {
			if (!isMounted) return;
			if (result.success && result.data) {
				setDetail(result.data);
				setError(null);
			} else {
				setError(result.error || t(localizationConstants.discountsLoadError));
			}
			setLoading(false);
		});

		return () => {
			isMounted = false;
		};
		// `t` is recreated on every render by useTranslate; refetching on it would loop.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [partnerId]);

	const { partner, offers, bannerSlides = [] } = detail;

	return (
		<div className="flex flex-1 flex-col">
			<PageHeader
				title={localizationConstants.discountsItem}
				breadcrumbs={DISCOUNT_DETAIL_BREADCRUMBS}
			/>

			<div className="flex flex-1 flex-col gap-6 bg-slate-50/50 p-6">
				<div className="flex flex-row items-start gap-1.5">
					<button
						type="button"
						onClick={() => router.back()}
						aria-label={t(localizationConstants.discountDetailBack)}
						className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-slate-900 transition-colors hover:text-slate-700"
					>
						<ChevronLeft className="h-6 w-6" />
					</button>
					<div className="flex flex-col gap-1.5">
						<h1 className="text-2xl font-semibold leading-none tracking-tight text-[#020617]">
							{partner?.name ?? ""}
						</h1>
						<p className="text-sm font-normal leading-5 text-[#64748B]">
							<Translate text={localizationConstants.discountDetailSubtitle} />
						</p>
					</div>
				</div>

				{loading ? (
					<p className="py-12 text-center text-sm text-slate-400">
						<Translate text={localizationConstants.discountsLoading} />
					</p>
				) : error ? (
					<p className="py-12 text-center text-sm text-red-500">{error}</p>
				) : !partner ? (
					<p className="py-12 text-center text-sm text-slate-400">
						<Translate text={localizationConstants.discountDetailNotFound} />
					</p>
				) : (
					<div className="flex flex-col items-start gap-6 xl:flex-row">
						<div className="w-full xl:sticky xl:top-6 xl:w-90 xl:shrink-0">
							<DiscountPartnerCard partner={partner} />
						</div>
						<div className="flex min-w-0 flex-1 flex-col gap-4">
							{bannerSlides.length > 0 && (
								<DiscountBannerSlider slides={bannerSlides} />
							)}
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
