"use client";

import { Translate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type { BookingKind } from "../types/bookMachine.types";

const BOOKING_KINDS: { value: BookingKind; labelKey: TranslationKeys }[] = [
	{ value: "internal", labelKey: localizationConstants.machineBookInternal },
	{ value: "external", labelKey: localizationConstants.machineBookExternal },
];

/**
 * "Intern / Extern" — whether the machine is taken from the own fleet or hired
 * in. Switching swaps the catalogue in both panes.
 */
export function BookingKindRadio({
	kind,
	onChange,
}: {
	kind: BookingKind;
	onChange: (kind: BookingKind) => void;
}) {
	return (
		<div className="rounded-lg border border-slate-200 bg-white p-4">
			<div
				role="radiogroup"
				className="grid grid-cols-1 gap-3 sm:grid-cols-2"
			>
				{BOOKING_KINDS.map((option) => (
					<button
						key={option.value}
						type="button"
						role="radio"
						aria-checked={kind === option.value}
						onClick={() => onChange(option.value)}
						className={`flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2.5 text-sm transition-colors ${
							kind === option.value
								? "border-slate-900 text-slate-900"
								: "border-slate-200 text-slate-600 hover:border-slate-300"
						}`}
					>
						<span
							className={`flex h-4 w-4 items-center justify-center rounded-full border ${
								kind === option.value
									? "border-slate-900"
									: "border-slate-300"
							}`}
						>
							{kind === option.value && (
								<span className="h-2 w-2 rounded-full bg-slate-900" />
							)}
						</span>
						<Translate text={option.labelKey} />
					</button>
				))}
			</div>
		</div>
	);
}
