import type { ConsultantStatus } from "../types/consultant";

export function getConsultantStatusVariant(status: ConsultantStatus) {
	switch (status) {
		case "active":
			return "success" as const;
		case "pending":
			return "warning" as const;
		case "completed":
			return "info" as const;
		case "past":
			return "outline" as const;
		default:
			return "outline" as const;
	}
}
