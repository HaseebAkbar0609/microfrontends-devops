"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StepRail } from "@/components/common/StepRail";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { useCreateConstructionLog } from "./useCreateConstructionLog";
import { CreateStep1GeneralInfo } from "./components/CreateStep1GeneralInfo";
import { CreateStep2WorkForce } from "./components/CreateStep2WorkForce";
import CreateConfirmModal from "./components/CreateConfirmModal";

const STEP_LABELS: TranslationKeys[] = [
	"orderDagbokStepGeneralInfo",
	"orderDagbokStepDetailedInfo",
];

interface CreateConstructionLogPageProps {
	orderId?: string;
}

export function CreateConstructionLogPage({ orderId }: CreateConstructionLogPageProps) {
	const t = useTranslate();
	const [showConfirm, setShowConfirm] = useState(false);
	const [role, setRole] = useState("");
	const [clarification, setClarification] = useState("");
	const [fileName, setFileName] = useState("");

	const {
		currentStep,
		isSubmitting,
		errors,
		formData,
		updateStep1,
		updateStep1Weather,
		updateStep2,
		handleNext,
		handleBack,
		handleCancel,
		handlePublish,
	} = useCreateConstructionLog(orderId);

	const basePath = `/module/production/order/${orderId ?? ""}`;
	const recordTitle = `${t(localizationConstants.order)} ${orderId ?? ""}`;

	return (
		<div className="flex h-full flex-col bg-slate-50 relative overflow-hidden">
			{/* Top Header: Back + Order Title + Tabs */}
			<div className="bg-white px-4 sm:px-6 pt-4">
				{/* Back Button + Order Title */}
				<div className="flex justify-between gap-4 items-center pt-0 pb-4">
					<div className="flex min-w-0 gap-2 items-center">
						<Button asChild variant="ghost" size="icon" aria-label="Back"
							className="size-7 shrink-0 rounded-md text-slate-900 hover:bg-slate-100 flex items-center justify-center cursor-pointer">
							<Link href="/module/production/order/overview" aria-label="Back" className="flex items-center justify-center">
								<ArrowLeft className="size-5" />
							</Link>
						</Button>
						<div className="min-w-0">
							<h2 className="truncate font-sans text-base sm:text-xl md:text-2xl font-semibold leading-6 sm:leading-7 md:leading-8 tracking-normal text-slate-900">
								{recordTitle}
							</h2>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<Tabs value="dagbok" className="w-full flex flex-col gap-0">
					<TabsList variant="line" className="pl-4 sm:pl-[3.25rem] pr-4 sm:pr-6">
							<TabsTrigger value="order-information" asChild>
								<Link href={`${basePath}/order-information`} className="cursor-pointer">
									<Translate text={localizationConstants.orderInformationTab} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="inspection" asChild>
								<Link href={`${basePath}/inspection`} className="cursor-pointer">
									<Translate text={localizationConstants.orderInspectionTab} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="organisation" asChild>
								<Link href={`${basePath}/organisation`} className="cursor-pointer">
									<Translate text={localizationConstants.orderOrganisationTab} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="payment-plan" asChild>
								<Link href={`${basePath}/payment-plan`} className="cursor-pointer">
									<Translate text={localizationConstants.paymentPlanTitle} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="ata" asChild>
								<Link href={`${basePath}/ata`} className="cursor-pointer">
									<Translate text={localizationConstants.ataTitle} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="guarantee" asChild>
								<Link href={`${basePath}/guarantee`} className="cursor-pointer">
									<Translate text={localizationConstants.warrantyCommitments} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="handlingar" asChild>
								<Link href={`${basePath}/handlingar`} className="cursor-pointer">
									<Translate text={localizationConstants.orderHandlingarTab} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="protocol" asChild>
								<Link href={`${basePath}/protocol`} className="cursor-pointer">
									<Translate text={localizationConstants.protocolsTab} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="staff" asChild>
								<Link href={`${basePath}/staff`} className="cursor-pointer">
									<Translate text={localizationConstants.staffLedgerTab} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="tidsplan" asChild>
								<Link href={`${basePath}/tidsplan`} className="cursor-pointer">
									<Translate text={localizationConstants.orderTimeplanTab} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="fraga-svar" asChild>
								<Link href={`${basePath}/fraga-svar`} className="cursor-pointer">
									<Translate text={localizationConstants.orderQaTab} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="dagbok" asChild>
								<Link href={`${basePath}/construction-log`} className="cursor-pointer">
									<Translate text={localizationConstants.orderDagbokTab} />
								</Link>
							</TabsTrigger>
				</TabsList>
				</Tabs>
			</div>

			{/* Main Content Scrollable */}
			<div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
				<div className="w-full space-y-4">

					{/* Page Title */}
					<div className="flex justify-between gap-4 items-center">
						<div className="flex min-w-0 gap-2 items-center">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={handleCancel}
								className="size-7 shrink-0 rounded-md text-slate-900 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
							>
								<ArrowLeft className="size-5" />
							</Button>
							<div className="min-w-0">
								<h1 className="truncate font-sans font-semibold text-lg sm:text-xl md:text-2xl leading-7 sm:leading-8 tracking-normal text-[#0A0A0A]">
									<Translate text={localizationConstants.orderDagbokCreateTitle} />
								</h1>
							</div>
						</div>
					</div>

					{/* Step Rail on small screens */}
					<div className="xl:hidden ml-0 sm:ml-7">
						<StepRail current={currentStep} steps={STEP_LABELS} showList={false} />
					</div>

					{/* Content + Step Rail on xl */}
					<div className="flex flex-col items-start gap-4 sm:gap-6 xl:flex-row ml-0 sm:ml-7">
						<div className="w-full flex-1 overflow-hidden">
							{currentStep === 1 && (
								<CreateStep1GeneralInfo
									date={formData.step1.date}
									author={formData.step1.author}
									weather={formData.step1.weather}
									errors={errors}
									onDateChange={(date) => updateStep1({ date })}
									onAuthorChange={(author) => updateStep1({ author })}
									onWeatherChange={updateStep1Weather}
								/>
							)}

							{currentStep === 2 && (
								<CreateStep2WorkForce
									workforce={formData.step2.workforce}
									activities={formData.step2.activities}
									machines={formData.step2.machines}
									deviations={formData.step2.deviations}
									generalNotes={formData.step2.generalNotes}
									selfInspectionNote={formData.step2.selfInspectionNote}
									errors={errors}
									onWorkforceChange={(workforce) => updateStep2({ workforce })}
									onActivitiesChange={(activities) => updateStep2({ activities })}
									onMachinesChange={(machines) => updateStep2({ machines })}
									onDeviationsChange={(deviations) => updateStep2({ deviations })}
									onGeneralNotesChange={(generalNotes) => updateStep2({ generalNotes })}
									onSelfInspectionNoteChange={(selfInspectionNote) => updateStep2({ selfInspectionNote })}
								/>
							)}
						</div>

						<div className="hidden w-64 shrink-0 xl:block xl:w-72">
							<StepRail current={currentStep} steps={STEP_LABELS} showList={false} />
						</div>
					</div>

				</div>
			</div>

			{/* Bottom Action Bar */}
			<div className="sticky bottom-0 border-t border-slate-200 bg-white pt-4 sm:pt-6">
				<div className="flex flex-wrap items-center justify-end gap-2 px-3 pb-3 sm:gap-3 sm:px-4 sm:pb-4">
					<Button
						type="button"
						variant="ghost"
						size="default"
						onClick={handleCancel}
						className="h-8 min-w-20 bg-transparent border border-slate-300 px-3 text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-none sm:h-9 sm:min-w-25 sm:px-5 sm:text-sm cursor-pointer"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>

					{currentStep > 1 && (
						<Button
							type="button"
							variant="ghost"
							size="default"
							onClick={handleBack}
							className="h-8 min-w-20 gap-1 bg-slate-100 border border-slate-200 px-3 text-xs text-slate-700 hover:bg-slate-200 hover:text-slate-900 shadow-none sm:h-9 sm:min-w-25 sm:gap-2 sm:px-5 sm:text-sm cursor-pointer"
						>
							<ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
							<Translate text={localizationConstants.orderCreateBackButton} />
						</Button>
					)}

					{currentStep < 2 ? (
						<Button
							type="button"
							variant="default"
							size="default"
							onClick={handleNext}
							className="h-8 min-w-20 gap-1 bg-[#111721] text-xs text-white hover:bg-slate-800 sm:h-9 sm:min-w-25 sm:gap-2 sm:text-sm cursor-pointer"
						>
							<Translate text={localizationConstants.nextButton} />
							<ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
						</Button>
					) : (
						<Button
							type="button"
							variant="default"
							size="default"
							onClick={() => setShowConfirm(true)}
							disabled={isSubmitting}
							className="h-8 min-w-20 gap-1 bg-[#111721] text-xs text-white hover:bg-slate-800 sm:h-9 sm:min-w-25 sm:gap-2 sm:text-sm cursor-pointer"
						>
							<Translate text={localizationConstants.orderDagbokPublish} />
							<ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
						</Button>
					)}
				</div>
			</div>

			<CreateConfirmModal
				open={showConfirm}
				onClose={() => setShowConfirm(false)}
				onSave={handlePublish}
				role={role}
				setRole={setRole}
				clarification={clarification}
				setClarification={setClarification}
				fileName={fileName}
				setFileName={setFileName}
			/>
		</div>
	);
}
