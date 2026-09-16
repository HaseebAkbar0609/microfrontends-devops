import type { LucideIcon } from "lucide-react";
import { CheckCheck, Mail, MailOpen } from "lucide-react";

import type { QAThreadLabels } from "@/components/common/QAThreadCard";
import type { QAThreadStatus } from "@/components/common/QAThreadColumn";
import type {
	QAThreadCreateLabels,
	QAThreadCreateOption,
} from "@/components/common/QAThreadCreateDialog";
import type {
	QAThreadFilterChipsLabels,
	QAThreadStatusOption,
} from "@/components/common/QAThreadFilterChips";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type { OrderQaFunction, OrderQaRole, OrderQaType, OrderQuestion } from "./types";

export interface OrderQaColumnConfig {
	status: QAThreadStatus;
	labelKey: TranslationKeys;
	icon: LucideIcon;
	showCount?: boolean;
	className?: string;
}

export const ORDER_QA_COLUMNS: readonly OrderQaColumnConfig[] = [
	{
		status: "new",
		labelKey: localizationConstants.projectQaColNew,
		icon: Mail,
		showCount: true,
	},
	{
		status: "opened",
		labelKey: localizationConstants.projectQaColOpened,
		icon: MailOpen,
	},
	{
		status: "answered",
		labelKey: localizationConstants.projectQaColAnswered,
		icon: CheckCheck,
		className: "md:col-span-2 xl:col-span-1",
	},
] as const;

export const ORDER_QA_ROLE_LABELS: Record<OrderQaRole, TranslationKeys> = {
	UE: localizationConstants.projectQaRoleUe,
	Supplier: localizationConstants.projectQaRoleSupplier,
	Beställare: localizationConstants.projectQaRoleClient,
	Fråga: localizationConstants.projectQaRoleQuestion,
};

export const ORDER_QA_CARD_LABELS: QAThreadLabels = {
	markAsRead: localizationConstants.projectQaMarkAsRead,
	archive: localizationConstants.projectQaArchiveAction,
	delete: localizationConstants.projectQaDeleteAction,
	leaveComment: localizationConstants.projectQaLeaveComment,
	send: localizationConstants.projectQaSend,
	cancel: localizationConstants.cancel,
	answerBadge: localizationConstants.projectQaAdmin,
	answerSubLabel: localizationConstants.projectQaYou,
	badges: {
		UE: localizationConstants.projectQaRoleUe,
		Beställare: localizationConstants.projectQaRoleClient,
		Fråga: localizationConstants.projectQaRoleQuestion,
		Supplier: localizationConstants.projectQaRoleSupplier,
	},
};

export const ORDER_QA_ARCHIVE_CARD_LABELS: QAThreadLabels = {
	...ORDER_QA_CARD_LABELS,
	archive: localizationConstants.projectQaUnarchiveAction,
};

export const ORDER_QA_CHIP_LABELS: QAThreadFilterChipsLabels = {
	company: localizationConstants.projectQaFilterCompany,
	role: localizationConstants.projectQaFilterRole,
	status: localizationConstants.status,
	reset: localizationConstants.projectQaFilterReset,
};

export const ORDER_QA_STATUS_OPTIONS: QAThreadStatusOption[] = [
	{ value: "new", label: localizationConstants.projectQaColNew },
	{ value: "opened", label: localizationConstants.projectQaColOpened },
	{ value: "answered", label: localizationConstants.projectQaColAnswered },
];

export const ORDER_QA_CREATE_LABELS: QAThreadCreateLabels = {
	title: localizationConstants.projectQaCreateTitle,
	type: localizationConstants.projectQaFieldType,
	subject: localizationConstants.projectQaFieldFunction,
	subjectPlaceholder: localizationConstants.projectQaFunctionPlaceholder,
	description: localizationConstants.projectQaFieldDescription,
	descriptionPlaceholder: localizationConstants.projectQaFieldDescription,
	cancel: localizationConstants.cancel,
	send: localizationConstants.projectQaSend,
	submit: localizationConstants.projectQaSend,
};

export const ORDER_QA_TYPE_OPTIONS: readonly QAThreadCreateOption<OrderQaType>[] = [
	{ value: "project", label: localizationConstants.projectQaTypeProject },
	{ value: "order", label: localizationConstants.projectQaTypeOrder },
] as const;

export const ORDER_QA_FUNCTION_OPTIONS: readonly QAThreadCreateOption<OrderQaFunction>[] =
	[
		{
			value: "construction",
			label: localizationConstants.projectQaFunctionConstruction,
		},
		{
			value: "electrical",
			label: localizationConstants.projectQaFunctionElectrical,
		},
		{
			value: "groundwork",
			label: localizationConstants.projectQaFunctionGroundwork,
		},
		{
			value: "painting",
			label: localizationConstants.projectQaFunctionPainting,
		},
		{
			value: "ventilation",
			label: localizationConstants.projectQaFunctionVentilation,
		},
		{
			value: "plumbing",
			label: localizationConstants.projectQaFunctionPlumbing,
		},
	] as const;

export interface OrderQaFilterEntry {
	value: string;
	label: TranslationKeys;
	kind: "type" | "function";
}

export const ORDER_QA_FILTER_ENTRIES: readonly OrderQaFilterEntry[] = [
	...ORDER_QA_TYPE_OPTIONS.map((option) => ({
		value: option.value,
		label: option.label,
		kind: "type" as const,
	})),
	...ORDER_QA_FUNCTION_OPTIONS.map((option) => ({
		value: option.value,
		label: option.label,
		kind: "function" as const,
	})),
] as const;

export function matchesOrderQaFilter(
	question: OrderQuestion,
	filter: string | null,
): boolean {
	if (!filter) return true;
	const entry = ORDER_QA_FILTER_ENTRIES.find((item) => item.value === filter);
	if (!entry) return true;
	if (entry.kind === "type") return question.type === filter;
	return question.function === filter;
}
