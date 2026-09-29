"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { ArrowUpDown, Calendar as CalendarIcon, ChevronDown, Folders, MoreVertical, Trash2, Upload, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { parseDateValue } from "@/utils/date";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { KalkylDocItem } from "../../types/kalkyl";
import {
	getCalculationAvailableDocumentsAPIAction,
	CALCULATION_DOCUMENT_OPTIONS,
	type AvailableDocOption,
} from "../../api/createCalculation";
import { KalkylDocIcon } from "../KalkylDocIcon";

// ── DatePicker Component ───────────────────────────────────────────────────

interface KalkylDatePickerProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

function KalkylDatePicker({ value, onChange, placeholder }: KalkylDatePickerProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					className={cn(
						"relative flex h-10 w-full cursor-pointer items-center justify-start gap-2.5 rounded-md border border-slate-200 bg-white px-3 text-left text-sm font-normal text-slate-700 shadow-none hover:bg-slate-50 focus:border-slate-400 focus:outline-none",
						!value && "text-slate-400",
					)}
				>
					<CalendarIcon className="h-4 w-4 shrink-0 text-slate-400 pointer-events-none" />
					<span className="truncate">{value || placeholder || "YYYY-MM-DD"}</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-auto p-0 border border-slate-200 bg-white shadow-lg rounded-xl z-50"
				align="start"
			>
				<Calendar
					mode="single"
					selected={parseDateValue(value)}
					onSelect={(date) => {
						onChange(date ? format(date, "yyyy-MM-dd") : "");
						setIsOpen(false);
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}

// ── Main component ─────────────────────────────────────────────────────────

interface KalkylDokumentStepProps {
	documents: KalkylDocItem[];
	datumFran: string;
	datumTill: string;
	gdprAccepted: boolean;
	onDatumFranChange: (v: string) => void;
	onDatumTillChange: (v: string) => void;
	onGdprChange: (v: boolean) => void;
	onAddDocument: (doc: KalkylDocItem) => void;
	onRemoveDocument: (id: string) => void;
}

export function KalkylDokumentStep({
	documents,
	datumFran,
	datumTill,
	gdprAccepted,
	onDatumFranChange,
	onDatumTillChange,
	onGdprChange,
	onAddDocument,
	onRemoveDocument,
}: KalkylDokumentStepProps) {
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [availableDocs, setAvailableDocs] = useState<AvailableDocOption[]>(CALCULATION_DOCUMENT_OPTIONS);

	useEffect(() => {
		let isMounted = true;
		async function fetchAvailableDocs() {
			try {
				const docs = await getCalculationAvailableDocumentsAPIAction();
				if (isMounted && docs.length > 0) {
					setAvailableDocs(docs);
				}
			} catch {
					setAvailableDocs([]);
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
			const fileType: KalkylDocItem["fileType"] = lower.endsWith(".pdf")
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
					{/* Date period */}
					<div className="mb-5">
						<Label className="mb-2 block text-sm font-medium text-slate-900">
							<Translate text={localizationConstants.calcNewDatumPeriod} />
						</Label>
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
							<div className="flex-1 min-w-0">
								<KalkylDatePicker
									value={datumFran}
									onChange={onDatumFranChange}
									placeholder={t(localizationConstants.calcNewFranDatum)}
								/>
							</div>
							<div className="flex-1 min-w-0">
								<KalkylDatePicker
									value={datumTill}
									onChange={onDatumTillChange}
									placeholder={t(localizationConstants.calcNewTillDatum)}
								/>
							</div>
						</div>
					</div>

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
														className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700 shadow-2xs max-w-full"
													>
														<KalkylDocIcon fileType={doc.fileType} fileName={doc.namn} className="h-4.5 w-3.5 shrink-0" />
														<span className="truncate max-w-[120px] sm:max-w-[160px] font-medium">{doc.namn}</span>
														<button
															type="button"
															aria-label={t(localizationConstants.remove)}
															onClick={(e) => {
																e.preventDefault();
																e.stopPropagation();
																onRemoveDocument(doc.id);
															}}
															className="ml-0.5 rounded-xs p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 cursor-pointer transition-colors shrink-0"
														>
															<X className="h-3 w-3" />
														</button>
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
												<div className="flex items-center gap-2.5 min-w-0">
													<KalkylDocIcon fileType={doc.fileType} fileName={doc.namn} className="h-6 w-5 shrink-0" />
													<span className={cn("truncate text-sm font-medium", isAlreadySelected ? "text-slate-400 line-through" : "text-slate-800")}>
														{doc.namn}
													</span>
												</div>
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
						<div className="flex items-start gap-2.5 sm:gap-3">
							<Checkbox
								id="gdpr-accept"
								checked={gdprAccepted}
								onCheckedChange={(c) => onGdprChange(Boolean(c))}
								className="mt-0.5 shrink-0 border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:text-white data-[state=checked]:border-slate-900"
							/>
							<label
								htmlFor="gdpr-accept"
								className="block min-w-0 flex-1 cursor-pointer text-xs font-normal leading-relaxed text-slate-600 sm:text-sm select-none"
							>
								<Translate text={localizationConstants.calcNewGdprText} />{" "}
								<a
									href="#privacy"
									onClick={(e) => e.preventDefault()}
									className="inline font-medium text-orange-500 underline hover:text-orange-600"
								>
									<Translate text={localizationConstants.calcNewGdprLink} />
								</a>{" "}
								<Translate text={localizationConstants.calcNewGdprSuffix} />
							</label>
						</div>
					</div>

					{/* Attached documents table */}
					<div>
						<p className="mb-3 text-sm font-medium text-slate-900">
							<Translate text={localizationConstants.agreementCreateBifogadeDokument} />
						</p>
						<div className="overflow-x-auto rounded border border-slate-200">
							<Table className="w-full min-w-[640px] table-fixed">
								<TableHeader>
									<TableRow className="h-11 border-b border-slate-200">
										<TableHead className="w-32 px-4 text-left font-medium text-slate-500">
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
										<TableHead className="w-28 px-4 text-left font-medium text-slate-500">
											<div className="flex items-center gap-1">
												<Translate text={localizationConstants.calcProType} />
												<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
											</div>
										</TableHead>
										<TableHead className="w-24 px-4 text-left font-medium text-slate-500">
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
													<TableCell className="w-32 whitespace-nowrap px-4 py-3 text-sm font-normal text-slate-900">
														{doc.datum}
													</TableCell>
													<TableCell className="min-w-0 px-4 py-3">
														<div className="flex w-full min-w-0 items-center gap-3 overflow-hidden text-sm font-normal text-slate-900">
															<KalkylDocIcon
																fileType={doc.fileType}
																fileName={doc.namn}
																className="h-10 w-8 shrink-0"
															/>
															<span className="truncate" title={doc.namn}>{doc.namn}</span>
														</div>
													</TableCell>
													<TableCell className="w-28 whitespace-nowrap px-4 py-3 text-sm font-normal text-slate-900">
														{doc.typ}
													</TableCell>
													<TableCell className="w-24 whitespace-nowrap px-4 py-3 text-sm font-normal uppercase text-slate-900">
														{fileExt}
													</TableCell>
													<TableCell className="w-36 shrink-0 border-l border-slate-200 px-4 py-3 text-right">
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
																		onClick={() => onRemoveDocument(doc.id)}
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
				</CardContent>
			</Card>
		</div>
	);
}

