"use client";

import { useRef, useState } from "react";
import type { AgreementDocument } from "../../types/agreementCreate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	File,
	Folders,
	Trash2,
	ArrowUpDown,
	X,
	ChevronDown,
} from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { uploadAgreementMediaAction } from "@/api-actions/agreements/agreements";
import { showToast } from "@/lib/toast";

interface DocumentStepProps {
	documents: AgreementDocument[];
	onAddDocument: (doc: AgreementDocument) => void;
	onRemoveDocument: (id: string) => void;
}

export function DocumentStep({
	documents,
	onAddDocument,
	onRemoveDocument,
}: DocumentStepProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [pendingFiles, setPendingFiles] = useState<
		{ name: string; file: File }[]
	>([]);
	const [isUploading, setIsUploading] = useState(false);

	const displayDocuments = documents;

	const handleSeeFile = (url?: string) => {
		if (!url) {
			showToast("error", "File is not available yet.");
			return;
		}
		window.open(url, "_blank", "noopener,noreferrer");
	};

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		setIsUploading(true);
		const today = new Date().toISOString().split("T")[0];
		
		try {
			for (const file of Array.from(files)) {
				const isPdf = file.name.toLowerCase().endsWith(".pdf");
				
				// Show it in pending immediately for UX (optional, but good for feedback)
				setPendingFiles((prev) => [...prev, { name: file.name, file }]);

				// Upload file to backend
				const res = await uploadAgreementMediaAction(file);
				if (res.success && res.data) {
					onAddDocument({
						id: res.data.id,
						datum: today,
						namn: file.name,
						fil: file.name,
						type: isPdf ? "pdf" : "doc",
						url: res.data.file_url_path,
					});
				} else {
					// Remove from pending if failed
					setPendingFiles((prev) => prev.filter((f) => f.name !== file.name));
				}
			}
		} catch (_error) {
			showToast("error", "Failed to upload one or more files.");
		} finally {
			setIsUploading(false);
		}

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleRemovePending = (name: string) => {
		setPendingFiles((prev) => prev.filter((f) => f.name !== name));
	};

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<Folders className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.agreementDocuments} />
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<div className="mb-4">
						<p className="mb-1 text-sm font-medium text-slate-900">
							<Translate text={localizationConstants.agreementUploadFiles} />
						</p>
						<p className="mb-3 text-sm text-slate-500">
							<Translate text={localizationConstants.agreementFileTypes} />
						</p>

						<div className="flex items-center gap-3">
							<div className="flex flex-1 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
								<div className="flex flex-1 flex-wrap items-center gap-2">
									{pendingFiles.map((pf) => (
										<span
											key={pf.name}
											className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700"
										>
											{pf.name}
											<button
												type="button"
												onClick={() => handleRemovePending(pf.name)}
												className="ml-1 text-slate-400 hover:text-slate-600 cursor-pointer"
											>
												<X className="h-3 w-3" />
											</button>
										</span>
									))}
									{pendingFiles.length === 0 && (
										<span className="text-sm text-slate-400">
											<Translate text={localizationConstants.agreementNoFile} />
										</span>
									)}
								</div>
								<ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
							</div>
							<input
								ref={fileInputRef}
								type="file"
								multiple
								accept=".png,.jpg,.jpeg,.pdf"
								className="hidden"
								onChange={handleFileSelect}
							/>
							<Button
								type="button"
								variant="default"
								size="default"
								disabled={isUploading}
								onClick={() => fileInputRef.current?.click()}
								className="h-9 min-w-25 bg-[#111721] text-white hover:bg-slate-800 cursor-pointer disabled:opacity-50"
							>
								{isUploading ? "Uploading..." : <Translate text={localizationConstants.agreementUpload} />}
							</Button>
						</div>
					</div>

					<div>
						<p className="mb-3 text-sm font-medium text-slate-900">
							<Translate
								text={localizationConstants.agreementCreateBifogadeDokument}
							/>
						</p>
						<div className="overflow-x-auto rounded border border-slate-200">
							<table className="w-full min-w-162.5 border-collapse">
								<thead>
									<tr className="h-11 border-b border-slate-200">
										<th className="font-sans px-4 text-left text-sm font-medium leading-6 tracking-normal text-slate-500">
											<div className="flex items-center gap-1">
												<Translate
													text={localizationConstants.agreementDetailDatum}
												/>
												<ArrowUpDown className="h-4 w-4 text-slate-400" />
											</div>
										</th>
										<th className="font-sans px-4 text-left text-sm font-medium leading-6 tracking-normal text-slate-500">
											<div className="flex items-center gap-1">
												<Translate
													text={
														localizationConstants.agreementDetailDokumentetsNamn
													}
												/>
												<ArrowUpDown className="h-4 w-4 text-slate-400" />
											</div>
										</th>
										<th className="font-sans px-4 text-left text-sm font-medium leading-6 tracking-normal text-slate-500">
											<div className="flex items-center gap-1">
												<Translate
													text={localizationConstants.agreementDetailFil}
												/>
												<ArrowUpDown className="h-4 w-4 text-slate-400" />
											</div>
										</th>
										<th className="relative">
											<div className="absolute left-0 top-0 h-full w-px bg-slate-200" />
										</th>
									</tr>
								</thead>
								<tbody>
									{displayDocuments.map((doc) => (
										<tr
											key={doc.id}
											className="border-b border-slate-100 last:border-b-0"
										>
											<td className="px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-slate-600">
												{doc.datum}
											</td>
											<td className="px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-slate-700">
												<span className="inline-flex items-center gap-2">
													<div className="relative flex h-10 w-8 shrink-0 items-center justify-center">
														<File
															className="h-10 w-8 text-slate-300"
															strokeWidth={1.5}
														/>
														<span className={`absolute -left-0.5 top-[60%] -translate-y-1/2 rounded-[2px] px-1 py-0.5 text-[9px] font-bold leading-none text-white ${doc.type === "pdf" ? "bg-red-600" : "bg-blue-600"}`}>
															{doc.type === "pdf" ? "PDF" : "DOC"}
														</span>
													</div>
													{doc.namn}
												</span>
											</td>
											<td className="px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-slate-600">
												{doc.type.toUpperCase()}
											</td>
											<td className="relative px-2 py-2">
												<div className="flex items-center gap-2">
													<div className="absolute left-0 top-0 h-full w-px bg-slate-200" />
													<Button
														type="button"
														variant="outline"
														size="sm"
														onClick={() => handleSeeFile(doc.url)}
														className="h-8 border border-slate-300 bg-white text-xs hover:bg-slate-50 cursor-pointer"
													>
														<Translate
															text={localizationConstants.agreementCreateSeFil}
														/>
													</Button>
													<button
														type="button"
														onClick={() => onRemoveDocument(doc.id)}
														className="ml-auto h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-500 cursor-pointer"
													>
														<Trash2 className="h-4 w-4" />
													</button>
												</div>
											</td>
										</tr>
									))}
									{displayDocuments.length === 0 && (
										<tr>
											<td colSpan={4} className="h-24 text-center text-sm text-slate-500">
												<Translate text={localizationConstants.agreementNoDocuments} />
											</td>
										</tr>
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
