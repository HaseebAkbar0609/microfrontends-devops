"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
	ChevronDown,
	ChevronUp,
	Printer,
	Plus,
	MoreVertical,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Eye,
	PencilLine,
	Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { RecordNavRow } from "@/components/layout/navigation";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import { ORDER_MODULE_BASE_URL } from "@/features/orders/data/orderNav.config";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import {
	type MemberItem,
	type GroupSection,
	getOrderOrganisation,
	INITIAL_ORGANISATION_GROUPS,
} from "./api/orderOrganisation.api";
import { useOrderOpened } from "@/features/orders/opened/hooks/useOrderOpened";

export interface OrderOrganisationPageProps {
	orderId?: string;
}

export function OrderOrganisationPage({ orderId = "5000-001" }: OrderOrganisationPageProps) {
	const t = useTranslate();
	const router = useRouter();
	const { orderData } = useOrderOpened(orderId);

	const serialNo = orderData?.orderDetails?.serialNo || orderData?.id || orderId;

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedGroupFilter, setSelectedGroupFilter] = useState("all");
	const [sortBy, setSortBy] = useState<keyof MemberItem>("foretag");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const [isLoading, setIsLoading] = useState(true);
	const [groups, setGroups] = useState<GroupSection[]>(INITIAL_ORGANISATION_GROUPS);
	const [openSections, setOpenSections] = useState<Record<string, boolean>>({
		bestallare: true,
		arkitet: true,
		byggentreprenor: true,
		elektriker: true,
	});

	// Fetch data via standard project API flow
	useEffect(() => {
		let isMounted = true;
		setIsLoading(true);
		getOrderOrganisation(orderId)
			.then((data) => {
				if (isMounted) {
					setGroups(data);
				}
			})
			.catch((err) => {
				console.warn("[OrderOrganisationPage] Fetch error:", err);
			})
			.finally(() => {
				if (isMounted) {
					setIsLoading(false);
				}
			});
		return () => {
			isMounted = false;
		};
	}, [orderId]);

	const toggleSection = (id: string) => {
		setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const handlePrint = () => {
		if (typeof window !== "undefined") {
			window.print();
		}
	};

	const handleSort = (field: keyof MemberItem) => {
		if (sortBy === field) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortBy(field);
			setSortOrder("asc");
		}
	};

	const renderSortIcon = (field: keyof MemberItem) => {
		if (sortBy !== field) {
			return <ArrowUpDown className="h-3.5 w-3.5 text-slate-500 opacity-50 shrink-0" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="h-3.5 w-3.5 text-slate-900 shrink-0" />
		) : (
			<ArrowDown className="h-3.5 w-3.5 text-slate-900 shrink-0" />
		);
	};

	const tableColumns: { key: keyof MemberItem; labelKey: TranslationKeys }[] = [
		{ key: "foretag", labelKey: localizationConstants.orgColForetag },
		{ key: "roll", labelKey: localizationConstants.orgColRoll },
		{ key: "kategori", labelKey: localizationConstants.orgColKategori },
		{ key: "address", labelKey: localizationConstants.orgColAddress },
		{ key: "postNr", labelKey: localizationConstants.orgColPostNr },
		{ key: "ort", labelKey: localizationConstants.orgColOrt },
		{ key: "kontakt", labelKey: localizationConstants.orgColKontakt },
		{ key: "mail", labelKey: localizationConstants.orgColMail },
	];

	const filteredGroups = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		return groups.map((grp) => {
			if (selectedGroupFilter !== "all" && grp.id !== selectedGroupFilter) {
				return { ...grp, items: [] };
			}
			let matchedItems = grp.items;
			if (q) {
				matchedItems = grp.items.filter((item) =>
					Object.values(item).some((val) =>
						val.toLowerCase().includes(q)
					)
				);
			}
			const sorted = [...matchedItems].sort((a, b) => {
				const aVal = (a[sortBy] || "").toLowerCase();
				const bVal = (b[sortBy] || "").toLowerCase();
				if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
				if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
				return 0;
			});
			return { ...grp, items: sorted };
		});
	}, [groups, searchQuery, selectedGroupFilter, sortBy, sortOrder]);

	const recordTitle = (
		<span>
			<span className="text-slate-400 font-normal">
				{t(localizationConstants.order)} {serialNo} /{" "}
			</span>
			<span className="text-slate-900 font-semibold">
				{t(localizationConstants.orderOrganisationTab)}
			</span>
		</span>
	);

	return (
		<div className="flex h-full flex-col bg-slate-50/50 relative overflow-hidden font-sans antialiased text-slate-900">
			{/* Main Content Scrollable Container */}
			<div className="flex-1 overflow-y-auto px-6 py-6">
				<div className="w-full space-y-6">
					{/* Record Back Navigation Bar */}
					<RecordNavRow
						title={recordTitle}
						backHref={`${ORDER_MODULE_BASE_URL}/${orderId}`}
						className="pt-0"
						titleClassName="font-sans text-base sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8 tracking-normal align-middle"
						backButtonClassName="mt-[2px] sm:mt-[5px]"
					/>

					<div className="ml-0 sm:ml-7 space-y-4">
						{/* Action Bar: Search, Filter, Print, Add */}
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
								<Search
									value={searchQuery}
									onChange={(val) => setSearchQuery(val)}
									placeholder={localizationConstants.orgSearchPlaceholder}
									className="h-10 w-full"
									wrapperClassName="w-full sm:w-[240px] md:w-[260px] lg:w-[280px]"
								/>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											className="h-10 w-full sm:w-[75px] sm:min-w-[75px] border-slate-200 text-slate-700 font-normal bg-transparent hover:bg-slate-50 gap-1.5 px-2.5 text-xs shadow-2xs justify-between cursor-pointer"
										>
											<Translate text={localizationConstants.filter} />
											<ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start" className="w-36 border border-slate-200 bg-white shadow-md rounded-md p-1">
										<DropdownMenuItem
											onClick={() => setSelectedGroupFilter("all")}
											className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
										>
											<Translate text={localizationConstants.orgFilterAll} />
										</DropdownMenuItem>
										{groups.map((g) => (
											<DropdownMenuItem
												key={g.id}
												onClick={() => setSelectedGroupFilter(g.id)}
												className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
											>
												<Translate text={g.titleKey} />
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>

							<div className="flex items-center justify-end sm:justify-start gap-3 w-full sm:w-auto">
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={handlePrint}
									className="h-10 w-10 rounded-lg border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-none cursor-pointer"
									title={t(localizationConstants.orgPrintButton)}
									aria-label={t(localizationConstants.orgPrintButton)}
								>
									<Printer className="h-4 w-4" />
								</Button>

								<Button
									type="button"
									className="h-10 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium shadow-none gap-1.5 cursor-pointer"
								>
									<Plus className="h-4 w-4" />
									<span>{t(localizationConstants.orgAddButton)}</span>
								</Button>
							</div>
						</div>

						{/* 4 Accordion Groups */}
						<div className="space-y-4 pb-12">
							{isLoading ? (
								<div className="space-y-4">
									{[1, 2, 3, 4].map((i) => (
										<div
											key={i}
											className="overflow-hidden rounded-[8px] border border-slate-200 bg-white"
										>
											<div className="h-[56px] w-full bg-slate-200 animate-pulse" />
											<div className="p-5 space-y-3">
												<Skeleton className="h-8 w-full bg-slate-100" />
												<Skeleton className="h-8 w-full bg-slate-100" />
											</div>
										</div>
									))}
								</div>
							) : (
								filteredGroups.map((group) => (
								<div
									key={group.id}
									className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-none"
								>
									{/* Accordion Header */}
									<Button
										type="button"
										variant="ghost"
										onClick={() => toggleSection(group.id)}
										className="w-full h-[56px] flex items-center justify-between px-5 bg-slate-200 hover:bg-slate-300 rounded-none transition-colors cursor-pointer shadow-none"
									>
										<span className="font-sans font-medium text-base leading-6 tracking-normal text-slate-900">
											{t(group.titleKey)}
										</span>
										{openSections[group.id] ? (
											<ChevronUp className="h-4 w-4 text-slate-900" />
										) : (
											<ChevronDown className="h-4 w-4 text-slate-900" />
										)}
									</Button>

									{/* Table Body */}
									{openSections[group.id] && (
										<div className="overflow-x-auto">
											<Table className="w-full">
												<TableHeader className="bg-transparent border-b border-slate-100">
													<TableRow className="h-[48px] hover:bg-transparent border-b border-slate-100">
														{tableColumns.map((col) => (
															<TableHead
																key={col.key}
																onClick={() => handleSort(col.key)}
																className="h-[48px] px-5 font-sans font-medium text-sm leading-6 tracking-normal text-slate-500 cursor-pointer hover:text-slate-900 select-none transition-colors"
															>
																<div className="flex items-center gap-1">
																	<span>{t(col.labelKey)}</span>
																	{renderSortIcon(col.key)}
																</div>
															</TableHead>
														))}
														<TableHead className="w-10 px-3" />
													</TableRow>
												</TableHeader>
												<TableBody>
													{group.items.length === 0 ? (
														<TableRow className="h-[56px]">
															<TableCell
																colSpan={9}
																className="h-[56px] py-4 text-center text-xs text-slate-400"
															>
																{t(localizationConstants.noRecordsFound)}
															</TableCell>
														</TableRow>
													) : (
														group.items.map((item) => (
															<TableRow
																key={item.id}
																className="h-[56px] border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
															>
																<TableCell className="h-[56px] px-5 py-0 font-sans font-medium text-sm leading-5 tracking-normal text-slate-800">
																	{item.foretag}
																</TableCell>
																<TableCell className="h-[56px] px-5 py-0 font-sans font-medium text-sm leading-5 tracking-normal text-slate-800">
																	{item.roll}
																</TableCell>
																<TableCell className="h-[56px] px-5 py-0 font-sans font-medium text-sm leading-5 tracking-normal text-slate-800">
																	{item.kategori}
																</TableCell>
																<TableCell className="h-[56px] px-5 py-0 font-sans font-medium text-sm leading-5 tracking-normal text-slate-800">
																	{item.address}
																</TableCell>
																<TableCell className="h-[56px] px-5 py-0 font-sans font-medium text-sm leading-5 tracking-normal text-slate-800">
																	{item.postNr}
																</TableCell>
																<TableCell className="h-[56px] px-5 py-0 font-sans font-medium text-sm leading-5 tracking-normal text-slate-800">
																	{item.ort}
																</TableCell>
																<TableCell className="h-[56px] px-5 py-0 font-sans font-medium text-sm leading-5 tracking-normal text-slate-800">
																	{item.kontakt}
																</TableCell>
																<TableCell className="h-[56px] px-5 py-0 font-sans font-medium text-sm leading-5 tracking-normal text-slate-800">
																	{item.mail}
																</TableCell>
																<TableCell className="px-3 py-0 text-right">
																	<DropdownMenu>
																		<DropdownMenuTrigger asChild>
																			<Button
																				type="button"
																				variant="ghost"
																				size="icon"
																				className="h-8 w-8 text-slate-900 hover:text-slate-950 hover:bg-slate-200/60 rounded-md cursor-pointer"
																				aria-label={t(localizationConstants.actions)}
																			>
																				<MoreVertical className="h-4 w-4 text-slate-900" />
																			</Button>
																		</DropdownMenuTrigger>
																		<DropdownMenuContent align="end" className="w-36 border border-slate-200 bg-white shadow-md rounded-md p-1">
																			<DropdownMenuItem
																				onClick={() => router.push(`${ORDER_MODULE_BASE_URL}/${orderId}`)}
																				className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
																			>
																				<Eye className="h-3.5 w-3.5 text-slate-500 shrink-0" />
																				<Translate text={localizationConstants.orgViewAction} />
																			</DropdownMenuItem>
																			<DropdownMenuItem
																				onClick={() => router.push(`${ORDER_MODULE_BASE_URL}/${orderId}`)}
																				className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
																			>
																				<PencilLine className="h-3.5 w-3.5 text-slate-500 shrink-0" />
																				<Translate text={localizationConstants.orgEditAction} />
																			</DropdownMenuItem>
																			<DropdownMenuItem
																				onClick={() => {
																					setGroups((prev) =>
																						prev.map((g) => ({
																							...g,
																							items: g.items.filter((m) => m.id !== item.id),
																						}))
																					);
																				}}
																				className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
																			>
																				<Trash2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
																				<Translate text={localizationConstants.orgDeleteAction} />
																			</DropdownMenuItem>
																		</DropdownMenuContent>
																	</DropdownMenu>
																</TableCell>
															</TableRow>
														))
													)}
												</TableBody>
											</Table>
										</div>
									)}
								</div>
							)))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default OrderOrganisationPage;
