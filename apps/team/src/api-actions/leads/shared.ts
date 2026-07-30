import type {
	LeadApiCategory,
	LeadApiItem,
	LeadDetailApiData,
	LeadStatus,
} from "@/features/leads/types";
import type { LeadRow } from "@/features/leads/types";

export function mapProjectType(projectType: string) {
	const normalizedProjectType = (projectType ?? "").trim().toLowerCase();
	switch (normalizedProjectType) {
		case "b2b":
			return "B2B";
		case "b2c":
			return "B2C";
		default:
			return projectType || "-";
	}
}

export function mapLeadStatus(status: string) {
	const normalizedStatus = (status ?? "").trim().toLowerCase();
	switch (normalizedStatus) {
		case "review":
			return "granskning" as const;
		case "monitoring":
		case "watch":
			return "bevakning" as const;
		case "handling":
			return "hantering" as const;
		case "accepted":
			return "accepterad" as const;
		case "paid":
			return "betalda" as const;
		case "archive":
		case "archived":
			return "arkiv" as const;
		default:
			return "granskning" as const;
	}
}

export function mapLeadStatusToApiStatus(status: LeadStatus) {
	switch (status) {
		case "granskning":
			return "review";
		case "bevakning":
			return "monitoring";
		case "hantering":
			return "handling";
		case "accepterad":
			return "accepted";
		case "betalda":
			return "paid";
		case "arkiv":
			return "archive";
		default:
			return "review";
	}
}

export function formatLeadDate(value: string | number) {
	if (value === null || value === undefined || value === "") return "-";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return String(value).slice(0, 10) || "-";
	}
	return date.toISOString().slice(0, 10);
}

export function formatLeadCategory(categories: LeadApiCategory[]) {
	if (!Array.isArray(categories)) return "-";
	return (
		categories
			.map(
				(category) =>
					category.name?.trim() ||
					category.english_name?.trim() ||
					category.swedish_name?.trim()
			)
			.filter(Boolean)
			.join(", ") || "-"
	);
}

export function mapLeadListItemToRow(item: LeadApiItem): LeadRow {
	const createdAt =
		typeof item.created_at === "string" || typeof item.created_at === "number"
			? item.created_at
			: typeof item.creatd_at === "string" || typeof item.creatd_at === "number"
				? item.creatd_at
				: typeof item.createdAt === "string" || typeof item.createdAt === "number"
					? item.createdAt
					: "";
	const customerName =
		typeof item.customer_name === "string" && item.customer_name.trim()
			? item.customer_name
			: "-";
	const projectType =
		typeof item.project_type === "string" ? item.project_type : "-";
	const city =
		typeof item.city_name === "string" && item.city_name.trim()
			? item.city_name
			: typeof item.city === "string" && item.city.trim()
				? item.city
				: "-";

	return {
		id: item.lead_id,
		date: formatLeadDate(createdAt),
		leadId: item.lead_number,
		customer: customerName,
		type: mapProjectType(projectType),
		category: formatLeadCategory(item.categories ?? []),
		city,
		matches: String(item.hit_count ?? 0),
		status: mapLeadStatus(item.status ?? "review"),
		email: "-",
		phone: "-",
	};
}

export function mapLeadDetailToRow(item: LeadDetailApiData): LeadRow {
	return {
		id: item.lead_id,
		date: formatLeadDate(item.created_at),
		leadId: item.lead_number,
		customer: item.customer_details.customer_name,
		type: "-",
		category: formatLeadCategory(item.categories),
		city: item.customer_details.city_name || item.customer_details.city || "-",
		matches: String(item.hit_count ?? 0),
		status: mapLeadStatus(item.status),
		email: item.customer_details.personal_email || "-",
		phone: item.customer_details.mobile_number || "-",
	};
}

export function getFileType(fileName: string) {
	const extension = fileName.split(".").pop()?.toUpperCase();
	return extension || "FILE";
}
