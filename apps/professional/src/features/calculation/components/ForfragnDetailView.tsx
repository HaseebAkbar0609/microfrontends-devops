"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	ArrowUpDown,
	ChevronDown,
	Folder,
	Folders,
	ClipboardList,
	MoreVertical,
	Plus,
	Trash2,
	Pencil,
	Upload,
	X,
	Check,
	Archive,
	FileText,
} from "lucide-react";
import { Search } from "@/components/search/Search";
import { TablePagination } from "@/components/table/TablePagination";
import type { InquiryDetailResponse } from "../api/inquiryApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { useInquiryDetail } from "../hooks/useInquiry";
import { KalkylDocIcon } from "./KalkylDocIcon";
import {
	getCalculationAvailableDocumentsAPIAction,
	MOCK_AVAILABLE_DOCUMENTS,
	type AvailableDocOption,
} from "../api/createCalculation";
import type { InbjudnaRow, InbjudnaStatus, SupplierDocument } from "../types/forfragan";

const INBJUDNA_STATUS_CLASSES: Record<InbjudnaStatus, string> = {
	"received-price": "bg-emerald-600 text-white font-medium",
	ongoing: "bg-amber-500 text-white font-medium",
	declined: "bg-red-500 text-white font-medium",
};

interface ForfragnDetailViewProps {
	calcId: string;
	requestId: string;
}

