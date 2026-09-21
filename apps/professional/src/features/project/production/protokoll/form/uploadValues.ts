import type { UploadDetails } from "../types";
import { planOf } from "./meetingValues";
import type { UploadFormValues } from "./uploadSchema";

/** "Nytt protokoll", empty — each opening of the dialog starts from it. */
export function emptyUploadDraft(): UploadFormValues {
	return {
		type: null,
		name: "",
		address: "",
		postalCode: "",
		city: "",
		location: "",
		participants: [],
		startDate: "",
		startTime: "",
		endDate: "",
		endTime: "",
		information: "",
		file: null,
		pendingFile: null,
	};
}

/**
 * The details the store keeps beside the file; `undefined` while Typ is unset,
 * which the schema already refuses. The form's Rubrik (`name`) becomes `title`.
 */
export function uploadDetailsFrom(values: UploadFormValues): UploadDetails | undefined {
	if (!values.type) return undefined;
	const { host: _host, ...plan } = planOf({ ...values, host: "", title: values.name });
	return { ...plan, type: values.type };
}
