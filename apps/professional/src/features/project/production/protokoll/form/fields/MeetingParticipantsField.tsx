"use client";

import { useId, useRef } from "react";
import { ChevronDown, X } from "lucide-react";
import { useController, type Control, type FieldPathByValue, type FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { ProjectPerson } from "../../../hooks/useProjectPeople";
import { PersonAvatar, PersonLabel } from "../../components/PersonLabel";

export interface MeetingParticipantsFieldProps<T extends FieldValues> {
	control: Control<T>;
	name: FieldPathByValue<T, string[]>;
	labelKey: TranslationKeys;
	people: ProjectPerson[];
	className?: string;
}

/**
 * "Lägg till deltagare" — the frames' chips. As ÄTA's reference select, the
 * chips and their × buttons sit beside the menu trigger, never inside it, so no
 * control is nested in another; the menu's checkbox items stay open while
 * several are picked. Names are the value, in the order they were added.
 */
export function MeetingParticipantsField<T extends FieldValues>({
	control,
	name,
	labelKey,
	people,
	className,
}: MeetingParticipantsFieldProps<T>) {
	const t = useTranslate();
	const id = useId();
	const triggerRef = useRef<HTMLButtonElement>(null);
	const { field } = useController({ control, name });
	const selected: string[] = field.value ?? [];

	const setChecked = (personName: string, checked: boolean) =>
		field.onChange(checked ? [...selected, personName] : selected.filter((value) => value !== personName));

	return (
		<div role="group" aria-labelledby={`${id}-label`} className={cn("grid gap-1", className)}>
			<span id={`${id}-label`} className="text-sm font-medium text-slate-900">
				<Translate text={labelKey} />
			</span>
			<div className="flex min-h-10 items-start gap-2 rounded-md border border-slate-200 bg-white px-2 py-1.5">
				<ul className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
					{selected.length === 0 && (
						<li className="px-1 py-1 text-sm text-slate-400">
							<Translate text={localizationConstants.projectProtocolParticipantsPlaceholder} />
						</li>
					)}
					{selected.map((personName) => (
						<li
							key={personName}
							className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-slate-100 py-0.5 pr-0.5 pl-1 text-xs font-medium text-slate-900"
						>
							<PersonAvatar name={personName} className="h-5 w-5 text-[9px]" />
							<span className="max-w-[12rem] truncate" title={personName}>
								{personName}
							</span>
							<button
								type="button"
								onClick={() => {
									setChecked(personName, false);
									triggerRef.current?.focus();
								}}
								aria-label={t(localizationConstants.projectProtocolRemoveParticipant, { name: personName })}
								className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded text-slate-500 hover:bg-slate-200 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none"
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
							aria-label={t(localizationConstants.projectProtocolParticipantsPlaceholder)}
							className="h-7 w-7 shrink-0 cursor-pointer text-slate-500"
						>
							<ChevronDown className="h-4 w-4" aria-hidden />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="max-h-72 w-72 overflow-y-auto border border-slate-200 bg-white p-1 shadow-md">
						{people.length === 0 ? (
							<p className="px-3 py-2 text-sm text-slate-500">
								<Translate text={localizationConstants.projectProtocolNoPeople} />
							</p>
						) : (
							people.map((person) => (
								<DropdownMenuCheckboxItem
									key={person.name}
									checked={selected.includes(person.name)}
									onCheckedChange={(checked) => setChecked(person.name, checked === true)}
									onSelect={(event) => event.preventDefault()}
									className="cursor-pointer text-sm"
								>
									<PersonLabel person={person} />
								</DropdownMenuCheckboxItem>
							))
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}

export default MeetingParticipantsField;
