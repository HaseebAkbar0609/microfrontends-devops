"use client";

import { Eye, MoreVertical, Trash2 } from "lucide-react";

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
	onView: () => void;
	onDelete: () => void;
}

/** A row's ⋮: Visa detaljer, as the eye does, and Ta bort. */
export function ForecastRowMenu({ objectNo, onView, onDelete }: ForecastRowMenuProps) {
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
