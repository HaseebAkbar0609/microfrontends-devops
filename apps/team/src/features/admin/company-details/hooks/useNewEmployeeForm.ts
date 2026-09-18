"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	CONTACT_NO_DIGITS,
	CONTACT_NO_PREFIX,
	type OrganisationMember,
} from "../constants/organisation";
import {
	EMPTY_NEW_EMPLOYEE,
	newEmployeeSchema,
	type NewEmployeeValues,
} from "../schemas/newEmployee.schema";

const CONTACT_NO_PATTERN = new RegExp(`^${CONTACT_NO_PREFIX}(\\d+)$`);

/** The next free contact number, one above the highest in use (A001, A002 ...). */
export function getNextContactNo(members: OrganisationMember[]): string {
	const highest = members.reduce((max, member) => {
		const match = member.contactNo.match(CONTACT_NO_PATTERN);
		return match ? Math.max(max, Number(match[1])) : max;
	}, 0);
	return `${CONTACT_NO_PREFIX}${String(highest + 1).padStart(CONTACT_NO_DIGITS, "0")}`;
}

type UseNewEmployeeFormOptions = {
	members: OrganisationMember[];
	onCreated: (member: OrganisationMember) => void;
};

/** Draft, validation and submit for adding an employee. The dialog stays layout. */
export function useNewEmployeeForm({ members, onCreated }: UseNewEmployeeFormOptions) {
	const t = useTranslate();
	const form = useForm<NewEmployeeValues>({
		resolver: zodResolver(newEmployeeSchema),
		defaultValues: EMPTY_NEW_EMPLOYEE,
		mode: "onSubmit",
	});

	const reset = useCallback(() => form.reset(EMPTY_NEW_EMPLOYEE), [form]);

	const submit = form.handleSubmit((values) => {
		onCreated({
			...values,
			id: crypto.randomUUID(),
			contactNo: getNextContactNo(members),
		});
		showToast("success", t(localizationConstants.adminEmployeeAddedToast));
		reset();
	});

	return { form, submit, reset };
}
