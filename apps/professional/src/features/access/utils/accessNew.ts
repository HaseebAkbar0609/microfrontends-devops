import {
	ACCESS_EMAIL_PATTERN,
	ACCESS_ID_DEFAULT_PREFIX,
	ACCESS_KEY_ID_PREFIX,
	ACCESS_NEW_LIMITS,
	ACCESS_NUMBER_DIGITS,
	ACCESS_POSTAL_CODE_PATTERN,
	ACCESS_ROW_ID_PREFIX,
} from "../constants/accessNewLimits.constants";
import type { AccessPoint } from "../types/access.types";
import type {
	AccessContactErrors,
	AccessFieldError,
	AccessInfoErrors,
	AccessKeyErrors,
	AccessNewContact,
	AccessNewContactDraft,
	AccessNewInfo,
	AccessNewKey,
	AccessNewKeyForm,
} from "../types/accessNew.types";

/**
 * Validation and id generation for the new-access wizard. Pure, so it can be
 * tested alone and kept when the form is wired to a server later.
 */

const isBlank = (value: string) => value.trim() === "";

/** The error for a required text field with a length limit, or undefined when it is fine. */
function checkText(value: string, max: number): AccessFieldError | undefined {
	if (isBlank(value)) return "required";
	return value.trim().length > max ? "tooLong" : undefined;
}

export function validateInfo(info: AccessNewInfo): AccessInfoErrors {
	const errors: AccessInfoErrors = {};
	const name = checkText(info.name, ACCESS_NEW_LIMITS.name);
	const address = checkText(info.address, ACCESS_NEW_LIMITS.address);
	const city = checkText(info.city, ACCESS_NEW_LIMITS.city);
	if (name) errors.name = name;
	if (address) errors.address = address;
	if (city) errors.city = city;
	if (isBlank(info.postalCode)) errors.postalCode = "required";
	else if (!ACCESS_POSTAL_CODE_PATTERN.test(info.postalCode.trim())) errors.postalCode = "postalCode";
	return errors;
}

export function validateContact(draft: AccessNewContactDraft, existing: AccessNewContact[]): AccessContactErrors {
	const errors: AccessContactErrors = {};
	if (isBlank(draft.person)) errors.person = "required";
	else if (existing.some((contact) => contact.name === draft.person)) errors.person = "duplicate";
	if (isBlank(draft.email)) errors.email = "required";
	else if (draft.email.trim().length > ACCESS_NEW_LIMITS.email) errors.email = "tooLong";
	else if (!ACCESS_EMAIL_PATTERN.test(draft.email.trim())) errors.email = "email";
	if (draft.mobile.trim().length > ACCESS_NEW_LIMITS.mobile) errors.mobile = "tooLong";
	return errors;
}

export function validateKey(form: AccessNewKeyForm, tags: string[]): AccessKeyErrors {
	const errors: AccessKeyErrors = {};
	if (form.type === "") errors.type = "required";
	const regNo = checkText(form.regNo, ACCESS_NEW_LIMITS.regNo);
	if (regNo) errors.regNo = regNo;
	if (isBlank(form.startDate)) errors.startDate = "required";
	if (isBlank(form.returnDate)) errors.returnDate = "required";
	else if (!isBlank(form.startDate) && form.returnDate < form.startDate) errors.returnDate = "dateOrder";
	if (tags.length === 0) errors.accessTo = "noTags";
	if (isBlank(form.company)) errors.company = "required";
	if (isBlank(form.person)) errors.person = "required";
	return errors;
}

/** Adds a place the key opens. A blank, too long or repeated one (ignoring case) is refused with the reason. */
export function addAccessTag(tags: string[], raw: string): { tags: string[]; error?: AccessFieldError } {
	const tag = raw.trim();
	if (tag === "") return { tags, error: "required" };
	if (tag.length > ACCESS_NEW_LIMITS.tag) return { tags, error: "tooLong" };
	if (tags.some((existing) => existing.toLowerCase() === tag.toLowerCase())) return { tags, error: "duplicate" };
	return { tags: [...tags, tag] };
}

const pad = (value: number) => String(value).padStart(ACCESS_NUMBER_DIGITS, "0");

/** The highest number a list of ids ends in, or 0. */
function highestNumber(ids: string[]): number {
	return ids.reduce((highest, id) => {
		const match = /(\d+)$/.exec(id);
		return match ? Math.max(highest, Number(match[1])) : highest;
	}, 0);
}

/** "N001" for the first key, then one more than the highest key number so far. */
export function nextKeyId(keys: { keyId: string }[]): string {
	return `${ACCESS_KEY_ID_PREFIX}${pad(highestNumber(keys.map((key) => key.keyId)) + 1)}`;
}

type AccessIds = { id: string; idNumber: string };

/**
 * The row id and the number shown to people for the next access, continuing the list.
 * `reserved` are ids that exist elsewhere (the mock records) and must not be handed out
 * again even if their row was deleted, or a new access would open an old record.
 */
export function nextAccessIds(rows: AccessIds[], reserved: AccessIds[] = []): AccessIds {
	const known = [...reserved, ...rows];
	const numbers = known.map((row) => row.idNumber);
	const highest = numbers.reduce((best, current) => (highestNumber([current]) >= highestNumber([best]) ? current : best), "");
	const prefix = highest ? highest.replace(/\d+$/, "") : ACCESS_ID_DEFAULT_PREFIX;
	return {
		id: `${ACCESS_ROW_ID_PREFIX}${pad(highestNumber(known.map((row) => row.id)) + 1)}`,
		idNumber: `${prefix}${pad(highestNumber(numbers) + 1)}`,
	};
}

/** Local date-time without an offset, e.g. "2026-10-02T09:30:00", the format of the list rows. */
export function formatLocalIso(date: Date): string {
	const two = (value: number) => String(value).padStart(2, "0");
	return `${date.getFullYear()}-${two(date.getMonth() + 1)}-${two(date.getDate())}T${two(date.getHours())}:${two(date.getMinutes())}:${two(date.getSeconds())}`;
}

/** The list row for a finished wizard: the type of the first key, and everyone who was given a key. */
export function buildAccessPoint(
	info: AccessNewInfo,
	keys: AccessNewKey[],
	ids: { id: string; idNumber: string },
	now: string,
): AccessPoint {
	const people = keys.map((key) => key.person).filter((person, index, all) => all.indexOf(person) === index);
	return {
		id: ids.id,
		idNumber: ids.idNumber,
		objectRef: info.objectRef === "" ? null : info.objectRef,
		name: info.name.trim(),
		type: keys[0].type,
		city: info.city.trim(),
		assignees: people,
		lastAssignedAt: now,
		status: "active",
		archived: false,
	};
}
