"use client";

import { useState } from "react";
import {
	ArrowUpDown,
	Eye,
	File,
	FileText,
	Folder,
	MoreHorizontal,
	Pencil,
	Plus,
	Trash2,
	User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { KalkylDetailData, KalkylDocItem } from "../types/kalkyl";

// ── Types ───────────────────────────────────────────────────────────────────

type DetailTab = "kontakt" | "projekt" | "dokument";

const DETAIL_TABS: { key: DetailTab; labelKey: string }[] = [
	{ key: "kontakt", labelKey: localizationConstants.calcNewStep1Tab },
	{ key: "projekt", labelKey: localizationConstants.calcNewStep2Tab },
	{ key: "dokument", labelKey: localizationConstants.calcNewStep3Tab },
];

// ── Sub-components ──────────────────────────────────────────────────────────

function InfoField({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col gap-1">
			<p className="text-sm font-medium text-zinc-950">{label}</p>
			<p className="text-sm font-normal text-zinc-500">{value || "-"}</p>
		</div>
	);
}

interface CardSectionProps {
	icon: React.FC<{ className?: string }>;
	title: string;
	children: React.ReactNode;
}

function CardSection({ icon: Icon, title, children }: CardSectionProps) {
	const t = useTranslate();
	return (
		<div className="rounded-lg border border-neutral-200 bg-white">
			<div className="flex h-17 items-center justify-between border-b border-zinc-200 px-4">
				<div className="flex items-center gap-2">
					<Icon className="h-6 w-6 text-slate-800" />
					<span className="text-base font-medium text-zinc-950">{title}</span>
				</div>
				<button
					type="button"
					className="flex cursor-pointer items-center gap-2 rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] hover:bg-zinc-200"
				>
					<Pencil className="h-4 w-4" />
					{t(localizationConstants.editLabel)}
				</button>
			</div>
			<div className="p-4">{children}</div>
		</div>
	);
}

interface DocFileBadgeProps {
	fileType: KalkylDocItem["fileType"];
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

// ── Tab panels ──────────────────────────────────────────────────────────────

function KontaktPanel({ data }: { data: KalkylDetailData }) {
	const t = useTranslate();
	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<CardSection icon={Folder} title={t(localizationConstants.calcNewKunduppgifter)}>
					<div className="grid grid-cols-2 gap-4">
						<InfoField label={t(localizationConstants.calcNewForetagLabel)} value={data.bestellareForetag} />
						<InfoField label={t(localizationConstants.calcNewAddressLabel)} value={data.bestellareAddress} />
						<InfoField label={t(localizationConstants.calcNewPostNr)} value={data.bestellarePostNr} />
						<InfoField label={t(localizationConstants.calcNewOrt)} value={data.bestellareOrt} />
						<InfoField label={t(localizationConstants.agreementDetailMail)} value={data.bestellareMail} />
						<InfoField label={t(localizationConstants.calcNewTelefon)} value={data.bestellareTelefon} />
						<div className="col-span-2">
							<InfoField label={t(localizationConstants.calcNewOrgPersonNr)} value={data.bestellareOrgNr} />
						</div>
					</div>
				</CardSection>

				<CardSection icon={User} title={t(localizationConstants.calcNewKontaktperson)}>
					<div className="grid grid-cols-2 gap-4">
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
				<CardSection icon={Folder} title={t(localizationConstants.calcNewKunduppgifter)}>
					<div className="grid grid-cols-2 gap-4">
						<InfoField label={t(localizationConstants.calcNewForetagLabel)} value={data.entreprenorForetag} />
						<InfoField label={t(localizationConstants.calcNewAddressLabel)} value={data.entreprenorAddress} />
						<InfoField label={t(localizationConstants.calcNewPostNr)} value={data.entreprenorPostNr} />
						<InfoField label={t(localizationConstants.calcNewOrt)} value={data.entreprenorOrt} />
						<InfoField label={t(localizationConstants.agreementDetailMail)} value={data.entreprenorMail} />
						<InfoField label={t(localizationConstants.calcNewTelefon)} value={data.entreprenorTelefon} />
						<div className="col-span-2">
							<InfoField label={t(localizationConstants.calcNewOrgPersonNr)} value={data.entreprenorOrgNr} />
						</div>
					</div>
				</CardSection>

				<CardSection icon={User} title={t(localizationConstants.calcNewKalkylAnsvarig)}>
					<div className="grid grid-cols-2 gap-4">
						<InfoField label={t(localizationConstants.agreementDetailFornamn)} value={data.kalkylFornamn} />
						<InfoField label={t(localizationConstants.agreementDetailEfternamn)} value={data.kalkylEfternamn} />
						<InfoField label={t(localizationConstants.agreementDetailMail)} value={data.kalkylMail} />
						<InfoField label={t(localizationConstants.agreementDetailMobil)} value={data.kalkylMobil} />
						<div className="col-span-2">
							<InfoField label={t(localizationConstants.agreementDetailRoll)} value={data.kalkylRoll} />
						</div>
					</div>
				</CardSection>
			</div>
		</div>
	);
}

function ProjektPanel({ data }: { data: KalkylDetailData }) {
	const t = useTranslate();
	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
			<CardSection icon={Folder} title={t(localizationConstants.calcNewProjekt)}>
				<div className="grid grid-cols-2 gap-4">
					<InfoField label={t(localizationConstants.calcDetailProjekteringNr)} value={data.projekteringNr} />
					<InfoField label={t(localizationConstants.calcDetailProjekteringNamn)} value={data.projekteringNamn} />
					<InfoField label={t(localizationConstants.calcNewKvartersNamn)} value={data.kvartersNamn} />
					<InfoField label={t(localizationConstants.calcDetailProjekteringAdress)} value={data.projekteringAdress} />
					<InfoField label={t(localizationConstants.calcNewPostNr)} value={data.postNr} />
					<InfoField label={t(localizationConstants.calcNewOrt)} value={data.ort} />
				</div>
			</CardSection>

			<CardSection icon={FileText} title={t(localizationConstants.calcNewProjektInfo)}>
				<div className="grid grid-cols-2 gap-4">
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

function DokumentPanel({ data }: { data: KalkylDetailData }) {
	return (
		<div className="rounded-lg border border-neutral-200 bg-white">
			<div className="flex h-17 items-center justify-between border-b border-zinc-200 px-4">
				<span className="text-base font-medium text-zinc-950">
					<Translate text={localizationConstants.agreementCreateBifogadeDokument} />
				</span>
				<Button
					type="button"
					size="sm"
					className="h-9 cursor-pointer gap-1.5 bg-[#111721] text-sm text-white hover:bg-slate-800"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.calcDetailNewDocument} />
				</Button>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-max border-collapse text-sm">
					<thead>
						<tr className="h-11 border-b border-zinc-200">
							<th className="px-4 text-left font-medium text-slate-500">
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.agreementDetailDatum} />
									<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
								</div>
							</th>
							<th className="px-4 text-left font-medium text-slate-500">
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.agreementDetailDokumentetsNamn} />
									<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
								</div>
							</th>
							<th className="px-4 text-left font-medium text-slate-500">
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.calcProType} />
									<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
								</div>
							</th>
							<th className="px-4 text-left font-medium text-slate-500">
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.agreementDetailFil} />
									<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
								</div>
							</th>
							<th className="w-10" />
						</tr>
					</thead>
					<tbody>
						{data.documents.length === 0 ? (
							<tr>
								<td colSpan={5} className="h-24 text-center text-sm text-slate-400">
									<Translate text={localizationConstants.agreementNoDocuments} />
								</td>
							</tr>
						) : (
							data.documents.map((doc) => (
								<tr key={doc.id} className="border-b border-zinc-200 last:border-b-0">
									<td className="px-4 py-3 text-zinc-500">{doc.datum}</td>
									<td className="px-4 py-3">
										<span className="inline-flex items-center gap-2 text-zinc-950">
											<DocFileBadge fileType={doc.fileType} />
											{doc.namn}
										</span>
									</td>
									<td className="px-4 py-3 text-zinc-500">{doc.typ}</td>
									<td className="px-4 py-3">
										<Button
											type="button"
											variant="outline"
											size="sm"
											className="h-7 cursor-pointer border-slate-200 bg-white text-xs hover:bg-slate-50"
										>
											<Eye className="mr-1.5 h-3 w-3" />
											<Translate text={localizationConstants.agreementCreateSeFil} />
										</Button>
									</td>
									<td className="px-2 py-3">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<button
													type="button"
													className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
												>
													<MoreHorizontal className="h-4 w-4 rotate-90" />
												</button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-36">
												<DropdownMenuItem className="cursor-pointer gap-2 text-sm text-red-600 focus:text-red-600">
													<Trash2 className="h-4 w-4" />
													<Translate text={localizationConstants.calcArchiveDelete} />
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

// ── Main component ──────────────────────────────────────────────────────────

interface Props {
	data: KalkylDetailData;
}

export function CalculationDetailView({ data }: Props) {
	const [activeTab, setActiveTab] = useState<DetailTab>("kontakt");

	return (
		<div className="flex flex-1 flex-col bg-slate-50">
			{/* Page header — contains title + tabs, shares the single bottom border */}
			<div className="flex flex-col border-b border-slate-200 bg-white px-5">
				{/* Title row */}
				<div className="flex items-center py-3">
					<h1 className="text-2xl font-semibold">
						<span className="text-slate-400">{data.calcNo} / </span>
						<Translate text={localizationConstants.protocolFieldInformation} />
					</h1>
				</div>

				{/* Tab bar — sits flush against the header's bottom border */}
				<div className="flex">
					{DETAIL_TABS.map((tab) => (
						<button
							key={tab.key}
							type="button"
							onClick={() => setActiveTab(tab.key)}
							className={cn(
								"cursor-pointer whitespace-nowrap border-b-2 text-sm font-semibold px-4 transition-colors",
								activeTab === tab.key
									? "border-slate-900 text-slate-950 pb-3 pt-2"
									: "border-transparent text-slate-500 pb-3.5 pt-2 hover:text-slate-700",
							)}
						>
							<Translate text={tab.labelKey} />
						</button>
					))}
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-y-auto pt-3 px-6 pb-6">
				{activeTab === "kontakt" && <KontaktPanel data={data} />}
				{activeTab === "projekt" && <ProjektPanel data={data} />}
				{activeTab === "dokument" && <DokumentPanel data={data} />}
			</div>
		</div>
	);
}
