"use client";

import { useQuery } from "@tanstack/react-query";
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
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { REQUESTER_SEARCH_DEBOUNCE_MS } from "../../constants/support.constants";
import type { SupportTicketFormValues } from "../../schemas/supportTicket.schema";
import type { SupportCustomerType } from "../../types";
import { searchRequesters } from "../../utils/requesterSearch";

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
								placeholder={t(localizationConstants.supportFieldCustomerPlaceholder)}
								onChange={(event) => {
									field.onChange(event);
									if (idField.value) idField.onChange("");
								}}
							/>
						</FormControl>
					</div>

					{idField.value ? (
						<p className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
							<Check className="h-3.5 w-3.5" />
							<Translate text={localizationConstants.supportRequesterLinked} />
						</p>
					) : (
						<p className="text-xs text-slate-500">
							<Translate text={localizationConstants.supportRequesterHint} />
						</p>
					)}

					{enabled && results.isPending ? (
						<p className="text-sm text-slate-500">
							<Translate text={localizationConstants.supportRequesterSearching} />
						</p>
					) : null}
					{enabled && results.isError ? (
						<p className="text-sm text-red-600">
							<Translate text={localizationConstants.supportRequesterSearchFailed} />
						</p>
					) : null}
					{enabled && results.data?.length === 0 ? (
						<p className="text-sm text-slate-500">
							<Translate text={localizationConstants.supportRequesterNoResults} />
						</p>
					) : null}
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
