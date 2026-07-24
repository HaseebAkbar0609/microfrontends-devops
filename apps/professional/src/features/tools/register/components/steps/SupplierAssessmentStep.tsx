"use client";

import { useState, useRef, useMemo } from "react";
import type { Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormTextarea } from "@/components/form";
import { StarRating } from "@/components/common/StarRating";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { Trash2, X, ChevronDown, File, ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import type { Ratings, RatingField, CreateSupplierFormData } from "../../types";
import { uploadSupplierFileAPIAction } from "../../api/supplierRegister";

interface SupplierAssessmentStepProps {
	readonly control: Control<CreateSupplierFormData>;
	readonly ratings: Ratings;
	readonly onRatingChange: (field: RatingField, value: number) => void;
}

interface UploadedFile {
	id: string;
	name: string;
	type: string;
	date: string;
	file: File;
	remoteId?: string;
}

export function SupplierAssessmentStep({
	control,
	ratings,
	onRatingChange,
}: SupplierAssessmentStepProps) {
	const t = useTranslate();
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [sortField, setSortField] = useState<"date" | "name" | "type">("date");
	const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files) return;

		setIsUploading(true);
		try {
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				if (file.type !== "application/pdf") continue;

				const result = await uploadSupplierFileAPIAction(file);
				setUploadedFiles((prev) => [
					...prev,
					{
						id: `${Date.now()}-${i}`,
						name: file.name,
						type: file.type.split("/").pop()?.toUpperCase() || "PDF",
						date: new Date().toISOString().split("T")[0],
						file,
						remoteId: result.id,
					},
				]);
			}
		} catch {
			showToast("error", t(localizationConstants.supplierCreateError));
		} finally {
			setIsUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const handleDeleteFile = (id: string) => {
		setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
	};

	const handleViewFile = (file: UploadedFile) => {
		const url = URL.createObjectURL(file.file);
		window.open(url, "_blank");
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	};

	const handleSort = (field: "date" | "name" | "type") => {
		if (sortField === field) {
			setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortDir("asc");
		}
	};

	const sortedFiles = useMemo(() => {
		const sorted = [...uploadedFiles];
		sorted.sort((a, b) => {
			let cmp = 0;
			if (sortField === "date") cmp = a.date.localeCompare(b.date);
			else if (sortField === "name") cmp = a.name.localeCompare(b.name);
			else cmp = a.type.localeCompare(b.type);
			return sortDir === "asc" ? cmp : -cmp;
		});
		return sorted;
	}, [uploadedFiles, sortField, sortDir]);

	const renderSortIcon = (field: "date" | "name" | "type") => {
		if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-slate-400" />;
		return sortDir === "asc" ? (
			<ArrowUp className="h-3 w-3 text-slate-600" />
		) : (
			<ArrowDown className="h-3 w-3 text-slate-600" />
		);
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Bedömning Section */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="text-base font-medium">
						<Translate text={localizationConstants.assessmentSection} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-5">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-[#09090B]">
								<Translate text={localizationConstants.economyLabel} />
							</span>
							<StarRating
								value={ratings.economy}
								onChange={(v) => onRatingChange("economy", v)}
								size={28}
							/>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-[#09090B]">
								<Translate text={localizationConstants.environmentLabel} />
							</span>
							<StarRating
								value={ratings.environment}
								onChange={(v) => onRatingChange("environment", v)}
								size={28}
							/>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-[#09090B]">
								<Translate text={localizationConstants.qualityLabel} />
							</span>
							<StarRating
								value={ratings.quality}
								onChange={(v) => onRatingChange("quality", v)}
								size={28}
							/>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-[#09090B]">
								<Translate text={localizationConstants.collaborationLabel} />
							</span>
							<StarRating
								value={ratings.collaboration}
								onChange={(v) => onRatingChange("collaboration", v)}
								size={28}
							/>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-[#09090B]">
								<Translate text={localizationConstants.punctualityLabel} />
							</span>
							<StarRating
								value={ratings.punctuality}
								onChange={(v) => onRatingChange("punctuality", v)}
								size={28}
							/>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-[#09090B]">
								<Translate text={localizationConstants.serviceLabel} />
							</span>
							<StarRating
								value={ratings.service}
								onChange={(v) => onRatingChange("service", v)}
								size={28}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* FÖRETAGSUPPGIFTER Section */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="text-base font-medium">
						<Translate text={localizationConstants.companyDetailsSection} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4">
						<div>
							<p className="mb-1 text-sm font-medium text-[#09090B]">
								<Translate text={localizationConstants.fileUploadLabel} />
							</p>
							<p className="mb-3 text-xs text-slate-500">
								<Translate text={localizationConstants.fileUploadHelper} />
							</p>
							<div className="flex items-center gap-3">
								<div
									className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
									onClick={() => fileInputRef.current?.click()}
								>
									<input
										ref={fileInputRef}
										type="file"
										accept=".pdf"
										multiple
										className="hidden"
										onChange={handleFileSelect}
									/>
									<div className="flex flex-1 flex-wrap items-center gap-1.5">
										{uploadedFiles.length > 0 ? (
											uploadedFiles.map((file) => (
												<span
													key={file.id}
													className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
												>
													{file.name}
													<button
														type="button"
														onClick={(e) => {
															e.stopPropagation();
															handleDeleteFile(file.id);
														}}
														className="rounded-full p-0.5 hover:bg-slate-200"
													>
														<X className="h-3 w-3" />
													</button>
												</span>
											))
										) : (
											<span className="text-sm text-slate-400">
												<Translate text={localizationConstants.selectFiles} />
											</span>
										)}
									</div>
									<ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
								</div>
								<Button
									type="button"
									variant="default"
									disabled={isUploading}
									className="h-9 shrink-0 gap-1.5 bg-[#111721] px-4 text-xs font-medium text-white hover:bg-slate-800"
									onClick={() => fileInputRef.current?.click()}
								>
									{isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
									<Translate text={localizationConstants.uploadButton} />
								</Button>
							</div>
						</div>

						{/* File Upload Table */}
						{sortedFiles.length > 0 && (
							<div className="mt-2 overflow-x-auto rounded-md border border-slate-200">
								<table className="w-full min-w-[600px] border-collapse">
									<thead>
										<tr className="border-b border-slate-200">
											<th
												className="cursor-pointer px-4 py-2.5 text-left text-xs font-medium text-slate-500 select-none hover:text-slate-700"
												onClick={() => handleSort("date")}
											>
												<span className="inline-flex items-center gap-1">
													<Translate text={localizationConstants.columnDate} />{" "}
													{renderSortIcon("date")}
												</span>
											</th>
											<th
												className="cursor-pointer px-4 py-2.5 text-left text-xs font-medium text-slate-500 select-none hover:text-slate-700"
												onClick={() => handleSort("name")}
											>
												<span className="inline-flex items-center gap-1">
													<Translate text={localizationConstants.columnDocumentName} />{" "}
													{renderSortIcon("name")}
												</span>
											</th>
											<th
												className="cursor-pointer px-4 py-2.5 text-left text-xs font-medium text-slate-500 select-none hover:text-slate-700"
												onClick={() => handleSort("type")}
											>
												<span className="inline-flex items-center gap-1">
													<Translate text={localizationConstants.columnFile} />{" "}
													{renderSortIcon("type")}
												</span>
											</th>
											<th className="w-40 border-l border-slate-200 px-4 py-2.5 font-medium text-slate-500" />
										</tr>
									</thead>
									<tbody>
										{sortedFiles.map((file) => (
											<tr key={file.id} className="border-b border-slate-100 last:border-b-0">
												<td className="px-4 py-3 text-sm text-slate-600">{file.date}</td>
												<td className="px-4 py-3 text-sm text-slate-700">
													<div className="flex items-center gap-2">
														<div className="relative flex h-16 w-12 items-center justify-center">
															<File className="h-16 w-12 text-slate-300" strokeWidth={1.5} />
															<span className="absolute -left-0.5 top-[55%] -translate-y-1/2 rounded-[2px] bg-red-600 px-1.5 py-0.5 text-[9px] font-bold leading-none text-white uppercase">
																{file.type}
															</span>
														</div>
														<span>{file.name}</span>
													</div>
												</td>
												<td className="px-4 py-3 text-sm text-slate-600">{file.type}</td>
												<td className="border-l border-slate-200 px-4 py-3">
													<div className="flex items-center justify-end gap-3">
														<Button
															type="button"
															variant="ghost"
															size="sm"
															className="h-7 rounded-sm border border-slate-300 px-3 text-xs font-medium text-slate-700 hover:bg-transparent hover:text-slate-900"
															onClick={() => handleViewFile(file)}
														>
															<Translate text={localizationConstants.viewFile} />
														</Button>
														<button
															type="button"
															onClick={() => handleDeleteFile(file.id)}
															className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
														>
															<Trash2 className="h-4 w-4" />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Tilläggsinformation Section */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="text-base font-medium">
						<Translate text={localizationConstants.additionalInfoSection} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<FormTextarea
						control={control}
						name="notes"
						label={localizationConstants.notesLabel}
						placeholder={localizationConstants.placeholderNotes}
						rows={3}
						labelClassName="text-[#09090B]"
					/>
				</CardContent>
			</Card>
		</div>
	);
}
