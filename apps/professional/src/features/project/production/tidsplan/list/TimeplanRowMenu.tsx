"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface TimeplanRowMenuProps {
	/** Names the trigger for a screen reader, including which plan it is for. */
	ariaLabel: string;
	onEdit: () => void;
	onDelete: () => void;
}

/**
 * A timeplan row's ⋮: Redigera and Radera.
 *
 * The frame never draws it open. Öppna is left out because the row's own
 * "Visa tidsplan" button already does that.
 */
export function TimeplanRowMenu({
	ariaLabel,
	onEdit,
	onDelete,
}: TimeplanRowMenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label={ariaLabel}
					className="h-8 w-8 cursor-pointer text-slate-500 hover:text-slate-900"
				>
					<MoreVertical className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-40">
				<DropdownMenuItem onClick={onEdit} className="cursor-pointer gap-2">
					<Pencil className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.actionEdit} />
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={onDelete}
					className="cursor-pointer gap-2 text-red-600 focus:text-red-700"
				>
					<Trash2 className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.projectListDeleteAction} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default TimeplanRowMenu;
