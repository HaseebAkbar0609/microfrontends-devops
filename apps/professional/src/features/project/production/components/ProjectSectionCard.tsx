"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface ProjectSectionCardProps {
	titleKey: TranslationKeys;
	icon: React.ReactNode;
	/** Right-aligned header slot — a pencil or "Lägga till". */
	action?: React.ReactNode;
	children: React.ReactNode;
	contentClassName?: string;
}

/**
 * A project record section's card: an icon and title with an optional header
 * action over free content — a table, grey panels, an upload row.
 *
 * Shared by the record's sections (Betalningsplan, Besiktning), so it lives
 * beside `ProjectRecordTitle` rather than inside any one of them.
 */
export function ProjectSectionCard({
	titleKey,
	icon,
	action,
	children,
	contentClassName,
}: ProjectSectionCardProps) {
	return (
		<Card className="gap-0 rounded-lg border border-slate-200 bg-white py-0 shadow-none">
			<CardHeader className="flex min-h-14 flex-row items-center justify-between gap-3 border-b border-slate-200 px-4 py-2 sm:px-6 [.border-b]:pb-2">
				<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
					{icon}
					<Translate text={titleKey} />
				</CardTitle>
				{action}
			</CardHeader>
			<CardContent className={cn("p-4 sm:p-6", contentClassName)}>{children}</CardContent>
		</Card>
	);
}

export default ProjectSectionCard;
