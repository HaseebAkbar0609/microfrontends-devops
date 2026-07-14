export const isValidSwedishPersonalNumber = (ssn: string): boolean => {
	const cleanSSN = ssn.replace(/\D/g, "");
	if (cleanSSN.length !== 10 && cleanSSN.length !== 12) return false;

	// For 12-digit SSN (YYYYMMDDXXXX), we drop the first 2 digits (century) for Luhn check
	const ssn10 = cleanSSN.length === 12 ? cleanSSN.substring(2) : cleanSSN;

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
