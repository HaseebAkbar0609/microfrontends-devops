"use client";

import { useState, useMemo } from "react";
import {
	CircleUserRound,
	FilePlus,
	FileText,
	Folder,
	MoreVertical,
	Pencil,
	Plus,
	Trash2,
	UserRoundCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { SortableHead } from "@/components/table/SortableHead";
import { sortItems, type SortDir } from "@/utils/tableSort";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { KalkylDetailData, KalkylDocItem } from "../types/kalkyl";
import { KalkylDocIcon } from "./KalkylDocIcon";
import {
	useCalculationDetail,
	type DetailTab,
} from "../hooks/useCalculationDetail";
import { DeleteDocumentDialog } from "./detail/DeleteDocumentDialog";

// ── Types ───────────────────────────────────────────────────────────────────

const DETAIL_TABS: { key: DetailTab; labelKey: string }[] = [
	{ key: "kontakt", labelKey: localizationConstants.calcNewStep1Tab },
	{ key: "projekt", labelKey: localizationConstants.calcNewStep2Tab },
	{ key: "dokument", labelKey: localizationConstants.calcNewStep3Tab },
];

// ── Sub-components ──────────────────────────────────────────────────────────

function InfoField({ label, value }: { label: string; value?: string | null }) {
	return (
		<div className="flex flex-col gap-1 min-w-0">
			<p className="text-sm font-medium text-zinc-950 truncate">{label}</p>
			<p className="text-sm font-normal text-zinc-500 break-words">{value?.trim() || "-"}</p>
		</div>
	);
}

interface CardSectionProps {
	icon: React.FC<{ className?: string }>;
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

// ── Tab panels ──────────────────────────────────────────────────────────────

interface PanelProps {
	data: KalkylDetailData;
	onEditProjekt?: () => void;
	onEditProjektInfo?: () => void;
	onEditKund?: () => void;
	onEditKontakt?: () => void;
	onEditEntreprenor?: () => void;
	onEditKalkylansvarig?: () => void;
	onOpenAddDoc?: () => void;
	onDeleteDoc?: (doc: KalkylDocItem) => void;
}

function KontaktPanel({
	data,
	onEditKund,
	onEditKontakt,
	onEditEntreprenor,
	onEditKalkylansvarig,
}: Pick<
	PanelProps,
	| "data"
	| "onEditKund"
	| "onEditKontakt"
	| "onEditEntreprenor"
	| "onEditKalkylansvarig"
>) {
	const t = useTranslate();
	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<CardSection
					icon={Folder}
					title={t(localizationConstants.calcNewKunduppgifter)}
					onEdit={onEditKund}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoField label={t(localizationConstants.calcNewForetagLabel)} value={data.bestellareForetag} />
						<InfoField label={t(localizationConstants.calcNewAddressLabel)} value={data.bestellareAddress} />
						<InfoField label={t(localizationConstants.calcNewPostNr)} value={data.bestellarePostNr} />
						<InfoField label={t(localizationConstants.calcNewOrt)} value={data.bestellareOrt} />
						<InfoField label={t(localizationConstants.agreementDetailMail)} value={data.bestellareMail} />
						<InfoField label={t(localizationConstants.calcNewTelefon)} value={data.bestellareTelefon} />
						<div className="col-span-1 sm:col-span-2">
							<InfoField label={t(localizationConstants.calcNewOrgPersonNr)} value={data.bestellareOrgNr} />
						</div>
					</div>
				</CardSection>

				<CardSection
					icon={CircleUserRound}
					title={t(localizationConstants.calcNewKontaktperson)}
					onEdit={onEditKontakt}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoField label={t(localizationConstants.agreementDetailFornamn)} value={data.kontaktFornamn} />
						<InfoField label={t(localizationConstants.agreementDetailEfternamn)} value={data.kontaktEfternamn} />
						<InfoField label={t(localizationConstants.calcNewAddressLabel)} value={data.kontaktAddress} />
						<InfoField label={t(localizationConstants.registerPostalCodeLabel)} value={data.kontaktPostnummer} />
						<InfoField label={t(localizationConstants.agreementDetailMail)} value={data.kontaktMail} />
						<InfoField label={t(localizationConstants.agreementDetailMobil)} value={data.kontaktMobil} />
						<InfoField label={t(localizationConstants.agreementDetailRoll)} value={data.kontaktRoll} />
						<InfoField label={t(localizationConstants.calcNewOrt)} value={data.kontaktOrt} />
					</div>
				</CardSection>
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<CardSection
					icon={Folder}
					title={t(localizationConstants.calcNewKunduppgifter)}
					onEdit={onEditEntreprenor}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoField label={t(localizationConstants.calcNewForetagLabel)} value={data.entreprenorForetag} />
						<InfoField label={t(localizationConstants.calcNewAddressLabel)} value={data.entreprenorAddress} />
						<InfoField label={t(localizationConstants.calcNewPostNr)} value={data.entreprenorPostNr} />
						<InfoField label={t(localizationConstants.calcNewOrt)} value={data.entreprenorOrt} />
						<InfoField label={t(localizationConstants.agreementDetailMail)} value={data.entreprenorMail} />
						<InfoField label={t(localizationConstants.calcNewTelefon)} value={data.entreprenorTelefon} />
						<div className="col-span-1 sm:col-span-2">
							<InfoField label={t(localizationConstants.calcNewOrgPersonNr)} value={data.entreprenorOrgNr} />
						</div>
					</div>
				</CardSection>

				<CardSection
					icon={UserRoundCog}
					title={t(localizationConstants.calcNewKalkylAnsvarig)}
					onEdit={onEditKalkylansvarig}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoField label={t(localizationConstants.agreementDetailFornamn)} value={data.kalkylFornamn} />
						<InfoField label={t(localizationConstants.agreementDetailEfternamn)} value={data.kalkylEfternamn} />
						<InfoField label={t(localizationConstants.agreementDetailMail)} value={data.kalkylMail} />
						<InfoField label={t(localizationConstants.agreementDetailMobil)} value={data.kalkylMobil} />
						<div className="col-span-1 sm:col-span-2">
							<InfoField label={t(localizationConstants.agreementDetailRoll)} value={data.kalkylRoll} />
						</div>
					</div>
				</CardSection>
			</div>
		</div>
	);
}

function ProjektPanel({
	data,
	onEditProjekt,
	onEditProjektInfo,
}: Pick<PanelProps, "data" | "onEditProjekt" | "onEditProjektInfo">) {
	const t = useTranslate();
	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
			<CardSection
				icon={Folder}
				title={t(localizationConstants.calcNewProjekt)}
				onEdit={onEditProjekt}
			>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<InfoField label={t(localizationConstants.calcDetailProjekteringNr)} value={data.projekteringNr} />
					<InfoField label={t(localizationConstants.calcDetailProjekteringNamn)} value={data.projekteringNamn} />
					<InfoField label={t(localizationConstants.calcNewKvartersNamn)} value={data.kvartersNamn} />
					<InfoField label={t(localizationConstants.calcDetailProjekteringAdress)} value={data.projekteringAdress} />
					<InfoField label={t(localizationConstants.calcNewPostNr)} value={data.postNr} />
					<InfoField label={t(localizationConstants.calcNewOrt)} value={data.ort} />
				</div>
			</CardSection>

			<CardSection
				icon={FileText}
				title={t(localizationConstants.calcNewProjektInfo)}
				onEdit={onEditProjektInfo}
			>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<InfoField label={t(localizationConstants.calcProType)} value={data.type} />
					<InfoField label={t(localizationConstants.category)} value={data.kategori} />
					<InfoField label={t(localizationConstants.calcNewAvdelning)} value={data.avdelning} />
					<InfoField label={t(localizationConstants.calcNewKontraktsumma)} value={data.kontraktsumma} />
					<InfoField label={t(localizationConstants.calcNewOffertNr)} value={data.offertNr} />
					<InfoField label={t(localizationConstants.calcStatStartDate)} value={data.startDatum} />
					<InfoField label={t(localizationConstants.calcStatEndDate)} value={data.slutDatum} />
					<InfoField label={t(localizationConstants.calcDetailSenasteDatumOffert)} value={data.senatsDatumOffert} />
				</div>
			</CardSection>
		</div>
	);
}

