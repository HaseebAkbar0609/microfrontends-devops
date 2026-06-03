export interface Supplier {
	id: string;
	companyName: string;
	orgNo: string;
	contactPersonName: string;
	email: string;
}

export type SupplierColumnField = keyof Omit<Supplier, "id"> | "actions";

export interface SupplierColumn {
	label: string;
	field: SupplierColumnField;
	sortable?: boolean;
}
