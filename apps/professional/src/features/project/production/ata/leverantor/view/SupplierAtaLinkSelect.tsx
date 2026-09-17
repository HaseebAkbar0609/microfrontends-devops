"use client";

import { useId } from "react";
import { useController, type Control } from "react-hook-form";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SUPPLIER_NO_LINK } from "../supplierAta.config";
import type { SupplierAtaFormValues } from "./supplierAtaFormSchema";

export interface SupplierAtaLinkSelectProps {
	control: Control<SupplierAtaFormValues>;
	customerAtas: { id: string; number: number }[];
	disabled: boolean;
}

/**
 * "Koppla Äta": which of the project's own ÄTAs this supplier ÄTA belongs to,
 * or none. The customer list's "Kopplad Lev-äta" reads the same link.
 */
export function SupplierAtaLinkSelect({ control, customerAtas, disabled }: SupplierAtaLinkSelectProps) {
	const t = useTranslate();
	const labelId = useId();
	const errorId = useId();
	const { field, fieldState } = useController({ control, name: "linkedCustomerAtaId" });
	const error = fieldState.error?.message;

	return (
		<div className="flex flex-col gap-2">
			<span id={labelId} className="text-sm font-medium text-slate-900">
				<Translate text={localizationConstants.viewAtaLinkAtaLabel} />
			</span>
			<Select
				value={field.value ?? SUPPLIER_NO_LINK}
				onValueChange={(value) => field.onChange(value === SUPPLIER_NO_LINK ? null : value)}
				disabled={disabled}
			>
				<SelectTrigger
					ref={field.ref}
					onBlur={field.onBlur}
					aria-labelledby={labelId}
					aria-invalid={Boolean(error)}
					aria-describedby={error ? errorId : undefined}
					className="h-10 w-full cursor-pointer bg-white"
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={SUPPLIER_NO_LINK}>
						<Translate text={localizationConstants.projectAtaSupplierNoLink} />
					</SelectItem>
					{customerAtas.map((customerAta) => (
						<SelectItem key={customerAta.id} value={customerAta.id}>
							{t(localizationConstants.projectAtaLabel, { number: customerAta.number })}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{error && (
				<p id={errorId} className="text-sm text-red-600">
					<Translate text={error as TranslationKeys} />
				</p>
			)}
		</div>
	);
}

export default SupplierAtaLinkSelect;
