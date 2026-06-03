"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CircleUserRound, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	createSupplierStep1Schema,
	type CreateSupplierStep1Values,
	TOTAL_STEPS,
} from "../schemas/createSupplierSchema";

const MOCK_CATEGORY_OPTIONS = [
	{ value: "bygg", label: "Bygg" },
	{ value: "el", label: "El" },
	{ value: "vvs", label: "VVS" },
	{ value: "maleri", label: "Måleri" },
	{ value: "mark", label: "Mark & Anläggning" },
	{ value: "tak", label: "Tak" },
	{ value: "golv", label: "Golv" },
	{ value: "ventilation", label: "Ventilation" },
];

interface CreateSupplierViewProps {
	onBack: () => void;
	onSuccess: () => void;
}

function ComingSoonStep() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-slate-500">
			<div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
				<Lock className="h-5 w-5 text-slate-400" />
			</div>
			<p className="text-sm font-medium">
				<Translate text={localizationConstants.comingSoon} />
			</p>
		</div>
	);
}

export function CreateSupplierView({
	onBack,
	onSuccess,
}: CreateSupplierViewProps) {
	const [currentStep, setCurrentStep] = useState(1);

	const form = useForm<CreateSupplierStep1Values>({
		resolver: zodResolver(createSupplierStep1Schema),
		defaultValues: {
			companyName: "",
			category: "",
			orgNo: "",
			email: "",
			contactFirstName: "",
			contactLastName: "",
		},
		mode: "onBlur",
	});

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep((s) => s - 1);
		} else {
			onBack();
		}
	};

	const handleNext = async () => {
		if (currentStep === 1) {
			const valid = await form.trigger();
			if (!valid) return;
		}
		if (currentStep < TOTAL_STEPS) {
			setCurrentStep((s) => s + 1);
		} else {
			onSuccess();
		}
	};

	const progressValue = (currentStep / TOTAL_STEPS) * 100;

	return (
		<div className="flex flex-col h-full overflow-hidden bg-slate-50">
			{/* Page header */}
			<header className="px-6 pt-4 pb-0 flex items-center gap-3 shrink-0">
				<Button
					variant="ghost"
					size="icon"
					onClick={handleBack}
					className="shrink-0"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div>
					<h1 className="text-xl font-semibold text-slate-900 leading-tight">
						<Translate
							text={localizationConstants.createNewOfferTitle}
						/>
					</h1>
					<p className="text-sm text-slate-500">
						<Translate
							text={localizationConstants.createNewOfferSubtitle}
						/>
					</p>
				</div>
			</header>

			{/* Scrollable content */}
			<main className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
				{currentStep === 1 && (
					<Form {...form}>
						<form id="create-supplier-form" className="space-y-6">
							{/* Section card */}
							<div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
								{/* Accordion-style section header */}
								<div className="flex items-center gap-2 px-5 py-4 border-b bg-slate-50/50">
									<CircleUserRound className="h-5 w-5 text-slate-400" />
									<span className="text-sm font-semibold text-slate-700">
										Supplier detaljer
									</span>
								</div>

								{/* Form fields */}
								<div className="p-5 space-y-4">
									{/* Row 1: Company name + Category */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormInput
											control={form.control}
											name="companyName"
											label={
												localizationConstants.companyNameLabel
											}
											placeholder={
												localizationConstants.companyNameLabel
											}
										/>
										<FormSelect
											control={form.control}
											name="category"
											label={
												localizationConstants.categoryLabel
											}
											placeholder={
												localizationConstants.registerCategoryPlaceholder
											}
											options={MOCK_CATEGORY_OPTIONS}
										/>
									</div>

									{/* Row 2: Org number + Email */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormInput
											control={form.control}
											name="orgNo"
											label={
												localizationConstants.orgNoLabel
											}
											placeholder={
												localizationConstants.orgNoLabel
											}
										/>
										<FormInput
											control={form.control}
											name="email"
											label={
												localizationConstants.emailAddressLabel
											}
											placeholder={
												localizationConstants.registerEmailPlaceholder
											}
											type="email"
										/>
									</div>

									{/* Row 3: Contact first name + last name */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormInput
											control={form.control}
											name="contactFirstName"
											label={
												localizationConstants.contactFirstNameLabel
											}
											placeholder={
												localizationConstants.registerFirstNamePlaceholder
											}
										/>
										<FormInput
											control={form.control}
											name="contactLastName"
											label={
												localizationConstants.contactLastNameLabel
											}
											placeholder={
												localizationConstants.registerLastNamePlaceholder
											}
										/>
									</div>
								</div>
							</div>

							{/* Step indicator inside content */}
							<div className="flex items-center gap-3 pt-2">
								<span className="text-sm font-medium text-slate-600 whitespace-nowrap">
									Step {currentStep}/{TOTAL_STEPS}
								</span>
								<Progress value={progressValue} className="h-2 flex-1" />
							</div>
						</form>
					</Form>
				)}

				{currentStep === 2 && (
					<>
						<ComingSoonStep />
						<div className="flex items-center gap-3 pt-6">
							<span className="text-sm font-medium text-slate-600 whitespace-nowrap">
								Step {currentStep}/{TOTAL_STEPS}
							</span>
							<Progress value={progressValue} className="h-2 flex-1" />
						</div>
					</>
				)}

				{currentStep === 3 && (
					<>
						<ComingSoonStep />
						<div className="flex items-center gap-3 pt-6">
							<span className="text-sm font-medium text-slate-600 whitespace-nowrap">
								Step {currentStep}/{TOTAL_STEPS}
							</span>
							<Progress value={progressValue} className="h-2 flex-1" />
						</div>
					</>
				)}
			</main>

			{/* Sticky footer with nav buttons */}
			<footer className="shrink-0 border-t bg-white px-6 py-4 z-10">
				<div className="flex items-center justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						className="min-w-[120px] border-slate-200 text-slate-600 h-10"
						onClick={handleBack}
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						type="button"
						className="min-w-[120px] bg-slate-900 hover:bg-slate-800 text-white h-10 gap-2"
						onClick={handleNext}
					>
						<Translate
							text={
								currentStep === TOTAL_STEPS
									? localizationConstants.save
									: localizationConstants.next
							}
						/>
						{currentStep < TOTAL_STEPS && (
							<ArrowRight className="h-4 w-4" />
						)}
					</Button>
				</div>
			</footer>
		</div>
	);
}
