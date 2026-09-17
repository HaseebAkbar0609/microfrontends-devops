"use client";

import type { LucideIcon } from "lucide-react";

import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface RecordCollapsibleCardProps {
	titleKey: TranslationKeys;
	icon: LucideIcon;
	children: React.ReactNode;
	contentClassName?: string;
}

/** A record section card: the shared `CollapsibleSection` in the record's card frame, open by default. */
export function RecordCollapsibleCard({ titleKey, icon: Icon, children, contentClassName }: RecordCollapsibleCardProps) {
	return (
		<CollapsibleSection
			title={<Translate text={titleKey} />}
			icon={<Icon className="h-5 w-5 text-slate-700" aria-hidden />}
			className="rounded-lg border border-slate-200 bg-white"
			headerClassName="mb-0 h-14 rounded-none rounded-t-lg px-4 pb-0 sm:px-6"
			titleClassName="text-base font-medium text-slate-900"
			contentClassName={cn("p-4 sm:p-6", contentClassName)}
		>
			{children}
		</CollapsibleSection>
	);
}

export default RecordCollapsibleCard;
