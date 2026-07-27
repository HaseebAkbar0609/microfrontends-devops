"use client";

import { useEffect, useState } from "react";
import { Heart, ChevronDown, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { OfferListTable } from "@/features/offer/components/OfferListTable";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BREADCRUMBS, DUMMY_OFFERS } from "../constants";
import localizationConstants from "@/utils/translation/constants";
import { listOffersAPIAction } from "@/api-actions/offers";
import { OfferList as OfferListType } from "../types";
import { Loader } from "@/components/ui/loader";
import { authStorage } from "@/lib/authStorage";
import { ProfessionalRow } from "@/types/company";

import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";

type ChipId = "alla-jobb" | "label-1" | "label-2" | "kategori" | "plats";

const FILTER_CHIPS: { id: ChipId; label: string; addable: boolean }[] = [
	{ id: "alla-jobb", label: "Alla jobb", addable: true },
	{ id: "label-1", label: "Label 1", addable: false },
	{ id: "label-2", label: "Label 2", addable: false },
	{ id: "kategori", label: "Kategori", addable: true },
	{ id: "plats", label: "Plats", addable: true },
];

export default function OfferList() {
	const { search, changeQuery, page = 1, query } = useQueryParams();
	const page_size = query.get("page_size") || "10";
	const [offers, setOffers] = useState<OfferListType[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [activeChips, setActiveChips] = useState<Set<ChipId>>(
		new Set<ChipId>(["label-1", "label-2"]),
	);
	const [showFavorites, setShowFavorites] = useState(false);

	useEffect(() => {
		async function fetchOffers() {
			setIsLoading(true);
			try {
				const companyData =
					authStorage.getCompanyData() as ProfessionalRow | null;

				const result = await listOffersAPIAction({
					status: "REQUESTED",
					page: Number(page) || 1,
					pageSize: Number(page_size) || 10,
					search: search,
					companyId: companyData?.id,
				});
				const items = result.items.length > 0 ? result.items : DUMMY_OFFERS;
				setOffers(items);
				setTotalItems(result.items.length > 0 ? result.totalItems : DUMMY_OFFERS.length);
			} catch {
				setOffers(DUMMY_OFFERS);
				setTotalItems(DUMMY_OFFERS.length);
			} finally {
				setIsLoading(false);
			}
		}
		fetchOffers();
	}, [search, page, page_size]);

	const toggleChip = (id: ChipId) => {
		setActiveChips((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	const resetFilters = () => setActiveChips(new Set<ChipId>());

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<PageHeader
				title={localizationConstants.offerList}
				breadcrumbs={BREADCRUMBS}
			/>

			{/* Toolbar with search, filter, chips, and fav button */}
			<div className="flex items-center justify-between gap-4 px-5 pt-6 pb-3">
				<div className="flex items-center gap-2 flex-1 flex-wrap min-w-0">
					<Search
						value={search}
						onChange={(val) => changeQuery("search", val)}
						className="h-10 w-full max-w-70 shrink-0"
					/>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="cursor-pointer h-10 gap-2 border-border text-secondary font-medium bg-white shrink-0"
							>
								<Translate text={localizationConstants.filter} />
								<ChevronDown className="h-4 w-4 opacity-50" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							{FILTER_CHIPS.map((chip) => (
								<DropdownMenuItem
									key={chip.id}
									onClick={() => toggleChip(chip.id)}
								>
									{chip.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Filter chips */}
					{FILTER_CHIPS.map((chip) => {
						const isActive = activeChips.has(chip.id);
						return (
							<button
								key={chip.id}
								type="button"
								onClick={() => toggleChip(chip.id)}
								className={cn(
									"cursor-pointer inline-flex items-center gap-1 rounded-full px-3 h-8 text-xs font-medium border transition-colors shrink-0",
									isActive
										? "bg-slate-900 text-white border-slate-900"
										: "bg-white text-slate-600 border-slate-200 hover:border-slate-400",
								)}
							>
								{chip.addable && !isActive && (
									<span className="mr-0.5">+</span>
								)}
								{chip.label}
								{isActive && <X className="h-3 w-3 ml-1" />}
							</button>
						);
					})}

					{activeChips.size > 0 && (
						<button
							type="button"
							onClick={resetFilters}
							className="cursor-pointer inline-flex items-center gap-1 rounded-full px-3 h-8 text-xs font-medium border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors shrink-0"
						>
							Reset
							<X className="h-3 w-3" />
						</button>
					)}
				</div>

				<Button
					onClick={() => setShowFavorites(!showFavorites)}
					className={cn(
						"cursor-pointer h-10 px-4 gap-2 rounded-md transition-colors shrink-0",
						showFavorites
							? "bg-pink-600 hover:bg-pink-700 text-white"
							: "bg-[#18181B] hover:bg-[#18181B]/90 text-white",
					)}
				>
					<Heart
						className={cn(
							"h-4 w-4",
							showFavorites ? "fill-white" : "fill-none",
						)}
					/>
					Fav jobb
				</Button>
			</div>

			<div className="p-5 flex-1 relative">
				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<Loader />
					</div>
				) : (
					<OfferListTable data={offers} totalItems={totalItems} />
				)}
			</div>
		</div>
	);
}
