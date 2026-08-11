"use client";

import { useRef, useState } from "react";
import { ArrowUpDown, ChevronDown, File, Folders, MoreHorizontal, Trash2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { KalkylDocItem } from "../../types/kalkyl";

// ── Sub-components ─────────────────────────────────────────────────────────

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
	const [pendingFiles, setPendingFiles] = useState<{ name: string }[]>([]);

	function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files) return;
		const today = new Date().toISOString().split("T")[0];
		Array.from(files).forEach((file) => {
			const lower = file.name.toLowerCase();
			const fileType: KalkylDocItem["fileType"] = lower.endsWith(".pdf")
				? "pdf"
				: lower.endsWith(".doc") || lower.endsWith(".docx")
					? "doc"
					: "img";
			onAddDocument({
				id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
				datum: today,
				namn: file.name,
				typ: fileType === "pdf" ? "PDF" : fileType === "doc" ? "DOC" : "IMG",
				fileType,
			});
			setPendingFiles((prev) => [...prev, { name: file.name }]);
		});
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	function handleRemovePending(name: string) {
		setPendingFiles((prev) => prev.filter((f) => f.name !== name));
	}

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<Folders className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.calcNewStep3Tab} />
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					{/* Date period */}
					<div className="mb-5">
						<p className="mb-2 text-sm font-medium text-slate-900">
							<Translate text={localizationConstants.calcNewDatumPeriod} />
						</p>
						<div className="flex items-center gap-3">
							<div className="relative flex-1">
								<input
									type="date"
									value={datumFran}
									onChange={(e) => onDatumFranChange(e.target.value)}
									placeholder={t(localizationConstants.calcNewFranDatum)}
									className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus-visible:border-slate-400 focus-visible:outline-none"
								/>
							</div>
							<div className="relative flex-1">
								<input
									type="date"
									value={datumTill}
									onChange={(e) => onDatumTillChange(e.target.value)}
									placeholder={t(localizationConstants.calcNewTillDatum)}
									className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus-visible:border-slate-400 focus-visible:outline-none"
								/>
							</div>
						</div>
					</div>

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
													onClick={() => handleRemovePending(pf.name)}
													className="ml-1 cursor-pointer text-slate-400 hover:text-slate-600"
												>
													<X className="h-3 w-3" />
												</button>
											</span>
										))
									)}
								</div>
								<ChevronDown className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
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
								className="h-9 min-w-25 cursor-pointer bg-[#111721] text-white hover:bg-slate-800"
							>
								<Translate text={localizationConstants.agreementUpload} />
							</Button>
						</div>
					</div>

					{/* GDPR checkbox */}
					<div className="mb-6 flex items-start gap-2">
						<Checkbox
							id="gdpr-accept"
							checked={gdprAccepted}
							onCheckedChange={(c) => onGdprChange(Boolean(c))}
							className="mt-0.5"
						/>
						<label htmlFor="gdpr-accept" className="cursor-pointer text-sm text-slate-600">
							<Translate text={localizationConstants.calcNewGdprText} />{" "}
							<button
								type="button"
								className="cursor-pointer text-blue-600 underline hover:text-blue-700"
							>
								<Translate text={localizationConstants.calcNewGdprLink} />
							</button>{" "}
							<Translate text={localizationConstants.calcNewGdprSuffix} />
						</label>
					</div>

					{/* Attached documents table */}
					<div>
						<p className="mb-3 text-sm font-medium text-slate-900">
							<Translate text={localizationConstants.agreementCreateBifogadeDokument} />
						</p>
						<div className="overflow-x-auto rounded border border-slate-200">
							<table className="w-full min-w-max border-collapse text-sm">
								<thead>
									<tr className="h-11 border-b border-slate-200">
										<th className="px-4 text-left font-medium text-slate-500">
											<div className="flex items-center gap-1">
												<Translate text={localizationConstants.agreementDetailDatum} />
												<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
											</div>
										</th>
										<th className="px-4 text-left font-medium text-slate-500">
											<div className="flex items-center gap-1">
												<Translate
													text={localizationConstants.agreementDetailDokumentetsNamn}
												/>
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
									{documents.length === 0 ? (
										<tr>
											<td
												colSpan={5}
												className="h-24 text-center text-sm text-slate-400"
											>
												<Translate text={localizationConstants.agreementNoDocuments} />
											</td>
										</tr>
									) : (
										documents.map((doc) => (
											<tr
												key={doc.id}
												className="border-b border-slate-100 last:border-b-0"
											>
												<td className="px-4 py-2 text-slate-600">{doc.datum}</td>
												<td className="px-4 py-2">
													<span className="inline-flex items-center gap-2 text-slate-700">
														<DocFileBadge fileType={doc.fileType} />
														{doc.namn}
													</span>
												</td>
												<td className="px-4 py-2 text-slate-600">{doc.typ}</td>
												<td className="px-4 py-2">
													<Button
														type="button"
														variant="outline"
														size="sm"
														className="h-7 cursor-pointer border-slate-200 bg-white text-xs hover:bg-slate-50"
													>
														<Translate text={localizationConstants.agreementCreateSeFil} />
													</Button>
												</td>
												<td className="px-2 py-2">
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
															<DropdownMenuItem
																className="cursor-pointer gap-2 text-sm text-red-600 focus:text-red-600"
																onClick={() => onRemoveDocument(doc.id)}
															>
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
				</CardContent>
			</Card>
		</div>
	);
}
