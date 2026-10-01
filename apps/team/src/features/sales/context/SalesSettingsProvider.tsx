"use client";

import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { getSalesSettings, patchSalesSettings } from "../api/salesSettingsApi";
import { SALES_SETTINGS_SAVE_DELAY_MS } from "../constants/sales.constants";
import type { SalesEmailTemplate, SalesSettings } from "../types";
import { createId } from "../utils/salesFactories";
import { isValidLink } from "../utils/salesTemplates";

const SETTINGS_KEY = ["team-sales-settings"] as const;
const EMPTY_SETTINGS: SalesSettings = { calendlyLink: "", emailTemplates: [] };

export type SalesSettingsContextValue = {
	isLoading: boolean;
	isError: boolean;
	calendlyLink: string;
	setCalendlyLink: (link: string) => void;
	templates: SalesEmailTemplate[];
	addTemplate: () => void;
	updateTemplate: (
		templateId: string,
		patch: Partial<Omit<SalesEmailTemplate, "id">>,
	) => void;
	removeTemplate: (templateId: string) => void;
};

export const SalesSettingsContext =
	createContext<SalesSettingsContextValue | null>(null);

/**
 * Presentation emails and the booking link, shared by the whole sales team and
 * stored on the server. Edits show at once and are saved after a short pause;
 * a value the server would refuse (a broken link, a template without a name)
 * stays on screen with its inline error and is not sent.
 */
export function SalesSettingsProvider({ children }: { children: ReactNode }) {
	const client = useQueryClient();
	const t = useTranslate();
	const query = useQuery({ queryKey: SETTINGS_KEY, queryFn: getSalesSettings });
	// What this tab has edited, until the next reload. Null shows the server value.
	const [draft, setDraft] = useState<SalesSettings | null>(null);
	// The same draft, readable synchronously when two edits land before a render.
	const draftRef = useRef<SalesSettings | null>(null);
	const settings = draft ?? query.data ?? EMPTY_SETTINGS;
	const timers = useRef(new Map<keyof SalesSettings, ReturnType<typeof setTimeout>>());

	useEffect(() => {
		const pending = timers.current;
		return () => pending.forEach((timer) => clearTimeout(timer));
	}, []);

	const save = useCallback(<K extends keyof SalesSettings>(field: K, value: SalesSettings[K]) => {
		clearTimeout(timers.current.get(field));
		timers.current.set(field, setTimeout(async () => {
			timers.current.delete(field);
			try {
				const saved = await patchSalesSettings({ [field]: value });
				client.setQueryData(SETTINGS_KEY, saved);
			} catch {
				showToast("error", t(localizationConstants.salesSettingsSaveFailed));
			}
		}, SALES_SETTINGS_SAVE_DELAY_MS));
	}, [client, t]);

	const edit = useCallback((change: (current: SalesSettings) => SalesSettings) => {
		const current = draftRef.current
			?? client.getQueryData<SalesSettings>(SETTINGS_KEY)
			?? EMPTY_SETTINGS;
		const next = change(current);
		draftRef.current = next;
		setDraft(next);
		if (next.calendlyLink !== current.calendlyLink && isValidLink(next.calendlyLink)) {
			// Trimmed: the link check ignores surrounding spaces, the server does not.
			save("calendlyLink", next.calendlyLink.trim());
		}
		if (next.emailTemplates !== current.emailTemplates
			&& next.emailTemplates.every((template) => template.name.trim())) {
			save("emailTemplates", next.emailTemplates);
		}
	}, [client, save]);

	const setCalendlyLink = useCallback((link: string) => {
		edit((current) => ({ ...current, calendlyLink: link }));
	}, [edit]);

	const addTemplate = useCallback(() => {
		edit((current) => ({
			...current,
			emailTemplates: [
				...current.emailTemplates,
				{ id: createId("tpl"), name: "", subject: "", body: "" },
			],
		}));
	}, [edit]);

	const updateTemplate = useCallback(
		(templateId: string, patch: Partial<Omit<SalesEmailTemplate, "id">>) => {
			edit((current) => ({
				...current,
				emailTemplates: current.emailTemplates.map((template) =>
					template.id === templateId ? { ...template, ...patch } : template,
				),
			}));
		},
		[edit],
	);

	const removeTemplate = useCallback((templateId: string) => {
		edit((current) => ({
			...current,
			emailTemplates: current.emailTemplates.filter((template) => template.id !== templateId),
		}));
	}, [edit]);

	const value = useMemo<SalesSettingsContextValue>(
		() => ({
			isLoading: query.isPending,
			isError: query.isError,
			calendlyLink: settings.calendlyLink,
			setCalendlyLink,
			templates: settings.emailTemplates,
			addTemplate,
			updateTemplate,
			removeTemplate,
		}),
		[query.isPending, query.isError, settings.calendlyLink, settings.emailTemplates,
			setCalendlyLink, addTemplate, updateTemplate, removeTemplate],
	);

	return (
		<SalesSettingsContext.Provider value={value}>
			{children}
		</SalesSettingsContext.Provider>
	);
}
