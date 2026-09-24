"use client";

import { MoreVertical, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface RowMenuActionProps {
	icon: LucideIcon;
	labelKey: TranslationKeys;
	/** Why the action is unavailable, or `null` when it can run. */
	reasonKey: TranslationKeys | null;
	destructive?: boolean;
	onSelect: () => void;
}

/**
 * A menu item that can be blocked without hiding why. Radix makes a
 * `disabled` item ignore the pointer — its `title` never shows — and skips it
 * from the keyboard, so a blocked action stays focusable, announces itself as
 * disabled, does nothing when chosen, and prints its reason under the label.
 */
export function RowMenuAction({ icon: Icon, labelKey, reasonKey, destructive = false, onSelect }: RowMenuActionProps) {
	const blocked = Boolean(reasonKey);

	return (
		<DropdownMenuItem
			aria-disabled={blocked || undefined}
			onSelect={(event) => {
				if (blocked) {
					event.preventDefault();
					return;
				}
				onSelect();
			}}
			className={cn(
				"flex cursor-pointer items-start gap-2 px-3 py-2 text-sm",
				blocked
					? "cursor-not-allowed text-slate-400 focus:text-slate-400"
					: destructive
						? "text-red-600 focus:text-red-700"
						: "text-slate-900",
			)}
		>
			<Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
			<span className="flex flex-col">
				<Translate text={labelKey} />
				{reasonKey && (
					<span className="text-xs text-slate-500">
						<Translate text={reasonKey} />
					</span>
				)}
			</span>
		</DropdownMenuItem>
	);
}

export interface RowActionMenuProps {
	/** Names the ⋮ for a screen reader, including which row it is for. */
	ariaLabel: string;
	children: React.ReactNode;
	/** Radix returns focus to ⋮ on close; a caller that moves focus elsewhere prevents it here. */
	onCloseAutoFocus?: (event: Event) => void;
}

/** The ⋮ trigger and its menu, shared by the project record's row menus. */
export function RowActionMenu({ ariaLabel, children, onCloseAutoFocus }: RowActionMenuProps) {
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
			<DropdownMenuContent
				align="end"
				className="w-60 border border-slate-200 bg-white p-1 shadow-md"
				onCloseAutoFocus={onCloseAutoFocus}
			>
				{children}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default RowActionMenu;
