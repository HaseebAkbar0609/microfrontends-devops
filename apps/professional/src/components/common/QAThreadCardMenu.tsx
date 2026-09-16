"use client";

import {
	Archive,
	CircleCheckBig,
	EllipsisVertical,
	Trash2,
	type LucideIcon,
} from "lucide-react";

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
import { useTranslate } from "@/utils/translation/translate";
import type { QAThreadLabels } from "./qaThread";

export interface QAThreadCardMenuProps {
	id: string;
	sender: string;
	labels: QAThreadLabels;
	onMarkAsRead?: (id: string) => void;
	onArchive?: (id: string) => void;
	onDelete?: (id: string) => void;
}

interface MenuAction {
	key: string;
	icon: LucideIcon;
	label?: TranslationKeys;
	handler?: (id: string) => void;
}

/**
 * The card's ⋮ menu. Only the actions a caller handles are listed, and the
 * trigger is not rendered at all when there are none.
 */
export function QAThreadCardMenu({
	id,
	sender,
	labels,
	onMarkAsRead,
	onArchive,
	onDelete,
}: QAThreadCardMenuProps) {
	const t = useTranslate();

	const actions: MenuAction[] = [
		{
			key: "read",
			icon: CircleCheckBig,
			label: labels.markAsRead,
			handler: onMarkAsRead,
		},
		{
			key: "archive",
			icon: Archive,
			label: labels.archive,
			handler: onArchive,
		},
		{ key: "delete", icon: Trash2, label: labels.delete, handler: onDelete },
	];
	const available = actions.filter((action) => action.handler && action.label);

	if (available.length === 0) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-9 w-9 shrink-0 cursor-pointer rounded-md p-0 text-zinc-950 transition-colors hover:bg-slate-100 data-[state=open]:bg-slate-100"
					aria-label={`${t(localizationConstants.actions)} ${sender}`}
				>
					<EllipsisVertical size={16} aria-hidden />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-44 rounded-md border border-slate-200 bg-white p-1 shadow-md"
			>
				{available.map(({ key, icon: Icon, label, handler }) => (
					<DropdownMenuItem
						key={key}
						onClick={() => handler?.(id)}
						className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-zinc-950 hover:bg-slate-100"
					>
						<Icon size={16} className="shrink-0 text-zinc-950" aria-hidden />
						<span>{label ? t(label) : null}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default QAThreadCardMenu;
