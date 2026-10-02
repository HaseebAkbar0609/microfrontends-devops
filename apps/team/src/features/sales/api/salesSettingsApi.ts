import axios from "@/lib/axiosInstance";
import type { SalesSettings } from "../types";

const ROOT = "/api/v1/teams/sales/settings";

export async function getSalesSettings(): Promise<SalesSettings> {
	return (await axios.get<{ data: SalesSettings }>(ROOT)).data.data;
}

/** A field left out is kept on the server, so saving the link never touches the templates. */
export async function patchSalesSettings(patch: Partial<SalesSettings>): Promise<SalesSettings> {
	return (await axios.patch<{ data: SalesSettings }>(ROOT, patch)).data.data;
}
