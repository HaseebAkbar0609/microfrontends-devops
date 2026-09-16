import { CheckCheck, Mail, MailOpen, type LucideIcon } from "lucide-react";

import type { QAThreadLabels } from "@/components/common/QAThreadCard";
import type { QAThreadStatus } from "@/components/common/QAThreadColumn";
import type {
	QAThreadCreateDialogLabels,
	QAThreadOption,
} from "@/components/common/QAThreadCreateDialog";
import type {
	QAThreadFilterChipsLabels,
	QAThreadStatusOption,
} from "@/components/common/QAThreadFilterChips";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type {
	ProjectQaFunction,
	ProjectQaRole,
	ProjectQaType,
	ProjectQuestion,
} from "./types";

export const PROJECT_QA_ROLE_LABELS: Record<ProjectQaRole, TranslationKeys> = {
	UE: localizationConstants.projectQaRoleUe,
	Beställare: localizationConstants.projectQaRoleClient,
	Fråga: localizationConstants.projectQaRoleQuestion,
	Supplier: localizationConstants.projectQaRoleSupplier,
};

/** The shared card's wording on the Alla tab. */
export const PROJECT_QA_CARD_LABELS: QAThreadLabels = {
	markAsRead: localizationConstants.projectQaMarkAsRead,
	archive: localizationConstants.projectQaArchiveAction,
	delete: localizationConstants.projectQaDeleteAction,
	leaveComment: localizationConstants.projectQaLeaveComment,
	send: localizationConstants.projectQaSend,
	cancel: localizationConstants.cancel,
	answerBadge: localizationConstants.projectQaAdmin,
	answerSubLabel: localizationConstants.projectQaYou,
	badges: PROJECT_QA_ROLE_LABELS,
};

/**
 * On Arkiv the archive slot takes a question back out. Purchase's board keeps
 * "Arkivera" there, which reads as the opposite of what the click does.
 */
export const PROJECT_QA_ARCHIVE_CARD_LABELS: QAThreadLabels = {
	...PROJECT_QA_CARD_LABELS,
	archive: localizationConstants.projectQaUnarchiveAction,
};

export interface ProjectQaColumn {
	status: QAThreadStatus;
	labelKey: TranslationKeys;
	icon: LucideIcon;
	/** Only New carries the count pill in the frame — the unread figure. */
	showCount: boolean;
	className?: string;
}

export const PROJECT_QA_COLUMNS: ProjectQaColumn[] = [
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
		showCount: false,
	},
	{
		status: "answered",
		labelKey: localizationConstants.projectQaColAnswered,
		icon: CheckCheck,
		showCount: false,
		className: "md:col-span-2 xl:col-span-1",
	},
];

export const PROJECT_QA_STATUS_OPTIONS: QAThreadStatusOption[] =
	PROJECT_QA_COLUMNS.map((column) => ({
		value: column.status,
		label: column.labelKey,
	}));

export const PROJECT_QA_CHIP_LABELS: QAThreadFilterChipsLabels = {
	company: localizationConstants.projectQaFilterCompany,
	role: localizationConstants.projectQaFilterRole,
	status: localizationConstants.statusLabel,
	reset: localizationConstants.projectQaFilterReset,
};

interface Option<T extends string> extends QAThreadOption {
	value: T;
}

export const PROJECT_QA_TYPE_OPTIONS: Option<ProjectQaType>[] = [
	{ value: "project", label: localizationConstants.projectQaTypeProject },
	{ value: "order", label: localizationConstants.projectQaTypeOrder },
];

/** The trades the calculation module's identical "Ny fråga" modal offers. */
export const PROJECT_QA_FUNCTION_OPTIONS: Option<ProjectQaFunction>[] = [
	{ value: "construction", label: localizationConstants.projectQaFunctionConstruction },
	{ value: "electrical", label: localizationConstants.projectQaFunctionElectrical },
	{ value: "groundwork", label: localizationConstants.projectQaFunctionGroundwork },
	{ value: "painting", label: localizationConstants.projectQaFunctionPainting },
	{ value: "ventilation", label: localizationConstants.projectQaFunctionVentilation },
	{ value: "plumbing", label: localizationConstants.projectQaFunctionPlumbing },
];

export const PROJECT_QA_CREATE_LABELS: QAThreadCreateDialogLabels = {
	title: localizationConstants.projectQaCreateTitle,
	type: localizationConstants.projectQaFieldType,
	subject: localizationConstants.projectQaFieldFunction,
	subjectPlaceholder: localizationConstants.projectQaFunctionPlaceholder,
	description: localizationConstants.projectQaFieldDescription,
	descriptionPlaceholder: localizationConstants.projectQaFieldDescription,
	cancel: localizationConstants.cancel,
	send: localizationConstants.projectQaSend,
};

/**
 * Filter ▾ lists Typ and Funktion values in one single-select list, as the
 * project list's Filter lists Kategori and Avdelning together. The prefix keeps
 * the two sets apart, so a value can never match the wrong field.
 */
const TYPE_FILTER_PREFIX = "type:";
const FUNCTION_FILTER_PREFIX = "function:";

export const PROJECT_QA_FILTER_ENTRIES: { value: string; label: TranslationKeys }[] = [
	...PROJECT_QA_TYPE_OPTIONS.map((option) => ({
		value: `${TYPE_FILTER_PREFIX}${option.value}`,
		label: option.label,
	})),
	...PROJECT_QA_FUNCTION_OPTIONS.map((option) => ({
		value: `${FUNCTION_FILTER_PREFIX}${option.value}`,
		label: option.label,
	})),
];

/** Whether a question passes the Filter ▾ selection; no selection passes all. */
export function matchesQaFilter(
	question: ProjectQuestion,
	filter: string | null,
): boolean {
	if (!filter) return true;
	if (filter.startsWith(TYPE_FILTER_PREFIX)) {
		return question.type === filter.slice(TYPE_FILTER_PREFIX.length);
	}
	if (filter.startsWith(FUNCTION_FILTER_PREFIX)) {
		return question.function === filter.slice(FUNCTION_FILTER_PREFIX.length);
	}
	return true;
}