export function ForfragnDetailView({ calcId, requestId }: ForfragnDetailViewProps) {
	const router = useRouter();
	const t = useTranslate();

	const {
		data,
		isLoading,
		activeTab,
		setActiveTab,
		isAddSupplierOpen,
		setIsAddSupplierOpen,
		newSupplierName,
		setNewSupplierName,
		newSupplierAmount,
		setNewSupplierAmount,
		handleAddSupplier,
		uploadedFiles,
		handleUploadDocument,
		handleDeleteDocument,
		gdprAccepted,
		setGdprAccepted,
	} = useInquiryDetail(calcId, requestId);

	const handleBack = () => {
		router.push(`/module/business/calculation/overview/${calcId}/inquiry`);
	};

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
			{/* Page Header matching Figma Images 2, 3, 4 */}
			<div className="shrink-0 border-b border-slate-200 bg-slate-50">
				<div className="px-6 pt-5 pb-3.5 sm:pl-15">
					<div className="flex items-start gap-2.5 sm:gap-3 -ml-4 sm:-ml-10">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={handleBack}
							className="h-8 w-8 sm:h-9 sm:w-9 mt-0.5 cursor-pointer text-slate-900 hover:bg-transparent hover:text-slate-700 p-0 shrink-0 flex items-center justify-center shadow-none"
						>
							<ArrowLeft className="h-6 w-6 sm:h-8 sm:w-8 text-slate-900 shrink-0" strokeWidth={2.5} />
						</Button>
						<div className="flex flex-col">
							<h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 leading-tight">
								<Translate text={localizationConstants.calcForfragnAllaForfragnningar} />
							</h1>
							<p className="text-xs font-normal text-slate-600">
								<Translate text={localizationConstants.calcKalkyl} /> : {calcId}
							</p>
						</div>
					</div>
				</div>

				{/* Subtabs Bar */}
				<div className="px-6 -mb-[1px] sm:pl-15">
					<div className="overflow-x-auto scrollbar-none">
						<nav className="inline-flex items-center gap-1 sm:gap-2 min-w-max h-[36px]" aria-label="Inquiry Detail Tabs">
							<Button
								type="button"
								variant="ghost"
								onClick={() => setActiveTab("inbjudna")}
								className={cn(
									"relative inline-flex items-center justify-center h-[36px] px-3 sm:px-4.5 pb-2 pt-1 font-sans text-sm leading-none transition-colors cursor-pointer rounded-none hover:bg-transparent shadow-none",
									activeTab === "inbjudna"
										? "text-slate-950 font-bold hover:text-slate-950"
										: "text-slate-600 hover:text-slate-900 font-semibold",
								)}
							>
								<Translate text={localizationConstants.calcForfragnInbjudna} />
								{activeTab === "inbjudna" && (
									<span className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-950 z-10" />
								)}
							</Button>
							<Button
								type="button"
								variant="ghost"
								onClick={() => setActiveTab("projektinformation")}
								className={cn(
									"relative inline-flex items-center justify-center h-[36px] px-3 sm:px-4.5 pb-2 pt-1 font-sans text-sm leading-none transition-colors cursor-pointer rounded-none hover:bg-transparent shadow-none",
									activeTab === "projektinformation"
										? "text-slate-950 font-bold hover:text-slate-950"
										: "text-slate-600 hover:text-slate-900 font-semibold",
								)}
							>
								<Translate text={localizationConstants.calcInquiryWizStep1} />
								{activeTab === "projektinformation" && (
									<span className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-950 z-10" />
								)}
							</Button>
							<Button
								type="button"
								variant="ghost"
								onClick={() => setActiveTab("dokument")}
								className={cn(
									"relative inline-flex items-center justify-center h-[36px] px-3 sm:px-4.5 pb-2 pt-1 font-sans text-sm leading-none transition-colors cursor-pointer rounded-none hover:bg-transparent shadow-none",
									activeTab === "dokument"
										? "text-slate-950 font-bold hover:text-slate-950"
										: "text-slate-600 hover:text-slate-900 font-semibold",
								)}
							>
								<Translate text={localizationConstants.calcInquiryWizStep3} />
								{activeTab === "dokument" && (
									<span className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-950 z-10" />
								)}
							</Button>
						</nav>
					</div>
				</div>
			</div>

			{/* Main Tab Content */}
			<div className="flex-1 overflow-y-auto bg-slate-50">
				{isLoading ? (
					<div className="p-6 sm:pl-15 sm:pr-6 space-y-4">
						<Skeleton className="h-64 w-full rounded-xl" />
					</div>
				) : activeTab === "inbjudna" ? (
					<div className="p-6 sm:pl-15 sm:pr-6 bg-slate-50 min-h-full">
						<InbjudnaTab
							rows={data?.inbjudna ?? []}
							calcId={calcId}
							requestId={requestId}
							onOpenAddSupplier={() => {
								showToast("info", t(localizationConstants.comingSoon));
							}}
						/>
					</div>
				) : activeTab === "projektinformation" ? (
					<div className="p-6 sm:pl-15 sm:pr-6 bg-slate-50 min-h-full">
						<ProjektInfoTab data={data} calcId={calcId} />
					</div>
				) : (
					<div className="p-6 sm:pl-15 sm:pr-6 bg-slate-50 min-h-full">
						<DokumentTab
							documents={uploadedFiles}
							onAddDocument={(doc) => {
								handleUploadDocument(doc.namn);
							}}
							onRemoveDocument={handleDeleteDocument}
							gdprAccepted={gdprAccepted}
							setGdprAccepted={setGdprAccepted}
						/>
					</div>
				)}
			</div>

			{/* Add Supplier Modal */}
			<Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
				<DialogContent className="sm:max-w-md rounded-xl bg-white shadow-xl">
					<DialogHeader>
						<DialogTitle className="text-lg font-semibold text-slate-900">
							<Translate text={localizationConstants.calcForfragnAddSupplier} />
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-3">
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.calcForfragnCompany} />
							</Label>
							<Input
								value={newSupplierName}
								onChange={(e) => setNewSupplierName(e.target.value)}
								placeholder={t(localizationConstants.calcForfragnCompanyPlaceholder)}
								className="rounded-lg border-slate-300 text-sm"
							/>
						</div>
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.calcForfragnAmount} /> (SEK)
							</Label>
							<Input
								value={newSupplierAmount}
								onChange={(e) => setNewSupplierAmount(e.target.value)}
								placeholder={t(localizationConstants.calcForfragnAmountPlaceholder)}
								className="rounded-lg border-slate-300 text-sm"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddSupplierOpen(false)} className="rounded-lg cursor-pointer">
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							onClick={handleAddSupplier}
							disabled={!newSupplierName.trim()}
							className="rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 cursor-pointer"
						>
							<Translate text={localizationConstants.save} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

