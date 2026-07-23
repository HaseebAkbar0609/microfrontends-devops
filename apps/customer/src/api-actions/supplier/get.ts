import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import type { SupplierDetail, ToolDetail } from "@/types/tools-suppliers";
import { handleApiError } from "@/utils/apiError";
export type { SupplierDetail, ToolDetail };

export async function getSupplierOrToolByIdAPIAction(
	id: string,
): Promise<ActionResult<SupplierDetail | ToolDetail>> {
	try {
		const { data: res } = await axiosInstance.get<{
			success: boolean;
			message?: string;
			data?: {
				id: string;
				company_name: string;
				organization_number?: string;
				company_category?: string;
				created_at?: number;
				updated_at?: number;
				email?: string;
				mobile_no?: string;
				city?: string;
				country?: string;
				location?: string;
				website?: string;
				completed_projects?: number;
				ongoing_projects?: number;
			};
		}>(API_PATH.SUPPLIER.detail(id));

		if (!res || res.success === false || !res.data) {
			return {
				success: false,
				data: null,
				error: res?.message || "Supplier not found",
			};
		}

		const supplier: SupplierDetail = {
			type: "supplier",
			id: res.data.id,
			initials: (res.data.company_name || "").split(" ").map((w: string) => w[0] || "").join("").toUpperCase().slice(0, 2) || "??",
			name: res.data.company_name,
			category: res.data.company_category || "",
			location: res.data.location || (res.data.city ? `${res.data.city}${res.data.country ? `, ${res.data.country}` : ''}` : ""),
			rating: 0,
			reviewCount: 0,
			isVerified: false,
			isTopSupplier: false,
			isOnline: false,
			phone: res.data.mobile_no || "",
			email: res.data.email || "",
			website: res.data.website || "",
			languages: "",
			responseTime: "",
			lastActive: "",
			completedProjects: res.data.completed_projects ?? 0,
			ongoingProjects: res.data.ongoing_projects ?? 0,
			hasRotRut: false,
			description: "",
			certifications: 0,
			mainMunicipality: "",
			additionalMunicipalities: 0,
		};

		return { success: true, data: supplier, error: null };
	} catch (error: unknown) {
		return handleApiError(error, "Failed to load supplier details");
	}
}

export interface SupplierEditData {
	id: string;
	companyName: string;
	category: string;
	orgNo: string;
	email: string;
	contactFirstName: string;
	contactLastName: string;
	mobileNo: string;
}

export async function getSupplierByIdForEditAPIAction(
	id: string,
): Promise<ActionResult<SupplierEditData>> {
	try {
		const { data: res } = await axiosInstance.get<{
			success: boolean;
			message?: string;
			data?: {
				id: string;
				company_name?: string;
				organization_number?: string;
				org_no?: string;
				company_category?: string;
				company_category_id?: string;
				category?: string;
				email?: string;
				mobile_no?: string;
				contact_first_name?: string;
				contact_last_name?: string;
			};
		}>(API_PATH.SUPPLIER.detail(id));

		if (!res || res.success === false || !res.data) {
			return {
				success: false,
				data: null,
				error: res?.message || "Supplier not found",
			};
		}

		const d = res.data as Record<string, unknown>;
		const categoryVal =
			String(
				d.company_category_id ||
				d.category_id ||
				d.company_category ||
				d.category ||
				d.company_category_name ||
				""
			);
		return {
			success: true,
			data: {
				id: String(d.id || ""),
				companyName: String(d.company_name || ""),
				category: categoryVal,
				orgNo: String(d.organization_number || d.org_no || ""),
				email: String(d.email || ""),
				contactFirstName: String(d.contact_first_name || d.contact_person_name || ""),
				contactLastName: String(d.contact_last_name || ""),
				mobileNo: String(d.mobile_no || ""),
			},
			error: null,
		};
	} catch (error: unknown) {
		return handleApiError(error, "Failed to load supplier for editing");
	}
}

