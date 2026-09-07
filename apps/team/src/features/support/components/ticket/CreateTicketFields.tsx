"use client";

import { useMemo } from "react";
import type { Control } from "react-hook-form";
import { FormInput, FormSelect, FormTextarea } from "@/components/form";
import type { FormSelectOption } from "@/components/form";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { SUPPORT_COUNTRIES } from "../../constants/support.constants";
import {
	SUPPORT_CHANNELS,
	TICKET_PRIORITIES,
} from "../../constants/supportStatuses";
import { NO_SELECTION } from "../../schemas/supportTicket.schema";
import type { SupportTicketFormValues } from "../../schemas/supportTicket.schema";
import type { SupportAgent } from "../../types";

type CreateTicketFieldsProps = {
	control: Control<SupportTicketFormValues>;
	availableAgents: SupportAgent[];
};

function toOptions(
	entries: { id: string; labelKey: string }[],
): FormSelectOption[] {
	return entries.map((entry) => ({
		value: entry.id,
		label: <Translate text={entry.labelKey} />,
	}));
}

const CUSTOMER_TYPE_OPTIONS: FormSelectOption[] = [
	{
		value: "private",
		label: <Translate text={localizationConstants.supportCustomerPrivateOption} />,
	},
	{
		value: "craftsman",
		label: <Translate text={localizationConstants.supportCustomerCraftsman} />,
	},
];

const LINE_OPTIONS: FormSelectOption[] = [
	{
		value: "first",
		label: <Translate text={localizationConstants.supportLineFirstOption} />,
	},
	{
		value: "second",
		label: <Translate text={localizationConstants.supportLineSecondOption} />,
	},
];

export function CreateTicketFields({
	control,
	availableAgents,
}: CreateTicketFieldsProps) {
	const assigneeOptions = useMemo<FormSelectOption[]>(
		() => [
			{
				value: NO_SELECTION,
				label: <Translate text={localizationConstants.supportUnassigned} />,
			},
			...availableAgents.map((agent) => ({
				value: agent.id,
				label: agent.name,
			})),
		],
		[availableAgents],
	);

	return (
		<div className="grid gap-4 @2xl:grid-cols-2">
			<FormInput
				control={control}
				name="subject"
				label={localizationConstants.supportFieldSubject}
				placeholder={localizationConstants.supportFieldSubjectPlaceholder}
				className="@2xl:col-span-2"
			/>
			<FormInput
				control={control}
				name="customer"
				label={localizationConstants.supportFieldCustomer}
				placeholder={localizationConstants.supportFieldCustomerPlaceholder}
			/>
			<FormSelect
				control={control}
				name="customerType"
				label={localizationConstants.supportFieldCustomerType}
				options={CUSTOMER_TYPE_OPTIONS}
			/>
			<FormSelect
				control={control}
				name="channel"
				label={localizationConstants.supportFieldChannel}
				options={toOptions(SUPPORT_CHANNELS)}
			/>
			<FormSelect
				control={control}
				name="priority"
				label={localizationConstants.supportFieldPriority}
				options={toOptions(TICKET_PRIORITIES)}
			/>
			<FormSelect
				control={control}
				name="line"
				label={localizationConstants.supportFieldLine}
				options={LINE_OPTIONS}
			/>
			<FormSelect
				control={control}
				name="country"
				label={localizationConstants.supportFieldCountry}
				options={SUPPORT_COUNTRIES.map((country) => ({
					value: country,
					label: country,
				}))}
			/>
			<FormSelect
				control={control}
				name="assigneeId"
				label={localizationConstants.supportFieldAssignee}
				options={assigneeOptions}
			/>
			<FormTextarea
				control={control}
				name="description"
				label={localizationConstants.supportFieldDescription}
				placeholder={localizationConstants.supportFieldDescriptionPlaceholder}
				rows={5}
				className="@2xl:col-span-2"
			/>
		</div>
	);
}
