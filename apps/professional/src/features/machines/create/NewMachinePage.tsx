"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, QrCode, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { MACHINE_MODULE_BASE_URL } from "@/features/machines/data/machineNav.config";
import { MachineInformationStep } from "./components/MachineInformationStep";
import { MachineDocumentsStep, fileTypeOf } from "./components/MachineDocumentsStep";
import { MachinePhotosStep } from "./components/MachinePhotosStep";
import {
	MOCK_MACHINE_DOCUMENTS,
	MOCK_MACHINE_PHOTOS,
	NEXT_MACHINE_NO,
} from "./data/newMachine.config";
import {
	INFORMATION_STEP_FIELDS,
	newMachineSchema,
} from "./schemas/newMachine.schema";
import type {
	MachineDocumentItem,
	MachineDocumentKind,
	MachinePhotoItem,
	NewMachineFormData,
	PendingMachineFile,
} from "./types/newMachine.types";

type WizardTab = "information" | "documents" | "photos";

const TABS: { key: WizardTab; labelKey: TranslationKeys }[] = [
	{
		key: "information",
		labelKey: localizationConstants.machineCreateTabInformation,
	},
	{
		key: "documents",
		labelKey: localizationConstants.machineCreateTabDocuments,
	},
	{ key: "photos", labelKey: localizationConstants.machineCreateTabPhotos },
];

const TOTAL_STEPS = 2;

/**
 * "Lagg till ny verktygsmaskin" (TFS-805) — the two-step wizard for adding a
 * machine to the register. Step 1 is the Information form; the Documents and
 * Photos tabs are both attachment steps and share step 2, which is why the
 * design shows "Step 1/2" on Information and "Step 2/2" on Documents.
 */
