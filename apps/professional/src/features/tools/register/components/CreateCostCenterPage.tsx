"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
		<div className="flex flex-col min-h-screen bg-slate-50/30">
			{/* Main Form Container */}
			<div className="flex-1 flex flex-col gap-6 p-6 pb-24 max-w-7xl w-full mx-auto">
				{/* Top Header with Back Arrow */}
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={handleCancel}
						className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
						aria-label="Go back"
					>
						<ArrowLeft className="h-5 w-5" />
					</button>
					<h1 className="text-2xl font-bold tracking-tight text-slate-900">
						<Translate text={localizationConstants.createCostCenterHeaderTitle} />
					</h1>
				</div>

				{/* Section Tab Line Header */}
				<div className="border-b border-slate-200">
					<div className="flex gap-8">
						<button
							type="button"
							className="border-b-2 border-slate-900 pb-3 text-sm font-semibold text-slate-900 cursor-pointer"
						>
							<Translate text={localizationConstants.grundInformationSection} />
						</button>
					</div>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
						{/* Grund information Card */}
						<Card className="border border-slate-200 bg-white shadow-2xs rounded-xl">
							<CardHeader className="pb-4 pt-5 px-6 border-b border-slate-100">
								<CardTitle className="text-base font-semibold text-zinc-950">
									<Translate text={localizationConstants.grundInformationSection} />
								</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col gap-5 p-6">
								{/* 2-Column Grid: KOD & Benämning */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* KOD */}
									<FormField
										control={form.control}
										name="kod"
										render={({ field }) => (
											<FormItem className="flex flex-col gap-1.5">
												<FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-700">
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
												<FormLabel className="text-xs font-medium text-slate-700">
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
											<FormLabel className="text-xs font-medium text-slate-700">
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

			{/* Sticky Bottom Action Bar matching Figma design */}
			<div className="fixed bottom-0 left-0 right-0 z-10 border-t border-slate-200 bg-white p-4 shadow-lg">
				<div className="max-w-7xl mx-auto flex items-center justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={handleCancel}
						className="h-10 rounded-lg border-slate-200 px-6 text-sm font-medium text-slate-900 hover:bg-slate-100 shadow-2xs"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>

					<Button
						type="button"
						disabled={isSubmitting}
						onClick={form.handleSubmit(onSubmit)}
						className="h-10 rounded-lg bg-[#111721] px-6 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 gap-2"
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
