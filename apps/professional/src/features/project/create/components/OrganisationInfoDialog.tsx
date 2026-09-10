"use client";

import { Info, X } from "lucide-react";

import {
	InfoField,
	InfoFieldGrid,
} from "@/features/purchase/components/shared/InfoFieldGrid";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type {
	ProjectContactPerson,
	ProjectOrganisationData,
} from "../types";

export interface OrganisationInfoDialogProps {
	isOpen: boolean;
	organisation: ProjectOrganisationData;
	/** The row the "Se information" link was clicked on, if any. */
	contact: ProjectContactPerson | null;
	onClose: () => void;
}

/**
 * Read-only "Organisation Information", opened from the summary's
 * "Se information" link.
 *
 * Every value comes from what the wizard already collected, so the dialog shows
 * the record rather than a form — there is nothing to save and no confirm.
 */
export function OrganisationInfoDialog({
	isOpen,
	organisation,
	contact,
	onClose,
}: OrganisationInfoDialogProps) {
	const t = useTranslate();

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="max-h-[85vh] w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-xl sm:w-[560px] sm:max-w-[560px] sm:p-7"
			>
				<DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
					<DialogTitle className="text-2xl font-semibold tracking-[-0.6px] text-slate-900">
						<Translate
							text={localizationConstants.projectCreateOrgInfoTitle}
						/>
					</DialogTitle>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onClose}
						aria-label={t(localizationConstants.closeButton)}
						className="h-8 w-8 cursor-pointer rounded-md p-1 text-slate-900 hover:bg-slate-100"
					>
						<X className="h-5 w-5" />
					</Button>
				</DialogHeader>

				<div className="space-y-4">
					<InfoFieldGrid
						titleKey={localizationConstants.orderGeneralInformation}
						icon={<Info className="h-4 w-4 text-slate-500" aria-hidden />}
					>
						<InfoField
							labelKey={
								localizationConstants.projectCreateContractorTypeLabel
							}
							value={organisation.contractorType}
						/>
						<InfoField
							labelKey={localizationConstants.orderOrganisationTab}
							value={organisation.organizationName}
						/>
						<InfoField
							labelKey={localizationConstants.agreementAddress}
							value={organisation.address}
						/>
						<InfoField
							labelKey={localizationConstants.orderPostNrLabel}
							value={organisation.postalCode}
						/>
						<InfoField
							labelKey={localizationConstants.orderCityLabel}
							value={organisation.city}
						/>
						<InfoField
							labelKey={localizationConstants.orderMailLabel}
							value={organisation.email}
						/>
						<InfoField
							labelKey={localizationConstants.orderTelefonLabel}
							value={organisation.phone}
						/>
					</InfoFieldGrid>

					{contact && (
						<InfoFieldGrid
							titleKey={localizationConstants.contactSection}
							icon={
								<Info
									className="h-4 w-4 text-slate-500"
									aria-hidden
								/>
							}
						>
							<InfoField
								labelKey={localizationConstants.orderFornamLabel}
								value={contact.firstName}
							/>
							<InfoField
								labelKey={localizationConstants.orderEfternamnLabel}
								value={contact.lastName}
							/>
							<InfoField
								labelKey={localizationConstants.orderMailLabel}
								value={contact.email}
							/>
							<InfoField
								labelKey={localizationConstants.orderMobilLabel}
								value={contact.mobile}
							/>
							<InfoField
								labelKey={localizationConstants.orderRollLabel}
								value={contact.role}
							/>
						</InfoFieldGrid>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default OrganisationInfoDialog;
