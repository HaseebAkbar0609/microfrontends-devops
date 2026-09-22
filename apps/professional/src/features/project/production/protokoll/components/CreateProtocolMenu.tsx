"use client";

import { FilePlus, Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { PROTOCOL_KIND_MENU_KEYS, PROTOCOL_KINDS } from "../projectProtocol.config";
import type { ProtocolKind } from "../types";

export interface CreateProtocolMenuProps {
	/** Called as the menu closes — the page defers the dialog a tick, as Radix needs. */
	onCreate: (kind: ProtocolKind) => void;
}

/**
 * "+ Skapa protokoll" and its menu, as the frame draws it: Protokoll -
 * Standard opens Nytt möte, Ladda upp Nytt protokoll, and Protokoll - Action
 * the short dialog.
 */
export function CreateProtocolMenu({ onCreate }: CreateProtocolMenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					className="h-10 cursor-pointer gap-2 rounded-md bg-[#111721] px-4 text-sm font-medium text-white hover:bg-slate-800"
				>
					<Plus className="h-4 w-4 shrink-0" aria-hidden />
					<Translate text={localizationConstants.projectProtocolCreateButton} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56 border border-slate-200 bg-white p-1 shadow-md">
				{PROTOCOL_KINDS.map((kind) => {
					const Icon = kind === "upload" ? Upload : FilePlus;
					return (
						<DropdownMenuItem
							key={kind}
							onSelect={() => onCreate(kind)}
							className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-900"
						>
							<Icon className="h-4 w-4 shrink-0" aria-hidden />
							<Translate text={PROTOCOL_KIND_MENU_KEYS[kind]} />
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default CreateProtocolMenu;
