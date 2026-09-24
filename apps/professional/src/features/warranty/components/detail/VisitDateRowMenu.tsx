"use client";

import { Download, MoreVertical, PencilLine, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { InspectionDateItem } from "../../types/warranty.types";

const ITEM_CLASS =
	"flex items-center gap-2 cursor-pointer w-full text-slate-900 hover:bg-slate-50 text-xs";

const ICON_CLASS = "h-4 w-4 text-slate-900";

export interface VisitDateRowMenuProps {
	item: InspectionDateItem;
	onEdit: (item: InspectionDateItem) => void;
	onDownload: (item: InspectionDateItem) => void;
	onDelete: (id: string) => void;
}

/** The frame's Redigera / Ladda ner / Ta bort menu for one visit-date row. */
export function VisitDateRowMenu({
	item,
	onEdit,
	onDownload,
	onDelete,
}: VisitDateRowMenuProps) {
	const t = useTranslate();

	const items: {
		labelKey: TranslationKeys;
		icon: React.ReactNode;
		onSelect: () => void;
	}[] = [
		{
			labelKey: localizationConstants.actionEdit,
			icon: <PencilLine className={ICON_CLASS} />,
			onSelect: () => onEdit(item),
		},
		{
			labelKey: localizationConstants.downloadAction,
			icon: <Download className={ICON_CLASS} />,
			onSelect: () => onDownload(item),
		},
		{
			labelKey: localizationConstants.actionDelete,
			icon: <Trash2 className={ICON_CLASS} />,
			onSelect: () => onDelete(item.id),
		},
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-slate-900 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
					/* Named per row — an unlabelled trigger leaves a screen
					   reader unable to tell one row's menu from the next. The
					   document name rather than the date: the frame's rows all
					   share one date, so the date names them all the same. */
					aria-label={`${t(localizationConstants.actions)} ${item.documentName}`}
				>
					<MoreVertical className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				className="w-36 border border-slate-200 bg-white shadow-md rounded-lg p-1"
			>
				{items.map((entry) => (
					<DropdownMenuItem
						key={entry.labelKey}
						onClick={entry.onSelect}
						className={ITEM_CLASS}
					>
						{entry.icon}
						<span>
							<Translate text={entry.labelKey} />
						</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default VisitDateRowMenu;
