"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
	ArrowLeft,
	ArrowRight,
	ChevronDown,
	CircleUserRound,
	Copy,
	HardHat,
	Loader2,
	Trash2,
} from "lucide-react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { FormInput, FormSelect, FormTextarea, OptionalLabelSuffix } from "@/components/form";
import type { FormSelectOption } from "@/components/form";
import { showToast } from "@/lib/toast";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { consultantTypeNameKey } from "../../utils/typeName";
import {
	createConsultantRequestAPIAction,
	getConsultantTypesAPIAction,
	uploadMediaAPIAction,
	getActiveProjectsAPIAction,
} from "@/api-actions";
import { getDocumentIconMeta } from "@/features/quote/utils/documentIcon";
import {
	CREATE_CONSULTANT_REQUEST_DEFAULT_VALUES,
	createConsultantRequestSchema,
	type ConsultantDocument,
	type CreateConsultantRequestFormValues,
} from "../../schemas/createRequest.schema";

const ACCEPTED_FILE_TYPES = ".png,.jpg,.jpeg,.pdf";

export default function CreateConsultantRequestForm() {
	const router = useRouter();
	const { t } = useTranslation();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [typeOptions, setTypeOptions] = useState<FormSelectOption[]>([]);
	const [typesLoading, setTypesLoading] = useState(true);
	const [projectOptions, setProjectOptions] = useState<FormSelectOption[]>([]);
	const [projectsLoading, setProjectsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<CreateConsultantRequestFormValues>({
		resolver: zodResolver(createConsultantRequestSchema),
		defaultValues: CREATE_CONSULTANT_REQUEST_DEFAULT_VALUES,
		mode: "onChange",
	});

	const { append, remove } = useFieldArray({
		control: form.control,
		name: "documents",
		keyName: "_rhfId",
	});

	const documents = form.watch("documents") ?? [];

	useEffect(() => {
		let cancelled = false;

		void getConsultantTypesAPIAction({}).then((result) => {
			if (cancelled) return;
			if (result.success && result.data) {
				setTypeOptions(
					result.data.map((type) => ({
						value: type.id,
						label: consultantTypeNameKey(type.name),
					})),
				);
			}
			setTypesLoading(false);
		});

		void getActiveProjectsAPIAction({ limit: 100 }).then((result) => {
			if (cancelled) return;
			if (result.success && result.data) {
				setProjectOptions(
					result.data.data.map((proj) => ({
						value: proj.id,
						label: proj.name,
					})),
				);
			}
			setProjectsLoading(false);
		});

		return () => {
			cancelled = true;
		};
	}, []);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			for (const file of Array.from(files)) {
				const ext = file.name.split(".").pop()?.toLowerCase() || "file";
				append({
					id: crypto.randomUUID(),
					name: file.name,
					size: file.size,
					type: ext,
					date: new Date().toISOString().split("T")[0],
					file,
				});
			}
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const goBack = () => {
		router.push("/business/consultant");
	};

	const onSubmit = async (values: CreateConsultantRequestFormValues) => {
		setIsSubmitting(true);
		try {
			const mediaIds: string[] = [];
			for (const [index, doc] of values.documents.entries()) {
				if (doc.mediaId) {
					mediaIds.push(doc.mediaId);
					continue;
				}
				if (!doc.file) continue;

				const uploadResult = await uploadMediaAPIAction(doc.file);
				if (!uploadResult.success || !uploadResult.data) {
					return;
				}
				mediaIds.push(uploadResult.data.id);
				form.setValue(
					`documents.${index}.mediaId`,
					uploadResult.data.id,
				);
			}

			const result = await createConsultantRequestAPIAction({
				project_id: values.project,
				consultant_type_id: values.consultantType,
				customer_name: values.customer,
				email: values.email,
				mobile_number: values.mobile,
				city: values.city,
				description: values.description,
				media_ids: mediaIds,
			});

			if (result.success) {
				showToast(
					"success",
					t(localizationConstants.consultantRequestSuccess),
				);
				router.push("/business/consultant?tab=requests");
			} else if (result.error) {
				showToast("error", result.error);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-1 flex-col bg-slate-50"
			>
				<div className="px-6 pt-6">
					<div className="flex items-start gap-3">
						<button
							type="button"
							onClick={goBack}
							aria-label={t(localizationConstants.cancel)}
							className="mt-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-100"
						>
							<ArrowLeft className="h-5 w-5" />
						</button>
						<div className="flex flex-col gap-0.5">
							<h1 className="text-2xl font-semibold text-slate-900">
								<Translate
									text={
										localizationConstants.findMyConsultant
									}
								/>
							</h1>
							<p className="text-sm text-slate-500">
								<Translate
									text={
										localizationConstants.addDetailedInformation
									}
								/>
							</p>
						</div>
					</div>
				</div>

				<div className="flex-1 px-6 py-4 md:pl-[44px]">
					<div className="max-w-[800px] space-y-4">
						<Card className="gap-0 overflow-hidden border bg-white py-0 shadow-sm">
							<CardHeader className="border-b px-5 py-4 !pb-2">
								<div className="flex items-center gap-2">
									<CircleUserRound className="h-5 w-5 text-slate-700" />
									<CardTitle className="text-base font-medium">
										<Translate
											text={
												localizationConstants.consultantDetailsSection
											}
										/>
									</CardTitle>
								</div>
							</CardHeader>
							<CardContent className="p-5">
								<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
									<FormSelect
										control={form.control}
										name="project"
										label={
											<Translate
												text={
													localizationConstants.projectLabel
												}
											/>
										}
										placeholder="Property 1"
										options={projectOptions}
										disabled={projectsLoading}
										triggerClassName="w-full"
									/>
									<FormSelect
										control={form.control}
										name="consultantType"
										label={
											<Translate
												text={
													localizationConstants.typeOfConsultantLabel
												}
											/>
										}
										placeholder="Architect"
										options={typeOptions}
										disabled={typesLoading}
										triggerClassName="w-full"
									/>
									<FormInput
										control={form.control}
										name="customer"
										label={
											<Translate
												text={
													localizationConstants.customerLabel
												}
											/>
										}
										placeholder="Anna"
									/>
									<FormInput
										control={form.control}
										name="email"
										type="email"
										label={
											<Translate
												text={
													localizationConstants.emailLabel
												}
											/>
										}
										placeholder="anna@gmail.com"
									/>
									<FormInput
										control={form.control}
										name="mobile"
										type="tel"
										label={
											<Translate
												text={
													localizationConstants.mobileNumberLabel
												}
											/>
										}
										placeholder="070-560 50 50"
									/>
									<FormInput
										control={form.control}
										name="city"
										label={
											<Translate
												text={
													localizationConstants.cityLabel
												}
											/>
										}
										placeholder="Stockholm"
									/>
								</div>
							</CardContent>
						</Card>

						<Card className="gap-0 overflow-hidden border bg-white py-0 shadow-sm">
							<CardHeader className="border-b px-5 py-4 !pb-2">
								<div className="flex items-center gap-2">
									<HardHat className="h-5 w-5 text-slate-700" />
									<CardTitle className="text-base font-medium">
										<Translate
											text={
												localizationConstants.projectDescriptionSection
											}
										/>
									</CardTitle>
								</div>
							</CardHeader>
							<CardContent className="p-5">
								<FormTextarea
									control={form.control}
									name="description"
									label={
										<Translate
											text={
												localizationConstants.descriptionLabel
											}
										/>
									}
									placeholder={t(
										localizationConstants.writeDescriptionPlaceholder,
									)}
									rows={5}
								/>
							</CardContent>
						</Card>

						<Card className="gap-0 overflow-hidden border bg-white py-0 shadow-sm">
							<CardHeader className="border-b px-5 py-4 !pb-2">
								<div className="flex items-center gap-2">
									<Copy className="h-5 w-5 text-slate-700" />
									<CardTitle className="text-base font-medium">
										<Translate
											text={
												localizationConstants.projectDocumentsSection
											}
										/>
									</CardTitle>
								</div>
							</CardHeader>
							<CardContent className="space-y-5 p-5">
								<div className="space-y-2">
									<label className="text-sm font-medium text-slate-700">
										<Translate
											text={
												localizationConstants.uploadYourFilesLabel
											}
										/>
										<OptionalLabelSuffix />
									</label>
									<p className="text-xs text-slate-500">
										<Translate
											text={
												localizationConstants.allowedFilesLabel
											}
										/>
									</p>
									<div className="flex items-center gap-2">
										<div className="flex min-h-10 flex-1 items-center justify-between rounded-md border border-slate-200 bg-white p-2">
											<div className="flex flex-wrap gap-2 text-sm text-slate-600">
												{documents.length > 0 ? (
													documents.map(
														(
															doc: ConsultantDocument,
															index: number,
														) => (
															<span
																key={`${doc.id}-${index}`}
																className="flex items-center gap-2 rounded border border-slate-200 bg-slate-100 px-2 py-1 text-xs"
															>
																{doc.name}
																<span
																	className="cursor-pointer text-slate-400 hover:text-slate-600"
																	onClick={() =>
																		remove(
																			index,
																		)
																	}
																>
																	✕
																</span>
															</span>
														),
													)
												) : (
													<span className="italic text-slate-400">
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
											accept={ACCEPTED_FILE_TYPES}
											onChange={handleFileChange}
										/>
										<Button
											type="button"
											className="min-w-[100px] bg-slate-900 text-white hover:bg-slate-800"
											onClick={() =>
												fileInputRef.current?.click()
											}
											disabled={isSubmitting}
										>
											<Translate
												text={
													localizationConstants.upload
												}
											/>
										</Button>
									</div>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium text-slate-700">
										<Translate
											text={
												localizationConstants.specificationLabel
											}
										/>
									</label>
									<div className="overflow-x-auto rounded-md border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="bg-slate-50/50 font-normal text-slate-500">
														<Translate
															text={
																localizationConstants.dateLabel
															}
														/>{" "}
														<span className="text-[10px]">
															↓↑
														</span>
													</TableHead>
													<TableHead className="bg-slate-50/50 font-normal text-slate-500">
														<Translate
															text={
																localizationConstants.documentNameLabel
															}
														/>{" "}
														<span className="text-[10px]">
															↓↑
														</span>
													</TableHead>
													<TableHead className="bg-slate-50/50 font-normal text-slate-500">
														<Translate
															text={
																localizationConstants.validityLabel
															}
														/>
													</TableHead>
													<TableHead className="bg-slate-50/50 font-normal text-slate-500">
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
													documents.map(
														(
															doc: ConsultantDocument,
															index: number,
														) => {
															const icon =
																getDocumentIconMeta(
																	doc.type,
																);
															return (
																<TableRow
																	key={`${doc.id}-${index}`}
																>
																	<TableCell className="text-sm">
																		{
																			doc.date
																		}
																	</TableCell>
																	<TableCell className="text-sm font-medium">
																		<span className="truncate">
																			{
																				doc.name
																			}
																		</span>
																	</TableCell>
																	<TableCell className="text-sm text-slate-600">
																		{doc.validity ??
																			"—"}
																	</TableCell>
																	<TableCell>
																		<div className="flex w-fit shrink-0 items-center justify-center rounded-md bg-slate-50 p-1.5">
																			<Image
																				src={
																					icon.src
																				}
																				alt={
																					icon.alt
																				}
																				width={
																					32
																				}
																				height={
																					32
																				}
																				className="object-contain"
																			/>
																		</div>
																	</TableCell>
																	<TableCell>
																		<Button
																			type="button"
																			variant="ghost"
																			size="icon"
																			className="h-8 w-8 text-slate-400 hover:text-red-500"
																			onClick={() =>
																				remove(
																					index,
																				)
																			}
																		>
																			<Trash2 className="h-4 w-4" />
																		</Button>
																	</TableCell>
																</TableRow>
															);
														},
													)
												) : (
													<TableRow>
														<TableCell
															colSpan={5}
															className="py-8 text-center text-slate-400"
														>
															<Translate
																text={
																	localizationConstants.noDocumentsUploaded
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
				</div>

				<div className="mt-auto flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
					<Button
						type="button"
						variant="outline"
						className="min-w-24"
						onClick={goBack}
						disabled={isSubmitting}
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						type="submit"
						className="min-w-28 gap-2 bg-slate-900 text-white hover:bg-slate-800"
						disabled={!form.formState.isValid || isSubmitting}
					>
						{isSubmitting ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<>
								<Translate
									text={localizationConstants.submitLabel}
								/>
								<ArrowRight className="h-4 w-4" />
							</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
