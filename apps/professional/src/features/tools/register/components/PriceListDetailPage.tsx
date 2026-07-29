"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, PenLine, Eye, UserPlus, Settings, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DataTable,
	type DataTableColumn,
	type DataTableAction,
} from "@/components/table/DataTable";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";
import type { PriceListDetail, PriceListDetailArticle } from "../types";
import { getPriceListDetailAPIAction } from "../api/priceListRegister";

type TabKey = "basic" | "articles";

const TABS: { key: TabKey; labelKey: string }[] = [
	{ key: "basic", labelKey: localizationConstants.priceListDetailBasicInfoTab },
	{ key: "articles", labelKey: localizationConstants.priceListDetailArticleListTab },
];

export function PriceListDetailPage() {
	const router = useRouter();
	const params = useParams();
	const id = params.id as string;

	const [priceList, setPriceList] = useState<PriceListDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<TabKey>("basic");

	const fetchPriceList = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await getPriceListDetailAPIAction(id);
			setPriceList(data);
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchPriceList();
	}, [fetchPriceList]);

	if (isLoading || !priceList) {
		return (
			<div className="flex flex-1 flex-col overflow-y-auto bg-slate-50 px-3 py-6">
				<div className="flex items-center gap-2">
					<div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
					<div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
				</div>
				<div className="h-4 w-20 animate-pulse rounded bg-slate-200 opacity-60 my-2" />
				<div className="flex gap-6 border-b border-slate-200 mb-6">
					{TABS.map((tab) => (
						<div key={tab.key} className="h-10 w-24 animate-pulse rounded bg-slate-200" />
					))}
				</div>
				<div className="grid grid-cols-1 gap-6">
					{Array.from({ length: 2 }).map((_, i) => (
						<div key={i} className="h-48 animate-pulse rounded-lg border border-slate-200 bg-white" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col overflow-y-auto bg-slate-50 px-3 py-6">
			<div className="mb-1 flex items-center gap-2 ml-0">
				<button
					type="button"
					aria-label="Go back to price list"
					onClick={() => router.push("/tools/register/price-list")}
					className="rounded-md p-1 hover:bg-slate-100 cursor-pointer"
				>
					<ArrowLeft className="h-5 w-5 text-slate-700" />
				</button>
				<h1 className="text-xl font-semibold text-slate-900">
					<Translate text={localizationConstants.priceListDetailTitle} />
				</h1>
			</div>

			<p className="mb-4 text-sm text-slate-500 sm:ml-9">#{priceList.kod}</p>

			<div className="mb-4 flex gap-4 border-b border-slate-200 sm:ml-9 sm:gap-6">
				{TABS.map((tab) => (
					<button
						key={tab.key}
						type="button"
						onClick={() => setActiveTab(tab.key)}
						className={cn(
							"whitespace-nowrap pb-1.5 font-sans text-sm font-semibold leading-none tracking-normal text-center transition-colors border-b-2 cursor-pointer",
							activeTab === tab.key
								? "border-slate-900 text-slate-900"
								: "border-transparent text-slate-500 hover:text-slate-700",
						)}
					>
						<Translate text={tab.labelKey} />
					</button>
				))}
			</div>

			{activeTab === "basic" && <BasicInfoTab priceList={priceList} />}
			{activeTab === "articles" && <ArticleListTab priceList={priceList} />}
		</div>
	);
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col gap-1">
			<span className="text-sm font-medium leading-5 text-slate-900">
				<Translate text={label} />
			</span>
			<span className="text-sm font-normal leading-5 text-slate-500">
				<Translate text={value || ""} />
			</span>
		</div>
	);
}

// ─── Section Card ─────────────────────────────────────────────────────────────
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
		<Card className={cn("rounded-lg bg-white border border-slate-200", className)}>
			<CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 px-4 py-0 [.border-b]:pb-0 h-14 sm:px-6">
				<CardTitle className="flex items-center gap-2 text-sm font-medium leading-6 text-slate-900 sm:text-base">
					{icon && <span className="inline-flex text-slate-900">{icon}</span>}
					<Translate text={title} />
				</CardTitle>
				{onEdit && (
					<button
						type="button"
						onClick={onEdit}
						className="pointer-events-auto flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-slate-200 sm:h-9 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm transition-colors"
					>
						<PenLine className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-900" />
						<Translate text={localizationConstants.editLabel} />
					</button>
				)}
			</CardHeader>
			<CardContent className="px-4 py-6 sm:px-6">{children}</CardContent>
		</Card>
	);
}

