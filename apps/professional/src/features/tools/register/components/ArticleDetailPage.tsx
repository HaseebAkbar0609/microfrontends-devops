"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
	ArrowLeft,
	PenLine,
	UserPlus,
	Star,
	ArrowUpDown,
	Tag,
	FileText,
	Warehouse,
} from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { getArticleDetailAPIAction } from "../api/articleRegister";
import type { ArticleDetail, PriceListRow } from "../types";

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col gap-1 min-w-0">
			<span className="text-sm font-medium leading-5 tracking-normal text-zinc-950">
				<Translate text={label} />
			</span>
			<span className="truncate text-sm font-normal leading-5 tracking-normal text-zinc-500">
				{value || "\u2014"}
			</span>
		</div>
	);
}

function InfoRowLink({
	label,
	value,
	href,
}: {
	label: string;
	value: string;
	href: string;
}) {
	return (
		<div className="flex flex-col gap-1 min-w-0">
			<span className="text-sm font-medium leading-5 tracking-normal text-zinc-950">
				<Translate text={label} />
			</span>
			<Link
				href={href}
				className="truncate text-sm font-normal leading-5 tracking-normal text-zinc-500 hover:underline"
			>
				{value || "\u2014"}
			</Link>
		</div>
	);
}

function SectionCard({
	icon,
	title,
	onEdit,
	children,
	className,
}: {
	icon?: React.ReactNode;
	title: string;
	onEdit?: () => void;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<Card className={cn("w-full gap-0 p-0", className)}>
			<div className="flex h-14 flex-row items-center justify-between border-b border-slate-200 px-4 py-4">
				<CardTitle className="flex items-center gap-2 min-w-0 text-sm font-medium sm:text-base leading-6 tracking-normal text-zinc-950">
					{icon && <span className="inline-flex shrink-0">{icon}</span>}
					<Translate text={title} />
				</CardTitle>
				{onEdit && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onEdit}
						className="hidden h-9 gap-2 rounded bg-zinc-100 px-4 py-2 text-sm font-medium leading-5 tracking-normal text-zinc-950 hover:opacity-80 sm:inline-flex"
					>
						<PenLine className="h-4 w-4" />
						<Translate text={localizationConstants.editLabel} />
					</Button>
				)}
			</div>
			{children}
		</Card>
	);
}

