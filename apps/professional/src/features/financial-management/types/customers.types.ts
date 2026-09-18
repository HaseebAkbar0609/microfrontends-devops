export type CustomerStatus = "active" | "inactive" | "prospect";

export interface CustomerOverviewItem {
	id: string;
	customerNo: string;
	name: string;
	orgNo: string;
	address: string;
	postNr: string;
	city: string;
	country: string;
	phone: string;
	email: string;
	status: CustomerStatus;
	dateAdded: string;
	category?: string;
	notes?: string;
}

export interface CustomerFilters {
	search: string;
	status: CustomerStatus | "all";
}
