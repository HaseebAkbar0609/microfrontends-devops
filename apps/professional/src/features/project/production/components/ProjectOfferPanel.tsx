"use client";

import {
	InfoField,
	InfoFieldGrid,
} from "@/features/purchase/components/shared/InfoFieldGrid";
import localizationConstants from "@/utils/translation/constants";
import type { ProjectRecordInfo } from "../types";

export interface ProjectOfferPanelProps {
	info: ProjectRecordInfo;
}

/**
 * Offert — the offer fields the project actually carries.
 *
 * The frame draws this tab but never shows its contents, and the project's
 * `offerNr` is an opaque string: the offer feature lives entirely under the
 * Business module and nothing in Production links to it. So this shows what
 * the record genuinely knows rather than inventing a panel; anything absent
 * gets `InfoField`'s missing-value mark. A real Offert view needs its own
 * design and a project-to-offer lookup.
 */
export function ProjectOfferPanel({ info }: ProjectOfferPanelProps) {
	return (
		<InfoFieldGrid titleKey={localizationConstants.offerTab} columns={2}>
			<InfoField
				labelKey={localizationConstants.orderOffertNrLabel}
				value={info.details.offerNo}
			/>
			<InfoField
				labelKey={localizationConstants.orderKontraktsummaLabel}
				value={info.details.contractSum}
			/>
			<InfoField
				labelKey={localizationConstants.orderStartDatumLabel}
				value={info.details.startDate}
			/>
			<InfoField
				labelKey={localizationConstants.orderSlutDatumLabel}
				value={info.details.endDate}
			/>
		</InfoFieldGrid>
	);
}

export default ProjectOfferPanel;
