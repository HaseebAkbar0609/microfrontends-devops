"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	createWageTypeSchema,
	type CreateWageTypeFormData,
} from "../types";
import {
	useWageTypeDetailQuery,
	useCreateWageTypeMutation,
	useUpdateWageTypeMutation,
} from "../hooks/useWageTypeRegister";

interface CreateWageTypePageProps {
	isEdit?: boolean;
}

export function CreateWageTypePage({ isEdit = false }: CreateWageTypePageProps) {
	const t = useTranslate();
	const router = useRouter();
	const params = useParams();
	const rawId = params.id as string;
	const cleanId = typeof rawId === "string" ? rawId.trim() : "";

	const { data: wageTypeDetail, isLoading: isLoadingDetail } = useWageTypeDetailQuery(
		cleanId,
		isEdit,
	);

	const createMutation = useCreateWageTypeMutation();
	const updateMutation = useUpdateWageTypeMutation();

	const form = useForm({
		resolver: zodResolver(createWageTypeSchema),
		defaultValues: {
			code: "",
			name: "",
			personalType: "Tjänsteman",
			wageForm: "Fast lön",
			transactionType: "Bruttolön",
			unit: "Månad",
			preliminaryTax: "Ja 30%",
			employerContribution: "Ja 30%",
			accountDebit: "",
			accountCredit: "",
			accountOppositeAG: "",
			agUnderlag: false,
			semestergrundad: false,
			agiCode: "",
			description: "",
			factor: "1.0",
			status: "active" as "active" | "inactive",
		},
	});

	useEffect(() => {
		if (isEdit && wageTypeDetail) {
			form.reset({
				code: wageTypeDetail.code,
				name: wageTypeDetail.name,
				personalType: wageTypeDetail.personalType ?? "Tjänsteman",
				wageForm: wageTypeDetail.wageForm ?? "Fast lön",
				transactionType: wageTypeDetail.transactionType ?? "Bruttolön",
				unit: wageTypeDetail.unit,
				preliminaryTax: wageTypeDetail.preliminaryTax ?? "Ja 30%",
				employerContribution: wageTypeDetail.employerContribution ?? "Ja 30%",
				accountDebit: wageTypeDetail.accountDebit ?? "",
				accountCredit: wageTypeDetail.accountCredit ?? "",
				accountOppositeAG: wageTypeDetail.accountOppositeAG ?? "",
				agUnderlag: Boolean(wageTypeDetail.agUnderlag),
				semestergrundad: Boolean(wageTypeDetail.semestergrundad),
				agiCode: wageTypeDetail.agiCode ?? "",
				description: wageTypeDetail.description ?? "",
				factor: wageTypeDetail.factor ?? "1.0",
				status: wageTypeDetail.status,
			});
		}
	}, [isEdit, wageTypeDetail, form]);

	const onSubmit = async (data: CreateWageTypeFormData) => {
		try {
			if (isEdit) {
				const res = await updateMutation.mutateAsync({ id: cleanId, data });
				if (res.success) {
					showToast("success", t(localizationConstants.wageTypeUpdatedSuccess));
					router.push("/tools/register?tab=wageType");
				} else {
					showToast(
						"error",
						res.error === "wageTypeDuplicateCodeError"
							? t(localizationConstants.wageTypeDuplicateCodeError)
							: (res.error ?? "Failed to update wage type"),
					);
				}
			} else {
				const res = await createMutation.mutateAsync(data);
				if (res.success) {
					showToast("success", t(localizationConstants.wageTypeCreatedSuccess));
					router.push("/tools/register?tab=wageType");
				} else {
					showToast(
						"error",
						res.error === "wageTypeDuplicateCodeError"
							? t(localizationConstants.wageTypeDuplicateCodeError)
							: (res.error ?? "Failed to create wage type"),
					);
				}
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "An error occurred";
			showToast("error", errorMessage);
		}
	};

	const handleCancel = () => {
		router.push("/tools/register?tab=wageType");
	};

	if (isEdit && isLoadingDetail) {
		return (
			<div className="flex h-full items-center justify-center bg-slate-50 py-12">
				<Loader2 className="h-8 w-8 animate-spin text-slate-500" />
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col overflow-y-auto bg-slate-50">
			{/* Main Form Content Area */}
			<div className="flex-1 gap-2 p-4">
				{/* Top Header with Back Arrow */}
				<div className="mb-4 flex items-center gap-2">
					<button
						type="button"
						onClick={handleCancel}
						className="rounded-md p-1 hover:bg-slate-100 cursor-pointer"
						aria-label="Go back"
					>
						<ArrowLeft className="h-5 w-5 text-slate-700" />
					</button>
					<h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
						{isEdit ? (
							<Translate text={localizationConstants.editWageTypeHeaderTitle} />
						) : (
							<Translate text={localizationConstants.createWageTypeHeaderTitle} />
						)}
					</h1>
				</div>

				{/* Section Tab Line Header */}
				<div className="flex gap-4 ml-8 overflow-x-auto border-b border-slate-200 sm:mb-6 sm:gap-6">
					<button
						type="button"
						className="whitespace-nowrap pb-3 text-sm font-medium transition-colors border-b-2 border-slate-900 text-slate-900 cursor-pointer"
					>
						<Translate text={localizationConstants.grundInformationSection} />
					</button>
				</div>

				<div className="pl-6 flex flex-col items-start gap-6 lg:gap-8">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
							{/* Grund information Card */}
							<Card className="w-full xl:w-[65%] border border-slate-200 bg-white shadow-2xs rounded-xl overflow-hidden animate-in fade-in duration-200">
								<div className="h-14 border-b border-slate-100 bg-white px-6 flex items-center">
									<h2 className="text-[16px] font-medium leading-6 tracking-normal text-zinc-950">
										<Translate text={localizationConstants.grundInformationSection} />
									</h2>
								</div>
								<CardContent className="p-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Löneart id */}
										<FormField
											control={form.control}
											name="code"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1">
													<FormLabel className="text-xs font-semibold text-slate-950 uppercase">
														<Translate text={localizationConstants.wageTypeCodeLabel} /> *
													</FormLabel>
													<FormControl>
														<Input
															placeholder={t(localizationConstants.wageTypeCodePlaceholder)}
															className="h-10 border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-950 text-slate-900 placeholder:text-slate-400"
															{...field}
														/>
													</FormControl>
													<FormMessage className="text-xs text-red-500" translate={t} />
												</FormItem>
											)}
										/>

										{/* Benämning */}
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1">
													<FormLabel className="text-xs font-semibold text-slate-950">
														<Translate text={localizationConstants.wageTypeNameLabel} /> *
													</FormLabel>
													<FormControl>
														<Input
															placeholder={t(localizationConstants.wageTypeNamePlaceholder)}
															className="h-10 border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-950 text-slate-900 placeholder:text-slate-400"
															{...field}
														/>
													</FormControl>
													<FormMessage className="text-xs text-red-500" translate={t} />
												</FormItem>
											)}
										/>

										{/* Personal typ */}
										<FormField
											control={form.control}
											name="personalType"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1">
													<FormLabel className="text-xs font-semibold text-slate-950">
														<Translate text={localizationConstants.wageTypePersonalTypeHeader} />
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="w-full h-10 border-slate-200 focus:ring-1 focus:ring-slate-950 text-slate-900">
																<SelectValue placeholder={t(localizationConstants.wageTypeSelectPersonalTypePlaceholder)} />
															</SelectTrigger>
														</FormControl>
														<SelectContent className="bg-white border border-slate-200 rounded-md p-1 shadow-md">
															<SelectItem value="Tjänsteman" className="cursor-pointer text-slate-700 focus:bg-slate-100">Tjänsteman</SelectItem>
															<SelectItem value="Arbetare" className="cursor-pointer text-slate-700 focus:bg-slate-100">Arbetare</SelectItem>
															<SelectItem value="Dellid" className="cursor-pointer text-slate-700 focus:bg-slate-100">Dellid</SelectItem>
															<SelectItem value="Vikarie" className="cursor-pointer text-slate-700 focus:bg-slate-100">Vikarie</SelectItem>
															<SelectItem value="Projektanställd" className="cursor-pointer text-slate-700 focus:bg-slate-100">Projektanställd</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage className="text-xs text-red-500" translate={t} />
												</FormItem>
											)}
										/>

										{/* Löneform */}
										<FormField
											control={form.control}
											name="wageForm"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1">
													<FormLabel className="text-xs font-semibold text-slate-950">
														<Translate text={localizationConstants.wageTypeWageFormHeader} />
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="w-full h-10 border-slate-200 focus:ring-1 focus:ring-slate-950 text-slate-900">
																<SelectValue placeholder={t(localizationConstants.wageTypeSelectWageFormPlaceholder)} />
															</SelectTrigger>
														</FormControl>
														<SelectContent className="bg-white border border-slate-200 rounded-md p-1 shadow-md">
															<SelectItem value="Tim lön" className="cursor-pointer text-slate-700 focus:bg-slate-100">Tim lön</SelectItem>
															<SelectItem value="Fast lön" className="cursor-pointer text-slate-700 focus:bg-slate-100">Fast lön</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage className="text-xs text-red-500" translate={t} />
												</FormItem>
											)}
										/>

										{/* Transaktionstyp */}
										<FormField
											control={form.control}
											name="transactionType"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1">
													<FormLabel className="text-xs font-semibold text-slate-950">
														<Translate text={localizationConstants.wageTypeTransactionTypeHeader} />
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="w-full h-10 border-slate-200 focus:ring-1 focus:ring-slate-950 text-slate-900">
																<SelectValue placeholder={t(localizationConstants.wageTypeSelectTransactionTypePlaceholder)} />
															</SelectTrigger>
														</FormControl>
														<SelectContent className="bg-white border border-slate-200 rounded-md p-1 shadow-md">
															<SelectItem value="Bruttolön" className="cursor-pointer text-slate-700 focus:bg-slate-100">Bruttolön</SelectItem>
															<SelectItem value="OB-lön" className="cursor-pointer text-slate-700 focus:bg-slate-100">OB-lön</SelectItem>
															<SelectItem value="Sjuklön" className="cursor-pointer text-slate-700 focus:bg-slate-100">Sjuklön</SelectItem>
															<SelectItem value="Övertid" className="cursor-pointer text-slate-700 focus:bg-slate-100">Övertid</SelectItem>
															<SelectItem value="Semester" className="cursor-pointer text-slate-700 focus:bg-slate-100">Semester</SelectItem>
															<SelectItem value="Nettolön" className="cursor-pointer text-slate-700 focus:bg-slate-100">Nettolön</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage className="text-xs text-red-500" translate={t} />
												</FormItem>
											)}
										/>

										{/* Enhet */}
										<FormField
											control={form.control}
											name="unit"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1">
													<FormLabel className="text-xs font-semibold text-slate-950">
														<Translate text={localizationConstants.wageTypeUnitLabel} /> *
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="w-full h-10 border-slate-200 focus:ring-1 focus:ring-slate-950 text-slate-900">
																<SelectValue placeholder={t(localizationConstants.wageTypeSelectUnitPlaceholder)} />
															</SelectTrigger>
														</FormControl>
														<SelectContent className="bg-white border border-slate-200 rounded-md p-1 shadow-md">
															<SelectItem value="Månad" className="cursor-pointer text-slate-700 focus:bg-slate-100">Månad</SelectItem>
															<SelectItem value="Tim" className="cursor-pointer text-slate-700 focus:bg-slate-100">Tim</SelectItem>
															<SelectItem value="Dag" className="cursor-pointer text-slate-700 focus:bg-slate-100">Dag</SelectItem>
															<SelectItem value="Belopp" className="cursor-pointer text-slate-700 focus:bg-slate-100">Belopp</SelectItem>
															<SelectItem value="%" className="cursor-pointer text-slate-700 focus:bg-slate-100">%</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage className="text-xs text-red-500" translate={t} />
												</FormItem>
											)}
										/>

										{/* Preliminärskatt % */}
										<FormField
											control={form.control}
											name="preliminaryTax"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1">
													<FormLabel className="text-xs font-semibold text-slate-950">
														<Translate text={localizationConstants.wageTypePreliminaryTaxHeader} />
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="w-full h-10 border-slate-200 focus:ring-1 focus:ring-slate-950 text-slate-900">
																<SelectValue placeholder={t(localizationConstants.wageTypeSelectTaxPlaceholder)} />
															</SelectTrigger>
														</FormControl>
														<SelectContent className="bg-white border border-slate-200 rounded-md p-1 shadow-md">
															<SelectItem value="Ja 30%" className="cursor-pointer text-slate-700 focus:bg-slate-100">Ja 30%</SelectItem>
															<SelectItem value="Ja 35%" className="cursor-pointer text-slate-700 focus:bg-slate-100">Ja 35%</SelectItem>
															<SelectItem value="Ja 50%" className="cursor-pointer text-slate-700 focus:bg-slate-100">Ja 50%</SelectItem>
															<SelectItem value="Nej 0%" className="cursor-pointer text-slate-700 focus:bg-slate-100">Nej 0%</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage className="text-xs text-red-500" translate={t} />
												</FormItem>
											)}
										/>

										{/* Arbetsgivare avgifter % */}
										<FormField
											control={form.control}
											name="employerContribution"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1">
													<FormLabel className="text-xs font-semibold text-slate-950">
														<Translate text={localizationConstants.wageTypeEmployerContributionHeader} />
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="w-full h-10 border-slate-200 focus:ring-1 focus:ring-slate-950 text-slate-900">
																<SelectValue placeholder={t(localizationConstants.wageTypeSelectContributionPlaceholder)} />
															</SelectTrigger>
														</FormControl>
														<SelectContent className="bg-white border border-slate-200 rounded-md p-1 shadow-md">
															<SelectItem value="Ja 31.42%" className="cursor-pointer text-slate-700 focus:bg-slate-100">Ja 31.42%</SelectItem>
															<SelectItem value="Ja 30%" className="cursor-pointer text-slate-700 focus:bg-slate-100">Ja 30%</SelectItem>
															<SelectItem value="Nej 0%" className="cursor-pointer text-slate-700 focus:bg-slate-100">Nej 0%</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage className="text-xs text-red-500" translate={t} />
												</FormItem>
											)}
										/>

										{/* Konto debet */}
										<FormField
											control={form.control}
											name="accountDebit"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1">
													<FormLabel className="text-xs font-semibold text-slate-950">
														<Translate text={localizationConstants.wageTypeAccountDebitLabel} />
													</FormLabel>
													<FormControl>
														<Input
															placeholder={t(localizationConstants.wageTypeAccountPlaceholder)}
															className="h-10 border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-950 text-slate-900 placeholder:text-slate-400"
															{...field}
														/>
													</FormControl>
													<FormMessage className="text-xs text-red-500" translate={t} />
												</FormItem>
											)}
										/>

										{/* Konto kredit */}
										<FormField
											control={form.control}
											name="accountCredit"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1">
													<FormLabel className="text-xs font-semibold text-slate-950">
														<Translate text={localizationConstants.wageTypeAccountCreditLabel} />
													</FormLabel>
													<FormControl>
														<Input
															placeholder={t(localizationConstants.wageTypeAccountCreditPlaceholder)}
															className="h-10 border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-950 text-slate-900 placeholder:text-slate-400"
															{...field}
														/>
													</FormControl>
													<FormMessage className="text-xs text-red-500" translate={t} />
												</FormItem>
											)}
										/>

										{/* Mot konto AG */}
										<FormField
											control={form.control}
											name="accountOppositeAG"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1">
													<FormLabel className="text-xs font-semibold text-slate-950">
														<Translate text={localizationConstants.wageTypeAccountOppositeAGLabel} />
													</FormLabel>
													<FormControl>
														<Input
															placeholder={t(localizationConstants.wageTypeOppositeAGPlaceholder)}
															className="h-10 border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-950 text-slate-900 placeholder:text-slate-400"
															{...field}
														/>
													</FormControl>
													<FormMessage className="text-xs text-red-500" translate={t} />
												</FormItem>
											)}
										/>

										{/* AG underlag */}
										<FormField
											control={form.control}
											name="agUnderlag"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-2">
													<FormLabel className="text-xs font-semibold text-slate-950">
														<Translate text={localizationConstants.wageTypeAgUnderlagLabel} />
													</FormLabel>
													<FormControl>
														<RadioGroup
															onValueChange={(val) => field.onChange(val === "ja")}
															value={field.value ? "ja" : "nej"}
															className="flex items-center gap-6 h-10"
														>
															<FormItem className="flex items-center gap-2 space-y-0 cursor-pointer">
																<RadioGroupItem value="ja" id="ag-ja" className="border-slate-300 text-[#111721] focus:ring-[#111721] focus:ring-offset-2 data-[state=checked]:border-[#111721] data-[state=checked]:text-[#111721]" />
																<FormLabel htmlFor="ag-ja" className="text-sm font-medium text-slate-700 cursor-pointer">
																	<Translate text={localizationConstants.yesLabel} />
																</FormLabel>
															</FormItem>
															<FormItem className="flex items-center gap-2 space-y-0 cursor-pointer">
																<RadioGroupItem value="nej" id="ag-nej" className="border-slate-300 text-[#111721] focus:ring-[#111721] focus:ring-offset-2 data-[state=checked]:border-[#111721] data-[state=checked]:text-[#111721]" />
																<FormLabel htmlFor="ag-nej" className="text-sm font-medium text-slate-700 cursor-pointer">
																	<Translate text={localizationConstants.noLabel} />
																</FormLabel>
															</FormItem>
														</RadioGroup>
													</FormControl>
													<FormMessage className="text-xs text-red-500" translate={t} />
												</FormItem>
											)}
										/>

										{/* Semestergrundad */}
										<FormField
											control={form.control}
											name="semestergrundad"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-2">
													<FormLabel className="text-xs font-semibold text-slate-950">
														<Translate text={localizationConstants.wageTypeSemestergrundadLabel} />
													</FormLabel>
													<FormControl>
														<RadioGroup
															onValueChange={(val) => field.onChange(val === "ja")}
															value={field.value ? "ja" : "nej"}
															className="flex items-center gap-6 h-10"
														>
															<FormItem className="flex items-center gap-2 space-y-0 cursor-pointer">
																<RadioGroupItem value="ja" id="sem-ja" className="border-slate-300 text-[#111721] focus:ring-[#111721] focus:ring-offset-2 data-[state=checked]:border-[#111721] data-[state=checked]:text-[#111721]" />
																<FormLabel htmlFor="sem-ja" className="text-sm font-medium text-slate-700 cursor-pointer">
																	<Translate text={localizationConstants.yesLabel} />
																</FormLabel>
															</FormItem>
															<FormItem className="flex items-center gap-2 space-y-0 cursor-pointer">
																<RadioGroupItem value="nej" id="sem-nej" className="border-slate-300 text-[#111721] focus:ring-[#111721] focus:ring-offset-2 data-[state=checked]:border-[#111721] data-[state=checked]:text-[#111721]" />
																<FormLabel htmlFor="sem-nej" className="text-sm font-medium text-slate-700 cursor-pointer">
																	<Translate text={localizationConstants.noLabel} />
																</FormLabel>
															</FormItem>
														</RadioGroup>
													</FormControl>
													<FormMessage className="text-xs text-red-500" translate={t} />
												</FormItem>
											)}
										/>

										{/* AGI - KOD */}
										<FormField
											control={form.control}
											name="agiCode"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1">
													<FormLabel className="text-xs font-semibold text-slate-950">
														<Translate text={localizationConstants.wageTypeAgiCodeLabel} />
													</FormLabel>
													<FormControl>
														<Input
															placeholder={t(localizationConstants.wageTypeAgiCodePlaceholder)}
															className="h-10 border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-950 text-slate-900 placeholder:text-slate-400"
															{...field}
														/>
													</FormControl>
													<FormMessage className="text-xs text-red-500" translate={t} />
												</FormItem>
											)}
										/>

										{/* Beskrivning */}
										<FormField
											control={form.control}
											name="description"
											render={({ field }) => (
												<FormItem className="md:col-span-2 flex flex-col gap-1">
													<FormLabel className="text-xs font-semibold text-slate-950">
														<Translate text={localizationConstants.wageTypeDescriptionLabel} />
													</FormLabel>
													<FormControl>
														<Textarea
															placeholder={t(localizationConstants.wageTypeDescriptionPlaceholder)}
															className="min-h-24 border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-950 text-slate-900 placeholder:text-slate-400"
															{...field}
														/>
													</FormControl>
													<FormMessage className="text-xs text-red-500" translate={t} />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
						</form>
					</Form>
				</div>
			</div>

			{/* Sticky Bottom Action Bar matching Create Cost Center / Price List page */}
			<div className="sticky bottom-0 border-t border-slate-200 bg-white pt-2 sm:pt-3 z-10">
				<div className="flex flex-wrap justify-end gap-2 px-3 pb-2 sm:flex-nowrap sm:items-center sm:justify-end sm:gap-3 sm:px-4 sm:pb-3">
					<Button
						type="button"
						variant="ghost"
						size="default"
						onClick={handleCancel}
						className="h-9 min-w-30 rounded bg-transparent border border-slate-300 px-5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-none cursor-pointer"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>

					<Button
						type="button"
						variant="default"
						size="default"
						disabled={createMutation.isPending || updateMutation.isPending}
						onClick={form.handleSubmit(onSubmit)}
						className="h-9 min-w-30 rounded gap-2 bg-[#111721] text-white hover:bg-slate-800 cursor-pointer shadow-2xs flex items-center justify-center"
					>
						{(createMutation.isPending || updateMutation.isPending) ? (
							<Loader2 className="h-4 w-4 animate-spin text-white" />
						) : (
							<Save className="h-4 w-4 text-white" />
						)}
						<Translate text={localizationConstants.saveButton} />
					</Button>
				</div>
			</div>
		</div>
	);
}
