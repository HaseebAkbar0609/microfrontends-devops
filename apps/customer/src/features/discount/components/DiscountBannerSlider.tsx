"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { BannerSlide } from "../types/types";

interface DiscountBannerSliderProps {
	slides: BannerSlide[];
}

export function DiscountBannerSlider({ slides }: DiscountBannerSliderProps) {
	const [current, setCurrent] = useState(0);

	const next = useCallback(() => {
		setCurrent((c) => (c + 1) % slides.length);
	}, [slides.length]);

	useEffect(() => {
		const timer = setInterval(next, 4000);
		return () => clearInterval(timer);
	}, [next]);

	if (!slides.length) return null;

	return (
		<div className="bg-white">
			{/* Slides */}
			<div className="relative overflow-hidden aspect-[764/207] rounded-[6px] border border-[#CBD5E1]">
				<div
					className="flex h-full transition-transform duration-500 ease-in-out"
					style={{ transform: `translateX(-${current * 100}%)` }}
				>
					{slides.map((slide) => (
						<div key={slide.id} className="relative min-w-full h-full shrink-0">
							<Image
								src={slide.backgroundImage}
								alt={slide.logoAlt ?? ""}
								fill
								className="object-cover"
							/>
							{slide.logoUrl && (
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="relative w-[33%] h-[34%]">
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

			{/* Dot indicators */}
			<div className="h-[25px] flex items-center justify-center gap-1">
				{slides.map((_, i) => (
					<button
						key={i}
						onClick={() => setCurrent(i)}
						aria-label={`Go to slide ${i + 1}`}
						className={`w-[7px] h-[7px] rounded-full transition-colors ${
							i === current ? "bg-[#374151]" : "bg-[#374151]/30"
						}`}
					/>
				))}
			</div>
		</div>
	);
}
