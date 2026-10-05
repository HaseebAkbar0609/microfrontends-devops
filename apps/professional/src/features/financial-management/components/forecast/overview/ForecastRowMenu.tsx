"use client";

import { Archive, ArchiveRestore, Eye, MoreVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export interface ForecastRowMenuProps {
	/** The row's Objekt, so a screen reader knows which row the ⋮ is for. */
	objectNo: string;
	/** Which way the middle item goes: Arkivera on Prognoslista, Återställ in Arkiv. */
	archived: boolean;
	onView: () => void;
	onToggleArchive: () => void;
	onDelete: () => void;
}

/** The row's ⋮: its details, putting it away or fetching it back, and Ta bort. */
export function ForecastRowMenu({ objectNo, archived, onView, onToggleArchive, onDelete }: ForecastRowMenuProps) {
	const t = useTranslate();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label={t(localizationConstants.forecastRowActions, { object: objectNo })}
					className="h-8 w-8 cursor-pointer text-slate-500 hover:text-slate-900"
				>
					<MoreVertical className="h-4 w-4" aria-hidden />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-44 border border-slate-200 bg-white p-1 shadow-md">
				<DropdownMenuItem onSelect={onView} className="cursor-pointer gap-2 text-sm text-slate-700">
					<Eye className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.viewDetailsButton} />
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={onToggleArchive} className="cursor-pointer gap-2 text-sm text-slate-700">
					{archived ? (
						<ArchiveRestore className="h-4 w-4" aria-hidden />
					) : (
						<Archive className="h-4 w-4" aria-hidden />
					)}
					<Translate
						text={archived ? localizationConstants.actionRestore : localizationConstants.projectListArchiveAction}
					/>
				</DropdownMenuItem>
				<DropdownMenuItem
					onSelect={onDelete}
					className="cursor-pointer gap-2 text-sm text-red-600 focus:bg-red-50 focus:text-red-700"
				>
					<Trash2 className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.forecastDelete} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default ForecastRowMenu;
