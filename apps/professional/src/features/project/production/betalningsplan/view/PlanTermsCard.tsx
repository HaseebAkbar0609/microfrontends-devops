"use client";

import { Folder } from "lucide-react";

import { InfoField } from "@/features/purchase/components/shared/InfoFieldGrid";
import { formatCurrency } from "@/utils/formatCurrency";
import localizationConstants from "@/utils/translation/constants";
import { retentionCap } from "../paymentPlanMath";
import type { PaymentTerms } from "../types";
import { PlanCard } from "./PlanCard";
import { PlanCardHeaderAction } from "./PlanCardHeaderAction";

export interface PlanTermsCardProps {
	terms: PaymentTerms;
	createdBy: string;
	createdDate: string;
	revisedDate: string;
	/** Opens the terms editor. Omit for a read-only card. */
	onEdit?: () => void;
}

/**
 * One of the frame's two grey panels: a percentage over the amount it gives.
 * Its own `<dl>`, so the description-list markup stays valid.
 */
function RetentionPanel({ children }: { children: React.ReactNode }) {
	return (
		<dl className="flex flex-col divide-y divide-slate-200 rounded-lg bg-slate-100 px-3 [&>div]:py-3">
			{children}
		</dl>
	);
}

/**
 * Betalningsplan: who made the plan and when, and its retention terms.
 *
 * "Belopp innehållet totalt" is derived from the contract and the ceiling
 * percentage, never typed, so it always matches the terms above it.
 */
export function PlanTermsCard({ terms, createdBy, createdDate, revisedDate, onEdit }: PlanTermsCardProps) {

	return (
		<PlanCard
			titleKey={localizationConstants.sectionBetalningsplan}
			icon={<Folder className="h-5 w-5 text-slate-700" aria-hidden />}
			action={
				onEdit ? (
					<PlanCardHeaderAction labelKey={localizationConstants.projectPaymentPlanTermsTitle} onClick={onEdit} />
				) : undefined
			}
		>
			<dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
				<InfoField labelKey={localizationConstants.lblKontraktsummaAlt} value={`${formatCurrency(terms.contractSum)} kr`} />
				<InfoField labelKey={localizationConstants.lblSkapadAv} value={createdBy} />
				<InfoField labelKey={localizationConstants.lblDatum} value={createdDate} />
				<InfoField labelKey={localizationConstants.lblReviderad} value={revisedDate} />
			</dl>

			<div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
				<RetentionPanel>
					<InfoField
						labelKey={localizationConstants.lblInnehallnaMedelPerAconto}
						value={`${terms.retentionPerAcontoPercent} %`}
					/>
					<InfoField labelKey={localizationConstants.lblBelopp} value={formatCurrency(terms.retentionFixedAmount)} />
				</RetentionPanel>

				<RetentionPanel>
					<InfoField
						labelKey={localizationConstants.lblTotaltInnehalletAvKontraktsumma}
						value={`${terms.retentionTotalPercent} %`}
					/>
					<InfoField
						labelKey={localizationConstants.lblBeloppInnehalletTotalt}
						value={formatCurrency(retentionCap(terms))}
					/>
				</RetentionPanel>
			</div>
		</PlanCard>
	);
}

export default PlanTermsCard;
