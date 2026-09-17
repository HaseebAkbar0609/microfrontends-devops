"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface TimeplanSectionCardProps {
	icon: React.ReactNode;
	titleKey: TranslationKeys;
	children: React.ReactNode;
}

/**
 * One of the form's two cards: an icon and title over a two-column grid.
 *
 * The header follows `MachineInformationStep`'s 56px icon row; the body grid
 * collapses to one column below `sm`.
 */
export function TimeplanSectionCard({
	icon,
	titleKey,
	children,
}: TimeplanSectionCardProps) {
	return (
		<Card className="gap-0 rounded-lg border border-slate-200 bg-white py-0 shadow-none">
			<CardHeader className="flex h-14 flex-row items-center gap-2 border-b border-slate-200 px-4 py-0 [.border-b]:pb-0">
				<span aria-hidden className="text-slate-700">
					{icon}
				</span>
				<CardTitle className="text-base font-medium text-slate-900">
					<Translate text={titleKey} />
				</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-1 items-start gap-x-4 gap-y-4 p-4 sm:grid-cols-2">
				{children}
			</CardContent>
		</Card>
	);
}

export default TimeplanSectionCard;
