"use client";

import type {
	FieldArrayWithId,
	FieldErrors,
	UseFormRegister,
} from "react-hook-form";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { WARRANTY_CONSTANTS } from "../../constants/warranty.constants";
import type { VisitDateFormData } from "./useVisitDateForm";

export interface VisitDateEmailFieldsProps {
	fields: FieldArrayWithId<VisitDateFormData, "emails", "id">[];
	register: UseFormRegister<VisitDateFormData>;
	/** RHF's own shape for this path — an array of row errors, or one for the array. */
	errors?: FieldErrors<VisitDateFormData>["emails"];
	onAppend: () => void;
	onRemove: (index: number) => void;
}

/**
 * Påminnelse mail — one input per address, with the frame's
 * "+ Lägg till fler mail" action.
 *
 * The two features this was merged from both used a dropdown recipient picker
 * here, which is not what the design asks for. Nothing else in the app repeats
 * a text input this way, so this is the pattern rather than a copy of one.
 */
export function VisitDateEmailFields({
	fields,
	register,
	errors,
	onAppend,
	onRemove,
}: VisitDateEmailFieldsProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-col gap-1.5">
			<div className="flex items-center justify-between gap-3">
				<Label className="font-sans text-sm leading-5 font-medium tracking-normal text-slate-900">
					<Translate text={localizationConstants.reminderEmailLabel} />
				</Label>
				<Button
					type="button"
					variant="ghost"
					onClick={onAppend}
					className="h-8 cursor-pointer gap-1.5 px-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
				>
					<Plus className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.addMoreReminderEmails} />
				</Button>
			</div>

			{fields.map((field, index) => (
				<div key={field.id} className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<Input
							type="email"
							{...register(`emails.${index}.value` as const)}
							placeholder={WARRANTY_CONSTANTS.DEFAULT_FALLBACK_EMAIL}
							/* Numbered — otherwise every row announces the same name. */
							aria-label={`${t(localizationConstants.reminderEmailLabel)} ${index + 1}`}
							className="h-11 flex-1 rounded-lg border-slate-200 bg-white text-sm shadow-none"
						/>
						{fields.length > 1 && (
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => onRemove(index)}
								aria-label={`${t(localizationConstants.removeReminderEmail)} ${index + 1}`}
								className="h-8 w-8 shrink-0 cursor-pointer p-0 text-slate-400 hover:bg-transparent hover:text-slate-700"
							>
								<X className="h-4 w-4" aria-hidden />
							</Button>
						)}
					</div>
					{errors?.[index]?.value && (
						<span className="text-xs font-medium text-red-500">
							{errors[index]?.value?.message}
						</span>
					)}
				</div>
			))}
		</div>
	);
}

export default VisitDateEmailFields;
