import type { ActionResult } from "@/types/api";
import type { Supplier } from "@/features/suppliers/types/types";

export interface CreateSupplierPayload {
	companyName: string;
	category: string;
	orgNo: string;
	email: string;
	contactFirstName: string;
	contactLastName: string;
	mobileNo: string;
}

export async function createSupplierAPIAction(
	payload: CreateSupplierPayload,
): Promise<ActionResult<Supplier>> {
	try {
		// TODO: replace with real API call
		// const response = await apiClient.post("/suppliers", payload);
		const newSupplier: Supplier = {
			id: crypto.randomUUID(),
			companyName: payload.companyName,
			orgNo: payload.orgNo,
			contactPersonName: `${payload.contactFirstName} ${payload.contactLastName}`,
			email: payload.email,
		};

		return { success: true, data: newSupplier, error: null };
	} catch {
		return {
			success: false,
			data: null,
			error: "Failed to create supplier",
		};
	}
}
