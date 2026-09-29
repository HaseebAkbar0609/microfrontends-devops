const SIZE_UNITS = ["B", "kB", "MB", "GB"];

/**
 * A file's size as a reader sees it, to one decimal from kB up. Binary steps,
 * as the size ceilings in the file rules are written.
 *
 * The step is clamped, so a file larger than the largest unit still prints a
 * unit rather than `undefined`, and anything at or below zero reads as `0 B`.
 */
export function formatFileSize(bytes: number): string {
	if (bytes <= 0) return `0 ${SIZE_UNITS[0]}`;

	const step = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), SIZE_UNITS.length - 1);
	const value = bytes / 1024 ** step;
	return `${step === 0 ? value : Number(value.toFixed(1))} ${SIZE_UNITS[step]}`;
}
