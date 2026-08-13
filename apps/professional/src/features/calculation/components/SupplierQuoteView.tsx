"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Building2,
	ChevronDown,
	ChevronUp,
	File,
	MoreVertical,
	User,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SupplierDocument, SupplierQuoteData } from "../types/forfragan";

// ── Sub-components ─────────────────────────────────────────────────────────────

interface CollapsibleSectionProps {
	title: string;
	icon?: React.ReactNode;
	children: React.ReactNode;
	defaultOpen?: boolean;
}

function CollapsibleSection({ title, icon, children, defaultOpen = true }: CollapsibleSectionProps) {
	const [open, setOpen] = useState(defaultOpen);
	return (
		<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="flex w-full cursor-pointer items-center justify-between px-5 py-3.5"
			>
				<div className="flex items-center gap-2">
					{icon}
					<span className="text-sm font-semibold text-zinc-950">{title}</span>
				</div>
				{open ? (
					<ChevronUp className="h-4 w-4 text-slate-400" />
				) : (
					<ChevronDown className="h-4 w-4 text-slate-400" />
				)}
			</button>
			{open && <div className="border-t border-slate-100 px-5 py-4">{children}</div>}
		</div>
	);
}

interface InfoRowProps {
	label: string;
	value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
	return (
		<div className="flex flex-col gap-0.5">
			<span className="text-xs text-slate-500">{label}</span>
			<span className="text-sm text-slate-800">{value || "–"}</span>
		</div>
	);
}

interface SubsectionProps {
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
}

function Subsection({ title, icon, children }: SubsectionProps) {
	return (
		<div className="mb-4 last:mb-0">
			<div className="mb-3 flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2">
				{icon}
				<span className="text-sm font-medium text-slate-700">{title}</span>
			</div>
			<div className="grid grid-cols-2 gap-x-8 gap-y-3 px-1">{children}</div>
		</div>
	);
}

