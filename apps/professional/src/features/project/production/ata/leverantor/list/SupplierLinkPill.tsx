"use client";

import { Badge } from "@/components/ui/badge";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

/**
 * "Kopplad äta": a dark pill naming the customer ÄTA this one is linked to
 * ("Ja · Äta 100"), or a red "Nej".
 */
export function SupplierLinkPill({ linkedNumber }: { linkedNumber: number | null }) {
	const t = useTranslate();

	if (linkedNumber === null) {
		return (
			<Badge variant="destructive" className="px-2 py-0.5 font-medium shadow-none hover:bg-destructive">
				<Translate text={localizationConstants.ataSupplierLinkedNo} />
			</Badge>
		);
	}

	return (
		<Badge variant="typeDark" className="px-2 py-0.5 font-medium whitespace-nowrap">
			{t(localizationConstants.projectAtaSupplierLinkedTo, {
				label: t(localizationConstants.projectAtaLabel, { number: linkedNumber }),
			})}
		</Badge>
	);
}

export default SupplierLinkPill;
