import type { RecordFilePickerCopy } from "@/components/form/RecordFilePicker";
import {
	PROTOCOL_FILE_ACCEPT,
	PROTOCOL_FILE_RULES,
	PROTOCOL_TYPES,
	PROTOCOL_TYPE_LABELS,
} from "@/features/project/production/protokoll/projectProtocol.config";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { ForecastProtocolSortField } from "../types/forecastProtocols.types";

export const PROTOCOLS_PAGE_SIZE = 10;

/**
 * The project module already names and describes a protocol, and takes the
 * same files — a PDF, or a photo or scan of a signed one, which is why images
 * are allowed under a column headed PDF. Prognos reads that vocabulary rather
 * than minting a second one, so a Byggmöte is a Byggmöte wherever it is read.
 */
export { PROTOCOL_TYPES, PROTOCOL_TYPE_LABELS, PROTOCOL_FILE_RULES, PROTOCOL_FILE_ACCEPT };

/**
 * How many protocols the register holds. Deliberately not folded into the file
 * rules: `RecordFileRules.maxCount` counts the files on one record, and this
 * counts the records.
 */
export const PROTOCOLS_MAX = 200;

/** The frame's three sortable columns; Handling is a plain head beside them. */
export const PROTOCOL_LIST_COLUMNS: { key: ForecastProtocolSortField; labelKey: TranslationKeys }[] = [
	{ key: "date", labelKey: localizationConstants.projectProtocolColDate },
	{ key: "type", labelKey: localizationConstants.projectProtocolColType },
	{ key: "fileName", labelKey: localizationConstants.projectProtocolColPdf },
];

/** What the file row on the upload dialog calls a protocol and its file. */
export const PROTOCOL_FILE_PICKER_COPY: RecordFilePickerCopy = {
	labelKey: localizationConstants.projectProtocolFileLabel,
	chooseKey: localizationConstants.forecastProtocolsChooseFile,
	hintKey: localizationConstants.projectProtocolAllowedFiles,
	removeKey: localizationConstants.projectProtocolRemoveFile,
	sizeErrorKey: localizationConstants.projectProtocolFileSizeError,
	typeErrorKey: localizationConstants.projectProtocolFileTypeError,
};