type DocSortField = "datum" | "namn" | "typ" | "fileType";

function DokumentPanel({
	data,
	onOpenAddDoc,
	onDeleteDoc,
}: Pick<PanelProps, "data" | "onOpenAddDoc" | "onDeleteDoc">) {
	const t = useTranslate();
	const [sortField, setSortField] = useState<DocSortField | null>(null);
	const [sortDir, setSortDir] = useState<SortDir>(null);

	const handleSort = (field: DocSortField) => {
		if (sortField === field) {
			if (sortDir === "asc") setSortDir("desc");
			else if (sortDir === "desc") {
				setSortField(null);
				setSortDir(null);
			}
		} else {
			setSortField(field);
			setSortDir("asc");
		}
	};

	const sortedDocuments = useMemo(() => {
		if (!sortField || !sortDir) return data.documents;
		return sortItems(data.documents, sortField, sortDir, (doc, field) => {
			if (field === "fileType") {
				return doc.fileType === "doc" ? "DOC" : doc.fileType === "img" ? "IMG" : "PDF";
			}
			return (doc[field as keyof KalkylDocItem] as string) || "";
		});
	}, [data.documents, sortField, sortDir]);

	return (
		<div className="rounded-lg border border-slate-200 bg-white shadow-none">
			<div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 sm:px-6">
				<div className="flex items-center gap-2 min-w-0">
					<FilePlus className="h-5 w-5 shrink-0 text-slate-700" />
					<span className="truncate text-base font-medium text-slate-900">
						<Translate text={localizationConstants.agreementCreateBifogadeDokument} />
					</span>
				</div>
				<Button
					type="button"
					size="sm"
					onClick={onOpenAddDoc}
					className="h-9 shrink-0 cursor-pointer gap-1.5 bg-slate-900 px-3 sm:px-4 text-sm text-white hover:bg-slate-800"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.calcDetailNewDocument} />
				</Button>
			</div>

			<div className="p-4 sm:p-5">
				<div className="overflow-x-auto scrollbar-thin">
					<Table className="min-w-[620px] w-full">
						<TableHeader>
							<TableRow className="h-11 border-b border-slate-200">
								<SortableHead
									labelKey={localizationConstants.agreementDetailDatum}
									onSort={() => handleSort("datum")}
									active={sortField === "datum"}
									dir={sortField === "datum" ? sortDir : null}
									className="h-11 px-4 text-left font-medium text-slate-500"
								/>
								<SortableHead
									labelKey={localizationConstants.agreementDetailDokumentetsNamn}
									onSort={() => handleSort("namn")}
									active={sortField === "namn"}
									dir={sortField === "namn" ? sortDir : null}
									className="h-11 px-4 text-left font-medium text-slate-500"
								/>
								<SortableHead
									labelKey={localizationConstants.calcProType}
									onSort={() => handleSort("typ")}
									active={sortField === "typ"}
									dir={sortField === "typ" ? sortDir : null}
									className="h-11 px-4 text-left font-medium text-slate-500"
								/>
								<SortableHead
									labelKey={localizationConstants.agreementDetailFil}
									onSort={() => handleSort("fileType")}
									active={sortField === "fileType"}
									dir={sortField === "fileType" ? sortDir : null}
									className="h-11 px-4 text-left font-medium text-slate-500"
								/>
								<TableHead className="w-36 border-l border-slate-200 px-4" />
							</TableRow>
						</TableHeader>
						<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-slate-200">
							{sortedDocuments.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={5}
										className="h-24 text-center text-sm text-slate-400"
									>
										<Translate text={localizationConstants.agreementNoDocuments} />
									</TableCell>
								</TableRow>
							) : (
								sortedDocuments.map((doc) => {
									const fileExt =
										doc.fileType === "doc"
											? "DOC"
											: doc.fileType === "img"
												? "IMG"
												: "PDF";
									return (
										<TableRow
											key={doc.id}
											className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors"
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
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																type="button"
																variant="ghost"
																size="icon"
																aria-label={t(localizationConstants.actions)}
																className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-900 hover:bg-slate-100"
															>
																<MoreVertical className="h-4 w-4 text-slate-900" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end" className="w-36">
															<DropdownMenuItem
																className="cursor-pointer gap-2 text-sm text-slate-900 focus:text-slate-900 hover:text-slate-900"
																onClick={() => onDeleteDoc?.(doc)}
															>
																<Trash2 className="h-4 w-4 text-slate-900" />
																<Translate text={localizationConstants.calcArchiveDelete} />
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
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
		</div>
	);
}

// ── Main component ──────────────────────────────────────────────────────────

interface Props {
	id?: string;
	data?: KalkylDetailData;
}

export function CalculationDetailView({ id, data: initialData }: Props) {
	const t = useTranslate();
	const {
		data,
		activeTab,
		setActiveTab,
		deleteDocTarget,
		setDeleteDocTarget,
		isDeletingDoc,
		handleDeleteDocument,
		isLoading,
		loadError,
		refresh,
	} = useCalculationDetail(id, initialData);

	const handleActionComingSoon = () => {
		showToast("info", t(localizationConstants.comingSoon));
	};

	const handleEditComingSoon = () => {
		showToast("info", t(localizationConstants.editComingSoon));
	};

	if (isLoading || loadError) return <div className="space-y-3 p-6" role={loadError ? "alert" : "status"}>
		<p>{t(loadError ? localizationConstants.widgetSourceLoadError : localizationConstants.genericLoading)}</p>
		{loadError && <Button variant="outline" onClick={() => void refresh()}>{t(localizationConstants.retry)}</Button>}
	</div>;

	return (
		<div className="flex flex-1 flex-col bg-white">
			{/* Page header */}
			<div className="shrink-0 border-b border-slate-200 bg-white">
				{/* Title row */}
				<div className="px-6 pt-5 pb-3.5 sm:pl-15">
					<h1 className="break-words text-2xl font-semibold">
						<span className="break-all text-slate-400">{data.calcNo} / </span>
						<Translate text={localizationConstants.protocolFieldInformation} />
					</h1>
				</div>

				{/* Tab bar — matching standard reused RouteTabs / ModuleHeader style */}
				<div className="px-6 -mb-[1px] sm:pl-15">
					<div className="overflow-x-auto scrollbar-none">
						<nav
							className="inline-flex items-center gap-1 sm:gap-2 min-w-max h-[36px]"
							aria-label="Calculation Detail Tabs"
						>
							{DETAIL_TABS.map((tab) => {
								const isActive = activeTab === tab.key;
								return (
									<button
										key={tab.key}
										type="button"
										onClick={() => setActiveTab(tab.key)}
										className={cn(
											"relative inline-flex items-center justify-center h-[36px] px-3 sm:px-4.5 pb-2 pt-1 font-sans text-sm font-semibold leading-none tracking-normal text-center whitespace-nowrap transition-colors cursor-pointer",
											isActive
												? "text-slate-950 font-bold"
												: "text-slate-600 hover:text-slate-900 font-medium",
										)}
									>
										<Translate text={tab.labelKey} />
										{isActive && (
											<span className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-950 z-10" />
										)}
									</button>
								);
							})}
						</nav>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-y-auto p-6 sm:pl-15 sm:pr-6">
				{activeTab === "kontakt" && (
					<KontaktPanel
						data={data}
						onEditKund={handleEditComingSoon}
						onEditKontakt={handleEditComingSoon}
						onEditEntreprenor={handleEditComingSoon}
						onEditKalkylansvarig={handleEditComingSoon}
					/>
				)}
				{activeTab === "projekt" && (
					<ProjektPanel
						data={data}
						onEditProjekt={handleEditComingSoon}
						onEditProjektInfo={handleEditComingSoon}
					/>
				)}
				{activeTab === "dokument" && (
					<DokumentPanel
						data={data}
						onOpenAddDoc={handleActionComingSoon}
						onDeleteDoc={(doc) => setDeleteDocTarget(doc)}
					/>
				)}
			</div>

			{/* Modals & Dialogs (shadcn primitives) */}
			<DeleteDocumentDialog
				isOpen={!!deleteDocTarget}
				onClose={() => setDeleteDocTarget(null)}
				onConfirm={handleDeleteDocument}
				isDeleting={isDeletingDoc}
			/>
		</div>
	);
}
