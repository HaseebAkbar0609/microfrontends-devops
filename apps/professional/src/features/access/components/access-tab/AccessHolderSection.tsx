"use client";

import { Key } from "lucide-react";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { AccessHolder, AccessItem } from "../../types/accessItems.types";
import { AccessItemsTable } from "./AccessItemsTable";

interface AccessHolderSectionProps {
	holder: AccessHolder;
	defaultOpen: boolean;
	onViewItem: (item: AccessItem) => void;
	onDeleteItem: (item: AccessItem) => void;
	onDeleteAll: () => void;
}

/**
 * One person's accordion: key icon and name on a grey bar, then their items and,
 * at the bottom right, the "Delete" button of the Figma frame. Figma gives that
 * button no selection to act on, so it removes all of this person's access.
 */
export function AccessHolderSection({ holder, defaultOpen, onViewItem, onDeleteItem, onDeleteAll }: AccessHolderSectionProps) {
	const t = useTranslate();

	return (
		<CollapsibleSection
			defaultOpen={defaultOpen}
			icon={<Key className="h-6 w-6" aria-hidden />}
			title={<span className="text-base font-semibold text-slate-900">{holder.name}</span>}
			headerClassName="mb-0 h-14 rounded-md border-b-0 bg-slate-200 px-4 pb-0 hover:bg-slate-200"
			contentClassName="pt-2"
		>
			<div className="px-1 pt-2">
				<AccessItemsTable items={holder.items} onView={onViewItem} onDelete={onDeleteItem} />
			</div>
			<div className="flex justify-end px-1 pb-2 pt-3">
				<Button
					type="button"
					className="h-9 w-36 cursor-pointer border border-slate-200 bg-blue-300 text-slate-950 hover:bg-blue-200"
					aria-label={t(localizationConstants.accessHolderDeleteLabel, { name: holder.name })}
					onClick={onDeleteAll}
				>
					<Translate text={localizationConstants.accessActionDelete} />
				</Button>
			</div>
		</CollapsibleSection>
	);
}
