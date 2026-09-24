"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { DISCOUNT_BANNER_INTERVAL_MS } from "../constants";
import type { BannerSlide } from "../types/discount.types";

interface DiscountBannerSliderProps {
	slides: BannerSlide[];
}

export function DiscountBannerSlider({ slides }: DiscountBannerSliderProps) {
	const t = useTranslate();
	const [current, setCurrent] = useState(0);

	const next = useCallback(() => {
		setCurrent((index) => (index + 1) % slides.length);
	}, [slides.length]);

	useEffect(() => {
		if (slides.length < 2) return;
		const timer = setInterval(next, DISCOUNT_BANNER_INTERVAL_MS);
		return () => clearInterval(timer);
	}, [next, slides.length]);

	if (!slides.length) return null;

	return (
		<div className="bg-white">
			<div className="relative aspect-[764/207] overflow-hidden rounded-[6px] border border-[#CBD5E1]">
				<div
					className="flex h-full transition-transform duration-500 ease-in-out"
					style={{ transform: `translateX(-${current * 100}%)` }}
				>
					{slides.map((slide) => (
						<div key={slide.id} className="relative h-full min-w-full shrink-0">
							<Image
								src={slide.backgroundImage}
								alt={slide.logoAlt ?? ""}
								fill
								className="object-cover"
							/>
							{slide.logoUrl && (
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="relative h-[34%] w-[33%]">
										<Image
											src={slide.logoUrl}
											alt={slide.logoAlt ?? ""}
											fill
											className="object-contain"
										/>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			<div className="flex h-[25px] items-center justify-center gap-1">
				{slides.map((slide, index) => (
					<button
						key={slide.id}
						type="button"
						onClick={() => setCurrent(index)}
						aria-label={t(localizationConstants.discountBannerGoToSlide, {
							index: index + 1,
						})}
						className={`h-[7px] w-[7px] rounded-full transition-colors ${
							index === current ? "bg-[#374151]" : "bg-[#374151]/30"
						}`}
					/>
				))}
			</div>
		</div>
	);
}
