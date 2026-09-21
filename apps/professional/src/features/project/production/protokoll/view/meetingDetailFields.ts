import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { momentLabel } from "../meetingTime";
import { MEETING_CATEGORY_LABELS, PROTOCOL_TYPE_LABELS } from "../projectProtocol.config";
import type { MeetingDetails, NextMeeting, UploadDetails } from "../types";

const M = localizationConstants;

export interface DetailField {
	labelKey: TranslationKeys;
	/** "" shows the missing-value mark. */
	value: string;
}

type Translate = (key: TranslationKeys) => string;

/**
 * Mötesinformation, in the frame's order — three to a row: Värd, Start tid,
 * Slut tid / Ämne, Protokoll nr, Deltagare / Rubrik, Kategori, Plats / Adress,
 * Post nr, Ort / Information, Kommentar, Typ.
 */
export function detailFields(details: MeetingDetails, t: Translate): DetailField[] {
	return [
		{ labelKey: M.protocolFieldHost, value: details.host },
		{ labelKey: M.protocolFieldStartTime, value: momentLabel(details.startDate, details.startTime) },
		{ labelKey: M.protocolFieldEndTime, value: momentLabel(details.endDate, details.endTime) },
		{ labelKey: M.protocolPointSubject, value: details.subject },
		{ labelKey: M.protocolFieldNumber, value: details.number },
		{ labelKey: M.protocolFieldParticipants, value: details.participants.join(", ") },
		{ labelKey: M.protocolFieldTitle, value: details.title },
		{ labelKey: M.protocolFieldCategory, value: t(MEETING_CATEGORY_LABELS[details.category]) },
		{ labelKey: M.protocolFieldLocation, value: details.location },
		{ labelKey: M.protocolFieldAddress, value: details.address },
		{ labelKey: M.protocolFieldPostalCode, value: details.postalCode },
		{ labelKey: M.protocolFieldCity, value: details.city },
		{ labelKey: M.protocolFieldInformation, value: details.information },
		{ labelKey: M.protocolFieldComment, value: details.comment },
		{ labelKey: M.projectProtocolColType, value: t(PROTOCOL_TYPE_LABELS[details.type]) },
	];
}

/**
 * Nästa möte, in the same order, with only the fields a next meeting has. The
 * frame also draws Ämne, Protokoll nr and Kommentar here, but no frame lets
 * them be entered for it, so they would only ever show "—".
 */
export function nextFields(next: NextMeeting, t: Translate): DetailField[] {
	return [
		{ labelKey: M.protocolFieldHost, value: next.host },
		{ labelKey: M.protocolFieldStartTime, value: momentLabel(next.startDate, next.startTime) },
		{ labelKey: M.protocolFieldEndTime, value: momentLabel(next.endDate, next.endTime) },
		{ labelKey: M.protocolFieldParticipants, value: next.participants.join(", ") },
		{ labelKey: M.protocolFieldTitle, value: next.title },
		{ labelKey: M.protocolFieldCategory, value: next.category ? t(MEETING_CATEGORY_LABELS[next.category]) : "" },
		{ labelKey: M.protocolFieldLocation, value: next.location },
		{ labelKey: M.protocolFieldAddress, value: next.address },
		{ labelKey: M.protocolFieldPostalCode, value: next.postalCode },
		{ labelKey: M.protocolFieldCity, value: next.city },
		{ labelKey: M.protocolFieldInformation, value: next.information },
	];
}

/**
 * An uploaded protocol, in the same order with the fields it has: no Värd,
 * Ämne, Protokoll nr, Kategori or Kommentar — Nytt protokoll asks for none.
 */
export function uploadFields(details: UploadDetails, t: Translate): DetailField[] {
	return [
		{ labelKey: M.protocolFieldStartTime, value: momentLabel(details.startDate, details.startTime) },
		{ labelKey: M.protocolFieldEndTime, value: momentLabel(details.endDate, details.endTime) },
		{ labelKey: M.protocolFieldParticipants, value: details.participants.join(", ") },
		{ labelKey: M.protocolFieldTitle, value: details.title },
		{ labelKey: M.protocolFieldLocation, value: details.location },
		{ labelKey: M.protocolFieldAddress, value: details.address },
		{ labelKey: M.protocolFieldPostalCode, value: details.postalCode },
		{ labelKey: M.protocolFieldCity, value: details.city },
		{ labelKey: M.protocolFieldInformation, value: details.information },
		{ labelKey: M.projectProtocolColType, value: t(PROTOCOL_TYPE_LABELS[details.type]) },
	];
}
