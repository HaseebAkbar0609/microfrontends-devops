"use client";

import { useState } from "react";
import { Star, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	DUMMY_REVIEWS,
	DUMMY_STAR_BREAKDOWN,
	DUMMY_POPULAR_TAGS,
} from "../../constants";

type SortOption = "latest" | "highest";
type RatingFilter = 1 | 2 | 3 | 4 | 5 | null;

export function ReviewsTab() {
	const [sort, setSort] = useState<SortOption>("latest");
	const [ratingFilter, setRatingFilter] = useState<RatingFilter>(null);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredReviews = DUMMY_REVIEWS.filter((r) =>
		ratingFilter ? r.rating === ratingFilter : true,
	)
		.filter((r) =>
			searchQuery
				? r.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
					r.name.toLowerCase().includes(searchQuery.toLowerCase())
				: true,
		)
		.sort((a, b) =>
			sort === "highest" ? b.rating - a.rating : 0,
		);

	return (
		<div className="flex gap-6">
			{/* Left column: filters + review list */}
			<div className="flex-1 min-w-0 flex flex-col gap-4">
				{/* Filter controls */}
				<div className="flex flex-col gap-3">
					{/* Sort + rating filter row */}
					<div className="flex items-center flex-wrap gap-2">
						<span className="text-sm text-slate-500 shrink-0">
							Sortera:
						</span>
						<button
							onClick={() => setSort("latest")}
							className={cn(
								"px-3 h-[31.5px] rounded-md text-[13px] font-medium leading-[19.5px] transition-colors",
								sort === "latest"
									? "bg-[#1E293B] text-white"
									: "bg-[#F7F8FA] text-slate-500 hover:bg-slate-100",
							)}
						>
							Senaste
						</button>
						<button
							onClick={() => setSort("highest")}
							className={cn(
								"px-3 h-[31.5px] rounded-md text-[13px] font-medium leading-[19.5px] transition-colors",
								sort === "highest"
									? "bg-[#1E293B] text-white"
									: "bg-[#F7F8FA] text-slate-500 hover:bg-slate-100",
							)}
						>
							Högst betyg
						</button>

						<div className="w-px h-6 bg-slate-200 mx-1 shrink-0" />

						<span className="text-sm text-slate-500 shrink-0">
							Betyg:
						</span>
						{([5, 4, 3, 2, 1] as const).map((star) => (
							<button
								key={star}
								onClick={() =>
									setRatingFilter(
										ratingFilter === star ? null : star,
									)
								}
								className={cn(
									"flex items-center gap-1 px-3 h-[31.5px] rounded-md text-[13px] font-medium leading-[19.5px] transition-colors",
									ratingFilter === star
										? "bg-[#1E293B] text-white"
										: "bg-[#F7F8FA] text-slate-500 hover:bg-slate-100",
								)}
							>
								{star}
								<Star
									className={cn(
										"w-3 h-3",
										ratingFilter === star
											? "fill-white text-white"
											: "fill-[#FFB800] text-[#FFB800]",
									)}
								/>
							</button>
						))}
					</div>

					{/* Search input */}
					<div className="relative w-full max-w-[430px]">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Sök i recensioner..."
							className="w-full h-9 bg-[#F3F3F5] rounded-lg pl-9 pr-3 text-sm text-[#0A0A0A] placeholder:text-[#717182] border-0 outline-none focus:ring-2 focus:ring-slate-300 transition-shadow"
						/>
					</div>
				</div>

				{/* Review cards */}
				<div className="flex flex-col gap-4">
					{filteredReviews.length === 0 ? (
						<div className="py-8 text-center text-sm text-slate-500">
							Inga recensioner matchar din sökning.
						</div>
					) : (
						filteredReviews.map((review) => (
							<div
								key={review.id}
								className="bg-white border border-slate-200 rounded-lg p-5 flex gap-4"
							>
								{/* Avatar */}
								<div className="w-12 h-12 rounded-full bg-[#E5E7EB] shrink-0 flex items-center justify-center">
									<span className="text-sm font-semibold text-slate-600">
										{review.initials}
									</span>
								</div>

								{/* Content */}
								<div className="flex-1 min-w-0 flex flex-col gap-2">
									{/* Header row */}
									<div className="flex items-start justify-between gap-2">
										<div className="flex flex-col gap-1">
											<span className="text-base font-semibold text-[#0A0A0A] leading-6 tracking-tight">
												{review.name}
											</span>
											<div className="flex items-center gap-0.5">
												{Array.from({
													length: 5,
												}).map((_, i) => (
													<Star
														key={i}
														className={cn(
															"w-3.5 h-3.5",
															i < review.rating
																? "fill-[#FFB800] text-[#FFB800]"
																: "fill-slate-200 text-slate-200",
														)}
													/>
												))}
											</div>
										</div>
										<span className="text-[13px] text-slate-500 leading-[19.5px] shrink-0">
											{review.date}
										</span>
									</div>

									{/* Review text */}
									<p className="text-sm text-slate-500 leading-[22.75px] tracking-tight">
										{review.text}
									</p>

									{/* Tags */}
									{review.tags.length > 0 && (
										<div className="flex flex-wrap gap-1.5 pt-1">
											{review.tags.map((tag) => (
												<span
													key={tag}
													className="px-2 py-0.5 text-xs font-medium text-slate-500 bg-[#F7F8FA] border border-slate-200 rounded-lg leading-4"
												>
													{tag}
												</span>
											))}
										</div>
									)}
								</div>
							</div>
						))
					)}
				</div>
			</div>

			{/* Right column: summary panel */}
			<div className="w-[320px] shrink-0 border border-slate-200 rounded-lg self-start">
				{/* Header */}
				<div className="px-6 pt-6 pb-0">
					<h3 className="text-base font-semibold text-[#0A0A0A] tracking-tight">
						Sammanfattning
					</h3>
				</div>

				{/* Big rating display */}
				<div className="px-6 pt-5">
					<div className="bg-[#F7F8FA] rounded-lg px-5 pt-5 pb-4 flex flex-col items-center gap-2">
						<span className="text-[48px] font-bold text-[#0A0A0A] leading-[48px]">
							5.0
						</span>
						<div className="flex items-center gap-1">
							{Array.from({ length: 5 }).map((_, i) => (
								<Star
									key={i}
									className="w-[18px] h-[18px] fill-[#FFB800] text-[#FFB800]"
								/>
							))}
						</div>
						<span className="text-sm text-slate-500 tracking-tight">
							Totalt: 48 recensioner
						</span>
					</div>
				</div>

				{/* Star breakdown bars */}
				<div className="px-6 pt-5 flex flex-col gap-3">
					{DUMMY_STAR_BREAKDOWN.map(({ stars, count, pct }) => (
						<div
							key={stars}
							className="flex items-center gap-3 h-5"
						>
							<div className="flex items-center gap-1 w-[52px] shrink-0">
								<span className="text-[13px] font-medium text-[#0A0A0A] leading-[19.5px]">
									{stars}
								</span>
								<Star className="w-3 h-3 fill-[#FFB800] text-[#FFB800]" />
							</div>
							<div className="flex-1 h-2 bg-[#F7F8FA] rounded-full overflow-hidden">
								<div
									className="h-full bg-[#FFB800] rounded-full transition-all"
									style={{ width: `${pct}%` }}
								/>
							</div>
							<span className="text-[13px] text-slate-500 leading-[19.5px] w-7 text-right shrink-0">
								{count}
							</span>
						</div>
					))}
				</div>

				{/* Popular tags */}
				<div className="px-6 pt-5 pb-6 mt-3 border-t border-slate-200 flex flex-col gap-3">
					<h4 className="text-sm font-semibold text-[#0A0A0A] tracking-tight">
						Populära taggar
					</h4>
					<div className="flex flex-wrap gap-1.5">
						{DUMMY_POPULAR_TAGS.map(({ label, count, isPopular }) => (
							<span
								key={label}
								className={cn(
									"px-2 py-0.5 text-xs font-medium rounded-lg leading-4",
									isPopular
										? "bg-[rgba(255,129,0,0.1)] border border-[rgba(255,129,0,0.2)] text-[#FF8100]"
										: "bg-[#F7F8FA] border border-slate-200 text-slate-500",
								)}
							>
								{label} ({count})
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
