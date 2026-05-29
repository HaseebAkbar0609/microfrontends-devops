export function maskPersonalNumber(value: string) {
	if (!value) return "";
	return value.replace(/\d{4}$/, "XXXX");
}

export function isPersonalNumberValid(value: string) {
	return /^\d{8}-\d{4}$/.test(value);
}