function DocFileBadge({ fileType }: { fileType: "pdf" | "doc" | "img" }) {
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

// ── Main component ─────────────────────────────────────────────────────────────

interface SupplierQuoteViewProps {
	calcId: string;
	requestId: string;
	data: SupplierQuoteData;
}

export function SupplierQuoteView({ calcId, requestId, data }: SupplierQuoteViewProps) {
	const t = useTranslate();
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [pendingFiles, setPendingFiles] = useState<{ name: string }[]>([]);
	const [documents, setDocuments] = useState<SupplierDocument[]>(data.documents);
	const [gdprAccepted, setGdprAccepted] = useState(false);
	const [kommentarer, setKommentarer] = useState(data.kommentarer);

	const backHref = `/module/business/calculation/overview/${calcId}/forfragan/${requestId}`;

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
			setDocuments((prev) => [
				...prev,
				{
					id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
					datum: today,
					namn: file.name,
					typ: fileType.toUpperCase(),
					fileType,
				},
			]);
			setPendingFiles((prev) => [...prev, { name: file.name }]);
		});
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
			{/* Page header */}
			<div className="border-b border-slate-200 bg-white px-6 py-4">
				<button
					type="button"
					onClick={() => router.push(backHref)}
					className="flex cursor-pointer items-center gap-2 text-xl font-semibold text-zinc-950 hover:text-slate-700"
				>
					<ArrowLeft className="h-5 w-5" />
					<Translate text={localizationConstants.calcForfragnSupplierQuote} />
				</button>
			</div>

			{/* Scrollable content */}
			<div className="flex-1 overflow-y-auto px-6 py-5">
				<div className="mx-auto flex max-w-3xl flex-col gap-4">
					{/* Leverantörsinformation */}
					<CollapsibleSection
						title={t(localizationConstants.calcForfragnLeverantorsInfo)}
					>
						<Subsection
							title={t(localizationConstants.calcForfragnForetagsinfo)}
							icon={<Building2 className="h-4 w-4 text-slate-500" />}
						>
							<InfoRow label={t(localizationConstants.calcNewForetagLabel)} value={data.company} />
							<InfoRow label={t(localizationConstants.agreementDetailMail)} value={data.mail} />
							<InfoRow label={t(localizationConstants.calcNewTelefon)} value={data.telefon} />
							<InfoRow label={t(localizationConstants.calcNewAddressLabel)} value={data.address} />
							<InfoRow label={t(localizationConstants.calcNewPostNr)} value={data.postNr} />
							<InfoRow label={t(localizationConstants.calcForfragnKontaktSumma)} value={data.kontaktSumma} />
						</Subsection>

						<Subsection
							title={t(localizationConstants.calcForfragnKontakt)}
							icon={<User className="h-4 w-4 text-slate-500" />}
						>
							<InfoRow label={t(localizationConstants.calcForfragnNamn)} value={data.kontaktNamn} />
							<InfoRow label={t(localizationConstants.agreementDetailMail)} value={data.kontaktMail} />
							<InfoRow label={t(localizationConstants.agreementDetailMobil)} value={data.kontaktMobil} />
						</Subsection>
					</CollapsibleSection>

					{/* Offert Pris */}
					<CollapsibleSection title={t(localizationConstants.calcForfragnOffertPris)}>
						<div className="flex items-center gap-3">
							{data.isFardig && (
								<span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
									<Translate text={localizationConstants.calcForfragnFardig} />
								</span>
							)}
							<span className="text-2xl font-semibold tabular-nums text-zinc-950">
								{data.offertPris.toLocaleString("sv-SE")}
							</span>
						</div>
					</CollapsibleSection>

					{/* Kommentarer */}
					<CollapsibleSection title={t(localizationConstants.calcForfragnKommentarer)}>
						<textarea
							value={kommentarer}
							onChange={(e) => setKommentarer(e.target.value)}
							placeholder={t(localizationConstants.calcForfragnKommentarer)}
							rows={3}
							className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:outline-none"
						/>
					</CollapsibleSection>

					{/* Dokuments */}
					<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
						{/* Table */}
						<div className="b2b-table-scroll overflow-x-auto">
							<table className="w-full min-w-max border-collapse text-sm">
								<thead>
									<tr className="border-b border-slate-200 bg-slate-50/60">
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
										<th className="w-10" />
									</tr>
								</thead>
								<tbody>
									{documents.map((doc) => (
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
													<Translate text={localizationConstants.calcForfragnSePlan} />
												</Button>
											</td>
											<td className="px-2 py-2.5">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<button
															type="button"
															className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-slate-400 hover:bg-slate-100"
														>
															<MoreVertical className="h-4 w-4" />
														</button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end" className="w-32">
														<DropdownMenuItem
															className="cursor-pointer text-sm text-red-600 focus:text-red-600"
															onClick={() => setDocuments((prev) => prev.filter((d) => d.id !== doc.id))}
														>
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

						{/* Upload section */}
						<div className="border-t border-slate-100 p-5">
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

							<div className="mt-4 flex items-start gap-2">
								<Checkbox
									id="gdpr-supplier"
									checked={gdprAccepted}
									onCheckedChange={(c) => setGdprAccepted(Boolean(c))}
									className="mt-0.5"
								/>
								<label htmlFor="gdpr-supplier" className="cursor-pointer text-sm text-slate-600">
									<Translate text={localizationConstants.calcNewGdprText} />{" "}
									<button type="button" className="cursor-pointer text-blue-600 underline">
										<Translate text={localizationConstants.calcNewGdprLink} />
									</button>{" "}
									<Translate text={localizationConstants.calcNewGdprSuffix} />
								</label>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom bar */}
			<div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3.5">
				<button
					type="button"
					onClick={() => router.push(backHref)}
					className="cursor-pointer text-sm font-medium text-slate-500 hover:text-slate-800"
				>
					<Translate text={localizationConstants.cancelButton} />
				</button>
				<Button className="h-9 cursor-pointer bg-[#111721] text-sm text-white hover:bg-slate-800">
					<Translate text={localizationConstants.saveButton} />
				</Button>
			</div>
		</div>
	);
}
