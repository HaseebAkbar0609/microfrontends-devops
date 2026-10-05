"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { Check, Search } from "lucide-react";
import type { Control } from "react-hook-form";
import { useController, useWatch } from "react-hook-form";
import { useDebounce } from "@/components/hooks/useDebounce";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { REQUESTER_SEARCH_DEBOUNCE_MS } from "../../constants/support.constants";
import type { SupportTicketFormValues } from "../../schemas/supportTicket.schema";
import type { SupportCustomerType } from "../../types";
import { searchRequesters, type Requester } from "../../utils/requesterSearch";

/** Each register searches different columns, so the placeholder names the ones that match. */
const PLACEHOLDER_KEYS: Record<SupportCustomerType, TranslationKeys> = {
	private: localizationConstants.supportFieldCustomerPlaceholderPrivate,
	professional: localizationConstants.supportFieldCustomerPlaceholderProfessional,
};

const MUTED = "text-slate-500";

/** Where the field stands, as one line: linked, searching, failed, empty, or the hint. */
function getStatusLine(
	linked: boolean,
	searching: boolean,
	results: UseQueryResult<Requester[]>,
): { textKey: TranslationKeys; className: string } {
	if (linked) {
		return { textKey: localizationConstants.supportRequesterLinked, className: "font-medium text-emerald-700" };
	}
	if (searching && results.isPending) {
		return { textKey: localizationConstants.supportRequesterSearching, className: MUTED };
	}
	if (searching && results.isError) {
		return { textKey: localizationConstants.supportRequesterSearchFailed, className: "text-red-600" };
	}
	if (searching && results.data?.length === 0) {
		return { textKey: localizationConstants.supportRequesterNoResults, className: MUTED };
	}
	return { textKey: localizationConstants.supportRequesterHint, className: MUTED };
}

type RequesterPickerProps = {
	control: Control<SupportTicketFormValues>;
	customerType: SupportCustomerType;
};

/**
 * The customer field: type to search the private or professional register and
 * pick a record. Typing after a pick drops the link, so the id can never point
 * at a record the name no longer matches. A name with no match is still valid.
 */
export function RequesterPicker({ control, customerType }: RequesterPickerProps) {
	const t = useTranslate();
	const { field: idField } = useController({ control, name: "customerId" });
	const typed = useWatch({ control, name: "customer" }) ?? "";
	const term = useDebounce(typed.trim(), REQUESTER_SEARCH_DEBOUNCE_MS);
	const enabled = term.length > 0 && !idField.value;

	const results = useQuery({
		queryKey: ["support-requesters", customerType, term],
		queryFn: () => searchRequesters(customerType, term),
		enabled,
	});
	const linked = Boolean(idField.value);
	const status = getStatusLine(linked, enabled, results);

	return (
		<FormField
			control={control}
			name="customer"
			render={({ field }) => (
				<FormItem className="grid gap-2 @2xl:col-span-2">
					<FormLabel>
						<Translate text={localizationConstants.supportFieldCustomer} />
					</FormLabel>
					<div className="relative">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<FormControl>
							<Input
								{...field}
								autoComplete="off"
								className="pl-9"
								placeholder={t(PLACEHOLDER_KEYS[customerType])}
								onChange={(event) => {
									field.onChange(event);
									if (idField.value) idField.onChange("");
								}}
							/>
						</FormControl>
					</div>

					{/* Always mounted, so screen readers announce each change of state. */}
					<p
						role="status"
						className={cn("inline-flex items-center gap-1.5 text-xs", status.className)}
					>
						{linked ? <Check className="h-3.5 w-3.5" /> : null}
						<Translate text={status.textKey} />
					</p>
					{enabled && results.data?.length ? (
						<ul className="grid gap-2 @2xl:grid-cols-2">
							{results.data.map((requester) => (
								<li key={requester.id}>
									<button
										type="button"
										onClick={() => {
											field.onChange(requester.name);
											idField.onChange(requester.id);
										}}
										className="w-full cursor-pointer rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50"
									>
										<p className="truncate text-sm font-medium text-slate-900">
											{requester.name}
										</p>
										<p className="truncate text-xs text-slate-500">
											{requester.detail}
										</p>
									</button>
								</li>
							))}
						</ul>
					) : null}

					<FormMessage translate={t} />
				</FormItem>
			)}
		/>
	);
}
