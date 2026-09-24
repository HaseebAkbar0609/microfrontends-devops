"use client";

import { Plus, X } from "lucide-react";
import type { Control, FieldArrayWithId } from "react-hook-form";

import { FormInput } from "@/components/form";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { WarrantyFormValues } from "./warrantySchema";

export interface ReminderEmailFieldsProps {
	control: Control<WarrantyFormValues>;
	fields: FieldArrayWithId<WarrantyFormValues, "emails", "id">[];
	onAppend: () => void;
	onRemove: (index: number) => void;
	translateError: (message: string) => string;
}

/**
 * Påminnelse mail — one input per address, with the frame's "+ Lägg till fler
 * mail" action.
 *
 * The rows are objects rather than strings, which is what react-hook-form's
 * field arrays hold. There is always at least one, and the last row keeps no ✕,
 * so the field cannot be emptied into nothing. Each input is numbered for a
 * screen reader — otherwise every row announces the same name. A row left blank
 * is not an error; it is dropped on Spara.
 */
export function ReminderEmailFields({ control, fields, onAppend, onRemove, translateError }: ReminderEmailFieldsProps) {
	const t = useTranslate();

	return (
		<div className="grid gap-2">
			<div className="flex items-center justify-between gap-3">
				<span className="text-sm font-medium text-slate-900">
					<Translate text={localizationConstants.projectWarrantyRuleEmails} />
				</span>
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
				<div key={field.id} className="flex items-start gap-2">
					<FormInput
						control={control}
						name={`emails.${index}.value` as const}
						type="email"
						className="min-w-0 flex-1"
						translateError={translateError}
						inputProps={{ "aria-label": `${t(localizationConstants.projectWarrantyRuleEmails)} ${index + 1}` }}
					/>
					{fields.length > 1 && (
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => onRemove(index)}
							aria-label={`${t(localizationConstants.removeReminderEmail)} ${index + 1}`}
							className="h-10 w-10 shrink-0 cursor-pointer text-slate-500 hover:text-slate-900"
						>
							<X className="h-4 w-4" aria-hidden />
						</Button>
					)}
				</div>
			))}
		</div>
	);
}

export default ReminderEmailFields;