// ── Inbjudna Tab Component (Image 2) ─────────────────────────────────────────

type InbjudnaSortField = keyof Pick<InbjudnaRow, "datum" | "company" | "amount" | "status">;

interface InbjudnaTabProps {
	rows: InbjudnaRow[];
	calcId: string;
	requestId: string;
	onOpenAddSupplier: () => void;
}

function InbjudnaTab({ rows, calcId, requestId, onOpenAddSupplier }: InbjudnaTabProps) {
	const t = useTranslate();
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState<InbjudnaStatus | null>(null);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const { sortField, sortDir, toggleSort } = useTableSort<InbjudnaSortField>();

	const statusOptions: { value: InbjudnaStatus; label: string }[] = [
		{ value: "received-price", label: t(localizationConstants.calcForfragnStatusReceivedPrice) },
		{ value: "ongoing", label: t(localizationConstants.calcForfragnStatusPagar) },
		{ value: "declined", label: t(localizationConstants.calcForfragnStatusEjPaborjad) },
	];

	const activeFilterLabel = filterStatus
		? (statusOptions.find((o) => o.value === filterStatus)?.label ?? filterStatus)
		: t(localizationConstants.filter);

	const filtered = useMemo(() => {
		let result = rows;
		if (filterStatus) {
			result = result.filter((r) => r.status === filterStatus);
		}
		const q = search.toLowerCase().trim();
		if (q) {
			result = result.filter((r) => r.company.toLowerCase().includes(q) || r.datum.includes(q));
		}
		return result;
	}, [rows, search, filterStatus]);

	const sorted = useMemo(
		() => sortItems(filtered, sortField, sortDir, (r, f) => r[f as keyof InbjudnaRow]),
		[filtered, sortField, sortDir],
	);

	const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
	const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

	return (
		<Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col p-4 sm:p-5">
			{/* Search & Actions Toolbar */}
			<div className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between bg-white">
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
					<Search
						value={search}
						onChange={(val) => {
							setSearch(val);
							setPage(1);
						}}
						placeholder={localizationConstants.search}
						className="h-9 w-full"
						wrapperClassName="w-full sm:w-72"
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="h-9 w-full sm:w-auto shrink-0 justify-between sm:justify-center cursor-pointer gap-2 border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 shadow-none rounded-lg"
							>
								<span>{activeFilterLabel}</span>
								<ChevronDown className="h-3.5 w-3.5 text-slate-500" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-48 bg-white shadow-md border-slate-200 rounded-lg">
							<DropdownMenuItem
								className="cursor-pointer text-sm flex items-center justify-between"
								onClick={() => {
									setFilterStatus(null);
									setPage(1);
								}}
							>
								<Translate text={localizationConstants.adminUsersFilterAll} />
								{!filterStatus && <Check size={14} className="text-slate-900" />}
							</DropdownMenuItem>
							{statusOptions.map((opt) => (
								<DropdownMenuItem
									key={opt.value}
									className="cursor-pointer text-sm flex items-center justify-between"
									onClick={() => {
										setFilterStatus(opt.value);
										setPage(1);
									}}
								>
									<span>{opt.label}</span>
									{filterStatus === opt.value && <Check size={14} className="text-slate-900" />}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<Button
					size="sm"
					onClick={onOpenAddSupplier}
					className="h-9 w-full sm:w-auto shrink-0 justify-center cursor-pointer gap-1.5 bg-neutral-950 px-4 text-sm font-semibold text-white hover:bg-neutral-800 rounded-lg shadow-sm"
				>
					<Plus className="h-4 w-4 stroke-[2.5]" />
					<Translate text={localizationConstants.calcForfragnAddSupplier} />
				</Button>
			</div>

			{/* Inbjudna Table */}
			<div className="overflow-x-auto">
				<Table className="w-full min-w-max border-collapse text-sm">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-transparent">
							<TableHead className="cursor-pointer px-4 py-2.5 text-left text-sm font-semibold text-slate-600 hover:text-slate-900" onClick={() => toggleSort("datum")}>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.agreementDetailDatum} />
									{renderSortIcon("datum", sortField, sortDir)}
								</div>
							</TableHead>
							<TableHead className="cursor-pointer px-4 py-2.5 text-left text-sm font-semibold text-slate-600 hover:text-slate-900" onClick={() => toggleSort("company")}>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.calcForfragnCompany} />
									{renderSortIcon("company", sortField, sortDir)}
								</div>
							</TableHead>
							<TableHead className="cursor-pointer px-4 py-2.5 text-left text-sm font-semibold text-slate-600 hover:text-slate-900" onClick={() => toggleSort("amount")}>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.calcForfragnAmount} />
									{renderSortIcon("amount", sortField, sortDir)}
								</div>
							</TableHead>
							<TableHead className="cursor-pointer px-4 py-2.5 text-left text-sm font-semibold text-slate-600 hover:text-slate-900" onClick={() => toggleSort("status")}>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.statusHeader} />
									{renderSortIcon("status", sortField, sortDir)}
								</div>
							</TableHead>
							<TableHead className="w-12 border-l border-slate-200 px-2 py-2.5 text-right" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginated.length === 0 ? (
							<TableRow className="border-b border-slate-200">
								<TableCell colSpan={5} className="h-36 text-center text-sm text-slate-400">
									<div className="flex flex-col items-center justify-center gap-2">
										<FileText className="h-8 w-8 text-slate-300" />
										<p><Translate text={localizationConstants.noDataFound} /></p>
									</div>
								</TableCell>
							</TableRow>
						) : (
							paginated.map((row) => (
								<TableRow
									key={row.id}
									className="border-b border-slate-200 hover:bg-slate-50/80 transition-colors cursor-pointer bg-white"
									onClick={() =>
										router.push(
											`/module/business/calculation/overview/${calcId}/forfragan/${requestId}/${row.id}`,
										)
									}
								>
									<TableCell className="px-4 py-2.5 text-slate-700">{row.datum}</TableCell>
									<TableCell className="px-4 py-2.5 font-normal text-slate-900">{row.company}</TableCell>
									<TableCell className="px-4 py-2.5 font-normal tabular-nums text-slate-900">
										{row.amount > 0 ? row.amount.toLocaleString("sv-SE") : "0"}
									</TableCell>
									<TableCell className="px-4 py-2.5">
										<span
											className={cn(
												"inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold tracking-wide",
												INBJUDNA_STATUS_CLASSES[row.status],
											)}
										>
											{row.status === "received-price"
												? t(localizationConstants.calcForfragnStatusReceivedPrice)
												: row.status === "ongoing"
													? t(localizationConstants.calcForfragnStatusPagar)
													: t(localizationConstants.calcForfragnStatusEjPaborjad)}
										</span>
									</TableCell>
									<TableCell className="border-l border-slate-200 px-2 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 cursor-pointer text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-lg p-0"
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-40 bg-white shadow-md border-slate-200 rounded-lg">
												<DropdownMenuItem
													className="cursor-pointer gap-2 text-sm font-medium text-slate-900 focus:text-slate-900"
													onClick={() =>
														router.push(
															`/module/business/calculation/overview/${calcId}/forfragan/${requestId}/${row.id}`,
														)
													}
												>
													<Archive className="h-4 w-4 text-slate-900" />
													<Translate text={localizationConstants.calcForfragnOpen} />
												</DropdownMenuItem>
												<DropdownMenuItem
													className="cursor-pointer gap-2 text-sm font-medium text-slate-900 focus:text-slate-900"
												>
													<Archive className="h-4 w-4 text-slate-900" />
													<Translate text={localizationConstants.archive} />
												</DropdownMenuItem>
												<DropdownMenuItem
													className="cursor-pointer gap-2 text-sm font-medium text-slate-900 focus:text-slate-900"
												>
													<Trash2 className="h-4 w-4 text-slate-900" />
													<Translate text={localizationConstants.calcArchiveDelete} />
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

			{/* Pagination Footer */}
			<div className="bg-white pt-3">
				<TablePagination
					currentPage={page}
					totalPages={totalPages}
					pageSize={pageSize}
					onPageChange={setPage}
					onPageSizeChange={(size) => {
						setPageSize(size);
						setPage(1);
					}}
				/>
			</div>
		</Card>
	);
}

// ── Projekt Information Tab Component (Image 3) ─────────────────────────────

interface CardSectionProps {
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	onEdit?: () => void;
	children: React.ReactNode;
}

function CardSection({ icon: Icon, title, onEdit, children }: CardSectionProps) {
	const t = useTranslate();
	return (
		<div className="rounded-lg border border-neutral-200 bg-white shadow-none">
			<div className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 sm:px-6">
				<div className="flex items-center gap-2 min-w-0">
					<Icon className="h-5 w-5 shrink-0 text-slate-800" />
					<span className="truncate text-base font-medium text-zinc-950">{title}</span>
				</div>
				{onEdit && (
					<Button
						type="button"
						variant="ghost"
						onClick={onEdit}
						className="flex h-auto shrink-0 cursor-pointer items-center gap-2 rounded-md bg-zinc-100 px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-zinc-950 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] hover:bg-zinc-200"
					>
						<Pencil className="h-4 w-4" />
						{t(localizationConstants.editLabel)}
					</Button>
				)}
			</div>
			<div className="p-4 sm:p-5">{children}</div>
		</div>
	);
}

function InfoField({ label, value }: { label: string; value?: string | null }) {
	return (
		<div className="flex flex-col gap-1 min-w-0">
			<p className="text-sm font-medium text-zinc-950 truncate">{label}</p>
			<p className="text-sm font-normal text-zinc-500 break-words">{value?.trim() || "-"}</p>
		</div>
	);
}

function ProjektInfoTab({
	data,
	calcId,
}: {
	data: InquiryDetailResponse | undefined;
	calcId: string;
}) {
	const t = useTranslate();
	const projekt = data?.projekt;
	const kontakt = data?.kontakt;

	const handleEditComingSoon = () => {
		showToast("info", t(localizationConstants.editComingSoon));
	};

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
			{/* Left column */}
			<div className="flex flex-col gap-4">
				<CardSection
					icon={Folder}
					title={t(localizationConstants.calcNewProjekt)}
					onEdit={handleEditComingSoon}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoField label={t(localizationConstants.calcDetailProjekteringNr)} value={projekt?.projektNr || "-"} />
						<InfoField label={t(localizationConstants.calcForfragnKalkylNo)} value={calcId || "-"} />
						<InfoField label={t(localizationConstants.calcDetailProjekteringNamn)} value={projekt?.projektNamn || "-"} />
						<InfoField label={t(localizationConstants.calcNewKvartersNamn)} value={projekt?.kvartersNamn || "-"} />
						<InfoField label={t(localizationConstants.calcDetailProjekteringAdress)} value={projekt?.projektAdress || "-"} />
						<InfoField label={t(localizationConstants.calcNewPostNr)} value={projekt?.postNr || "-"} />
						<InfoField label={t(localizationConstants.calcNewOrt)} value={projekt?.ort || "-"} />
					</div>
				</CardSection>

				<CardSection
					icon={Folder}
					title={t(localizationConstants.calcNewKontaktInfoSection)}
					onEdit={handleEditComingSoon}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoField label={t(localizationConstants.agreementDetailFornamn)} value={kontakt?.fornamn || "-"} />
						<InfoField label={t(localizationConstants.agreementDetailEfternamn)} value={kontakt?.efternamn || "-"} />
						<InfoField label={t(localizationConstants.calcNewAddressLabel)} value={kontakt?.adress || "-"} />
						<InfoField label={t(localizationConstants.registerPostalCodeLabel)} value={kontakt?.postNr || "-"} />
						<InfoField label={t(localizationConstants.agreementDetailMail)} value={kontakt?.mail || "-"} />
						<InfoField label={t(localizationConstants.calcNewTelefon)} value={kontakt?.telefon || "-"} />
						<InfoField label={t(localizationConstants.calcNewOrt)} value={kontakt?.ort || "-"} />
						<InfoField label={t(localizationConstants.agreementDetailRoll)} value={t(localizationConstants.calcNewBestallare)} />
					</div>
				</CardSection>
			</div>

			{/* Right column */}
			<div className="flex flex-col gap-4">
				<CardSection
					icon={ClipboardList}
					title={t(localizationConstants.calcNewProjektInfo)}
					onEdit={handleEditComingSoon}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoField label={t(localizationConstants.calcProType)} value={projekt?.type || "-"} />
						<InfoField label={t(localizationConstants.category)} value={projekt?.kategori || "-"} />
						<InfoField label={t(localizationConstants.calcNewAvdelning)} value={projekt?.avdelning || "-"} />
						<InfoField label={t(localizationConstants.calcNewKontraktsumma)} value={projekt?.kontraktsumma || "-"} />
						<InfoField label={t(localizationConstants.calcNewOffertNr)} value={projekt?.offertNr || "-"} />
						<InfoField label={t(localizationConstants.calcStatStartDate)} value={projekt?.startDatum || "-"} />
						<InfoField label={t(localizationConstants.calcStatEndDate)} value={projekt?.slutDatum || "-"} />
						<InfoField label={t(localizationConstants.calcDetailSenasteDatumOffert)} value={projekt?.senasteDatum || "-"} />
					</div>
				</CardSection>
			</div>
		</div>
	);
}

// ── Dokument Tab Component (Matching Create Calculation Step 3) ───────────────

interface DokumentTabProps {
	documents: SupplierDocument[];
	onAddDocument: (doc: SupplierDocument) => void;
	onRemoveDocument: (id: string) => void;
	gdprAccepted: boolean;
	setGdprAccepted: (val: boolean) => void;
}

function DokumentTab({
	documents,
	onAddDocument,
	onRemoveDocument,
	gdprAccepted,
	setGdprAccepted,
}: DokumentTabProps) {
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [availableDocs, setAvailableDocs] = useState<AvailableDocOption[]>(MOCK_AVAILABLE_DOCUMENTS);

	useEffect(() => {
		let isMounted = true;
		async function fetchAvailableDocs() {
			try {
				const docs = await getCalculationAvailableDocumentsAPIAction();
				if (isMounted && docs.length > 0) {
					setAvailableDocs(docs);
				}
			} catch {
				// Fallback to MOCK_AVAILABLE_DOCUMENTS
			}
		}
		fetchAvailableDocs();
		return () => {
			isMounted = false;
		};
	}, []);

	function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files) return;
		const today = new Date().toISOString().split("T")[0];
		Array.from(files).forEach((file, index) => {
			const lower = file.name.toLowerCase();
			const fileType: SupplierDocument["fileType"] = lower.endsWith(".pdf")
				? "pdf"
				: lower.endsWith(".doc") || lower.endsWith(".docx")
					? "doc"
					: "img";
			onAddDocument({
				id: `doc_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 6)}`,
				datum: today,
				namn: file.name,
				typ: fileType === "pdf" ? "PDF" : fileType === "doc" ? "DOC" : "IMG",
				fileType,
			});
		});
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	function handleSelectMockDoc(docOption: AvailableDocOption) {
		if (documents.some((d) => d.namn === docOption.namn)) return;
		const today = new Date().toISOString().split("T")[0];
		onAddDocument({
			id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
			datum: today,
			namn: docOption.namn,
			typ: docOption.typ,
			fileType: docOption.fileType,
		});
	}

	return (
		<div className="flex flex-col gap-4">
			<Card className="gap-0 overflow-hidden rounded-lg border border-slate-200 bg-white py-0 pb-0 shadow-none">
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
						<Folders className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.calcNewStep3Tab} />
					</CardTitle>
				</CardHeader>
				<CardContent className="px-6 py-5">
					{/* Upload & Dropdown selector */}
					<div className="mb-5">
						<Label className="mb-1 block text-sm font-medium text-slate-900">
							<Translate text={localizationConstants.agreementUploadFiles} />
						</Label>
						<p className="mb-3 text-xs sm:text-sm text-slate-500">
							<Translate text={localizationConstants.agreementFileTypes} />
						</p>
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<div
										role="button"
										tabIndex={0}
										className="flex flex-1 items-center justify-between min-h-10 rounded-md border border-slate-200 bg-white px-3 py-1.5 cursor-pointer hover:border-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 transition-colors select-none"
									>
										<div className="flex flex-1 flex-wrap items-center gap-1.5 py-0.5 min-w-0">
											{documents.length === 0 ? (
												<span className="text-sm text-slate-400">
													<Translate text={localizationConstants.agreementNoFile} />
												</span>
											) : (
												documents.map((doc) => (
													<span
														key={doc.id}
														className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-700 shadow-2xs max-w-full"
													>
														<span className="truncate max-w-[120px] sm:max-w-[160px] font-medium">{doc.namn}</span>
														<Button
															type="button"
															variant="ghost"
															size="icon"
															aria-label={t(localizationConstants.remove)}
															onClick={(e) => {
																e.preventDefault();
																e.stopPropagation();
																onRemoveDocument(doc.id);
															}}
															className="h-4 w-4 ml-0.5 rounded-xs p-0 text-slate-400 hover:bg-slate-200 hover:text-slate-700 cursor-pointer transition-colors shrink-0"
														>
															<X className="h-3 w-3" />
														</Button>
													</span>
												))
											)}
										</div>
										<ChevronDown className="h-4 w-4 text-slate-500 shrink-0 ml-2 pointer-events-none" aria-hidden="true" />
									</div>
								</DropdownMenuTrigger>

								<DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[280px] sm:min-w-[320px] max-h-64 overflow-y-auto p-1.5 border border-slate-200 bg-white shadow-lg rounded-lg z-50">
									{availableDocs.map((doc) => {
										const isAlreadySelected = documents.some((d) => d.namn === doc.namn);
										return (
											<DropdownMenuItem
												key={doc.id}
												disabled={isAlreadySelected}
												onClick={() => handleSelectMockDoc(doc)}
												className={cn(
													"flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-sm transition-colors",
													isAlreadySelected ? "opacity-50 cursor-not-allowed bg-slate-50" : "hover:bg-slate-100",
												)}
											>
												<span className={cn("truncate text-sm font-medium", isAlreadySelected ? "text-slate-400 line-through" : "text-slate-800")}>
													{doc.namn}
												</span>
												{isAlreadySelected ? (
													<span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
														✓
													</span>
												) : (
													<span className="text-xs text-slate-400 shrink-0">
														+<Translate text={localizationConstants.calcNewKopplaBtn} />
													</span>
												)}
											</DropdownMenuItem>
										);
									})}
									<div className="mt-1 pt-1 border-t border-slate-100">
										<DropdownMenuItem
											onClick={() => fileInputRef.current?.click()}
											className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm text-slate-700 hover:bg-slate-100 font-medium"
										>
											<Upload className="h-4 w-4 text-slate-500 shrink-0" />
											<span><Translate text={localizationConstants.agreementUpload} /></span>
										</DropdownMenuItem>
									</div>
								</DropdownMenuContent>
							</DropdownMenu>

							<input
								ref={fileInputRef}
								type="file"
								multiple
								aria-label={t(localizationConstants.agreementUploadFiles)}
								accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
								className="hidden"
								onChange={handleFileSelect}
							/>
							<Button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="h-10 w-full sm:w-auto min-w-25 cursor-pointer bg-slate-900 text-white hover:bg-slate-800 font-medium text-sm shadow-none shrink-0"
							>
								<Translate text={localizationConstants.agreementUpload} />
							</Button>
						</div>
					</div>

					{/* GDPR checkbox with divider line */}
					<div className="mb-6 border-b border-slate-200 pb-5">
						<div className="flex items-start gap-3">
							<Checkbox
								id="gdpr-doc"
								checked={gdprAccepted}
								onCheckedChange={(c) => setGdprAccepted(Boolean(c))}
								className="mt-0.5 shrink-0 border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:text-white data-[state=checked]:border-slate-900"
							/>
							<Label
								htmlFor="gdpr-doc"
								className="block cursor-pointer text-xs sm:text-sm font-normal text-slate-600 leading-relaxed"
							>
								<span>
									<Translate text={localizationConstants.calcNewGdprText} />{" "}
								</span>
								<span
									role="link"
									tabIndex={0}
									onClick={(e) => {
										e.stopPropagation();
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.stopPropagation();
										}
									}}
									className="inline text-orange-500 underline hover:text-orange-600 font-medium cursor-pointer"
								>
									<Translate text={localizationConstants.calcNewGdprLink} />
								</span>{" "}
								<span>
									<Translate text={localizationConstants.calcNewGdprSuffix} />
								</span>
							</Label>
						</div>
					</div>

					{/* Attached documents table */}
					<div>
						<p className="mb-3 text-sm font-medium text-slate-900">
							<Translate text={localizationConstants.agreementCreateBifogadeDokument} />
						</p>
						<div className="overflow-x-auto rounded border border-slate-200">
							<Table>
								<TableHeader>
									<TableRow className="h-11 border-b border-slate-200">
										<TableHead className="px-4 text-left font-medium text-slate-500">
											<div className="flex items-center gap-1">
												<Translate text={localizationConstants.agreementDetailDatum} />
												<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
											</div>
										</TableHead>
										<TableHead className="px-4 text-left font-medium text-slate-500">
											<div className="flex items-center gap-1">
												<Translate
													text={localizationConstants.agreementDetailDokumentetsNamn}
												/>
												<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
											</div>
										</TableHead>
										<TableHead className="px-4 text-left font-medium text-slate-500">
											<div className="flex items-center gap-1">
												<Translate text={localizationConstants.calcProType} />
												<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
											</div>
										</TableHead>
										<TableHead className="px-4 text-left font-medium text-slate-500">
											<div className="flex items-center gap-1">
												<Translate text={localizationConstants.agreementDetailFil} />
												<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
											</div>
										</TableHead>
										<TableHead className="w-36 border-l border-slate-200 px-4" />
									</TableRow>
								</TableHeader>
								<TableBody>
									{documents.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={5}
												className="h-24 text-center text-sm text-slate-400"
											>
												<Translate text={localizationConstants.agreementNoDocuments} />
											</TableCell>
										</TableRow>
									) : (
										documents.map((doc) => {
											const fileExt =
												doc.fileType === "doc"
													? "DOC"
													: doc.fileType === "img"
														? "IMG"
														: "PDF";
											return (
												<TableRow
													key={doc.id}
													className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors"
												>
													<TableCell className="px-4 py-3 text-sm text-slate-900 font-normal">
														{doc.datum}
													</TableCell>
													<TableCell className="px-4 py-3">
														<div className="inline-flex items-center gap-3 text-slate-900 font-normal text-sm">
															<KalkylDocIcon
																fileType={doc.fileType}
																fileName={doc.namn}
																className="h-10 w-8 shrink-0"
															/>
															<span className="truncate">{doc.namn}</span>
														</div>
													</TableCell>
													<TableCell className="px-4 py-3 text-sm text-slate-900 font-normal">
														{doc.typ}
													</TableCell>
													<TableCell className="px-4 py-3 text-sm text-slate-900 font-normal uppercase">
														{fileExt}
													</TableCell>
													<TableCell className="border-l border-slate-200 px-4 py-3 text-right">
														<div className="flex items-center justify-end gap-3">
															<Button
																type="button"
																variant="outline"
																size="sm"
																className="h-8 rounded-md border-slate-200 bg-white px-3 text-xs font-normal text-slate-900 hover:bg-slate-50 shadow-none cursor-pointer"
															>
																<Translate text={localizationConstants.agreementCreateSeFil} />
															</Button>
															<Button
																type="button"
																variant="ghost"
																size="icon"
																aria-label={t(localizationConstants.calcArchiveDelete)}
																onClick={() => onRemoveDocument(doc.id)}
																className="h-8 w-8 cursor-pointer text-slate-900 hover:bg-slate-100 rounded-md p-0"
															>
																<Trash2 className="h-4 w-4 text-slate-900" />
															</Button>
														</div>
													</TableCell>
												</TableRow>
											);
										})
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
