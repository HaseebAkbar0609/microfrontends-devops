import { listPrivateCustomersAPIAction } from "@/api-actions/customer/list";
import { listProfessionalsAPIAction } from "@/api-actions/customers/professionals/list";
import { REQUESTER_SEARCH_LIMIT } from "../constants/support.constants";
import type { SupportCustomerType } from "../types";

/** One row the create-ticket form can pick as the requester. */
export type Requester = { id: string; name: string; detail: string };

/** One search per customer type, over the registers the Customers module already lists. */
export async function searchRequesters(
	type: SupportCustomerType,
	search: string,
): Promise<Requester[]> {
	if (type === "private") {
		const { items } = await listPrivateCustomersAPIAction({
			page: 1,
			pageSize: REQUESTER_SEARCH_LIMIT,
			search,
		});
		return items.map((customer) => ({
			id: customer.id,
			name: customer.name,
			detail: [customer.email, customer.city].filter(Boolean).join(" · "),
		}));
	}
	const { items } = await listProfessionalsAPIAction({
		page: 1,
		pageSize: REQUESTER_SEARCH_LIMIT,
		search,
	});
	return items.map((company) => ({
		id: company.id,
		name: company.companyName,
		detail: [company.orgNo, company.contactPerson].filter(Boolean).join(" · "),
	}));
}
