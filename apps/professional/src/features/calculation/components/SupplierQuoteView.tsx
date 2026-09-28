"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	ArrowUpDown,
	ChevronDown,
	ChevronUp,
	CircleDollarSign,
	Contact,
	Info,
	MessagesSquare,
	MoreVertical,
	Save,
	Upload,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useSupplierQuote } from "../hooks/useInquiry";
import { KalkylDocIcon } from "./KalkylDocIcon";
import {
	getCalculationAvailableDocumentsAPIAction,
	MOCK_AVAILABLE_DOCUMENTS,
	type AvailableDocOption,
} from "../api/createCalculation";
import type { SupplierDocument } from "../types/forfragan";

interface SupplierQuoteViewProps {
	calcId: string;
	requestId: string;
	supplierId: string;
}

function InfoField({ label, value }: { label: string; value?: string | null }) {
	return (
		<div className="flex flex-col gap-1 min-w-0">
			<p className="text-sm font-medium text-zinc-950 truncate">{label}</p>
			<p className="text-sm font-normal text-zinc-500 break-words">{value?.trim() || "-"}</p>
		</div>
	);
}

export function SupplierQuoteView({ calcId, requestId, supplierId }: SupplierQuoteViewProps) {
	const router = useRouter();
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		data,
		isLoading,
		offertPris,
		setOffertPris,
		kommentarer,
		setKommentarer,
		gdprAccepted,
		setGdprAccepted,
		handleSave,
		isSaving,
	} = useSupplierQuote(calcId, requestId, supplierId);

	// Section collapse states
	const [isSupplierInfoOpen, setIsSupplierInfoOpen] = useState(true);
	const [isOffertPrisOpen, setIsOffertPrisOpen] = useState(true);
	const [isKommentarerOpen, setIsKommentarerOpen] = useState(true);
	const [isDocumentsOpen, setIsDocumentsOpen] = useState(true);

	const [availableDocs, setAvailableDocs] = useState<AvailableDocOption[]>(MOCK_AVAILABLE_DOCUMENTS);
	const [attachedDocuments, setAttachedDocuments] = useState<SupplierDocument[]>([]);

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

	const handleBack = () => {
		router.push(`/module/business/calculation/overview/${calcId}/forfragan/${requestId}`);
	};

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
			const newDoc: SupplierDocument = {
				id: `quote_doc_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 6)}`,
				datum: today,
				namn: file.name,
				typ: fileType === "pdf" ? "PDF" : fileType === "doc" ? "DOC" : "IMG",
				fileType,
			};
			setAttachedDocuments((prev) => [...prev, newDoc]);
		});
		showToast("success", t(localizationConstants.save));
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	function handleSelectMockDoc(docOption: AvailableDocOption) {
		const allDocs = [...(data?.documents ?? []), ...attachedDocuments];
		if (allDocs.some((d) => d.namn === docOption.namn)) return;
		const today = new Date().toISOString().split("T")[0];
		const newDoc: SupplierDocument = {
			id: `quote_doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
			datum: today,
			namn: docOption.namn,
			typ: docOption.typ,
			fileType: docOption.fileType,
		};
		setAttachedDocuments((prev) => [...prev, newDoc]);
		showToast("success", t(localizationConstants.save));
	}

	function handleRemoveDocument(docId: string) {
		setAttachedDocuments((prev) => prev.filter((d) => d.id !== docId));
		showToast("info", t(localizationConstants.deleteConfirmationTitle));
	}

	if (isLoading) {
		return (
			<div className="flex flex-1 flex-col p-6 space-y-4">
				<Skeleton className="h-10 w-48 rounded-lg" />
				<Skeleton className="h-64 w-full rounded-xl" />
			</div>
		);
	}

	const quoteData = data;
	const documents: SupplierDocument[] = [
		...(quoteData?.documents ?? [
			{ id: "d1", datum: "2024-05-10", namn: "offert.pdf", typ: "Offert", fileType: "pdf" },
			{ id: "d2", datum: "2024-05-10", namn: "offert.pdf", typ: "Offert", fileType: "pdf" },
			{ id: "d3", datum: "2024-05-10", namn: "offert.pdf", typ: "Offert", fileType: "pdf" },
		]),
		...attachedDocuments,
	];

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
			{/* Page Header */}
			<div className="shrink-0 bg-slate-50">
				<div className="px-6 pt-5 pb-3.5 sm:pl-15">
					<div className="flex items-center gap-2.5 sm:gap-3 -ml-4 sm:-ml-10">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={handleBack}
							className="h-8 w-8 sm:h-9 sm:w-9 cursor-pointer text-slate-900 hover:bg-transparent hover:text-slate-700 p-0 shrink-0 flex items-center justify-center shadow-none"
						>
							<ArrowLeft className="h-6 w-6 sm:h-8 sm:w-8 text-slate-900 shrink-0" strokeWidth={2.5} />
						</Button>
						<h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 leading-tight">
							<Translate text={localizationConstants.calcForfragnSupplierQuote} />
						</h1>
					</div>
				</div>
			</div>

			{/* Main Form Body */}
			<div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:pl-15 sm:pr-6">
				{/* Section 1: Leverantörsinformation */}
				<Card className="rounded-lg border border-neutral-200 bg-white shadow-none overflow-hidden gap-0 py-0 pb-0">
					<Button
						type="button"
						variant="ghost"
						onClick={() => setIsSupplierInfoOpen((prev) => !prev)}
						className="flex h-14 w-full items-center justify-between px-4 sm:px-6 border-b border-zinc-200 bg-white text-left cursor-pointer hover:bg-slate-50/50 transition-colors rounded-none shadow-none font-normal"
					>
						<div className="flex items-center gap-2 min-w-0">
							<Info className="h-5 w-5 shrink-0 text-slate-800" />
							<span className="truncate text-base font-medium text-zinc-950">
								<Translate text={localizationConstants.calcForfragnLeverantorsInfo} />
							</span>
						</div>
						{isSupplierInfoOpen ? (
							<ChevronUp className="h-4 w-4 text-slate-500" />
						) : (
							<ChevronDown className="h-4 w-4 text-slate-500" />
						)}
					</Button>

					{isSupplierInfoOpen && (
						<CardContent className="p-4 sm:p-5 space-y-5">
							{/* Sub-box: Företagsinformation */}
							<div className="space-y-3">
								<div className="w-fit inline-flex items-center gap-2 rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-900">
									<Info className="h-4 w-4 shrink-0 text-slate-700" />
									<span><Translate text={localizationConstants.calcForfragnForetagsinfo} /></span>
								</div>

								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<InfoField label={t(localizationConstants.calcForfragnCompany)} value={quoteData?.company || "-"} />
									<InfoField label={t(localizationConstants.agreementDetailMail)} value={quoteData?.mail || "-"} />
									<InfoField label={t(localizationConstants.calcNewTelefon)} value={quoteData?.telefon || "-"} />
									<InfoField label={t(localizationConstants.calcNewAddressLabel)} value={quoteData?.address || "-"} />
									<InfoField label={t(localizationConstants.calcNewPostNr)} value={quoteData?.postNr || "-"} />
									<InfoField label={t(localizationConstants.calcForfragnKontaktSumma)} value={quoteData?.kontaktSumma || "-"} />
								</div>
							</div>

							{/* Sub-box: Kontakt */}
							<div className="space-y-3 pt-2">
								<div className="w-fit inline-flex items-center gap-2 rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-900">
									<Contact className="h-4 w-4 shrink-0 text-slate-700" />
									<span><Translate text={localizationConstants.calcForfragnKontakt} /></span>
								</div>

								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<InfoField label={t(localizationConstants.calcForfragnNamn)} value={quoteData?.kontaktNamn || "-"} />
									<InfoField label={t(localizationConstants.agreementDetailMail)} value={quoteData?.kontaktMail || "-"} />
									<InfoField label={t(localizationConstants.agreementDetailMobil)} value={quoteData?.kontaktMobil || "-"} />
								</div>
							</div>
						</CardContent>
					)}
				</Card>

				{/* Section 2: Offert Pris */}
				<Card className="rounded-lg border border-neutral-200 bg-white shadow-none overflow-hidden gap-0 py-0 pb-0">
					<Button
						type="button"
						variant="ghost"
						onClick={() => setIsOffertPrisOpen((prev) => !prev)}
						className="flex h-14 w-full items-center justify-between px-4 sm:px-6 border-b border-zinc-200 bg-white text-left cursor-pointer hover:bg-slate-50/50 transition-colors rounded-none shadow-none font-normal"
					>
						<div className="flex items-center gap-2.5 min-w-0">
							<CircleDollarSign className="h-5 w-5 shrink-0 text-slate-800" />
							<span className="truncate text-base font-medium text-zinc-950">
								<Translate text={localizationConstants.calcForfragnOffertPris} />
							</span>
							<span className="inline-flex items-center rounded-md bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white">
								<Translate text={localizationConstants.calcForfragnStatusReceivedPrice} />
							</span>
						</div>
						{isOffertPrisOpen ? (
							<ChevronUp className="h-4 w-4 text-slate-500" />
						) : (
							<ChevronDown className="h-4 w-4 text-slate-500" />
						)}
					</Button>

					{isOffertPrisOpen && (
						<CardContent className="p-4 sm:p-5">
							<Input
								value={offertPris}
								onChange={(e) => setOffertPris(e.target.value)}
								placeholder={t(localizationConstants.calcForfragnAmountPlaceholder)}
								className="h-10 w-full rounded-md border-slate-200 bg-white text-sm font-normal text-slate-900 shadow-none focus-visible:border-slate-400"
							/>
						</CardContent>
					)}
				</Card>

				{/* Section 3: Kommentarer */}
				<Card className="rounded-lg border border-neutral-200 bg-white shadow-none overflow-hidden gap-0 py-0 pb-0">
					<Button
						type="button"
						variant="ghost"
						onClick={() => setIsKommentarerOpen((prev) => !prev)}
						className="flex h-14 w-full items-center justify-between px-4 sm:px-6 border-b border-zinc-200 bg-white text-left cursor-pointer hover:bg-slate-50/50 transition-colors rounded-none shadow-none font-normal"
					>
						<div className="flex items-center gap-2 min-w-0">
							<MessagesSquare className="h-5 w-5 shrink-0 text-slate-800" />
							<span className="truncate text-base font-medium text-zinc-950">
								<Translate text={localizationConstants.calcForfragnKommentarer} />
							</span>
						</div>
						{isKommentarerOpen ? (
							<ChevronUp className="h-4 w-4 text-slate-500" />
						) : (
							<ChevronDown className="h-4 w-4 text-slate-500" />
						)}
					</Button>

					{isKommentarerOpen && (
						<CardContent className="p-4 sm:p-5">
							<Input
								value={kommentarer}
								onChange={(e) => setKommentarer(e.target.value)}
								placeholder={t(localizationConstants.fieldCommentPlaceholder)}
								className="h-10 w-full rounded-md border-slate-200 bg-white text-sm font-normal text-slate-900 shadow-none focus-visible:border-slate-400"
							/>
						</CardContent>
					)}
				</Card>

				{/* Section 4: Dokuments */}
				<Card className="rounded-lg border border-neutral-200 bg-white shadow-none overflow-hidden gap-0 py-0 pb-0">
					<Button
						type="button"
						variant="ghost"
						onClick={() => setIsDocumentsOpen((prev) => !prev)}
						className="flex h-14 w-full items-center justify-between px-4 sm:px-6 border-b border-zinc-200 bg-white text-left cursor-pointer hover:bg-slate-50/50 transition-colors rounded-none shadow-none font-normal"
					>
						<div className="flex items-center gap-2 min-w-0">
							<Upload className="h-5 w-5 shrink-0 text-slate-800" />
							<span className="truncate text-base font-medium text-zinc-950">
								<Translate text={localizationConstants.calcInquiryWizStep3} />
							</span>
						</div>
						{isDocumentsOpen ? (
							<ChevronUp className="h-4 w-4 text-slate-500" />
						) : (
							<ChevronDown className="h-4 w-4 text-slate-500" />
						)}
					</Button>

					{isDocumentsOpen && (
						<CardContent className="p-4 sm:p-5 space-y-4">
							{/* Document list table */}
							<div className="overflow-x-auto rounded border border-slate-200">
								<Table>
									<TableHeader>
										<TableRow className="h-11 border-b border-slate-200 bg-white">
											<TableHead className="px-4 text-left font-medium text-slate-500">
												<div className="flex items-center gap-1">
													<Translate text={localizationConstants.agreementDetailDatum} />
													<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
												</div>
											</TableHead>
											<TableHead className="px-4 text-left font-medium text-slate-500">
												<div className="flex items-center gap-1">
													<Translate text={localizationConstants.agreementDetailDokumentetsNamn} />
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
										{documents.map((doc) => {
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
																className="h-8 w-6 shrink-0"
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
																<Translate text={localizationConstants.calcForfragnSePlan} />
															</Button>
															<Button
																type="button"
																variant="ghost"
																size="icon"
																aria-label={t(localizationConstants.actions)}
																className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-900 hover:bg-slate-100"
															>
																<MoreVertical className="h-4 w-4 text-slate-900" />
															</Button>
														</div>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>

							{/* Upload & Dropdown selector */}
							<div className="space-y-3 pt-1">
								<div>
									<h4 className="text-sm font-medium text-slate-900">
										<Translate text={localizationConstants.calcForfragnLaddaUppFiler} />
									</h4>
									<p className="text-xs text-slate-500">
										<Translate text={localizationConstants.calcForfragnAllowedFileTypes} />
									</p>
								</div>

								<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<div
												role="button"
												tabIndex={0}
												className="flex flex-1 items-center justify-between min-h-10 rounded-md border border-slate-200 bg-white px-3 py-1.5 cursor-pointer hover:border-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 transition-colors select-none"
											>
												<div className="flex flex-1 flex-wrap items-center gap-1.5 py-0.5 min-w-0">
													{attachedDocuments.length === 0 ? (
														<span className="text-sm text-slate-400">
															<Translate text={localizationConstants.agreementNoFile} />
														</span>
													) : (
														attachedDocuments.map((doc) => (
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
																		handleRemoveDocument(doc.id);
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
										<Translate text={localizationConstants.calcForfragnUploadBtn} />
									</Button>
								</div>

								{/* GDPR Checkbox */}
								<div className="flex items-start gap-3 pt-2">
									<Checkbox
										id="gdpr-quote"
										checked={gdprAccepted}
										onCheckedChange={(c) => setGdprAccepted(Boolean(c))}
										className="mt-0.5 shrink-0 border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:text-white data-[state=checked]:border-slate-900"
									/>
									<Label
										htmlFor="gdpr-quote"
										className="block cursor-pointer text-xs sm:text-sm font-normal text-slate-600 leading-relaxed"
									>
										<span>
											<Translate text={localizationConstants.calcNewGdprText} />{" "}
										</span>
										<span
											role="link"
											tabIndex={0}
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
						</CardContent>
					)}
				</Card>
			</div>

			{/* Bottom Action Footer matching Figma Image 5 */}
			<div className="flex h-16 shrink-0 items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 sm:pl-15 sm:pr-6">
				<Button
					type="button"
					variant="ghost"
					onClick={handleBack}
					className="h-10 rounded-md bg-[var(--color-bg-secondary,#F4F4F5)] px-6 text-sm font-medium text-slate-800 hover:bg-slate-200 cursor-pointer shadow-none"
				>
					<Translate text={localizationConstants.cancelButton} />
				</Button>
				<Button
					type="button"
					onClick={handleSave}
					disabled={isSaving}
					className="h-10 rounded-md bg-slate-900 px-6 text-sm font-medium text-white hover:bg-slate-800 cursor-pointer gap-2 shadow-none"
				>
					<Save className="h-4 w-4" />
					<Translate text={localizationConstants.save} />
				</Button>
			</div>
		</div>
	);
}
