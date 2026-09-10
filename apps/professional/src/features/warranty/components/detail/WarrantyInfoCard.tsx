"use client";

import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { WarrantyRow } from "../../types/warranty.types";

/** The glyph the frame prints where a record has no value for a field. */
const EMPTY_VALUE = "-";

/**
 * One read-only label/value pair.
 *
 * The purchase module has an `InfoField` of its own, but it draws a white card
 * header where this frame draws a grey bar, and these two Order screens are
 * already merged against this markup. Sharing the two would move pixels on
 * shipped screens, so this stays local until someone reconciles the treatments.
 */
function WarrantyField({
	labelKey,
	value,
}: {
	labelKey: TranslationKeys;
	value?: string;
}) {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
				<Translate text={labelKey} />
			</span>
			<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 wrap-break-word">
				{value?.trim() ? value : EMPTY_VALUE}
			</span>
		</div>
	);
}

/**
 * Garantiinformation — the frame's four-column key-value grid.
 *
 * The columns hold three, three, two and two fields, which is the frame's own
 * uneven layout rather than a wrap; declaring them keeps that without eleven
 * copies of the same markup.
 */
export function WarrantyInfoCard({ warranty }: { warranty: WarrantyRow }) {
	const columns: { labelKey: TranslationKeys; value?: string }[][] = [
		[
			{
				labelKey: localizationConstants.projectLabel,
				value: warranty.recordNo,
			},
			{
				labelKey: localizationConstants.warrantyResponsibleLabel,
				value: warranty.warrantyResponsible,
			},
			{ labelKey: localizationConstants.mobileLabel, value: warranty.phone },
		],
		[
			{
				labelKey: localizationConstants.colProjectName,
				value: warranty.recordName,
			},
			{
				labelKey: localizationConstants.orderStart,
				value: warranty.startDate,
			},
			{ labelKey: localizationConstants.mailLabel, value: warranty.email },
		],
		[
			{
				labelKey: localizationConstants.orderCustomer,
				value: warranty.customer,
			},
			{
				labelKey: localizationConstants.colApproved,
				value: warranty.approvedDate,
			},
		],
		[
			{
				labelKey: localizationConstants.contactPersonSection,
				value: warranty.contactPerson,
			},
			{
				labelKey: localizationConstants.colWarrantyPeriod,
				/* The frame prints the period and the end date in one field. */
				value: [warranty.warrantyPeriod, warranty.warrantyEndDate]
					.filter(Boolean)
					.join(" / "),
			},
		],
	];

	return (
		<div className="overflow-hidden rounded-lg border border-slate-200 bg-white w-full shadow-2xs">
			<div className="flex h-14 min-h-14 w-full items-center bg-slate-100 px-4 sm:px-6 font-sans font-medium text-sm leading-5 tracking-normal text-slate-900 border-b border-slate-200">
				<h2>
					<Translate text={localizationConstants.warrantyInfoSection} />
				</h2>
			</div>

			<div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6 sm:gap-x-8 text-sm">
				{columns.map((fields, index) => (
					<div
						/* Fixed layout positions, so the index is the identity. */
						key={`warranty-info-column-${index}`}
						className="space-y-4"
					>
						{fields.map((field) => (
							<WarrantyField
								key={field.labelKey}
								labelKey={field.labelKey}
								value={field.value}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

export default WarrantyInfoCard;
