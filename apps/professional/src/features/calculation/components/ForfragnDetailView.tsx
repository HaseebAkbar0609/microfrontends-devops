"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	ChevronDown,
	File,
	Folder,
	MoreVertical,
	Plus,
	Search,
	Trash2,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import type { InbjudnaRow, InbjudnaStatus, SupplierDocument } from "../types/forfragan";

// ── Inbjudna tab ──────────────────────────────────────────────────────────────

const INBJUDNA_STATUS_CLASSES: Record<InbjudnaStatus, string> = {
	"received-price": "bg-[#059669] text-white",
	ongoing: "bg-[#EAB308] text-white",
	declined: "bg-red-500 text-white",
};

type InbjudnaSortField = keyof Pick<InbjudnaRow, "datum" | "company" | "amount" | "status">;

interface InbjudnaTabProps {
	rows: InbjudnaRow[];
	calcId: string;
	requestId: string;
}

function InbjudnaTab({ rows, calcId, requestId }: InbjudnaTabProps) {
	const t = useTranslate();
	const router = useRouter();
	const [search, setSearch] = useState("");
	const { sortField, sortDir, toggleSort } = useTableSort<InbjudnaSortField>();

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		return q ? rows.filter((r) => r.company.toLowerCase().includes(q) || r.datum.includes(q)) : rows;
	}, [rows, search]);

	const sorted = useMemo(
		() => sortItems(filtered, sortField, sortDir, (r, f) => r[f as keyof InbjudnaRow]),
		[filtered, sortField, sortDir],
	);

	const TH =
		"cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800";

	return (
		<div className="overflow-hidden rounded-lg border border-[#E5E5E5] bg-white">
			{/* Search / filter toolbar */}
			<div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
				<div className="relative">
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 opacity-50" />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder={t(localizationConstants.search)}
						className="h-10 w-72 rounded-none border-x-0 border-t-0 border-b border-b-slate-200 pl-9 text-sm shadow-none focus-visible:ring-0"
					/>
				</div>
				<Button variant="outline" size="sm" className="h-9 cursor-pointer gap-1 text-sm">
					<Translate text={localizationConstants.filter} />
					<ChevronDown className="h-4 w-4" />
				</Button>
			</div>

			<table className="w-full border-collapse text-sm">
				<thead>
					<tr className="border-b border-slate-200">
						<th className={TH} onClick={() => toggleSort("datum")}>
							<div className="flex items-center gap-1">
								<Translate text={localizationConstants.agreementDetailDatum} />
								{renderSortIcon("datum", sortField, sortDir)}
							</div>
						</th>
						<th className={TH} onClick={() => toggleSort("company")}>
							<div className="flex items-center gap-1">
								<Translate text={localizationConstants.calcForfragnCompany} />
								{renderSortIcon("company", sortField, sortDir)}
							</div>
						</th>
						<th className={TH} onClick={() => toggleSort("amount")}>
							<div className="flex items-center gap-1">
								<Translate text={localizationConstants.calcForfragnAmount} />
								{renderSortIcon("amount", sortField, sortDir)}
							</div>
						</th>
						<th className={TH} onClick={() => toggleSort("status")}>
							<div className="flex items-center gap-1">
								<Translate text={localizationConstants.statusHeader} />
								{renderSortIcon("status", sortField, sortDir)}
							</div>
						</th>
						<th className="border-l border-slate-200 px-3">
							<button
								type="button"
								className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-zinc-700 hover:bg-slate-100"
							>
								<Plus className="h-4 w-4" />
							</button>
						</th>
					</tr>
				</thead>
				<tbody>
					{sorted.map((row) => (
						<tr key={row.id} className="h-14 border-b border-[#E2E8F0] last:border-b-0 hover:bg-slate-50">
							<td className="px-4 text-zinc-950">{row.datum}</td>
							<td className="px-4 font-semibold text-zinc-950">{row.company}</td>
							<td className="px-4 tabular-nums font-semibold text-zinc-950">
								{row.amount > 0 ? row.amount.toLocaleString("sv-SE") : "0"}
							</td>
							<td className="px-4">
								<span
									className={cn(
										"inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
										INBJUDNA_STATUS_CLASSES[row.status],
									)}
								>
									{row.status === "received-price"
										? t(localizationConstants.calcForfragnStatusReceivedPrice)
										: row.status === "ongoing"
											? t(localizationConstants.calcForfragnStatusPagar)
											: t(localizationConstants.calcForfragnStatusEjPaborjad)}
								</span>
							</td>
							<td className="border-l border-[#E2E8F0] px-3">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<button
											type="button"
											className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md bg-[#F4F4F5] text-zinc-950 hover:bg-zinc-200"
										>
											<MoreVertical className="h-4 w-4" />
										</button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-32">
										<DropdownMenuItem
											className="cursor-pointer text-sm"
											onClick={() =>
												router.push(
													`/module/business/calculation/overview/${calcId}/forfragan/${requestId}/${row.id}`,
												)
											}
										>
											<Translate text={localizationConstants.calcForfragnOpen} />
										</DropdownMenuItem>
										<DropdownMenuItem className="cursor-pointer text-sm">
											<Translate text={localizationConstants.calcForfragnArchive} />
										</DropdownMenuItem>
										<DropdownMenuItem className="cursor-pointer text-sm text-red-600 focus:text-red-600">
											<Translate text={localizationConstants.calcArchiveDelete} />
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

// ── ProjektInformation tab ────────────────────────────────────────────────────

interface InfoFieldProps {
	label: string;
	value: string;
}

function InfoField({ label, value }: InfoFieldProps) {
	return (
		<div className="flex flex-col gap-0.5">
			<span className="text-xs text-slate-500">{label}</span>
			<span className="text-sm text-slate-800">{value || "–"}</span>
		</div>
	);
}

interface InfoCardProps {
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
}

function InfoCard({ title, icon, children }: InfoCardProps) {
	return (
		<div className="overflow-hidden rounded-lg border border-[#E5E5E5] bg-white">
			<div className="flex h-12 items-center justify-between border-b border-slate-200 px-5">
				<div className="flex items-center gap-2">
					{icon}
					<span className="text-sm font-semibold text-zinc-950">{title}</span>
				</div>
				<button
					type="button"
					className="flex cursor-pointer items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
				>
					✎ <Translate text={localizationConstants.editLabel} />
				</button>
			</div>
			<div className="grid grid-cols-2 gap-x-8 gap-y-4 p-5">{children}</div>
		</div>
	);
}

function ProjektInfoTab({ requestId }: { requestId: string }) {
	const t = useTranslate();

	return (
		<div className="flex gap-5">
			{/* Left column */}
			<div className="flex flex-1 flex-col gap-5">
				<InfoCard
					title={t(localizationConstants.calcNewProjekt)}
					icon={<Folder className="h-4 w-4 text-slate-500" />}
				>
					<InfoField label={t(localizationConstants.calcNewProjektNr)} value="ORD-0002" />
					<InfoField label={t(localizationConstants.calcForfragnKalkylNo)} value={requestId} />
					<InfoField label={t(localizationConstants.projectName)} value="Renovation" />
					<InfoField label={t(localizationConstants.calcNewKvartersNamn)} value="" />
					<InfoField label={t(localizationConstants.calcNewProjektAdress)} value="Storgatan 16, 18880 Stockholm." />
					<InfoField label={t(localizationConstants.calcNewPostNr)} value="000892" />
					<InfoField label={t(localizationConstants.calcNewOrt)} value="" />
				</InfoCard>

				<InfoCard
					title={t(localizationConstants.calcNewKontaktInfoSection)}
					icon={<Folder className="h-4 w-4 text-slate-500" />}
				>
					<InfoField label={t(localizationConstants.agreementDetailFornamn)} value="info" />
					<InfoField label={t(localizationConstants.agreementDetailEfternamn)} value="info" />
					<InfoField label={t(localizationConstants.calcNewAddressLabel)} value="Storgatan 16, 18880 Stockholm." />
					<InfoField label={t(localizationConstants.calcNewPostNr)} value="info" />
					<InfoField label={t(localizationConstants.agreementDetailMail)} value="000892" />
					<InfoField label={t(localizationConstants.calcNewTelefon)} value="info" />
					<InfoField label={t(localizationConstants.calcNewOrt)} value="Info" />
					<InfoField label={t(localizationConstants.agreementDetailRoll)} value="Beställare" />
				</InfoCard>
			</div>

			{/* Right column */}
			<div className="flex-1">
				<InfoCard
					title={t(localizationConstants.calcNewProjektInfo)}
					icon={<Folder className="h-4 w-4 text-slate-500" />}
				>
					<InfoField label={t(localizationConstants.calcProType)} value="" />
					<InfoField label={t(localizationConstants.category)} value="" />
					<InfoField label={t(localizationConstants.calcNewAvdelning)} value="" />
					<InfoField label={t(localizationConstants.calcNewKontraktsumma)} value="" />
					<InfoField label={t(localizationConstants.calcNewOffertNr)} value="" />
					<InfoField label={t(localizationConstants.calcStatStartDate)} value="12/10/2025" />
					<InfoField label={t(localizationConstants.calcStatEndDate)} value="12/10/2025" />
					<InfoField label={t(localizationConstants.calcNewSenasteDatum)} value="12/10/2025" />
				</InfoCard>
			</div>
		</div>
	);
}

// ── Dokument tab ──────────────────────────────────────────────────────────────

interface DocFileBadgeProps {
	fileType: "pdf" | "doc" | "img";
}

function DocFileBadge({ fileType }: DocFileBadgeProps) {
	const label = fileType === "pdf" ? "PDF" : fileType === "doc" ? "DOC" : "IMG";
	const color =
		fileType === "pdf" ? "bg-red-600" : fileType === "doc" ? "bg-blue-600" : "bg-emerald-600";
	return (
		<div className="relative flex h-10 w-8 shrink-0 items-center justify-center">
			<File className="h-10 w-8 text-slate-300" strokeWidth={1.5} />
			<span
				className={`absolute -left-0.5 top-[60%] -translate-y-1/2 rounded-[2px] px-1 py-0.5 text-[9px] font-bold leading-none text-white ${color}`}
			>
				{label}
			</span>
		</div>
	);
}

interface DokumentTabProps {
	documents: SupplierDocument[];
	gdprAccepted: boolean;
	onGdprChange: (v: boolean) => void;
	onAddDocument: (doc: SupplierDocument) => void;
	onRemoveDocument: (id: string) => void;
}

function DokumentTab({ documents, gdprAccepted, onGdprChange, onAddDocument, onRemoveDocument }: DokumentTabProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [pendingFiles, setPendingFiles] = useState<{ name: string }[]>([]);

	function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files) return;
		const today = new Date().toISOString().split("T")[0];
		Array.from(files).forEach((file) => {
			const lower = file.name.toLowerCase();
			const fileType: "pdf" | "doc" | "img" = lower.endsWith(".pdf")
				? "pdf"
				: lower.endsWith(".doc") || lower.endsWith(".docx")
					? "doc"
					: "img";
			onAddDocument({
				id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
				datum: today,
				namn: file.name,
				typ: fileType.toUpperCase(),
				fileType,
			});
			setPendingFiles((prev) => [...prev, { name: file.name }]);
		});
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	return (
		<div className="overflow-hidden rounded-lg border border-[#E5E5E5] bg-white">
			<div className="flex h-12 items-center gap-2 border-b border-slate-200 px-5">
				<Folder className="h-4 w-4 text-slate-500" />
				<span className="text-sm font-semibold text-zinc-950">
					<Translate text={localizationConstants.calcNewStep3Tab} />
				</span>
			</div>
			<div className="p-6">
				{/* Upload */}
				<div className="mb-5">
					<p className="mb-1 text-sm font-medium text-slate-900">
						<Translate text={localizationConstants.agreementUploadFiles} />
					</p>
					<p className="mb-3 text-sm text-slate-500">
						<Translate text={localizationConstants.agreementFileTypes} />
					</p>
					<div className="flex items-center gap-3">
						<div className="flex flex-1 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
							<div className="flex flex-1 flex-wrap items-center gap-2">
								{pendingFiles.length === 0 ? (
									<span className="text-sm text-slate-400">
										<Translate text={localizationConstants.agreementNoFile} />
									</span>
								) : (
									pendingFiles.map((pf) => (
										<span
											key={pf.name}
											className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700"
										>
											{pf.name}
											<button
												type="button"
												onClick={() => setPendingFiles((p) => p.filter((f) => f.name !== pf.name))}
												className="ml-1 cursor-pointer text-slate-400 hover:text-slate-600"
											>
												<X className="h-3 w-3" />
											</button>
										</span>
									))
								)}
							</div>
							<ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
						</div>
						<input
							ref={fileInputRef}
							type="file"
							multiple
							accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
							className="hidden"
							onChange={handleFileSelect}
						/>
						<Button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="h-9 min-w-24 cursor-pointer bg-[#111721] text-white hover:bg-slate-800"
						>
							<Translate text={localizationConstants.agreementUpload} />
						</Button>
					</div>
				</div>

				{/* GDPR */}
				<div className="mb-6 flex items-start gap-2">
					<Checkbox
						id="gdpr-forfragan"
						checked={gdprAccepted}
						onCheckedChange={(c) => onGdprChange(Boolean(c))}
						className="mt-0.5"
					/>
					<label htmlFor="gdpr-forfragan" className="cursor-pointer text-sm text-slate-600">
						<Translate text={localizationConstants.calcNewGdprText} />{" "}
						<button type="button" className="cursor-pointer text-blue-600 underline">
							<Translate text={localizationConstants.calcNewGdprLink} />
						</button>{" "}
						<Translate text={localizationConstants.calcNewGdprSuffix} />
					</label>
				</div>

				{/* Documents table */}
				<p className="mb-3 text-sm font-medium text-slate-900">
					<Translate text={localizationConstants.agreementCreateBifogadeDokument} />
				</p>
				<div className="overflow-x-auto rounded border border-slate-200">
					<table className="w-full min-w-max border-collapse text-sm">
						<thead>
							<tr className="border-b border-slate-200">
								<th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.agreementDetailDatum} />
								</th>
								<th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.agreementDetailDokumentetsNamn} />
								</th>
								<th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.calcProType} />
								</th>
								<th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.agreementDetailFil} />
								</th>
								<th className="border-l border-slate-200 px-3">
							<button
								type="button"
								className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-zinc-700 hover:bg-slate-100"
							>
								<Plus className="h-4 w-4" />
							</button>
						</th>
							</tr>
						</thead>
						<tbody>
							{documents.length === 0 ? (
								<tr>
									<td colSpan={5} className="h-20 text-center text-sm text-slate-400">
										<Translate text={localizationConstants.agreementNoDocuments} />
									</td>
								</tr>
							) : (
								documents.map((doc) => (
									<tr key={doc.id} className="border-b border-slate-100 last:border-b-0">
										<td className="px-4 py-2.5 text-slate-600">{doc.datum}</td>
										<td className="px-4 py-2.5">
											<span className="inline-flex items-center gap-2 text-slate-700">
												<DocFileBadge fileType={doc.fileType} />
												{doc.namn}
											</span>
										</td>
										<td className="px-4 py-2.5 text-slate-600">{doc.typ}</td>
										<td className="px-4 py-2.5">
											<Button
												variant="outline"
												size="sm"
												className="h-7 cursor-pointer border-slate-200 bg-white text-xs"
											>
												<Translate text={localizationConstants.agreementCreateSeFil} />
											</Button>
										</td>
										<td className="px-2 py-2.5">
											<button
												type="button"
												onClick={() => onRemoveDocument(doc.id)}
												className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-slate-300 hover:bg-red-50 hover:text-red-500"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

// ── Main component ─────────────────────────────────────────────────────────────

type TabKey = "inbjudna" | "projektinfo" | "dokument";

const TABS: { key: TabKey; labelKey: string }[] = [
	{ key: "inbjudna", labelKey: localizationConstants.calcForfragnInbjudna },
	{ key: "projektinfo", labelKey: localizationConstants.calcNewProjektInfo },
	{ key: "dokument", labelKey: localizationConstants.calcNewStep3Tab },
];

interface ForfragnDetailViewProps {
	calcId: string;
	requestId: string;
	inbjudnaRows: InbjudnaRow[];
}

export function ForfragnDetailView({ calcId, requestId, inbjudnaRows }: ForfragnDetailViewProps) {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<TabKey>("inbjudna");
	const [documents, setDocuments] = useState<SupplierDocument[]>([]);
	const [gdprAccepted, setGdprAccepted] = useState(false);

	const base = `/module/business/calculation/overview/${calcId}/forfragan`;

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
			{/* Page header */}
			<div className="flex flex-col border-b border-slate-200 bg-white px-6">
				<div className="flex items-center gap-2 py-4">
					<button
						type="button"
						onClick={() => router.push(base)}
						className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
					>
						<ArrowLeft className="h-4 w-4" />
						<Translate text={localizationConstants.calcForfragnAllaForfragnningar} />
					</button>
					<span className="text-slate-300">/</span>
					<span className="text-sm font-semibold text-zinc-950">
						<Translate text={localizationConstants.calcForfragnKalkylNo} />: {requestId}
					</span>
				</div>

				{/* Tabs */}
				<div className="flex">
					{TABS.map((tab) => {
						const isActive = activeTab === tab.key;
						return (
							<button
								key={tab.key}
								type="button"
								onClick={() => setActiveTab(tab.key)}
								className={cn(
									"cursor-pointer whitespace-nowrap border-b-2 px-4 text-sm font-semibold transition-colors",
									isActive
										? "border-slate-900 pb-3 pt-2 text-slate-950"
										: "border-transparent pb-3.5 pt-2 text-slate-500 hover:text-slate-700",
								)}
							>
								<Translate text={tab.labelKey} />
							</button>
						);
					})}
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-y-auto px-6 py-5">
				{activeTab === "inbjudna" && (
					<InbjudnaTab rows={inbjudnaRows} calcId={calcId} requestId={requestId} />
				)}
				{activeTab === "projektinfo" && <ProjektInfoTab requestId={requestId} />}
				{activeTab === "dokument" && (
					<DokumentTab
						documents={documents}
						gdprAccepted={gdprAccepted}
						onGdprChange={setGdprAccepted}
						onAddDocument={(doc) => setDocuments((prev) => [...prev, doc])}
						onRemoveDocument={(id) => setDocuments((prev) => prev.filter((d) => d.id !== id))}
					/>
				)}
			</div>
		</div>
	);
}
