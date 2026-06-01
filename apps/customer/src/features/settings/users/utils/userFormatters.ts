export function maskPersonalNumber(value: string) {
	if (!value) return "";
	return value.replace(/\d{4}$/, "XXXX");
}

export function isPersonalNumberValid(value: string) {
	return /^\d{8}-\d{4}$/.test(value);
}

export function isSwedishPhoneNumberValid(value: string) {
	const normalized = value.replace(/[\s()-]/g, "");
	return /^(?:\+46|0046|0)[1-9]\d{6,9}$/.test(normalized);
}
