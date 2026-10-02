"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	ACCESS_STATUS_IDS,
	ACCESS_STATUS_LABELS,
	ACCESS_TYPE_IDS,
	ACCESS_TYPE_LABELS,
} from "../constants/access.constants";
import type { AccessStatusId, AccessTypeId } from "../types/access.types";

/** Radio value standing for "no filter"; never a status or type id. */
const ANY = "any";

interface AccessFilterMenuProps {
	status: AccessStatusId | null;
	type: AccessTypeId | null;
	onStatusChange: (status: AccessStatusId | null) => void;
	onTypeChange: (type: AccessTypeId | null) => void;
	onClear: () => void;
}

/** The Figma "Filter" dropdown. It only shows a bare button there, so status and type are the filters offered. */
export function AccessFilterMenu({ status, type, onStatusChange, onTypeChange, onClear }: AccessFilterMenuProps) {
	const activeCount = Number(status !== null) + Number(type !== null);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button type="button" variant="outline" className="h-10 cursor-pointer gap-2">
					<Translate text={localizationConstants.filter} />
					{activeCount > 0 && (
						<span className="rounded-full bg-slate-900 px-1.5 text-xs leading-5 text-white">{activeCount}</span>
					)}
					<ChevronDown className="h-4 w-4" aria-hidden />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-56">
				<DropdownMenuLabel>
					<Translate text={localizationConstants.accessFilterStatusLabel} />
				</DropdownMenuLabel>
				<DropdownMenuRadioGroup
					value={status ?? ANY}
					onValueChange={(value) => onStatusChange(ACCESS_STATUS_IDS.find((id) => id === value) ?? null)}
				>
					<DropdownMenuRadioItem value={ANY} className="cursor-pointer">
						<Translate text={localizationConstants.accessAllStatuses} />
					</DropdownMenuRadioItem>
					{ACCESS_STATUS_IDS.map((id) => (
						<DropdownMenuRadioItem key={id} value={id} className="cursor-pointer">
							<Translate text={ACCESS_STATUS_LABELS[id]} />
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuLabel>
					<Translate text={localizationConstants.accessFilterTypeLabel} />
				</DropdownMenuLabel>
				<DropdownMenuRadioGroup
					value={type ?? ANY}
					onValueChange={(value) => onTypeChange(ACCESS_TYPE_IDS.find((id) => id === value) ?? null)}
				>
					<DropdownMenuRadioItem value={ANY} className="cursor-pointer">
						<Translate text={localizationConstants.accessAllTypes} />
					</DropdownMenuRadioItem>
					{ACCESS_TYPE_IDS.map((id) => (
						<DropdownMenuRadioItem key={id} value={id} className="cursor-pointer">
							<Translate text={ACCESS_TYPE_LABELS[id]} />
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem disabled={activeCount === 0} onSelect={onClear} className="cursor-pointer">
					<Translate text={localizationConstants.clearFilters} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
