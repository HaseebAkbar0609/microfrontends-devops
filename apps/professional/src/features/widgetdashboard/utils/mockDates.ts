export const MOCK_REFERENCE_DATE = "2026-07-24";

export function mockDate(offsetDays: number): string {
	const date = new Date(`${MOCK_REFERENCE_DATE}T00:00:00Z`);
	date.setUTCDate(date.getUTCDate() + offsetDays);
	return date.toISOString().slice(0, 10);
}

export function mockDateTime(offsetDays: number, time: string): string {
	return `${mockDate(offsetDays)} ${time}`;
}
