"use client";

import { ChevronDown } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	ACCESS_ITEM_STATUS_CLASSES,
	ACCESS_ITEM_STATUS_IDS,
	ACCESS_ITEM_STATUS_LABELS,
} from "../../constants/accessItems.constants";
import type { AccessItem, AccessItemStatusId } from "../../types/accessItems.types";

/** The status badge with a dropdown arrow, as in the Figma table: pick Active or Returned. */
export function AccessItemStatusSelect({
	item,
	onChange,
}: {
	item: AccessItem;
	onChange: (status: AccessItemStatusId) => void;
}) {
	const t = useTranslate();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label={t(localizationConstants.accessItemStatusLabel, { id: item.nycId })}
				className={cn(
					"inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium text-white whitespace-nowrap",
					ACCESS_ITEM_STATUS_CLASSES[item.status],
				)}
			>
				<Translate text={ACCESS_ITEM_STATUS_LABELS[item.status]} />
				<ChevronDown className="h-3.5 w-3.5" aria-hidden />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuRadioGroup
					value={item.status}
					onValueChange={(value) => {
						const next = ACCESS_ITEM_STATUS_IDS.find((id) => id === value);
						if (next) onChange(next);
					}}
				>
					{ACCESS_ITEM_STATUS_IDS.map((id) => (
						<DropdownMenuRadioItem key={id} value={id} className="cursor-pointer">
							<Translate text={ACCESS_ITEM_STATUS_LABELS[id]} />
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
