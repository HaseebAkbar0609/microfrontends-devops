import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ACCESS_EMPTY_CELL } from "../../constants/access.constants";

export interface AccessField {
	label: TranslationKeys;
	/** A data value, not UI copy; empty or null shows a dash. */
	value: string | null;
}

/** Label over value pairs, in a row on wide screens and stacked on narrow ones. */
export function AccessFieldGrid({ fields }: { fields: AccessField[] }) {
	return (
		<dl className="grid gap-x-6 gap-y-4 p-4 sm:grid-cols-2 xl:grid-cols-4">
			{fields.map((field) => (
				<div key={field.label} className="min-w-0">
					<dt className="text-sm font-semibold text-slate-900">
						<Translate text={field.label} />
					</dt>
					<dd className="mt-1 break-words text-sm text-slate-500">{field.value || ACCESS_EMPTY_CELL}</dd>
				</div>
			))}
		</dl>
	);
}
