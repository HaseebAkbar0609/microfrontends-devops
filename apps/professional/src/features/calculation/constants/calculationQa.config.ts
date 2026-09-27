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
	CalculationQaFunction,
	CalculationQaRole,
	CalculationQaType,
	CalculationQuestion,
} from "../types/calculationQa";

export const CALCULATION_QA_ROLE_LABELS: Record<CalculationQaRole, TranslationKeys> = {
	UE: localizationConstants.calcQABadgeUE,
	Beställare: localizationConstants.calcQABadgeBestellare,
	Fråga: localizationConstants.calcQABadgeFraga,
	Supplier: localizationConstants.calcQABadgeSupplier,
};

/** Shared card copy for the Alla tab */
export const CALCULATION_QA_CARD_LABELS: QAThreadLabels = {
	markAsRead: localizationConstants.calcQAMarkAsRead,
	archive: localizationConstants.calcQAArchivera,
	delete: localizationConstants.calcQADelete,
	leaveComment: localizationConstants.calcQALeaveComment,
	send: localizationConstants.calcQASkicka,
	cancel: localizationConstants.cancel,
	answerBadge: localizationConstants.calcQAAdmin,
	answerSubLabel: localizationConstants.calcQAYou,
	badges: CALCULATION_QA_ROLE_LABELS,
};

/** Shared card copy for the Arkiv tab */
export const CALCULATION_QA_ARCHIVE_CARD_LABELS: QAThreadLabels = {
	...CALCULATION_QA_CARD_LABELS,
	archive: localizationConstants.calcQAUnarchiveAction,
};

export interface CalculationQaColumn {
	status: QAThreadStatus;
	labelKey: TranslationKeys;
	icon: LucideIcon;
	showCount: boolean;
	className?: string;
}

export const CALCULATION_QA_COLUMNS: CalculationQaColumn[] = [
	{
		status: "new",
		labelKey: localizationConstants.calcQAColNew,
		icon: Mail,
		showCount: true,
	},
	{
		status: "opened",
		labelKey: localizationConstants.calcQAColOpened,
		icon: MailOpen,
		showCount: false,
	},
	{
		status: "answered",
		labelKey: localizationConstants.calcQAColAnswered,
		icon: CheckCheck,
		showCount: false,
		className: "md:col-span-2 xl:col-span-1",
	},
];

export const CALCULATION_QA_STATUS_OPTIONS: QAThreadStatusOption[] =
	CALCULATION_QA_COLUMNS.map((column) => ({
		value: column.status,
		label: column.labelKey,
	}));

export const CALCULATION_QA_CHIP_LABELS: QAThreadFilterChipsLabels = {
	company: localizationConstants.calcQAForetagFilter,
	role: localizationConstants.calcQAKundFilter,
	status: localizationConstants.statusLabel,
	reset: localizationConstants.calcQAFilterReset,
};

interface Option<T extends string> extends QAThreadOption {
	value: T;
}

export const CALCULATION_QA_TYPE_OPTIONS: Option<CalculationQaType>[] = [
	{ value: "project", label: localizationConstants.calcQATypProjekt },
	{ value: "order", label: localizationConstants.calcQATypOrder },
	{ value: "calculation", label: localizationConstants.calcQATypeCalculation },
];

export const CALCULATION_QA_FUNCTION_OPTIONS: Option<CalculationQaFunction>[] = [
	{ value: "construction", label: localizationConstants.calcQAFunctionConstruction },
	{ value: "electrical", label: localizationConstants.calcQAFunctionElectrical },
	{ value: "groundwork", label: localizationConstants.calcQAFunctionGroundwork },
	{ value: "painting", label: localizationConstants.calcQAFunctionPainting },
	{ value: "ventilation", label: localizationConstants.calcQAFunctionVentilation },
	{ value: "plumbing", label: localizationConstants.calcQAFunctionPlumbing },
];

export const CALCULATION_QA_CREATE_LABELS: QAThreadCreateDialogLabels = {
	title: localizationConstants.calcQANewDialogTitle,
	type: localizationConstants.calcQATyp,
	subject: localizationConstants.calcQAFunktion,
	subjectPlaceholder: localizationConstants.calcQAFunctionPlaceholder,
	description: localizationConstants.calcQABeskrivning,
	descriptionPlaceholder: localizationConstants.calcQABeskrivning,
	cancel: localizationConstants.cancel,
	send: localizationConstants.calcQASkicka,
};

const TYPE_FILTER_PREFIX = "type:";
const FUNCTION_FILTER_PREFIX = "function:";

export const CALCULATION_QA_FILTER_ENTRIES: { value: string; label: TranslationKeys }[] = [
	...CALCULATION_QA_TYPE_OPTIONS.map((option) => ({
		value: `${TYPE_FILTER_PREFIX}${option.value}`,
		label: option.label,
	})),
	...CALCULATION_QA_FUNCTION_OPTIONS.map((option) => ({
		value: `${FUNCTION_FILTER_PREFIX}${option.value}`,
		label: option.label,
	})),
];

export function matchesCalculationQaFilter(
	question: CalculationQuestion,
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
