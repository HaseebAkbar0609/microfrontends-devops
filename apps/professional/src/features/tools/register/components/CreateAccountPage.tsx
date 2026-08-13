"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	createAccountPlanSchema,
	type CreateAccountPlanFormData,
} from "../types";
import { createAccountPlanAPIAction } from "../api/accountPlan";

export function CreateAccountPage() {
	const t = useTranslate();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isAdditionalOpen, setIsAdditionalOpen] = useState(true);

	const form = useForm({
		resolver: zodResolver(createAccountPlanSchema),
		defaultValues: {
			accountNumber: "",
			accountName: "",
			accountType: "Asset",
			openingBalance: "",
			accountStatus: "active",
			vatCode: "",
			sru: "",
			autoAccount: "SEK",
			budget: "0",
			costCenterMode: "obligatoriskt" as const,
			projectMode: "obligatoriskt" as const,
			suggestedCostCenter: "",
			suggestedProject: "",
			description: "",
		},
	});

	const onSubmit = async (data: CreateAccountPlanFormData) => {
		setIsSubmitting(true);
		try {
			const res = await createAccountPlanAPIAction(data);
			if (res.success) {
				showToast("success", t(localizationConstants.accountCreatedSuccess));
				router.push("/tools/register?tab=accountPlan&subtab=kontoplan");
			} else {
				if (res.error === "validationAccountNumberUnique") {
					form.setError("accountNumber", {
						type: "manual",
						message: t(localizationConstants.validationAccountNumberUnique),
					});
					showToast("error", t(localizationConstants.validationAccountNumberUnique));
				} else {
					showToast("error", t(localizationConstants.accountCreateError));
				}
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Failed to create account";
			showToast("error", errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		router.push("/tools/register?tab=accountPlan&subtab=kontoplan");
	};

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
						aria-label={t(localizationConstants.goBackToAccountPlanLabel)}
					>
						<ArrowLeft className="h-5 w-5 text-slate-700" />
					</button>
					<h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
						<Translate text={localizationConstants.createAccountHeaderTitle} />
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
						<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
							{/* Card 1: Grund information */}
							<Card className="w-full xl:w-[65%] border border-slate-200 bg-white shadow-2xs rounded-xl overflow-hidden">
								<div className="h-14 border-b border-slate-100 bg-white px-6 flex items-center">
									<h2 className="text-[16px] font-medium leading-6 tracking-normal text-zinc-950">
										<Translate text={localizationConstants.grundInformationSection} />
									</h2>
								</div>
								<CardContent className="flex flex-col gap-5 p-6 bg-white">
									{/* 2-Column Grid */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Kontonummer */}
										<FormField
											control={form.control}
											name="accountNumber"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1.5">
													<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
														<Translate text={localizationConstants.accountNumberHeader} />
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder={t(localizationConstants.accountNumberPlaceholder)}
															className="h-10 border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white transition-colors"
														/>
													</FormControl>
													<FormMessage translate={t} />
												</FormItem>
											)}
										/>

										{/* Benämning */}
										<FormField
											control={form.control}
											name="accountName"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1.5">
													<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
														<Translate text={localizationConstants.accountNameHeader} />
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder={t(localizationConstants.accountNamePlaceholder)}
															className="h-10 border-slate-200 bg-white text-sm text-slate-900"
														/>
													</FormControl>
													<FormMessage translate={t} />
												</FormItem>
											)}
										/>

										{/* Ingående balans */}
										<FormField
											control={form.control}
											name="openingBalance"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1.5">
													<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
														<Translate text={localizationConstants.openingBalanceLabel} />
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder={t(localizationConstants.openingBalancePlaceholder)}
															className="h-10 border-slate-200 bg-white text-sm text-slate-900"
														/>
													</FormControl>
													<FormMessage translate={t} />
												</FormItem>
											)}
										/>

										{/* Aktivt */}
										<FormField
											control={form.control}
											name="accountStatus"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1.5">
													<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
														<Translate text={localizationConstants.activeStatusLabel} />
													</FormLabel>
													<Select value={field.value} onValueChange={field.onChange}>
														<FormControl>
															<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-none">
																<SelectValue placeholder="Beijer" />
															</SelectTrigger>
														</FormControl>
														<SelectContent className="bg-white border-slate-200 shadow-md">
															<SelectItem value="active" className="cursor-pointer text-sm">
																<Translate text={localizationConstants.costCenterActiveStatus} />
															</SelectItem>
															<SelectItem value="inactive" className="cursor-pointer text-sm">
																<Translate text={localizationConstants.costCenterInactiveStatus} />
															</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage translate={t} />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Card 2: Ytterligare uppgifter */}
							<Card className="w-full xl:w-[65%] border border-slate-200 bg-white shadow-2xs rounded-xl overflow-hidden">
								<button
									type="button"
									onClick={() => setIsAdditionalOpen((prev) => !prev)}
									className="w-full h-14 border-b border-slate-100 bg-white px-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
								>
									<h2 className="text-[16px] font-medium leading-6 tracking-normal text-zinc-950">
										<Translate text={localizationConstants.additionalDetailsSection} />
									</h2>
									{isAdditionalOpen ? (
										<ChevronUp className="h-5 w-5 text-slate-500" />
									) : (
										<ChevronDown className="h-5 w-5 text-slate-500" />
									)}
								</button>
								{isAdditionalOpen && (
									<CardContent className="flex flex-col gap-6 p-6 bg-white">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{/* SRU-kod */}
											<FormField
												control={form.control}
												name="sru"
												render={({ field }) => (
													<FormItem className="flex flex-col gap-1.5">
														<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
															<Translate text={localizationConstants.sruLabel} />
														</FormLabel>
														<FormControl>
															<Input
																{...field}
																placeholder={t(localizationConstants.sruPlaceholder)}
																className="h-10 border-slate-200 bg-white text-sm text-slate-900"
															/>
														</FormControl>
														<FormMessage translate={t} />
													</FormItem>
												)}
											/>

											{/* Momskod */}
											<FormField
												control={form.control}
												name="vatCode"
												render={({ field }) => (
													<FormItem className="flex flex-col gap-1.5">
														<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
															<Translate text={localizationConstants.vatCodeLabel} />
														</FormLabel>
														<Select value={field.value} onValueChange={field.onChange}>
															<FormControl>
																<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-none">
																	<SelectValue placeholder={t(localizationConstants.vatCodePlaceholder)} />
																</SelectTrigger>
															</FormControl>
															<SelectContent className="bg-white border-slate-200 shadow-md">
																<SelectItem value="none" className="cursor-pointer text-sm">-</SelectItem>
																<SelectItem value="25%" className="cursor-pointer text-sm">25%</SelectItem>
																<SelectItem value="12%" className="cursor-pointer text-sm">12%</SelectItem>
																<SelectItem value="6%" className="cursor-pointer text-sm">6%</SelectItem>
																<SelectItem value="0%" className="cursor-pointer text-sm">0%</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage translate={t} />
													</FormItem>
												)}
											/>

											{/* Kostnadsställe Mode */}
											<FormField
												control={form.control}
												name="costCenterMode"
												render={({ field }) => (
													<FormItem className="flex flex-col gap-2">
														<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
															<Translate text={localizationConstants.costCenterLabel} />
														</FormLabel>
														<FormControl>
															<RadioGroup
																value={field.value}
																onValueChange={field.onChange}
																className="flex flex-wrap items-center gap-4 [--primary:#111721]"
															>
																<label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
																	<RadioGroupItem value="obligatoriskt" className="border-black text-[#111721] data-[state=checked]:border-[#111721]" />
																	<Translate text={localizationConstants.radioObligatoriskt} />
																</label>
																<label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
																	<RadioGroupItem value="tillatet" className="border-black text-[#111721] data-[state=checked]:border-[#111721]" />
																	<Translate text={localizationConstants.radioTillatet} />
																</label>
																<label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
																	<RadioGroupItem value="ejTillatet" className="border-black text-[#111721] data-[state=checked]:border-[#111721]" />
																	<Translate text={localizationConstants.radioEjTillatet} />
																</label>
															</RadioGroup>
														</FormControl>
														<FormMessage translate={t} />
													</FormItem>
												)}
											/>

											{/* Projekt Mode */}
											<FormField
												control={form.control}
												name="projectMode"
												render={({ field }) => (
													<FormItem className="flex flex-col gap-2">
														<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
															<Translate text={localizationConstants.projectLabel} />
														</FormLabel>
														<FormControl>
															<RadioGroup
																value={field.value}
																onValueChange={field.onChange}
																className="flex flex-wrap items-center gap-4 [--primary:#111721]"
															>
																<label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
																	<RadioGroupItem value="obligatoriskt" className="border-black text-[#111721] data-[state=checked]:border-[#111721]" />
																	<Translate text={localizationConstants.radioObligatoriskt} />
																</label>
																<label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
																	<RadioGroupItem value="tillatet" className="border-black text-[#111721] data-[state=checked]:border-[#111721]" />
																	<Translate text={localizationConstants.radioTillatet} />
																</label>
																<label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
																	<RadioGroupItem value="ejTillatet" className="border-black text-[#111721] data-[state=checked]:border-[#111721]" />
																	<Translate text={localizationConstants.radioEjTillatet} />
																</label>
															</RadioGroup>
														</FormControl>
														<FormMessage translate={t} />
													</FormItem>
												)}
											/>

											{/* Föreslå kostnadsställe */}
											<FormField
												control={form.control}
												name="suggestedCostCenter"
												render={({ field }) => (
													<FormItem className="flex flex-col gap-1.5">
														<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
															<Translate text={localizationConstants.suggestedCostCenterLabel} />
														</FormLabel>
														<FormControl>
															<Input
																{...field}
																placeholder={t(localizationConstants.suggestedCostCenterPlaceholder)}
																className="h-10 border-slate-200 bg-white text-sm text-slate-900"
															/>
														</FormControl>
														<FormMessage translate={t} />
													</FormItem>
												)}
											/>

											{/* Föreslå projekt */}
											<FormField
												control={form.control}
												name="suggestedProject"
												render={({ field }) => (
													<FormItem className="flex flex-col gap-1.5">
														<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
															<Translate text={localizationConstants.suggestedProjectLabel} />
														</FormLabel>
														<FormControl>
															<Input
																{...field}
																placeholder={t(localizationConstants.suggestedProjectPlaceholder)}
																className="h-10 border-slate-200 bg-white text-sm text-slate-900"
															/>
														</FormControl>
														<FormMessage translate={t} />
													</FormItem>
												)}
											/>
										</div>
									</CardContent>
								)}
							</Card>
						</form>
					</Form>
				</div>
			</div>

			{/* Sticky Bottom Action Bar matching Create Cost Center and Create Price List pages */}
			<div className="sticky bottom-0 border-t border-slate-200 bg-white pt-2 sm:pt-3">
				<div className="flex flex-wrap justify-end gap-2 px-3 pb-2 sm:flex-nowrap sm:items-center sm:justify-end sm:gap-3 sm:px-4 sm:pb-3">
					<Button
						type="button"
						variant="ghost"
						size="default"
						onClick={handleCancel}
						className="h-9 min-w-30 rounded bg-transparent border border-slate-300 px-5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-none"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>

					<Button
						type="button"
						variant="default"
						size="default"
						disabled={isSubmitting}
						onClick={form.handleSubmit(onSubmit)}
						className="h-9 min-w-30 rounded gap-2 bg-[#111721] text-white hover:bg-slate-800"
					>
						{isSubmitting ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Save className="h-4 w-4" />
						)}
						<Translate text={localizationConstants.saveButton} />
					</Button>
				</div>
			</div>
		</div>
	);
}
