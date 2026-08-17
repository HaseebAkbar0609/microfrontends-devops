"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
	Heart,
	ChevronDown,
	X,
	Plus,
} from "lucide-react";
import { OfferModuleHeader } from "./OfferModuleHeader";
import { OfferListTable } from "./OfferListTable";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Breadcrumb,
	BreadcrumbItem as BreadcrumbUIItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BREADCRUMBS, DUMMY_OFFERS } from "../constants";
import localizationConstants from "@/utils/translation/constants";
import { listOffersAPIAction } from "@/api-actions/offers";
import { OfferList as OfferListType } from "../types";
import { Loader } from "@/components/ui/loader";
import { authStorage } from "@/lib/authStorage";
import { ProfessionalRow } from "@/types/company";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";

type ChipId = "alla-jobb" | "label-1" | "label-2";

const FILTER_CHIPS: { id: ChipId; labelKey: string; addable?: boolean }[] = [
	{ id: "alla-jobb", labelKey: localizationConstants.allJobs, addable: true },
	{ id: "label-1", labelKey: localizationConstants.filterLabel1, addable: false },
	{ id: "label-2", labelKey: localizationConstants.filterLabel2, addable: false },
];

export default function OfferList() {
	const { search, changeQuery, page = 1, query } = useQueryParams();
	const page_size = query.get("page_size") || "10";
	const [offers, setOffers] = useState<OfferListType[]>(DUMMY_OFFERS);
	const [totalItems, setTotalItems] = useState(DUMMY_OFFERS.length);
	const [isLoading, setIsLoading] = useState(false);
	const [activeChips, setActiveChips] = useState<Set<ChipId>>(
		new Set<ChipId>(["label-1", "label-2"]),
	);
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [selectedMunicipality, setSelectedMunicipality] = useState<string>("all");
	const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

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
				if (result && result.items && result.items.length > 0) {
					setOffers(result.items);
					setTotalItems(result.totalItems);
				} else {
					setOffers(DUMMY_OFFERS);
					setTotalItems(DUMMY_OFFERS.length);
				}
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

	const resetFilters = () => {
		setActiveChips(new Set<ChipId>());
		setSelectedCategory("all");
		setSelectedMunicipality("all");
		setShowFavoritesOnly(false);
		changeQuery("search", "");
	};

	// Unique categories & municipalities for dropdowns
	const uniqueCategories = useMemo(() => {
		const cats = new Set<string>();
		offers.forEach((o) => {
			if (o.category && o.category !== "-") cats.add(o.category);
		});
		return Array.from(cats);
	}, [offers]);

	const uniqueMunicipalities = useMemo(() => {
		const munis = new Set<string>();
		offers.forEach((o) => {
			if (o.municipality && o.municipality !== "-") munis.add(o.municipality);
		});
		return Array.from(munis);
	}, [offers]);

	// Filtered list
	const filteredOffers = useMemo(() => {
		return offers.filter((item) => {
			if (showFavoritesOnly && !item.isFavorite) return false;
			if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
			if (selectedMunicipality !== "all" && item.municipality !== selectedMunicipality) return false;
			if (search.trim()) {
				const q = search.toLowerCase();
				const matchName = item.jobName?.toLowerCase().includes(q);
				const matchId = item.idNumber?.toLowerCase().includes(q);
				const matchCategory = item.category?.toLowerCase().includes(q);
				const matchMuni = item.municipality?.toLowerCase().includes(q);
				if (!matchName && !matchId && !matchCategory && !matchMuni) return false;
			}
			return true;
		});
	}, [offers, showFavoritesOnly, selectedCategory, selectedMunicipality, search]);

	const isAnyFilterActive =
		activeChips.size > 0 ||
		selectedCategory !== "all" ||
		selectedMunicipality !== "all" ||
		showFavoritesOnly ||
		Boolean(search);

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen font-sans">
			{/* Top Offer Module Header with Navigation Tabs */}
			<OfferModuleHeader activeTab="available" />

			{/* Sub-Header / Breadcrumb Section */}
			<div className="flex flex-col gap-1.5 px-6 pt-5 pb-2">
				<h2 className="text-xl font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.offerAvailableProjects} />
				</h2>

				<Breadcrumb>
					<BreadcrumbList className="flex items-center flex-wrap gap-1 text-slate-500 text-xs">
						{BREADCRUMBS.map((item, index) => {
							const isLast = index === BREADCRUMBS.length - 1;
							return (
								<BreadcrumbUIItem
									key={`${item.label}-${index}`}
									className="flex items-center gap-1 text-xs"
								>
									{index !== 0 && <BreadcrumbSeparator className="text-slate-400" />}
									{isLast ? (
										<BreadcrumbPage className="text-xs text-slate-500 font-normal">
											<Translate text={item.label} />
										</BreadcrumbPage>
									) : (
										<BreadcrumbLink asChild>
											<Link
												href={item.href || "#"}
												className="text-xs text-slate-500 hover:text-slate-900 transition-colors font-normal"
											>
												<Translate text={item.label} />
											</Link>
										</BreadcrumbLink>
									)}
								</BreadcrumbUIItem>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			{/* Main Content Area */}
			<div className="px-6 py-4 flex-1 flex flex-col gap-4">
				{/* Toolbar with search, filters, chips, and Fav button */}
				<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 flex-wrap">
					{/* Left Filter Controls */}
					<div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
						{/* Search Input */}
						<Search
							value={search}
							onChange={(val) => changeQuery("search", val)}
							placeholder={localizationConstants.search}
							wrapperClassName="w-full sm:w-[220px] flex-shrink-0"
							className="h-9 text-xs"
						/>

						{/* Filter Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="h-9 px-3 gap-1.5 border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
								>
									<Translate text={localizationConstants.filter} />
									<ChevronDown className="h-3.5 w-3.5 text-slate-400" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-44 text-xs">
								{FILTER_CHIPS.map((chip) => (
									<DropdownMenuItem
										key={chip.id}
										onClick={() => toggleChip(chip.id)}
										className="text-xs cursor-pointer"
									>
										<Translate text={chip.labelKey} />
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Dotted Pill Group */}
						<div className="h-9 flex items-center border border-dotted border-slate-300 rounded-md overflow-hidden flex-shrink-0 bg-transparent">
							<button
								type="button"
								onClick={() => toggleChip("alla-jobb")}
								className={cn(
									"h-full flex items-center gap-1 px-2.5 text-xs font-medium transition-colors cursor-pointer",
									activeChips.has("alla-jobb")
										? "bg-slate-900 text-white"
										: "bg-transparent text-slate-700 hover:bg-slate-100"
								)}
							>
								<Plus className="w-3.5 h-3.5" />
								<Translate text={localizationConstants.allJobs} />
							</button>
							<div className="w-px h-5 bg-slate-300 flex-shrink-0" />
							<button
								type="button"
								onClick={() => toggleChip("label-1")}
								className={cn(
									"h-6 my-auto mx-1 px-2 text-xs font-medium flex items-center rounded-sm transition-colors cursor-pointer",
									activeChips.has("label-1")
										? "bg-slate-900 text-white"
										: "bg-slate-100 text-slate-700 hover:bg-slate-200"
								)}
							>
								<Translate text={localizationConstants.filterLabel1} />
							</button>
							<button
								type="button"
								onClick={() => toggleChip("label-2")}
								className={cn(
									"h-6 my-auto mx-1 px-2 text-xs font-medium flex items-center rounded-sm transition-colors cursor-pointer",
									activeChips.has("label-2")
										? "bg-slate-900 text-white"
										: "bg-slate-100 text-slate-700 hover:bg-slate-200"
								)}
							>
								<Translate text={localizationConstants.filterLabel2} />
							</button>
						</div>

						{/* Category Filter */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button
									type="button"
									className={cn(
										"h-9 flex items-center gap-1.5 px-3 rounded-md text-xs font-medium border border-dotted border-slate-300 transition-colors cursor-pointer shrink-0",
										selectedCategory !== "all"
											? "bg-slate-900 text-white border-slate-900"
											: "bg-transparent text-slate-700 hover:bg-slate-50"
									)}
								>
									<Plus className="w-3.5 h-3.5" />
									<Translate text={localizationConstants.category} />
									{selectedCategory !== "all" && (
										<span className="ml-1 rounded bg-slate-800 text-white px-1.5 py-0.2 text-[10px]">
											{selectedCategory}
										</span>
									)}
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-44 text-xs">
								<DropdownMenuItem onClick={() => setSelectedCategory("all")}>
									<Translate text={localizationConstants.filterAllCategories} />
								</DropdownMenuItem>
								{uniqueCategories.map((cat) => (
									<DropdownMenuItem key={cat} onClick={() => setSelectedCategory(cat)}>
										{cat}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Municipality / Location Filter */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button
									type="button"
									className={cn(
										"h-9 flex items-center gap-1.5 px-3 rounded-md text-xs font-medium border border-dotted border-slate-300 transition-colors cursor-pointer shrink-0",
										selectedMunicipality !== "all"
											? "bg-slate-900 text-white border-slate-900"
											: "bg-transparent text-slate-700 hover:bg-slate-50"
									)}
								>
									<Plus className="w-3.5 h-3.5" />
									<Translate text={localizationConstants.locationPlace} />
									{selectedMunicipality !== "all" && (
										<span className="ml-1 rounded bg-slate-800 text-white px-1.5 py-0.2 text-[10px]">
											{selectedMunicipality}
										</span>
									)}
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-44 text-xs">
								<DropdownMenuItem onClick={() => setSelectedMunicipality("all")}>
									<Translate text={localizationConstants.filterAllCategories} />
								</DropdownMenuItem>
								{uniqueMunicipalities.map((muni) => (
									<DropdownMenuItem key={muni} onClick={() => setSelectedMunicipality(muni)}>
										{muni}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Reset Button */}
						{isAnyFilterActive && (
							<button
								type="button"
								onClick={resetFilters}
								className="h-9 flex items-center gap-1 px-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
							>
								<Translate text={localizationConstants.reset} />
								<X className="w-3.5 h-3.5" />
							</button>
						)}
					</div>

					{/* Right Actions: Fav jobb Button */}
					<Button
						onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
						className={cn(
							"cursor-pointer h-9 px-4 gap-2 rounded-md text-xs font-semibold transition-colors shrink-0",
							showFavoritesOnly
								? "bg-rose-600 hover:bg-rose-700 text-white"
								: "bg-[#18181B] hover:bg-[#18181B]/90 text-white shadow-2xs"
						)}
					>
						<Heart
							className={cn(
								"h-4 w-4",
								showFavoritesOnly ? "fill-white text-white" : "fill-none text-white"
							)}
						/>
						<Translate text={localizationConstants.offerFavJobb} />
					</Button>
				</div>

				{/* Table Container */}
				<div className="flex-1 relative mt-1">
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Loader />
						</div>
					) : (
						<OfferListTable
							data={filteredOffers}
							totalItems={filteredOffers.length || totalItems}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
