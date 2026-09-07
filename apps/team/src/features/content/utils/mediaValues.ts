import { MAX_MEDIA_FILE_BYTES } from "../constants/content.constants";
import type { ContentRowValue } from "../types";

/**
 * Media values are arrays of data URLs. The prototype packed them into a single
 * `"|||"`-joined string so that every field value could be typed `string`;
 * reading a row then meant remembering to split on a magic delimiter.
 */
export function toMediaList(value: ContentRowValue | undefined): string[] {
	if (Array.isArray(value)) return value;
	if (!value) return [];
	return [value];
}

export function toText(value: ContentRowValue | undefined): string {
	if (Array.isArray(value)) return value.join(", ");
	return value ?? "";
}

export type MediaReadResult = {
	dataUrls: string[];
	/** Files rejected for exceeding the size cap, by name. */
	rejected: string[];
};

/**
 * Reads picked files as data URLs. There is no upload endpoint yet, so the
 * bytes live in React state — hence the per-file cap.
 */
export async function readMediaFiles(
	files: FileList,
): Promise<MediaReadResult> {
	const accepted: File[] = [];
	const rejected: string[] = [];

	for (const file of Array.from(files)) {
		if (file.size > MAX_MEDIA_FILE_BYTES) {
			rejected.push(file.name);
			continue;
		}
		accepted.push(file);
	}

	const dataUrls = await Promise.all(
		accepted.map(
			(file) =>
				new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => resolve(String(reader.result));
					reader.onerror = () => reject(reader.error);
					reader.readAsDataURL(file);
				}),
		),
	);

	return { dataUrls, rejected };
}
