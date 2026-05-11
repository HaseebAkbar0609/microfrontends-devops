import { UseFormReturn, useFieldArray } from "react-hook-form";
import {
	HardHat,
	FolderOpen,
	Trash2,
	ChevronDown,
	Loader2,
	ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { CreateOfferFormValues, QuoteDocument } from "../../types/form";
import React, { useRef, useState } from "react";
import { uploadMediaAPIAction } from "@/api-actions";
import { getDocumentIconMeta } from "../../utils/documentIcon";

interface Step3Props {
	form: UseFormReturn<CreateOfferFormValues>;
}

export function Step3ProjectDescription({ form }: Step3Props) {
	const { t } = useTranslation();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);
	const { append, remove } = useFieldArray({
		control: form.control,
		name: "documents",
		/** RHF default `id` overwrites our media UUID in `fields`; render from `watch` instead */
		keyName: "_rhfId",
	});

	const documents = form.watch("documents") ?? [];

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			setIsUploading(true);
			try {
				for (const file of Array.from(files)) {
					const result = await uploadMediaAPIAction(file);
					if (result.success && result.data) {
						const ext =
							result.data.file_name
								.split(".")
								.pop()
								?.toLowerCase() || "file";
						append({
							id: result.data.id,
							name: result.data.file_name,
							size: file.size,
							type: ext,
							date: new Date().toISOString().split("T")[0],
							file: file,
						});
					}
				}
			} finally {
				setIsUploading(false);
				if (fileInputRef.current) {
					fileInputRef.current.value = "";
				}
			}
		}
	};

	const removeFile = (index: number) => {
		remove(index);
	};

	return (
		<div className="space-y-4">
			<Card className="border shadow-sm overflow-hidden bg-white py-0 gap-0">
				<CardHeader className="bg-slate-50/50 px-5 py-4 border-b !pb-0 ">
					<div className="flex items-center gap-2">
						<HardHat className="h-5 w-5 text-slate-700" />
						<CardTitle className="text-base font-semibold">
							<Translate
								text={
									localizationConstants.projectDescriptionSection
								}
							/>
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="p-4">
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<label className="text-sm font-medium text-slate-700">
									<Translate
										text={
											localizationConstants.descriptionLabel
										}
									/>
								</label>
								<FormControl>
									<Textarea
										placeholder={t(
											localizationConstants.writeDescriptionPlaceholder,
										)}
										className="resize-none min-h-[120px]"
										{...field}
										value={
											typeof field.value === "string"
												? field.value
												: ""
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</CardContent>
			</Card>

			<Card className="border shadow-sm overflow-hidden bg-white py-0 gap-0">
				<CardHeader className="bg-slate-50/50 px-5 py-4 border-b !pb-0 ">
					<div className="flex items-center gap-2">
						<FolderOpen className="h-5 w-5 text-slate-400" />
						<CardTitle className="text-base font-semibold">
							<Translate
								text={
									localizationConstants.projectDocumentsSection
								}
							/>
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="p-4 space-y-4">
					<div className="space-y-2">
						<label className="text-sm font-medium text-slate-700">
							<Translate
								text={
									localizationConstants.uploadYourFilesLabel
								}
							/>
						</label>
						<p className="text-xs text-slate-500">
							<Translate
								text={localizationConstants.allowedFilesLabel}
							/>
						</p>
						<div className="flex items-center gap-2">
							<div className="flex-1 border border-slate-200 rounded-md p-2 min-h-10 flex items-center justify-between bg-slate-50/50">
								<div className="flex flex-wrap gap-2 text-sm text-slate-600">
									{documents.length > 0 ? (
										documents.map((doc: QuoteDocument, index: number) => (
											<span
												key={`${doc.id}-${index}`}
												className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-xs flex items-center gap-2"
											>
												{doc.name}
												<span
													className="text-slate-400 cursor-pointer hover:text-slate-600"
													onClick={() =>
														removeFile(index)
													}
												>
													✕
												</span>
											</span>
										))
									) : (
										<span className="text-slate-400 italic">
											<Translate
												text={
													localizationConstants.noFileChosen
												}
											/>
										</span>
									)}
								</div>
								<ChevronDown className="h-4 w-4 text-slate-400" />
							</div>
							<input
								type="file"
								ref={fileInputRef}
								className="hidden"
								multiple
								onChange={handleFileChange}
							/>
							<Button
								type="button"
								className="bg-slate-900 text-white hover:bg-slate-800 min-w-[100px]"
								onClick={handleUploadClick}
								disabled={isUploading}
							>
								{isUploading ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Translate
										text={localizationConstants.upload}
									/>
								)}
							</Button>
						</div>
					</div>

					<div className="space-y-2 pt-4">
						<label className="text-sm font-medium text-slate-700">
							<Translate
								text={localizationConstants.specificationLabel}
							/>
						</label>
						<div className="border rounded-md overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="font-normal text-slate-500 bg-slate-50/50">
											<Translate
												text={
													localizationConstants.dateLabel
												}
											/>{" "}
											<span className="text-[10px]">
												↓↑
											</span>
										</TableHead>
										<TableHead className="font-normal text-slate-500 bg-slate-50/50">
											<Translate
												text={
													localizationConstants.documentNameLabel
												}
											/>{" "}
											<span className="text-[10px]">
												↓↑
											</span>
										</TableHead>
										<TableHead className="font-normal text-slate-500 bg-slate-50/50">
											<Translate
												text={
													localizationConstants.fileLabel
												}
											/>
										</TableHead>
										<TableHead className="w-[50px] bg-slate-50/50"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{documents.length > 0 ? (
										documents.map((doc: QuoteDocument, index: number) => {
											const icon = getDocumentIconMeta(
												doc.type,
											);
											return (
												<TableRow
													key={`${doc.id}-${index}`}
												>
													<TableCell className="text-sm">
														{doc.date}
													</TableCell>
													<TableCell className="text-sm font-medium">
														<div className="flex items-center gap-3">
															<div className="flex shrink-0 items-center justify-center p-1.5 rounded-md bg-slate-50">
																<Image
																	src={
																		icon.src
																	}
																	alt={
																		icon.alt
																	}
																	width={40}
																	height={40}
																	className="object-contain"
																/>
															</div>
															<div className="flex min-w-0 flex-col gap-0.5">
																{doc.url ? (
																	<a
																		href={
																			doc.url
																		}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="inline-flex items-center gap-1 text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-600"
																	>
																		<span className="truncate">
																			{
																				doc.name
																			}
																		</span>
																		<ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-500" />
																	</a>
																) : (
																	<span className="truncate">
																		{doc.name}
																	</span>
																)}
															</div>
														</div>
													</TableCell>
													<TableCell>
														<div className="bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px] w-fit font-semibold uppercase">
															{doc.type}
														</div>
													</TableCell>
													<TableCell>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8 text-slate-400 hover:text-red-500"
															onClick={() =>
																removeFile(
																	index,
																)
															}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</TableCell>
												</TableRow>
											);
										})
									) : (
										<TableRow>
											<TableCell
												colSpan={4}
												className="text-center py-8 text-slate-400"
											>
												<Translate
													text={
														localizationConstants.noQuotesFound
													}
												/>
											</TableCell>
										</TableRow>
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
