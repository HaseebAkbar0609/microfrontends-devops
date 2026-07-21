import axiosInstance from "@/lib/axiosInstance";
import { MOCK_DATA, type ProfessionalRow } from "./list";

const PROFESSIONALS_ACCOUNTS_PATH = "/api/v1/teams/professionals/accounts";
const MOCK_ENABLE = true;

export interface RecentActivityItem {
	id: string;
	title: string;
	titleKey?: string;
	date: string;
}

export interface ProfessionalDetail extends ProfessionalRow {
	plan: string;
	activeSeats: number;
	recentActivities: RecentActivityItem[];
}

function getMockDetail(id: string): ProfessionalDetail {
	const found = MOCK_DATA.find((item) => item.id === id);

	const defaultActivities: RecentActivityItem[] = [
		{ id: "a1", title: "Customer logged in", titleKey: "activityCustomerLoggedIn", date: "2025-02-10" },
		{ id: "a2", title: "Invoice INV-001 paid", titleKey: "activityInvoicePaid", date: "2025-02-08" },
		{ id: "a3", title: "Follow-up call scheduled", titleKey: "activityFollowUpCall", date: "2025-02-01" },
		{ id: "a4", title: "Account activated", titleKey: "activityAccountActivated", date: "2025-01-15" },
	];

	if (found) {
		return {
			...found,
			plan: "Standard",
			activeSeats: 8,
			recentActivities: defaultActivities,
		};
	}

	return {
		id,
		contactUserId: "2025-01",
		companyName: "Byggbolaget AB",
		orgNo: "556890-1002",
		category: "Bygg",
		contactPerson: "Erik Andersson",
		email: "erik@example.com",
		phone: "040 987 6574",
		city: "Järfälla",
		status: "active",
		plan: "Standard",
		activeSeats: 8,
		recentActivities: defaultActivities,
	};
}

export async function getProfessionalAPIAction(
	id: string,
): Promise<ProfessionalDetail> {
	if (MOCK_ENABLE) {
		return getMockDetail(id);
	}

	try {
		const response = await axiosInstance.get<{ data: ProfessionalDetail }>(
			`${PROFESSIONALS_ACCOUNTS_PATH}/${id}`,
		);
		return response.data.data;
	} catch {
		return getMockDetail(id);
	}
}
