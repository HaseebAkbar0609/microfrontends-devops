import axiosInstance from "@/lib/axiosInstance";
import { mapItemToRow, type ProfessionalAccountItem, type ProfessionalRow } from "./list";

const PROFESSIONALS_ACCOUNTS_PATH = "/api/v1/teams/professionals/accounts";

export interface RecentActivityItem {
	id: string;
	title: string;
	titleKey?: string;
	date: string;
}

export interface ProfessionalDetail extends ProfessionalRow {
	plan: string;
	activeSeats: number | null;
	recentActivities: RecentActivityItem[];
}

export async function getProfessionalAPIAction(
	id: string,
): Promise<ProfessionalDetail> {
		const response = await axiosInstance.get<{ data: ProfessionalAccountItem }>(
			`${PROFESSIONALS_ACCOUNTS_PATH}/${id}`,
		);
		return { ...mapItemToRow(response.data.data), plan: "-", activeSeats: null, recentActivities: [] };
}
