export const isValidSwedishPersonalNumber = (ssn: string): boolean => {
	if (!ssn || typeof ssn !== "string") return false;
	const trimmed = ssn.trim();
	if (/[^0-9\-+\s]/.test(trimmed)) return false;
	const cleanSSN = trimmed.replace(/[\-+\s]/g, "");
	if (cleanSSN.length !== 10 && cleanSSN.length !== 12) return false;

	// For 12-digit SSN (YYYYMMDDXXXX), we drop the first 2 digits (century) for Luhn check
	const ssn10 = cleanSSN.length === 12 ? cleanSSN.substring(2) : cleanSSN;
	const month = parseInt(ssn10.substring(2, 4), 10);
	const dayRaw = parseInt(ssn10.substring(4, 6), 10);
	const day = dayRaw > 60 ? dayRaw - 60 : dayRaw; // handles samordningsnummer (coordination numbers)

	if (month < 1 || month > 12) return false;
	if (day < 1 || day > 31) return false;

	const today = new Date();
	const todayYYYYMMDD =
		today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

	let year: number;
	if (cleanSSN.length === 12) {
		year = parseInt(cleanSSN.substring(0, 4), 10);
		if (year * 10000 + month * 100 + day > todayYYYYMMDD) return false;
	} else {
		const yy = parseInt(ssn10.substring(0, 2), 10);
		const currentCentury = Math.floor(today.getFullYear() / 100) * 100;
		year = currentCentury + yy;
		if (year * 10000 + month * 100 + day > todayYYYYMMDD) year -= 100;
	}

	const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	const daysInMonths = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if (day > daysInMonths[month - 1]) return false;

	let sum = 0;
	let isSecond = false;
	for (let i = ssn10.length - 1; i >= 0; i--) {
		let num = parseInt(ssn10[i], 10);
		if (isSecond) {
			num *= 2;
			if (num > 9) num -= 9;
		}
		sum += num;
		isSecond = !isSecond;
	}
	return sum % 10 === 0;
};
