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
	allocatedSeats: number;
	licensePools: Array<{ plan_key: string; purchased: number; allocated: number; available: number }>;
	recentActivities: RecentActivityItem[];
}

export async function getProfessionalAPIAction(
	id: string,
): Promise<ProfessionalDetail> {
		const response = await axiosInstance.get<{ data: ProfessionalAccountItem }>(
			`${PROFESSIONALS_ACCOUNTS_PATH}/${id}`,
		);
		const item = response.data.data;
		const licensePools = item.license_pools ?? [];
		return {
			...mapItemToRow(item),
			plan: item.plan ?? "-",
			allocatedSeats: licensePools.reduce((total, pool) => total + pool.allocated, 0),
			licensePools,
			recentActivities: [],
		};
}
