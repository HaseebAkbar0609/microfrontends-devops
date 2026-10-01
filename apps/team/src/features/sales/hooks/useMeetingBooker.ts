"use client";

import { useCallback, useMemo, useState } from "react";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { SalesActivity, SalesCompany, SalesEmailTemplate } from "../types";
import { createId } from "../utils/salesFactories";
import { getCallList, getMeetingBookerStats } from "../utils/meetingBooker";
import { buildMailtoLink, renderTemplate } from "../utils/salesTemplates";
import { useSalesSettings } from "./useSalesSettings";
import { useSalesCompanies } from "./useSalesCompanies";
import { useMeetingBookerNames } from "./useSalesTeam";
import { useTodayKey } from "./useTodayKey";

/**
 * State and actions for the meeting booker workspace.
 *
 * Everything is derived from the shared CRM companies, so a logged call shows
 * up in the counters, the reminders and the statistics at once.
 */
export function useMeetingBooker() {
	const { companies, addActivity: appendActivity, updateActivity } = useSalesCompanies();
	const t = useTranslate();
	const bookerNames = useMeetingBookerNames();
	const { calendlyLink, templates } = useSalesSettings();
	const [selectedBooker, setBooker] = useState("");
	// Falls back to the first booker when none is picked yet, or when the picked
	// one is removed or given another role on the sales organisation page.
	const booker = bookerNames.includes(selectedBooker)
		? selectedBooker
		: (bookerNames[0] ?? "");
	const [category, setCategory] = useState("");
	const [region, setRegion] = useState("");
	const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

	const todayKey = useTodayKey();

	const callList = useMemo(
		() => getCallList(companies, { category, region }),
		[companies, category, region],
	);
	const stats = useMemo(
		() => getMeetingBookerStats(companies, todayKey, bookerNames),
		[companies, todayKey, bookerNames],
	);
	const selectedCompany = useMemo(
		() => companies.find((company) => company.id === selectedCompanyId) ?? null,
		[companies, selectedCompanyId],
	);

	const addActivity = useCallback(
		(company: SalesCompany, patch: Partial<SalesActivity>) => {
			const activity: SalesActivity = {
				id: createId("sa"),
				date: new Date().toISOString(),
				type: "note",
				text: "",
				followUpAt: "",
				done: false,
				booker,
				...patch,
			};
			void appendActivity(company.id, activity);
		},
		[appendActivity, booker],
	);

	const logCall = useCallback(
		(company: SalesCompany, text: string) => {
			addActivity(company, { type: "call", text: text.trim() });
			showToast("success", t(localizationConstants.salesBookerCallLoggedToast));
		},
		[addActivity, t],
	);

	const bookMeeting = useCallback(
		(company: SalesCompany, meetingAt: string, text: string) => {
			addActivity(company, {
				type: "meeting",
				text: text.trim(),
				meetingAt: new Date(meetingAt).toISOString(),
			});
			showToast("success", t(localizationConstants.salesBookerMeetingBookedToast));
		},
		[addActivity, t],
	);

	const saveReminder = useCallback(
		(company: SalesCompany, followUpAt: string, text: string) => {
			addActivity(company, { type: "note", text: text.trim(), followUpAt });
			showToast("success", t(localizationConstants.salesBookerReminderSavedToast));
		},
		[addActivity, t],
	);

	const sendPresentation = useCallback(
		(company: SalesCompany, template: SalesEmailTemplate) => {
			const { subject, body } = renderTemplate(template, company, calendlyLink, booker);
			window.location.href = buildMailtoLink(company.email, subject, body);
			addActivity(company, {
				type: "email",
				text: t(localizationConstants.salesBookerPresentationLogged).replace("{name}", template.name),
			});
		},
		[addActivity, booker, calendlyLink, t],
	);

	const completeReminder = useCallback(
		(companyId: string, activityId: string) => {
			void updateActivity(companyId, activityId, { done: true });
		},
		[updateActivity],
	);

	return {
		booker,
		bookerNames,
		setBooker,
		category,
		setCategory,
		region,
		setRegion,
		callList,
		stats,
		todayKey,
		selectedCompany,
		selectCompany: setSelectedCompanyId,
		logCall,
		bookMeeting,
		saveReminder,
		completeReminder,
		templates,
		sendPresentation,
	};
}