// ─── Basic Info Tab ───────────────────────────────────────────────────────────
function BasicInfoTab({ priceList }: { priceList: PriceListDetail }) {
	const handleEdit = () => {};

	return (
		<div className="flex flex-col gap-6 ml-0 sm:ml-9">
			<SectionCard
				icon={<UserPlus className="h-6 w-6" />}
				title={localizationConstants.priceListDetailGrundInfoSection}
				onEdit={handleEdit}
			>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<InfoRow label={localizationConstants.priceListDetailCodeLabel} value={priceList.kod} />
					<InfoRow label={localizationConstants.priceListDetailNameLabel} value={priceList.benamning} />
					<InfoRow label={localizationConstants.priceListDetailDateLabel} value={priceList.datum} />
					<InfoRow label={localizationConstants.priceListValidFromLabel} value={priceList.giltigFran} />
					<InfoRow label={localizationConstants.priceListValidToLabel} value={priceList.giltigTill} />
					<InfoRow label={localizationConstants.priceListCurrencyLabel} value={priceList.valuta} />
					<InfoRow label={localizationConstants.priceListDetailCreatedByLabel} value={priceList.skapadAv} />
					<InfoRow label={localizationConstants.priceListDetailCommentLabel} value={priceList.kommentar} />
				</div>
			</SectionCard>

			<SectionCard
				icon={<Settings className="h-6 w-6" />}
				title={localizationConstants.priceListDetailSettingsSection}
				onEdit={handleEdit}
			>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
					<InfoRow label={localizationConstants.priceListDetailCategoryLabel} value={priceList.kategori} />
					<InfoRow label={localizationConstants.priceListDetailUnitLabel} value={priceList.enhet} />
				</div>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<div className="flex flex-col border-0 rounded-none overflow-hidden">
						<div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5">
							<span className="text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.priceListDetailLinkedCustomersTitle} />
							</span>
						</div>
						<div className="flex flex-col bg-white">
							{priceList.kund.map((item) => (
								<span key={item} className="block py-2.5 px-4 text-sm text-slate-600 border-0">
									{item}
								</span>
							))}
						</div>
					</div>

					<div className="flex flex-col border-0 rounded-none overflow-hidden">
						<div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5">
							<span className="text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.priceListDetailLinkedSuppliersTitle} />
							</span>
						</div>
						<div className="flex flex-col bg-white">
							{priceList.leverantor.map((item) => (
								<span key={item} className="block py-2.5 px-4 text-sm text-slate-600 border-0">
									{item}
								</span>
							))}
						</div>
					</div>
				</div>
			</SectionCard>
		</div>
	);
}

// ─── Article List Tab ─────────────────────────────────────────────────────────
function ArticleListTab({ priceList }: { priceList: PriceListDetail }) {
	const router = useRouter();
	const [articles, setArticles] = useState(priceList.articles);

	const handleToggleFavorite = useCallback((id: string) => {
		setArticles((prev) =>
			prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)),
		);
	}, []);

	const handleRowClick = useCallback(
		(row: PriceListDetailArticle) => {
			router.push(`/tools/register/articles/${row.id}`);
		},
		[router],
	);

	const columns: DataTableColumn<PriceListDetailArticle>[] = useMemo(
		() => [
			{
				key: "isFavorite",
				label: "",
				headerClassName: "w-10 text-center",
				cellClassName: "text-center",
				render: (row) => (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							handleToggleFavorite(row.id);
						}}
						className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
					>
						<Star
							className={`h-4 w-4 ${
								row.isFavorite
									? "fill-[#111721] text-[#111721]"
									: "text-slate-400 hover:text-[#111721]"
							}`}
						/>
					</button>
				),
			},
			{
				key: "articleNo",
				label: localizationConstants.priceListDetailArticleNoHeader,
				sortable: true,
			},
			{
				key: "benamning",
				label: localizationConstants.priceListDetailBenamningHeader,
				sortable: true,
			},
			{
				key: "utprislistaA",
				label: localizationConstants.priceListDetailUtprislistaAHeader,
				sortable: true,
			},
			{
				key: "kalkylKostnad",
				label: localizationConstants.priceListDetailKalkylKostnadHeader,
				sortable: true,
			},
			{
				key: "lager",
				label: localizationConstants.priceListDetailStockHeader,
				sortable: true,
			},
			{
				key: "reserverat",
				label: localizationConstants.priceListDetailReservedHeader,
				sortable: true,
			},
			{
				key: "disponibelt",
				label: localizationConstants.priceListDetailAvailableHeader,
				sortable: true,
			},
			{
				key: "lagervarde",
				label: localizationConstants.priceListDetailStockValueHeader,
				sortable: true,
			},
			{
				key: "status",
				label: localizationConstants.priceListStatusHeader,
				sortable: true,
				render: (row) => (
					<span
						className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-semibold text-white ${
							row.status === "active" ? "bg-[#16A34A]" : "bg-slate-400"
						}`}
					>
						{row.status === "active" ? (
							<Translate text={localizationConstants.activeStatus} />
						) : (
							<Translate text={localizationConstants.inactiveStatus} />
						)}
					</span>
				),
			},
			{
				key: "view",
				label: "",
				headerClassName: "w-10 text-center",
				cellClassName: "text-center",
				render: (row) => (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							handleRowClick(row);
						}}
						className="inline-flex items-center justify-center p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
					>
						<Eye className="h-4 w-4" />
					</button>
				),
			},
		],
		[handleRowClick, handleToggleFavorite],
	);

	const actions: DataTableAction<PriceListDetailArticle>[] = useMemo(
		() => [
			{
				label: localizationConstants.viewLabel,
				icon: <Eye className="h-4 w-4" />,
				onClick: (row) => handleRowClick(row),
			},
		],
		[handleRowClick],
	);

	return (
		<div className="flex flex-col gap-6 ml-0 sm:ml-9">
			<DataTable
				data={articles}
				columns={columns}
				rowKey={(row) => row.id}
				actions={actions}
				loading={false}
			/>
		</div>
	);
}
