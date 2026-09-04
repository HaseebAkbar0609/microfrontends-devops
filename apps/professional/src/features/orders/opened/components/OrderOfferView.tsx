"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
	UserPlus,
	Building2,
	ClipboardList,
	BadgeDollarSign,
	FilePlus,
	ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderOpenedData } from "../types/orderOpened.types";
import { OrderAccordionSection } from "./OrderAccordionSection";
import { OrderDocumentTable } from "./OrderDocumentTable";

function Field({ label, value }: { label: string; value?: string }) {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-sans text-sm font-medium leading-5 text-slate-900">{label}</span>
			<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 break-words">{value || "—"}</span>
		</div>
	);
}

export interface OrderOfferViewProps {
	data: OrderOpenedData;
}

export function OrderOfferView({ data }: OrderOfferViewProps) {
	const t = useTranslate();
	const router = useRouter();

	const company = data.companyInfo || {
		companyId: "comp-example-01",
		name: "Exempel Bygg AB",
		email: "company@example.com",
		phone: "08-000 000 00",
		address: "Exempelgatan 1, 123 45 Stockholm",
		orgNumber: "556000-0000",
	};

	const project = data.projectDescription || {
		projectName: "Köksprojekt",
		workLocation: "Exempelgatan 1, 123 45 Stockholm",
		specifications: "-",
	};

	const offer = data.offerDetails || {
		offerNo: "1234",
		work: "Total kostnad för projektet, inklusive material och arbete.",
		material: "Material",
		totalOffer: "10 000 kr",
		rotDeductionLabor: "---",
		paymentTerms: "30 dagar",
		rotDeductionSettled: "ja",
		secondaryPaymentTerms: "30 dagar",
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Accordion 1: Kunduppgifter */}
			<OrderAccordionSection
				title={t(localizationConstants.customerDetailsSection)}
				icon={<UserPlus className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 text-sm">
					<Field label={t(localizationConstants.orderCustomer)} value={data.customerInfo.customerName} />
					<Field label={t(localizationConstants.addressLabel)} value={data.customerInfo.address} />
					<Field label={t(localizationConstants.postNrLabel)} value={data.customerInfo.postCode} />
					<Field label={t(localizationConstants.cityLabel)} value={data.customerInfo.city} />
					<Field label={t(localizationConstants.mailLabel)} value={data.customerInfo.email} />
					<Field label={t(localizationConstants.phoneLabel)} value={data.customerInfo.phone} />
					<Field label={t(localizationConstants.orgPersonNrLabel)} value={data.customerInfo.orgNumber} />
				</div>
			</OrderAccordionSection>

			{/* Accordion 2: Företagsnummer */}
			<OrderAccordionSection
				title={t(localizationConstants.companyNumberSection)}
				icon={<Building2 className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 text-sm">
					<Field label={t(localizationConstants.company)} value={company.name} />
					<Field label={t(localizationConstants.mailLabel)} value={company.email} />
					<Field label={t(localizationConstants.phoneLabel)} value={company.phone} />
					<Field label={t(localizationConstants.addressLabel)} value={company.address} />
					<Field label={t(localizationConstants.orgPersonNrLabel)} value={company.orgNumber} />
				</div>
				<div className="mt-6 flex justify-center pt-2">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => router.push(`/module/production/order/${data.id || "5000-001"}/organisation`)}
						className="gap-2 text-sm font-medium text-slate-900 hover:text-slate-700 cursor-pointer"
					>
						<span>{t(localizationConstants.goToCompany)}</span>
						<ArrowRight className="h-4 w-4" />
					</Button>
				</div>
			</OrderAccordionSection>

			{/* Accordion 3: Projektbeskrivning */}
			<OrderAccordionSection
				title={t(localizationConstants.projectDescriptionSection)}
				icon={<ClipboardList className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 text-sm">
					<Field label={t(localizationConstants.projectDescriptionSection)} value={project.projectName} />
					<Field label={t(localizationConstants.workPlaceLabel)} value={project.workLocation} />
					<Field label={t(localizationConstants.specificationsLabel)} value={project.specifications} />
				</div>
			</OrderAccordionSection>

			{/* Accordion 4: Offert */}
			<OrderAccordionSection
				title={t(localizationConstants.offerTab)}
				icon={<BadgeDollarSign className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 text-sm">
					<Field label={t(localizationConstants.offerTab)} value={offer.offerNo} />
					<Field label={t(localizationConstants.workLabel)} value={offer.work} />
					<Field label={t(localizationConstants.materialLabel)} value={offer.material} />
					<Field label={t(localizationConstants.totalOfferLabel)} value={offer.totalOffer} />
					<Field label={t(localizationConstants.rotDeductionLabel)} value={offer.rotDeductionLabor} />
					<Field label={t(localizationConstants.paymentTermsLabel)} value={offer.paymentTerms} />
					<Field label={t(localizationConstants.rotDeductionSettled)} value={offer.rotDeductionSettled} />
					<Field label={t(localizationConstants.paymentTermsLabel)} value={offer.secondaryPaymentTerms} />
				</div>
			</OrderAccordionSection>

			{/* Section 5: Bifogade dokument */}
			<OrderAccordionSection
				title={t(localizationConstants.attachedDocumentsSection)}
				icon={<FilePlus className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
				hideToggle
			>
				<OrderDocumentTable initialDocuments={data.documents} />
			</OrderAccordionSection>
		</div>
	);
}
