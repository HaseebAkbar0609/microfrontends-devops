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
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { ProjectDocumentItem } from "../types";

export interface DocumentRowMenuProps {
	document: ProjectDocumentItem;
	/** Puts the caret in this row's name field, which the table owns. */
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
}

const ITEM_CLASS =
	"flex cursor-pointer items-center gap-2 text-xs text-slate-700 hover:bg-slate-50";

/**
 * The frames' Redigera / Radera menu on an attached document.
 *
 * Redigera focuses the row's name field rather than opening a dialog — the name
 * is the only editable thing on the row and it is already an input. The table
 * holds the ref and does the focusing; this only says which row.
 */
export function DocumentRowMenu({
	document,
	onEdit,
	onDelete,
}: DocumentRowMenuProps) {
	const t = useTranslate();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 cursor-pointer rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900"
					/* Named per row — an unlabelled trigger leaves a screen
					   reader unable to tell one row's menu from the next. */
					aria-label={`${t(localizationConstants.actions)} ${document.fileName}`}
				>
					<MoreVertical className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				className="w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-md"
			>
				<DropdownMenuItem
					onClick={() => onEdit(document.id)}
					className={ITEM_CLASS}
				>
					<Pencil className="h-4 w-4 text-slate-500" />
					<Translate text={localizationConstants.actionEdit} />
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => onDelete(document.id)}
					className={ITEM_CLASS}
				>
					<Trash2 className="h-4 w-4 text-slate-500" />
					<Translate text={localizationConstants.menuDeleteDocument} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default DocumentRowMenu;
