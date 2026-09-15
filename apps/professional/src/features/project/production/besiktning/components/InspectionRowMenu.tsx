"use client";

import { Archive, ArchiveRestore, MoreVertical, PencilLine, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

const ITEM = "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm";

export interface InspectionRowMenuProps {
	/** Names the trigger for a screen reader, including which inspection it is for. */
	ariaLabel: string;
	archived: boolean;
	onOpen: () => void;
	onToggleArchive: () => void;
	onDelete: () => void;
}

/**
 * A row's ⋮, as the frame draws it: Öppna (the edit dialog, drawn with a
 * pencil), Arkivera and Radera. In the Arkiverade view Arkivera becomes
 * Återställ, which is how an archived inspection comes back.
 */
export function InspectionRowMenu({
	ariaLabel,
	archived,
	onOpen,
	onToggleArchive,
	onDelete,
}: InspectionRowMenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label={ariaLabel}
					className="h-9 w-9 cursor-pointer text-slate-700 hover:text-slate-900"
				>
					<MoreVertical className="h-4 w-4" aria-hidden />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-44 border border-slate-200 bg-white p-1 shadow-md">
				<DropdownMenuItem onClick={onOpen} className={`${ITEM} text-slate-900`}>
					<PencilLine className="h-4 w-4 shrink-0" aria-hidden />
					<Translate text={localizationConstants.projectListOpen} />
				</DropdownMenuItem>
				<DropdownMenuItem onClick={onToggleArchive} className={`${ITEM} text-slate-900`}>
					{archived ? (
						<ArchiveRestore className="h-4 w-4 shrink-0" aria-hidden />
					) : (
						<Archive className="h-4 w-4 shrink-0" aria-hidden />
					)}
					<Translate
						text={archived ? localizationConstants.actionRestore : localizationConstants.projectListArchiveAction}
					/>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={onDelete} className={`${ITEM} text-red-600 focus:text-red-700`}>
					<Trash2 className="h-4 w-4 shrink-0" aria-hidden />
					<Translate text={localizationConstants.projectListDeleteAction} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default InspectionRowMenu;