function PriceListTable({ rows }: { rows: PriceListRow[] }) {
	const [sortKey, setSortKey] = useState<keyof PriceListRow | null>(null);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const handleSort = (key: keyof PriceListRow) => {
		if (sortKey === key) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortKey(key);
			setSortOrder("asc");
		}
	};

	const sortedRows = useMemo(() => {
		if (!sortKey) return rows;
		return [...rows].sort((a, b) => {
			const aVal = a[sortKey] || "";
			const bVal = b[sortKey] || "";
			const cmp = aVal.localeCompare(bVal, undefined, { numeric: true });
			return sortOrder === "asc" ? cmp : -cmp;
		});
	}, [rows, sortKey, sortOrder]);

	return (
		<table className="w-full min-w-[900px] text-sm">
			<thead>
				<tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500">
					<th className="py-3 pr-2 w-10" />
					<th className="py-3 px-5 whitespace-nowrap cursor-pointer select-none" onClick={() => handleSort("priceList")}>
						<span className="inline-flex items-center gap-2">
							<Translate text={localizationConstants.articlePrislistaHeader} />
							<ArrowUpDown className="h-3 w-3 text-slate-400" />
						</span>
					</th>
					<th className="py-3 px-5 whitespace-nowrap cursor-pointer select-none" onClick={() => handleSort("benamning")}>
						<span className="inline-flex items-center gap-2">
							<Translate text={localizationConstants.articleBenamningHeader} />
							<ArrowUpDown className="h-3 w-3 text-slate-400" />
						</span>
					</th>
					<th className="py-3 px-5 whitespace-nowrap">
						<Translate text={localizationConstants.articlePrisUtHeader} />
					</th>
					<th className="py-3 px-5 whitespace-nowrap">
						<Translate text={localizationConstants.articlePrisKalkylHeader} />
					</th>
					<th className="py-3 px-5 whitespace-nowrap">
						<Translate text={localizationConstants.articleTgProcentHeader} />
					</th>
					<th className="py-3 px-5 whitespace-nowrap">
						<Translate text={localizationConstants.articleTbSekHeader} />
					</th>
					<th className="py-3 px-5 whitespace-nowrap">
						<Translate text={localizationConstants.articleKostnadHeader} />
					</th>
					<th className="py-3 px-5 whitespace-nowrap">
						<Translate text={localizationConstants.articleAndringsDatumHeader} />
					</th>
					<th className="py-3 px-5 whitespace-nowrap">
						<Translate text={localizationConstants.articleStatistikHeader} />
					</th>
					<th className="py-3 w-12" />
				</tr>
			</thead>
			<tbody>
				{sortedRows.map((row) => (
					<tr key={row.id} className="border-b border-[#E2E8F0] rounded-md">
						<td className="py-3 pl-2 pr-2 rounded-l-md">
							<Star className="h-4 w-4 fill-[#111721] text-[#111721]" />
						</td>
						<td className="py-3 px-6 font-sans font-normal text-sm leading-5 text-slate-700 whitespace-nowrap">
							{row.priceList}
						</td>
						<td className="py-3 px-6 font-sans font-normal text-sm leading-5 text-slate-700">
							{row.benamning}
						</td>
						<td className="py-3 px-6 font-sans font-normal text-sm leading-5 text-slate-700 whitespace-nowrap">
							{row.prisUt}
						</td>
						<td className="py-3 px-6 font-sans font-normal text-sm leading-5 text-slate-700 whitespace-nowrap">
							{row.prisKalkyl}
						</td>
						<td className="py-3 px-6 font-sans font-normal text-sm leading-5 text-slate-700 whitespace-nowrap">
							{row.tgProcent}
						</td>
						<td className="py-3 px-6 font-sans font-normal text-sm leading-5 text-slate-700 whitespace-nowrap">
							{row.tbSek}
						</td>
						<td className="py-3 px-6 font-sans font-normal text-sm leading-5 text-slate-700 whitespace-nowrap">
							{row.kostnad}
						</td>
						<td className="py-3 px-6 font-sans font-normal text-sm leading-5 text-slate-700 whitespace-nowrap">
							{row.andringsDatum}
						</td>
						<td className="py-3 px-6 font-sans font-normal text-sm leading-5 text-slate-700 whitespace-nowrap">
							{"\u2014"}
						</td>
						<td className="py-3 w-12" />
					</tr>
				))}
			</tbody>
		</table>
	);
}

