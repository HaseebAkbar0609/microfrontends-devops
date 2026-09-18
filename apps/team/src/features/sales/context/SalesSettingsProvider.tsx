"use client";

import {
	createContext,
	useCallback,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import {
	DEFAULT_CALENDLY_LINK,
	SALES_EMAIL_TEMPLATES_SEED,
} from "../constants/salesSettings.mock";
import type { SalesEmailTemplate } from "../types";
import { createId } from "../utils/salesFactories";

export type SalesSettingsContextValue = {
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

/** Presentation emails and the booking link, shared by the whole sales module. */
export function SalesSettingsProvider({ children }: { children: ReactNode }) {
	const [calendlyLink, setCalendlyLink] = useState(DEFAULT_CALENDLY_LINK);
	const [templates, setTemplates] = useState<SalesEmailTemplate[]>(
		SALES_EMAIL_TEMPLATES_SEED,
	);

	const addTemplate = useCallback(() => {
		setTemplates((previous) => [
			...previous,
			{ id: createId("tpl"), name: "", subject: "", body: "" },
		]);
	}, []);

	const updateTemplate = useCallback(
		(templateId: string, patch: Partial<Omit<SalesEmailTemplate, "id">>) => {
			setTemplates((previous) =>
				previous.map((template) =>
					template.id === templateId ? { ...template, ...patch } : template,
				),
			);
		},
		[],
	);

	const removeTemplate = useCallback((templateId: string) => {
		setTemplates((previous) =>
			previous.filter((template) => template.id !== templateId),
		);
	}, []);

	const value = useMemo<SalesSettingsContextValue>(
		() => ({
			calendlyLink,
			setCalendlyLink,
			templates,
			addTemplate,
			updateTemplate,
			removeTemplate,
		}),
		[calendlyLink, templates, addTemplate, updateTemplate, removeTemplate],
	);

	return (
		<SalesSettingsContext.Provider value={value}>
			{children}
		</SalesSettingsContext.Provider>
	);
}
