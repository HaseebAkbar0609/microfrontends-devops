"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { DesignKontaktData, DesignProjektData } from "../types/designRegister";

interface PreviewRowProps {
	labelKey: string;
	value: string;
}

function PreviewRow({ labelKey, value }: PreviewRowProps) {
	if (!value) return null;
	return (
		<div className="grid gap-0.5">
			<p className="text-xs font-medium text-slate-500">
				<Translate text={labelKey} />
			</p>
			<p className="text-sm text-slate-900">{value}</p>
		</div>
	);
}

interface CollapsibleSectionProps {
	titleKey: string;
	children: React.ReactNode;
}

function CollapsibleSection({ titleKey, children }: CollapsibleSectionProps) {
	const [open, setOpen] = useState(true);
	return (
		<Card>
			<CardHeader
				className="flex cursor-pointer flex-row items-center justify-between border-b border-slate-200 px-6 py-4"
				onClick={() => setOpen((v) => !v)}
			>
				<p className="text-base font-medium text-slate-900">
					<Translate text={titleKey} />
				</p>
				{open ? (
					<ChevronUp className="h-4 w-4 text-slate-500" />
				) : (
					<ChevronDown className="h-4 w-4 text-slate-500" />
				)}
			</CardHeader>
			{open && (
				<CardContent className="p-6">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">{children}</div>
				</CardContent>
			)}
		</Card>
	);
}

interface DesignPreviewStepProps {
	kontakt: DesignKontaktData;
	projekt: DesignProjektData;
}

export function DesignPreviewStep({ kontakt, projekt }: DesignPreviewStepProps) {
	const isExtern = kontakt.mode === "extern";

	return (
		<div className="flex flex-col gap-4">
			{/* Kunduppgifter */}
			<CollapsibleSection titleKey={localizationConstants.calcNewKunduppgifter}>
				<PreviewRow labelKey={localizationConstants.calcNewForetagLabel} value={kontakt.foretag} />
				<PreviewRow labelKey={localizationConstants.calcNewAddressLabel} value={kontakt.address} />
				<PreviewRow labelKey={localizationConstants.calcNewPostNr} value={kontakt.postNr} />
				<PreviewRow labelKey={localizationConstants.calcNewOrt} value={kontakt.ort} />
				<PreviewRow labelKey={localizationConstants.agreementDetailMail} value={kontakt.mail} />
				<PreviewRow labelKey={localizationConstants.calcNewTelefon} value={kontakt.telefon} />
				<PreviewRow labelKey={localizationConstants.calcNewOrgPersonNr} value={kontakt.orgNr} />
			</CollapsibleSection>

			{/* Projekterings ansvarig */}
			<CollapsibleSection titleKey={localizationConstants.designRegNewProjektAnsvarig}>
				<PreviewRow labelKey={localizationConstants.agreementDetailFornamn} value={isExtern ? kontakt.ansvarigFornamn : kontakt.fornamn} />
				<PreviewRow labelKey={localizationConstants.agreementDetailEfternamn} value={isExtern ? kontakt.ansvarigEfternamn : kontakt.efternamn} />
				<PreviewRow labelKey={localizationConstants.agreementDetailMail} value={isExtern ? kontakt.ansvarigMail : kontakt.kontaktMail} />
				<PreviewRow labelKey={localizationConstants.agreementDetailMobil} value={isExtern ? kontakt.ansvarigMobil : kontakt.mobil} />
				<PreviewRow labelKey={localizationConstants.agreementDetailRoll} value={isExtern ? kontakt.ansvarigRoll : kontakt.roll} />
			</CollapsibleSection>

			{/* Projektering */}
			<CollapsibleSection titleKey={localizationConstants.designRegNewProjektering}>
				<PreviewRow labelKey={localizationConstants.designRegNewProjekteringNr} value={projekt.projekteringNr} />
				<PreviewRow labelKey={localizationConstants.designRegNewProjekteringNamn} value={projekt.projekteringNamn} />
				<PreviewRow labelKey={localizationConstants.designRegNewKvarteraNamn} value={projekt.kvarteraNamn} />
				<PreviewRow labelKey={localizationConstants.designRegNewProjekteringAdress} value={projekt.projekteringAdress} />
				<PreviewRow labelKey={localizationConstants.calcNewPostNr} value={projekt.postNr} />
				<PreviewRow labelKey={localizationConstants.calcNewOrt} value={projekt.ort} />
			</CollapsibleSection>

			{/* Projektering information */}
			<CollapsibleSection titleKey={localizationConstants.designRegNewProjekteringInfo}>
				<PreviewRow labelKey={localizationConstants.calcProType} value={projekt.type} />
				<PreviewRow labelKey={localizationConstants.category} value={projekt.kategori} />
				<PreviewRow labelKey={localizationConstants.calcNewAvdelning} value={projekt.avdelning} />
				<PreviewRow labelKey={localizationConstants.calcStatStartDate} value={projekt.startDatum} />
				<PreviewRow labelKey={localizationConstants.calcStatEndDate} value={projekt.slutDatum} />
			</CollapsibleSection>
		</div>
	);
}