export function ArticleDetailPage() {
	const t = useTranslate();
	const router = useRouter();
	const params = useParams();
	const id = params.id as string;

	const [article, setArticle] = useState<ArticleDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchArticle = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await getArticleDetailAPIAction(id);
			setArticle(data);
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsLoading(false);
		}
	}, [id, t]);

	useEffect(() => {
		fetchArticle();
	}, [fetchArticle]);

	if (isLoading) {
		return (
			<div className="flex flex-1 flex-col overflow-y-auto bg-slate-50 pt-6 pb-6 px-4">
				<div className="flex items-center gap-2">
					<div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
					<div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
				</div>
				<div className="h-4 w-20 animate-pulse rounded bg-slate-200 opacity-60 my-2" />
				<div className="flex gap-6 border-b border-slate-200 mb-6">
					<div className="h-10 w-24 animate-pulse rounded bg-slate-200" />
					<div className="h-10 w-24 animate-pulse rounded bg-slate-200" />
				</div>
				<div className="grid grid-cols-1 gap-4 sm:gap-6">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="h-48 animate-pulse rounded-lg border border-slate-200 bg-white"
						/>
					))}
				</div>
			</div>
		);
	}

	if (!article) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-4 py-16">
				<h2 className="mb-2 text-lg font-semibold leading-7 text-zinc-950">
					<Translate text={localizationConstants.noDataFound} />
				</h2>
				<Button onClick={() => router.push("/tools/register?tab=artikel&subtab=artikel")}>
					<Translate text={localizationConstants.goBackButton} />
				</Button>
			</div>
		);
	}

	const handleEdit = () => {
		router.push("/tools/register/create-article");
	};

	return (
		<div className="flex flex-1 flex-col overflow-y-auto bg-slate-50 pt-4 pb-4 px-2 sm:px-2 md:px-2">
			<div className="mb-0.5 flex items-center gap-2">
				<Button
					variant="ghost"
					size="icon"
					aria-label={t(localizationConstants.goBackToRegisterLabel)}
					onClick={() => router.push("/tools/register?tab=artikel&subtab=artikel")}
					className="h-8 w-8 shrink-0"
				>
					<ArrowLeft className="h-5 w-5 text-slate-700" />
				</Button>
				<h1 className="text-2xl font-semibold leading-none tracking-[-0.6px] text-zinc-950">
					<Translate text={localizationConstants.detailTitle} />
				</h1>
			</div>

			<p className="mb-2 ml-10 text-sm font-normal leading-5 text-zinc-500">
				#{article.articleNo}
			</p>

			<Tabs defaultValue="basic" className="ml-0 sm:ml-10">
				<TabsList variant="line" className="mb-2">
					<TabsTrigger
						value="basic"
						className="min-w-fit text-sm font-semibold leading-none tracking-normal text-center"
					>
						<Translate text={localizationConstants.articleGrundInfoTab} />
					</TabsTrigger>
					<TabsTrigger
						value="structured"
						className="min-w-fit text-sm font-semibold leading-none tracking-normal text-center"
					>
						<Translate text={localizationConstants.articleStruktureradInfoTab} />
					</TabsTrigger>
				</TabsList>

				<TabsContent value="basic">
					<div className="flex flex-col gap-4">
						{/* Kund + Prislista combined card */}
						<SectionCard
							icon={<UserPlus className="h-5 w-5 sm:h-6 sm:w-6" />}
							title={localizationConstants.articleKundSection}
							onEdit={handleEdit}
						>
							<CardContent className="p-0 px-4 pt-4 pb-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-4">
									<InfoRow
										label={localizationConstants.articleNrLabel}
										value={article.articleNo}
									/>
									<InfoRow
										label={localizationConstants.articleBenamningLabel}
										value={article.benamning}
									/>
									<InfoRow
										label={localizationConstants.articleEanLabel}
										value={article.ean}
									/>
									<InfoRowLink
										label={localizationConstants.articleLeverantorLabel}
										value={article.leverantor}
										href={`/tools/register/supplier/${article.leverantorId}`}
									/>
									<InfoRow
										label={localizationConstants.articleHusarbeteLabel}
										value={article.husarbete}
									/>
									<InfoRow
										label={localizationConstants.articleSupplierArticleNoLabel}
										value={article.supplierArticleNo}
									/>
									<InfoRow
										label={localizationConstants.articleTypHusarbeteLabel}
										value={article.typHusarbete}
									/>
									<InfoRow
										label={localizationConstants.articleEnhetLabel}
										value={article.enhet}
									/>
									<InfoRow
										label={localizationConstants.articleTypAvArtikelLabel}
										value={article.typAvArtikel}
									/>
									<InfoRow
										label={localizationConstants.articleLagerVaraLabel}
										value={article.lagerVara}
									/>
								</div>

								{/* Prislista Section */}
								{article.priceListRows.length > 0 && (
									<div className="border-slate-200 pt-4">
										<div className="flex w-full items-center gap-2 bg-slate-100 px-4 py-1.5 border-b text-left">
											<h3 className="text-sm font-medium text-slate-900 sm:text-base">
												<Translate text={localizationConstants.articlePrislistaLabel} />
											</h3>
										</div>
										<div className="-mx-4 sm:mx-0 sm:px-0 mt-4 overflow-x-auto px-4">
											<PriceListTable rows={article.priceListRows} />
										</div>
									</div>
								)}
							</CardContent>
						</SectionCard>

						{/* Bokföringsuppgifter */}
						<SectionCard
							icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6" />}
							title={localizationConstants.articleBokoringsUppgifterSection}
							onEdit={handleEdit}
						>
							<CardContent className="p-0 px-4 pt-4 pb-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-4">
									<InfoRow
										label={localizationConstants.articleForsaljningLabel}
										value={article.forsaljning}
									/>
									<InfoRow
										label={localizationConstants.articleMomsLabel}
										value={article.moms}
									/>
									<InfoRow
										label={localizationConstants.articleForsaljningSELabel}
										value={article.forsaljningSE}
									/>
									<InfoRow
										label={localizationConstants.articleForsaljningEULabel}
										value={article.forsaljningEU}
									/>
									<InfoRow
										label={localizationConstants.articleLagerkontoLabel}
										value={article.lagerkonto}
									/>
									<InfoRow
										label={localizationConstants.articleForsaljningEUMomsLabel}
										value={article.forsaljningEUMoms}
									/>
									<InfoRow
										label={localizationConstants.articleForsaljningExportLabel}
										value={article.forsaljningExport}
									/>
									<InfoRow
										label={localizationConstants.articleInkopLabel}
										value={article.inkop}
									/>
								</div>
							</CardContent>
						</SectionCard>
					</div>
				</TabsContent>

				<TabsContent value="structured">
					<div className="flex flex-col gap-4">
						{/* Priser */}
						<SectionCard
							icon={<Tag className="h-5 w-5 sm:h-6 sm:w-6" />}
							title={localizationConstants.articlePriserSection}
							onEdit={handleEdit}
						>
							<CardContent className="p-0 px-4 pt-4 pb-4">
								<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
									<InfoRow
										label={localizationConstants.articlePriserA}
										value={article.priserA}
									/>
									<InfoRow
										label={localizationConstants.articleEuroprislista}
										value={article.europrislista}
									/>
									<InfoRow
										label={localizationConstants.articleKampanj}
										value={article.kampanj}
									/>
									<InfoRow
										label={localizationConstants.articleVipPriser}
										value={article.vipPriser}
									/>
								</div>
							</CardContent>
						</SectionCard>

						{/* Bokföringsuppgifter + Lagerplats */}
						<SectionCard
							icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6" />}
							title={localizationConstants.articleBokoringsUppgifterSection}
							onEdit={handleEdit}
						>
							<CardContent className="p-0 px-4 pt-4 pb-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3">
									<InfoRow
										label={localizationConstants.articleKalkylkostnad}
										value={article.kalkylkostnad}
									/>
									<InfoRow
										label={localizationConstants.articleBestallningspunkt}
										value={article.bestallningspunkt}
									/>
									<InfoRow
										label={localizationConstants.articleILager}
										value={article.iLager}
									/>
								</div>

								{/* Lagerplats Sub-section */}
								<div className="mt-4">
									<h4 className="mb-3 flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900">
										<Warehouse className="h-4 w-4 text-slate-600" />
										<Translate text={localizationConstants.articleLagerplatsSection} />
									</h4>
									<div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
										<InfoRow
											label={localizationConstants.articleViktLabel}
											value={article.vikt}
										/>
										<InfoRow
											label={localizationConstants.articleLangdLabel}
											value={article.langd}
										/>
										<InfoRow
											label={localizationConstants.articleBreddLabel}
											value={article.bredd}
										/>
										<InfoRow
											label={localizationConstants.articleHojdLabel}
											value={article.hojd}
										/>
										<InfoRow
											label={localizationConstants.articleMaterialLabel}
											value={article.material}
										/>
									</div>
								</div>
							</CardContent>
						</SectionCard>

						{/* Bokföringsuppgifter */}
						<SectionCard
							icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6" />}
							title={localizationConstants.articleBokforingsuppgifterSection}
							onEdit={handleEdit}
						>
							<CardContent className="p-0 px-4 pt-4 pb-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-4">
									<InfoRow
										label={localizationConstants.articleForsaljningLabel}
										value={article.forsaljningSESkattskyldighet}
									/>
									<InfoRow
										label={localizationConstants.articleMomsLabel}
										value={article.momsSESkattskyldighet}
									/>
									<InfoRow
										label={localizationConstants.articleForsaljningSELabel}
										value={article.forsaljningSE}
									/>
									<InfoRow
										label={localizationConstants.articleForsaljningEULabel}
										value={article.forsaljningEUSkattskyldighet}
									/>
									<InfoRow
										label={localizationConstants.articleLagerkontoLabel}
										value={article.lagerkonto}
									/>
									<InfoRow
										label={localizationConstants.articleForsaljningEUMomsLabel}
										value={article.forsaljningEUMoms}
									/>
									<InfoRow
										label={localizationConstants.articleForsaljningExportLabel}
										value={article.forsaljningExport}
									/>
									<InfoRow
										label={localizationConstants.articleInkopLabel}
										value={article.inkop}
									/>
									<InfoRow
										label={localizationConstants.articleLagerforandringLabel}
										value={article.lagerforandring}
									/>
								</div>
							</CardContent>
						</SectionCard>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
