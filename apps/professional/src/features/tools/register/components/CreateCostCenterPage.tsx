"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
	createCostCenterSchema,
	type CreateCostCenterFormData,
} from "../types";
import { createCostCenterAPIAction } from "../api/costCenterRegister";

export function CreateCostCenterPage() {
	const t = useTranslate();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm({
		resolver: zodResolver(createCostCenterSchema),
		defaultValues: {
			kod: "",
			benamning: "",
			anteckningar: "",
			status: "active",
		},
	});

	const onSubmit = async (data: CreateCostCenterFormData) => {
		setIsSubmitting(true);
		try {
			const res = await createCostCenterAPIAction(data);
			if (res.success) {
				showToast("success", t(localizationConstants.costCenterCreatedSuccess));
				router.push("/tools/register/cost-centre");
			} else {
				showToast("error", res.error ?? "Failed to create cost center");
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Failed to create cost center";
			showToast("error", errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		router.push("/tools/register/cost-centre");
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
						aria-label="Go back"
					>
						<ArrowLeft className="h-5 w-5 text-slate-700" />
					</button>
					<h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
						<Translate text={localizationConstants.createCostCenterHeaderTitle} />
					</h1>
				</div>

				{/* Section Tab Line Header */}
				<div className="ml-8 border-b border-slate-200 sm:mb-6 h-[36px] -mb-[1px]">
					<Tabs defaultValue="grund" className="w-fit">
						<TabsList variant="line" className="h-[36px]">
							<TabsTrigger value="grund" className="cursor-pointer">
								<Translate text={localizationConstants.grundInformationSection} />
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				<div className="pl-6 flex flex-col items-start gap-6 lg:gap-8">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
							{/* Grund information Card */}
							<Card className="w-full xl:w-[65%] border border-slate-200 bg-white shadow-2xs rounded-xl overflow-hidden">
								<div className="h-14 border-b border-slate-100 bg-white px-6 flex items-center">
									<h2 className="text-[16px] font-medium leading-6 tracking-normal text-zinc-950">
										<Translate text={localizationConstants.grundInformationSection} />
									</h2>
								</div>
								<CardContent className="flex flex-col gap-5 p-6 bg-white">
									{/* 2-Column Grid: KOD & Benämning */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* KOD */}
										<FormField
											control={form.control}
											name="kod"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1.5">
													<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
														<Translate text={localizationConstants.costCenterCodeHeader} />
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder={t(localizationConstants.costCenterCodePlaceholder)}
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
											name="benamning"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-1.5">
													<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
														<Translate text={localizationConstants.costCenterNameHeader} />
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder={t(localizationConstants.costCenterNamePlaceholder)}
															className="h-10 border-slate-200 bg-white text-sm text-slate-900"
														/>
													</FormControl>
													<FormMessage translate={t} />
												</FormItem>
											)}
										/>
									</div>

									{/* Anteckningar (Notes) */}
									<FormField
										control={form.control}
										name="anteckningar"
										render={({ field }) => (
											<FormItem className="flex flex-col gap-1.5">
												<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
													<Translate text={localizationConstants.costCenterNotesHeader} />
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder={t(localizationConstants.costCenterNotesPlaceholder)}
														className="h-10 border-slate-200 bg-white text-sm text-slate-900"
													/>
												</FormControl>
												<FormMessage translate={t} />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</form>
					</Form>
				</div>
			</div>

			{/* Sticky Bottom Action Bar matching Create Price List page */}
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
