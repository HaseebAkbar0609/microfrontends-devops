"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { getTicketHref } from "../constants/supportNav";
import {
	EMPTY_SUPPORT_TICKET_DRAFT,
	NO_SELECTION,
	supportTicketDraftSchema,
	type SupportTicketFormValues,
} from "../schemas/supportTicket.schema";
import { useSupportTickets } from "./useSupportTickets";

/**
 * Draft, validation and submit for registering a ticket. The page stays layout
 * and wiring.
 */
export function useCreateTicketForm() {
	const { agents, createTicket } = useSupportTickets();
	const router = useRouter();
	const t = useTranslate();

	const form = useForm<SupportTicketFormValues>({
		resolver: zodResolver(supportTicketDraftSchema),
		defaultValues: EMPTY_SUPPORT_TICKET_DRAFT,
		mode: "onSubmit",
	});

	const line = form.watch("line");
	const customerType = form.watch("customerType");
	const assigneeId = form.watch("assigneeId");

	/** Agents are listed per line, so a line change can strand the selection. */
	const availableAgents = agents.filter((agent) => agent.line === line);

	useEffect(() => {
			if (assigneeId === NO_SELECTION) return;
		if (availableAgents.some((agent) => agent.id === assigneeId)) return;
		form.setValue("assigneeId", NO_SELECTION);
	}, [assigneeId, availableAgents, form]);

	/** A picked record belongs to one register, so switching type drops it. */
	useEffect(() => {
		form.setValue("customerId", "");
	}, [customerType, form]);

	const submit = form.handleSubmit((values) => {
		const ticketId = createTicket({
			...values,
			assigneeId:
				values.assigneeId === NO_SELECTION ? null : values.assigneeId,
			customerId: values.customerId || null,
		});
		showToast("success", t(localizationConstants.supportTicketCreatedToast));
		router.push(getTicketHref(ticketId));
	});

	return { form, submit, availableAgents, customerType };
}
