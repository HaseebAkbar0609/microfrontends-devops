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

export const WAGE_TYPE_CONSTANTS = {
	personalType: {
		tjansteman: "Tjänsteman",
		arbetare: "Arbetare",
		dellid: "Dellid",
		vikarie: "Vikarie",
		projektanstalld: "Projektanställd",
	},
	wageForm: {
		timLon: "Tim lön",
		fastLon: "Fast lön",
	},
	transactionType: {
		bruttolon: "Bruttolön",
		obLon: "OB-lön",
		sjuklon: "Sjuklön",
		overtid: "Övertid",
		semester: "Semester",
		nettolon: "Nettolön",
	},
	unit: {
		manad: "Månad",
		tim: "Tim",
		dag: "Dag",
		belopp: "Belopp",
		percent: "%",
	},
	preliminaryTax: {
		ja30: "Ja 30%",
		ja35: "Ja 35%",
		ja50: "Ja 50%",
		nej0: "Nej 0%",
	},
	employerContribution: {
		ja3142: "Ja 31.42%",
		ja30: "Ja 30%",
		nej0: "Nej 0%",
	},
} as const;

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
	const isPending = createMutation.isPending || updateMutation.isPending;

	const form = useForm({
		resolver: zodResolver(createWageTypeSchema),
		defaultValues: {
			code: "",
			name: "",
			personalType: WAGE_TYPE_CONSTANTS.personalType.tjansteman,
			wageForm: WAGE_TYPE_CONSTANTS.wageForm.fastLon,
			transactionType: WAGE_TYPE_CONSTANTS.transactionType.bruttolon,
			unit: WAGE_TYPE_CONSTANTS.unit.manad,
			preliminaryTax: WAGE_TYPE_CONSTANTS.preliminaryTax.ja30,
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
				personalType: wageTypeDetail.personalType ?? WAGE_TYPE_CONSTANTS.personalType.tjansteman,
				wageForm: wageTypeDetail.wageForm ?? WAGE_TYPE_CONSTANTS.wageForm.fastLon,
				transactionType: wageTypeDetail.transactionType ?? WAGE_TYPE_CONSTANTS.transactionType.bruttolon,
				unit: wageTypeDetail.unit,
				preliminaryTax: wageTypeDetail.preliminaryTax ?? WAGE_TYPE_CONSTANTS.preliminaryTax.ja30,
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
					router.push("/tools/register/wage-type");
				} else {
					showToast(
						"error",
						res.error === "wageTypeDuplicateCodeError"
							? t(localizationConstants.wageTypeDuplicateCodeError)
							: t(localizationConstants.genericError),
					);
				}
			} else {
				const res = await createMutation.mutateAsync(data);
				if (res.success) {
					showToast("success", t(localizationConstants.wageTypeCreatedSuccess));
					router.push("/tools/register/wage-type");
				} else {
					showToast(
						"error",
						res.error === "wageTypeDuplicateCodeError"
							? t(localizationConstants.wageTypeDuplicateCodeError)
							: t(localizationConstants.genericError),
					);
				}
			}
		} catch {
			showToast("error", t(localizationConstants.genericError));
		}
	};

	const handleCancel = () => {
		if (isPending) return;
		router.push("/tools/register/wage-type");
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
						disabled={isPending}
						className="rounded-md p-1 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
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
															<SelectItem value={WAGE_TYPE_CONSTANTS.personalType.tjansteman} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.personalTypeTjanstemanLabel} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.personalType.arbetare} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.personalTypeArbetareLabel} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.personalType.dellid} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.personalTypeDellidLabel} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.personalType.vikarie} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.personalTypeVikarieLabel} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.personalType.projektanstalld} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.personalTypeProjektanstalldLabel} />
															</SelectItem>
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
															<SelectItem value={WAGE_TYPE_CONSTANTS.wageForm.timLon} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.wageFormTimLonLabel} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.wageForm.fastLon} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.wageFormFastLonLabel} />
															</SelectItem>
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
															<SelectItem value={WAGE_TYPE_CONSTANTS.transactionType.bruttolon} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.transactionTypeBruttolonLabel} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.transactionType.obLon} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.transactionTypeObLonLabel} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.transactionType.sjuklon} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.transactionTypeSjuklonLabel} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.transactionType.overtid} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.transactionTypeOvertidLabel} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.transactionType.semester} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.transactionTypeSemesterLabel} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.transactionType.nettolon} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.transactionTypeNettolonLabel} />
															</SelectItem>
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
															<SelectItem value={WAGE_TYPE_CONSTANTS.unit.manad} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.unitManadLabel} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.unit.tim} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.unitTimLabel} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.unit.dag} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.unitDagLabel} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.unit.belopp} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.unitBeloppLabel} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.unit.percent} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.unitPercentLabel} />
															</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage className="text-xs text-red-500" translate={t} />
												</FormItem>
											)}
										/>

										{/* Faktor / Multiplier */}
										<FormField
											control={form.control}
											name="factor"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1">
													<FormLabel className="text-xs font-semibold text-slate-950">
														<Translate text={localizationConstants.wageTypeFactorLabel} />
													</FormLabel>
													<FormControl>
														<Input
															type="text"
															placeholder={t(localizationConstants.wageTypeFactorPlaceholder)}
															className="h-10 border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-950 text-slate-900 placeholder:text-slate-400"
															{...field}
														/>
													</FormControl>
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
															<SelectItem value={WAGE_TYPE_CONSTANTS.preliminaryTax.ja30} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.taxJa30Label} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.preliminaryTax.ja35} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.taxJa35Label} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.preliminaryTax.ja50} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.taxJa50Label} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.preliminaryTax.nej0} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.taxNej0Label} />
															</SelectItem>
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
															<SelectItem value={WAGE_TYPE_CONSTANTS.employerContribution.ja3142} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.contrJa30Label} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.employerContribution.ja30} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.contrJa35Label} />
															</SelectItem>
															<SelectItem value={WAGE_TYPE_CONSTANTS.employerContribution.nej0} className="cursor-pointer text-slate-700 focus:bg-slate-100">
																<Translate text={localizationConstants.contrNej0Label} />
															</SelectItem>
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
															aria-describedby="agUnderlag-message"
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
													<FormMessage id="agUnderlag-message" className="text-xs text-red-500" translate={t} />
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
															aria-describedby="semestergrundad-message"
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
													<FormMessage id="semestergrundad-message" className="text-xs text-red-500" translate={t} />
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
						disabled={isPending}
						onClick={handleCancel}
						className="h-9 min-w-30 rounded bg-transparent border border-slate-300 px-5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-none cursor-pointer disabled:opacity-50"
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
