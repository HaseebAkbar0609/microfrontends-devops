import type { RecordFilePickerCopy } from "@/components/form/RecordFilePicker";
import type { RecordFileRules } from "@/features/project/shared/recordFiles";
import { acceptAttribute } from "@/features/project/shared/recordFiles";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { TemplateCategory, TemplateColumnKey } from "../types/forecastTemplates.types";

export const TEMPLATES_PAGE_SIZE = 10;

/** What the name field accepts; the input caps it, so nothing longer arrives. */
export const TEMPLATE_NAME_MAX_LENGTH = 80;
export const TEMPLATE_DESCRIPTION_MAX_LENGTH = 280;

/** The register's columns in the frame's order; every one sorts and every one hides. */
export const TEMPLATE_COLUMNS: { key: TemplateColumnKey; labelKey: TranslationKeys }[] = [
	{ key: "templateNo", labelKey: localizationConstants.forecastTemplatesColId },
	{ key: "category", labelKey: localizationConstants.forecastTemplatesColCategory },
	{ key: "date", labelKey: localizationConstants.forecastTemplatesColDate },
	{ key: "documentName", labelKey: localizationConstants.forecastTemplatesColName },
	{ key: "fileName", labelKey: localizationConstants.forecastTemplatesColFile },
];

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, TranslationKeys> = {
	budget: localizationConstants.forecastTemplatesCategoryBudget,
	forecast: localizationConstants.forecastTemplatesCategoryForecast,
	report: localizationConstants.forecastTemplatesCategoryReport,
	calculation: localizationConstants.forecastTemplatesCategoryCalculation,
	other: localizationConstants.forecastTemplatesCategoryOther,
};

/** The categories in the order the Filter menu and the dialog list them. */
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
	"budget",
	"forecast",
	"report",
	"calculation",
	"other",
];

/**
 * What a template may be. The extensions decide both what the picker accepts
 * and what content type the stored file is served as, so a renamed file never
 * opens as something else.
 */
export const TEMPLATE_FILE_RULES: RecordFileRules = {
	types: {
		".pdf": "application/pdf",
		".doc": "application/msword",
		".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		".xls": "application/vnd.ms-excel",
		".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	},
	maxBytes: 10 * 1024 * 1024,
	/** The register is a list, not one record's attachments; this is its ceiling. */
	maxCount: 200,
};

export const TEMPLATE_FILE_ACCEPT = acceptAttribute(TEMPLATE_FILE_RULES.types);

/** What the file row on the create dialog calls a template and its file. */
export const TEMPLATE_FILE_PICKER_COPY: RecordFilePickerCopy = {
	labelKey: localizationConstants.forecastTemplatesColFile,
	chooseKey: localizationConstants.forecastTemplatesChooseFile,
	hintKey: localizationConstants.forecastTemplatesAllowedFiles,
	removeKey: localizationConstants.forecastTemplatesRemoveFile,
	sizeErrorKey: localizationConstants.forecastTemplatesFileSizeError,
	typeErrorKey: localizationConstants.forecastTemplatesFileTypeError,
};
