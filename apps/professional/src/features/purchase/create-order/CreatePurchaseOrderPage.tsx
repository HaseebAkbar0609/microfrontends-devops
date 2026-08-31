"use client";

import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PermissionGate } from "@/components/common/PermissionGate";
import { ModulePageHeader } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ContactPersonCard } from "../components/shared/ContactPersonCard";
import {
	PURCHASE_MODULE_TABS,
	PURCHASE_MODULE_TITLE,
} from "../data/purchaseNav.config";
import { GoodsUploadCard } from "../create-goods-reception/components/GoodsUploadCard";
import type { PurchaseRow } from "../types/purchase.types";
import { OrderObjectStep } from "./components/OrderObjectStep";
import { OrderSpecificationStep } from "./components/OrderSpecificationStep";
import { OrderStepRail } from "./components/OrderStepRail";
import {
	TOTAL_ORDER_STEPS,
	useCreatePurchaseOrderForm,
	type OrderStep,
} from "./useCreatePurchaseOrderForm";

export interface CreatePurchaseOrderPageProps {
	purchase: PurchaseRow;
}

const STEP_TABS: { value: OrderStep; label: TranslationKeys }[] = [
	{ value: 1, label: localizationConstants.purchaseOrderTabObject },
	{ value: 2, label: localizationConstants.purchaseOrderTabContact },
	{ value: 3, label: localizationConstants.purchaseOrderTabSpecification },
];

/** Placeholder contacts, as the frame's Kontaktperson picker shows. */
const CONTACT_OPTIONS = [
	{ id: "anders", name: "Anders Svensson" },
	{ id: "karin", name: "Karin Lund" },
];

/**
 * Ny inköpsorder — a three-step wizard creating an order line under a purchase.
 *
 * The frames contradict each other on the title ("Ny inköpsorder" vs "Skapa
 * nytt"), the step count ("Step 2/4" beside a rail reading 2/3) and the middle
 * tab's name ("Kontaktinformation" vs "Projektinformation"). This is built
 * self-consistent; each conflict is listed on the ticket.
 */
export function CreatePurchaseOrderPage({
	purchase,
}: CreatePurchaseOrderPageProps) {
	const { t } = useTranslation();
	const {
		step,
		goNext,
		goBack,
		goToStep,
		errors,
		object,
		patchObject,
		delivery,
		contact,
		patchContact,
		specification,
		patchSpecification,
		updateLine,
		addLine,
		removeLine,
		grandTotal,
		supplierOptions,
		documents,
		gdprAccepted,
		setGdprAccepted,
		recordHref,
		cancel,
		submit,
	} = useCreatePurchaseOrderForm(purchase);

	const handleUpload = () => {
		const added = documents.commitPendingFiles();
		if (added > 0) {
			showToast(
				"success",
				t(localizationConstants.purchaseAgreementUploadedToast),
			);
		}
	};

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<ModulePageHeader
				title={PURCHASE_MODULE_TITLE}
				tabs={PURCHASE_MODULE_TABS}
				record={{
					title: t(localizationConstants.purchaseOrderTitle),
					description: `${t(localizationConstants.stepLabel)} ${step}/${TOTAL_ORDER_STEPS}`,
					backHref: recordHref,
				}}
			/>

			{/* Step navigation, doubling as the design's three tabs. */}
			<div className="flex items-center gap-6 border-b border-slate-200 bg-white px-6 pt-2">
				{STEP_TABS.map((tab) => (
					<button
						key={tab.value}
						type="button"
						onClick={() => goToStep(tab.value)}
						className={cn(
							"relative cursor-pointer pb-3 text-sm font-medium whitespace-nowrap transition-colors",
							step === tab.value
								? "font-semibold text-slate-900 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-slate-900"
								: "text-slate-500 hover:text-slate-800",
						)}
					>
						<Translate text={tab.label} />
					</button>
				))}
			</div>

			<div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 pt-4 pb-8 xl:flex-row">
				<div className="min-w-0 flex-1 space-y-4">
					{step === 1 && (
						<OrderObjectStep
							purchaseNo={purchase.purchaseNo}
							lineNo={specification.marking ?? ""}
							calculationNo="K301"
							value={object}
							delivery={delivery}
							errors={errors}
							onChange={patchObject}
							supplierOptions={supplierOptions}
						/>
					)}

					{step === 2 && (
						<ContactPersonCard
							titleKey={
								localizationConstants.purchaseOrderTabContact
							}
							value={contact}
							onChange={patchContact}
							errors={errors}
							contactOptions={CONTACT_OPTIONS}
						/>
					)}

					{step === 3 && (
						<>
							<OrderSpecificationStep
								value={specification}
								errors={errors}
								onChange={patchSpecification}
								onUpdateLine={updateLine}
								onAddLine={addLine}
								onRemoveLine={removeLine}
								total={grandTotal}
								projectNo={object.projectNo ?? ""}
								invoiceEmail="faktura@byggbolaget.se"
							/>

							<GoodsUploadCard
								pendingFiles={documents.pendingFiles}
								onSelectFiles={documents.selectFiles}
								onRemovePending={documents.removePending}
								onUpload={handleUpload}
								gdprAccepted={gdprAccepted}
								onGdprChange={setGdprAccepted}
							/>
						</>
					)}
				</div>

				<OrderStepRail step={step} onSend={submit} />
			</div>

			<div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white py-3 shadow-sm">
				<div className="flex flex-wrap items-center justify-end gap-3 px-6">
					<Button
						type="button"
						variant="outline"
						onClick={cancel}
						className="h-10 min-w-25 cursor-pointer border-slate-300 bg-white text-sm text-slate-700 shadow-none hover:bg-slate-100"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>

					{step === TOTAL_ORDER_STEPS && (
						<Button
							type="button"
							disabled
							title={t(
								localizationConstants.purchaseOrderUnavailable,
							)}
							className="h-10 border border-slate-300 bg-white text-sm text-slate-700 shadow-none disabled:cursor-not-allowed disabled:opacity-50"
						>
							<Translate
								text={localizationConstants.purchaseOrderPreview}
							/>
						</Button>
					)}

					<PermissionGate permission="CREATE_PURCHASE">
						<Button
							type="button"
							onClick={submit}
							className="h-10 min-w-25 cursor-pointer gap-2 bg-[#111721] text-sm text-white shadow-none hover:bg-slate-800"
						>
							<Save className="h-4 w-4" aria-hidden />
							<Translate text={localizationConstants.confirmSave} />
						</Button>
					</PermissionGate>

					{step > 1 && (
						<Button
							type="button"
							variant="outline"
							onClick={goBack}
							className="h-10 min-w-25 cursor-pointer gap-2 border-slate-300 bg-white text-sm text-slate-700 shadow-none hover:bg-slate-100"
						>
							<ArrowLeft className="h-4 w-4" aria-hidden />
							<Translate text={localizationConstants.backButton} />
						</Button>
					)}

					{step < TOTAL_ORDER_STEPS && (
						<Button
							type="button"
							onClick={goNext}
							className="h-10 min-w-25 cursor-pointer gap-2 bg-[#111721] text-sm text-white shadow-none hover:bg-slate-800"
						>
							<Translate text={localizationConstants.nextButton} />
							<ArrowRight className="h-4 w-4" aria-hidden />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

export default CreatePurchaseOrderPage;
