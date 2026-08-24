import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type {
	CreateOrderFormData,
	CustomerInfoData,
	ContactPersonData,
	OrderInfoData,
	OrderDocumentItem,
	ContractorOrganizationData,
	OrderOrganizationSummaryRow,
} from "../types";

export interface CreateOrderResult {
	id: string;
	orderNo: string;
	success: boolean;
	data?: Record<string, unknown>;
}

export interface SaveDraftOrderResult {
	id: string;
	success: boolean;
	data?: Record<string, unknown>;
}

export const mapCustomerInfoToApi = (info: CustomerInfoData) => ({
	customer: info.customer,
	address: info.address,
	postal_code: info.postalCode,
	city: info.city,
	email: info.email,
	phone: info.phone,
	org_or_personal_no: info.orgOrPersonalNo,
});

export const mapContactPersonToApi = (contact: ContactPersonData) => ({
	first_name: contact.firstName,
	last_name: contact.lastName,
	email: contact.email,
	mobile: contact.mobile,
	role: contact.role,
});

export const mapOrderInfoToApi = (order: OrderInfoData) => ({
	order_no: order.orderNo,
	order_name: order.orderName,
	block_name: order.blockName,
	order_address: order.orderAddress,
	postal_code: order.postalCode,
	city: order.city,
	type: order.type,
	category: order.category,
	department: order.department,
	contract_sum: order.contractSum,
	offer_no: order.offerNo,
	start_date: order.startDate,
	end_date: order.endDate,
});

export const mapDocumentsToApi = (documents: OrderDocumentItem[]) =>
	documents.map((doc) => ({
		id: doc.id,
		date: doc.date,
		document_name: doc.documentName,
		file_name: doc.fileName,
		file_type: doc.fileType,
		file_size: doc.fileSize,
		url: doc.fileUrl || null,
	}));

export const mapContractorToApi = (contractor: ContractorOrganizationData) => ({
	contractor_type: contractor.contractorType,
	organization_name: contractor.organizationName,
	address: contractor.address,
	postal_code: contractor.postalCode,
	city: contractor.city,
	email: contractor.email,
	phone: contractor.phone,
	selected_contact_tags: contractor.selectedContactTags,
	contacts: contractor.contacts.map((c) => ({
		id: c.id,
		first_name: c.firstName,
		last_name: c.lastName,
		email: c.email,
		mobile: c.mobile,
		role: c.role,
	})),
});

export const mapOrganizationsListToApi = (organizations: OrderOrganizationSummaryRow[]) =>
	organizations.map((org) => ({
		id: org.id,
		company: org.company,
		category: org.category,
		name: org.name,
		email: org.email,
		mobile: org.mobile,
		role: org.role,
		address: org.address || null,
		postal_code: org.postalCode || null,
		city: org.city || null,
		phone: org.phone || null,
		contacts: (org.contacts || []).map((c) => ({
			id: c.id,
			first_name: c.firstName,
			last_name: c.lastName,
			email: c.email,
			mobile: c.mobile,
			role: c.role,
		})),
	}));

/**
 * Standard backend payload mapper converting CamelCase wizard data to snake_case API payload
 */
export const mapOrderToApi = (data: CreateOrderFormData): Record<string, unknown> => ({
	customer_info: mapCustomerInfoToApi(data.customerInfo),
	contact_person: mapContactPersonToApi(data.contactPerson),
	order_info: mapOrderInfoToApi(data.orderInfo),
	documents: mapDocumentsToApi(data.documents),
	contractor: mapContractorToApi(data.contractor),
	organizations_list: mapOrganizationsListToApi(data.organizationsList),
});

/**
 * Creates an order via the standard professional API
 */
export async function createOrderAPIAction(
	data: CreateOrderFormData
): Promise<CreateOrderResult> {
	const payload = mapOrderToApi(data);
	const response = await axiosInstance.post(API_PATH.ORDERS.CREATE, payload);
	const responseData = response.data?.data ?? response.data;
	return {
		id: String(responseData?.id ?? ""),
		orderNo: String(responseData?.order_no ?? data.orderInfo.orderNo ?? ""),
		success: true,
		data: responseData,
	};
}

/**
 * Saves an order draft via the draft endpoint
 */
export async function saveOrderDraftAPIAction(
	data: CreateOrderFormData
): Promise<SaveDraftOrderResult> {
	const payload = {
		...mapOrderToApi(data),
		is_draft: true,
	};
	const response = await axiosInstance.post(API_PATH.ORDERS.DRAFT, payload);
	const responseData = response.data?.data ?? response.data;
	return {
		id: String(responseData?.id ?? ""),
		success: true,
		data: responseData,
	};
}

/**
 * Uploads an order document file
 */
export async function uploadOrderDocumentAPIAction(
	file: File
): Promise<{ id: string; url: string; fileName: string }> {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("media_type", "order_document");

	const response = await axiosInstance.post(API_PATH.ORDERS.UPLOAD_FILE, formData);
	const data = response.data?.data;
	const id = String(data?.id ?? "");
	const url = String(data?.url ?? data?.file_url_path ?? data?.signed_url ?? "");

	return { id, url, fileName: file.name };
}