export function NewMachinePage() {
	const t = useTranslate();
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<WizardTab>("information");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [documents, setDocuments] = useState<MachineDocumentItem[]>(
		MOCK_MACHINE_DOCUMENTS
	);
	const [photos, setPhotos] = useState<MachinePhotoItem[]>(MOCK_MACHINE_PHOTOS);

	const methods = useForm<NewMachineFormData>({
		resolver: zodResolver(newMachineSchema),
		defaultValues: {
			machineNo: NEXT_MACHINE_NO,
			name: "",
			factory: "",
			designation: "",
			category: "",
			purchaseDate: "",
			internalRent: "",
			unit: "",
			location: "",
			instruction: "",
		},
	});

	const currentStep = activeTab === "information" ? 1 : TOTAL_STEPS;
	const progress = (currentStep / TOTAL_STEPS) * 100;

	const validateInformation = useCallback(async () => {
		const valid = await methods.trigger([...INFORMATION_STEP_FIELDS]);
		if (!valid) {
			showToast("error", t(localizationConstants.machineCreateValidationFailed));
		}
		return valid;
	}, [methods, t]);

	const handleTabClick = async (tab: WizardTab) => {
		// Leaving the Information tab requires a valid form, as on the other
		// create wizards; coming back to it is always allowed.
		if (tab !== "information" && activeTab === "information") {
			const valid = await validateInformation();
			if (!valid) return;
		}
		setActiveTab(tab);
	};

	const handleNext = async () => {
		if (activeTab !== "information") return;
		const valid = await validateInformation();
		if (valid) setActiveTab("documents");
	};

	const handleAddDocuments = useCallback(
		(files: PendingMachineFile[], kind: MachineDocumentKind) => {
			const today = new Date().toISOString().slice(0, 10);
			setDocuments((prev) => [
				...prev,
				...files.map((file) => ({
					id: `${kind}-${file.id}`,
					date: today,
					name: file.name,
					fileType: fileTypeOf(file.name),
					kind,
				})),
			]);
		},
		[]
	);

	const handleRemoveDocument = useCallback((id: string) => {
		setDocuments((prev) => prev.filter((doc) => doc.id !== id));
	}, []);

	const handleAddPhotos = useCallback((files: PendingMachineFile[]) => {
		setPhotos((prev) => [
			...prev,
			...files.map((file) => ({
				id: `photo-${file.id}`,
				name: file.name,
				previewUrl: file.previewUrl,
			})),
		]);
	}, []);

	const handleRemovePhoto = useCallback((id: string) => {
		setPhotos((prev) => {
			const removed = prev.find((photo) => photo.id === id);
			if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
			return prev.filter((photo) => photo.id !== id);
		});
	}, []);

	const handleCancel = () => {
		router.push(MACHINE_MODULE_BASE_URL);
	};

	const handleSave = methods.handleSubmit(
		async () => {
			setIsSubmitting(true);
			try {
				// No machines endpoint yet — the register is still mock data, so the
				// wizard confirms and returns to the list.
				showToast("success", t(localizationConstants.machineCreateSuccess));
				router.push(MACHINE_MODULE_BASE_URL);
			} finally {
				setIsSubmitting(false);
			}
		},
		() => {
			showToast("error", t(localizationConstants.machineCreateValidationFailed));
			setActiveTab("information");
		}
	);

	return (
		<div className="flex h-full flex-col overflow-hidden bg-slate-50">
			<div className="flex-1 overflow-y-auto px-4 py-4">
				<div className="mb-1 flex items-center gap-2">
					<button
						type="button"
						aria-label={t(localizationConstants.backButton)}
						onClick={handleCancel}
						className="cursor-pointer rounded-md bg-slate-100 p-1.5 text-slate-700 hover:bg-slate-200"
					>
						<ArrowLeft className="h-5 w-5 text-slate-700" />
					</button>
					<h1 className="text-lg font-semibold text-slate-900 sm:text-2xl">
						<Translate text={localizationConstants.machineCreateTitle} />
					</h1>
				</div>

				<p className="mb-3 ml-7 text-xs text-slate-500 sm:ml-9 sm:text-sm">
					<Translate text={localizationConstants.stepLabel} /> {currentStep}/
					{TOTAL_STEPS}
				</p>

				<div className="mb-4 ml-7 overflow-x-auto border-b border-slate-200 sm:ml-9">
					<div className="flex gap-4 sm:gap-6">
						{TABS.map((tab) => (
							<button
								key={tab.key}
								type="button"
								onClick={() => handleTabClick(tab.key)}
								className={cn(
									"cursor-pointer whitespace-nowrap border-b-2 pb-3 text-xs font-medium transition-colors sm:text-sm",
									activeTab === tab.key
										? "border-slate-900 text-slate-900"
										: "border-transparent text-slate-500 hover:text-slate-700"
								)}
							>
								<Translate text={tab.labelKey} />
							</button>
						))}
					</div>
				</div>

				<div className="ml-7 flex flex-col items-start gap-4 sm:ml-9 sm:gap-6 xl:flex-row">
					<div className="w-full flex-1 overflow-hidden">
						<FormProvider {...methods}>
							<form onSubmit={handleSave}>
								{activeTab === "information" && (
									<MachineInformationStep control={methods.control} />
								)}
								{activeTab === "documents" && (
									<MachineDocumentsStep
										documents={documents}
										onAddDocuments={handleAddDocuments}
										onRemoveDocument={handleRemoveDocument}
									/>
								)}
								{activeTab === "photos" && (
									<MachinePhotosStep
										photos={photos}
										onAddPhotos={handleAddPhotos}
										onRemovePhoto={handleRemovePhoto}
									/>
								)}
							</form>
						</FormProvider>
					</div>

					<div className="w-full shrink-0 xl:w-72">
						<div className="sticky top-6 flex flex-col gap-4">
							<div className="rounded-lg border border-slate-200 bg-white p-4">
								{/* The design shows the step label and bar only — no percentage. */}
								<p className="mb-2 text-sm font-medium text-slate-900">
									<Translate text={localizationConstants.stepLabel} />{" "}
									{currentStep}/{TOTAL_STEPS}
								</p>
								<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
									<div
										className="h-full bg-[#111721] transition-all duration-300"
										style={{ width: `${progress}%` }}
									/>
								</div>
							</div>

							{/* The QR card only appears on step 1 in the design. */}
							{activeTab === "information" && (
								<div className="rounded-lg border border-slate-200 bg-white p-4">
									<p className="mb-3 text-sm font-medium text-slate-900">
										<Translate text={localizationConstants.machineCreateQrCode} />
									</p>
									{/* Placeholder: the machine number is assigned on save, and no
									    QR renderer is a dependency of this app yet. */}
									<div className="flex h-24 w-24 items-center justify-center rounded-md bg-slate-100">
										<QrCode className="h-16 w-16 text-slate-900" />
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="sticky bottom-0 border-t border-slate-200 bg-white pt-4 sm:pt-6">
				<div className="flex flex-wrap items-center justify-end gap-2 px-3 pb-3 sm:gap-3 sm:px-4 sm:pb-4">
					<Button
						type="button"
						variant="ghost"
						onClick={handleCancel}
						className="h-9 min-w-25 cursor-pointer border border-slate-300 bg-transparent px-5 text-sm text-slate-700 shadow-none hover:bg-slate-100 hover:text-slate-900"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>

					<Button
						type="button"
						onClick={handleSave}
						disabled={isSubmitting}
						className="h-9 min-w-25 cursor-pointer gap-2 bg-[#111721] text-sm text-white hover:bg-slate-800"
					>
						{isSubmitting ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<>
								<Translate text={localizationConstants.saveButton} />
								<Save className="h-4 w-4" />
							</>
						)}
					</Button>

					{activeTab === "information" && (
						<Button
							type="button"
							onClick={handleNext}
							className="h-9 min-w-25 cursor-pointer gap-2 bg-[#111721] text-sm text-white hover:bg-slate-800"
						>
							<Translate text={localizationConstants.nextButton} />
							<ArrowRight className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

export default NewMachinePage;
