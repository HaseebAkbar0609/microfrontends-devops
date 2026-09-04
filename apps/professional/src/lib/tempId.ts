export const generateTempId = (): string =>
	`temp-${
		typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
			? crypto.randomUUID()
			: Math.random().toString(36).slice(2)
	}`;
