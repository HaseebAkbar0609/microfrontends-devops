"use client";

import { useId, useRef } from "react";
import { ChevronDown, X } from "lucide-react";
import { useController, type Control } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TranslationKeys } from "@/utils/translation/constants";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { AtaReferenceOption } from "../../types";
import type { AtaFormValues } from "../ataFormSchema";

export interface AtaReferenceSelectProps {
	control: Control<AtaFormValues>;
	name: "supplierInvoiceIds" | "timeReportIds";
	labelKey: TranslationKeys;
	chooseKey: TranslationKeys;
	options: AtaReferenceOption[];
	disabled: boolean;
}

/**
 * The frame's chip multi-select. Chips and their × buttons sit beside the menu
 * trigger, never inside it, so no control is nested in another; the menu's
 * checkbox items stay open while several are picked.
 */
export function AtaReferenceSelect({ control, name, labelKey, chooseKey, options, disabled }: AtaReferenceSelectProps) {
	const t = useTranslate();
	const id = useId();
	const triggerRef = useRef<HTMLButtonElement>(null);
	const { field } = useController({ control, name });
	const selected = field.value;
	const chosen = options.filter((option) => selected.includes(option.id));

	const setChecked = (optionId: string, checked: boolean) =>
		field.onChange(checked ? [...selected, optionId] : selected.filter((value) => value !== optionId));

	return (
		<div role="group" aria-labelledby={`${id}-label`} className="grid gap-1">
			<span id={`${id}-label`} className="text-sm font-medium text-slate-900">
				<Translate text={labelKey} />
			</span>
			<div className="flex min-h-10 items-start gap-2 rounded-md border border-slate-200 bg-white px-2 py-1.5">
				<ul className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
					{chosen.length === 0 && (
						<li className="px-1 py-1 text-sm text-slate-400">
							<Translate text={chooseKey} />
						</li>
					)}
					{chosen.map((option) => (
						<li key={option.id} className="inline-flex max-w-full items-center gap-1 rounded-md bg-slate-100 py-0.5 pr-0.5 pl-2 text-xs font-medium text-slate-900">
							<span className="max-w-[12rem] truncate" title={option.label}>
								{option.label}
							</span>
							<button
								type="button"
								disabled={disabled}
								onClick={() => {
									setChecked(option.id, false);
									triggerRef.current?.focus();
								}}
								aria-label={t(localizationConstants.projectAtaRemoveReference, { name: option.label })}
								className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded text-slate-500 hover:bg-slate-200 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none disabled:cursor-not-allowed"
							>
								<X className="h-3 w-3" aria-hidden />
							</button>
						</li>
					))}
				</ul>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							ref={triggerRef}
							type="button"
							variant="ghost"
							size="icon"
							disabled={disabled}
							aria-label={t(chooseKey)}
							className="h-7 w-7 shrink-0 cursor-pointer text-slate-500"
						>
							<ChevronDown className="h-4 w-4" aria-hidden />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-72 border border-slate-200 bg-white p-1 shadow-md">
						{options.length === 0 ? (
							<p className="px-3 py-2 text-sm text-slate-500">
								<Translate text={localizationConstants.projectAtaNoReferenceOptions} />
							</p>
						) : (
							options.map((option) => (
								<DropdownMenuCheckboxItem
									key={option.id}
									checked={selected.includes(option.id)}
									onCheckedChange={(checked) => setChecked(option.id, checked === true)}
									onSelect={(event) => event.preventDefault()}
									className="cursor-pointer text-sm text-slate-900"
								>
									{option.label}
								</DropdownMenuCheckboxItem>
							))
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}

export default AtaReferenceSelect;
