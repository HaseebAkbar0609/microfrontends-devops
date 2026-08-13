import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import {
	type WageTypeRow,
	type GetWageTypeListParams,
	type GetWageTypeListResponse,
	type CreateWageTypeFormData,
} from "../types";

type ApiListEnvelope<T> = {
	data: T;
	total_items?: number;
	current_page?: number;
	page_size?: number;
	total_pages?: number;
};

const WAGE_TYPE_SORT_MAP: Record<string, string> = {
	code: "code",
	name: "name",
	unit: "unit",
	personalType: "personal_type",
	wageForm: "wage_form",
	transactionType: "transaction_type",
	preliminaryTax: "preliminary_tax",
	employerContribution: "employer_contribution",
	accountDebit: "account_debit",
	accountCredit: "account_credit",
	factor: "factor",
	status: "status",
	createdAt: "created_at",
	updatedAt: "updated_at",
};

const mapWageTypeFromApi = (item: Record<string, unknown>): WageTypeRow => ({
	id: String(item.id ?? ""),
	code: String(item.code ?? ""),
	name: String(item.name ?? ""),
	personalType: String(item.personal_type ?? item.personalType ?? "Tjänsteman"),
	wageForm: String(item.wage_form ?? item.wageForm ?? "Fast lön"),
	transactionType: String(item.transaction_type ?? item.transactionType ?? "Bruttolön"),
	unit: String(item.unit ?? ""),
	preliminaryTax: String(item.preliminary_tax ?? item.preliminaryTax ?? "Ja 30%"),
	employerContribution: String(item.employer_contribution ?? item.employerContribution ?? "Ja 30%"),
	createdAt: String(item.created_at ?? item.createdAt ?? ""),
	updatedAt: String(item.updated_at ?? item.updatedAt ?? ""),
	accountDebit: item.account_debit !== null && item.account_debit !== undefined ? String(item.account_debit) : "",
	accountCredit: item.account_credit !== null && item.account_credit !== undefined ? String(item.account_credit) : "",
	accountOppositeAG: item.account_opposite_ag !== null && item.account_opposite_ag !== undefined ? String(item.account_opposite_ag) : "",
	agUnderlag: Boolean(item.ag_underlag ?? item.agUnderlag ?? false),
	semestergrundad: Boolean(item.semestergrundad ?? false),
	agiCode: item.agi_code !== null && item.agi_code !== undefined ? String(item.agi_code) : "",
	description: item.description !== null && item.description !== undefined ? String(item.description) : undefined,
	factor: item.factor !== null && item.factor !== undefined ? String(item.factor) : undefined,
	status: item.status === "inactive" ? "inactive" : "active",
});

const mapWageTypeToApi = (data: Partial<CreateWageTypeFormData>): Record<string, unknown> => ({
	code: data.code,
	name: data.name,
	personal_type: data.personalType ?? "Tjänsteman",
	wage_form: data.wageForm ?? "Fast lön",
	transaction_type: data.transactionType ?? "Bruttolön",
	unit: data.unit,
	preliminary_tax: data.preliminaryTax ?? "Ja 30%",
	employer_contribution: data.employerContribution ?? "Ja 30%",
	account_debit: data.accountDebit ?? "",
	account_credit: data.accountCredit ?? "",
	account_opposite_ag: data.accountOppositeAG ?? "",
	ag_underlag: Boolean(data.agUnderlag),
	semestergrundad: Boolean(data.semestergrundad),
	agi_code: data.agiCode ?? "",
	description: data.description ?? "",
	factor: data.factor ?? "1.0",
	status: data.status ?? "active",
});

export async function getWageTypeListAPIAction(
	params?: GetWageTypeListParams,
): Promise<GetWageTypeListResponse> {
	const queryParams: Record<string, string | number> = {};
	if (params?.page) queryParams.page = params.page;
	if (params?.limit) queryParams.limit = params.limit;
	if (params?.search) queryParams.search = params.search;
	if (params?.status && params.status !== "all") queryParams.status = params.status;
	const sortBy = params?.sortBy ? WAGE_TYPE_SORT_MAP[params.sortBy] ?? params.sortBy : undefined;
	if (sortBy) queryParams.sort_by = sortBy;
	if (params?.sortOrder) queryParams.sort_order = params.sortOrder;

	const res = await axiosInstance.get<ApiListEnvelope<Record<string, unknown>[]>>(
		API_PATH.WAGE_TYPES.LIST,
		{ params: queryParams },
	);
	const items = Array.isArray(res.data?.data) ? res.data.data : [];

	const total = res.data?.total_items ?? items.length;
	const backendPageSize = Number(res.data?.page_size);
	const limit = Number.isFinite(backendPageSize) && backendPageSize > 0
		? backendPageSize
		: (params?.limit && params.limit > 0 ? params.limit : 50);
	const effectiveLimit = Number.isFinite(limit) && limit > 0 ? limit : 50;
	return {
		data: items.map(mapWageTypeFromApi),
		total,
		page: res.data?.current_page ?? params?.page ?? 1,
		limit: effectiveLimit,
		totalPages: res.data?.total_pages ?? (Math.ceil(total / effectiveLimit) || 1),
	};
}

export async function getWageTypeDetailAPIAction(
	id: string,
): Promise<WageTypeRow | null> {
	try {
		const res = await axiosInstance.get(API_PATH.WAGE_TYPES.GET(id));
		const data = res.data?.data;
		if (data) {
			return mapWageTypeFromApi(data);
		}
		return null;
	} catch (error) {
		throw error;
	}
}

export async function createWageTypeAPIAction(
	data: CreateWageTypeFormData,
): Promise<{ success: boolean; data?: WageTypeRow; error?: string }> {
	try {
		const res = await axiosInstance.post(API_PATH.WAGE_TYPES.CREATE, mapWageTypeToApi(data));
		const isSuccess = res.data?.success ?? true;
		if (isSuccess && res.data?.data) {
			return { success: true, data: mapWageTypeFromApi(res.data.data) };
		}
		return { success: false, error: res.data?.message ?? "Failed to create wage type" };
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 409) {
			return { success: false, error: "wageTypeDuplicateCodeError" };
		}
		throw error;
	}
}

export async function updateWageTypeAPIAction(
	id: string,
	data: Partial<CreateWageTypeFormData>,
): Promise<{ success: boolean; data?: WageTypeRow; error?: string }> {
	try {
		const payload = mapWageTypeToApi(data);
		const providedKeys = new Set(Object.keys(data));
		const fieldMap: Record<string, string> = {
			personalType: "personal_type",
			wageForm: "wage_form",
			transactionType: "transaction_type",
			preliminaryTax: "preliminary_tax",
			employerContribution: "employer_contribution",
			accountDebit: "account_debit",
			accountCredit: "account_credit",
			accountOppositeAG: "account_opposite_ag",
			agUnderlag: "ag_underlag",
			semestergrundad: "semestergrundad",
			agiCode: "agi_code",
			factor: "factor",
			status: "status",
			unit: "unit",
			description: "description",
		};
		for (const [camel, snake] of Object.entries(fieldMap)) {
			if (!providedKeys.has(camel)) {
				delete payload[snake];
			}
		}
		if (!providedKeys.has("code")) delete payload.code;
		if (!providedKeys.has("name")) delete payload.name;
		const res = await axiosInstance.put(API_PATH.WAGE_TYPES.UPDATE(id), payload);
		const isSuccess = res.data?.success ?? true;
		if (isSuccess && res.data?.data) {
			return { success: true, data: mapWageTypeFromApi(res.data.data) };
		}
		return { success: false, error: res.data?.message ?? "Failed to update wage type" };
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 409) {
			return { success: false, error: "wageTypeDuplicateCodeError" };
		}
		throw error;
	}
}

export async function deleteWageTypeAPIAction(id: string): Promise<boolean> {
	const res = await axiosInstance.delete(API_PATH.WAGE_TYPES.DELETE(id));
	return res.data?.success ?? true;
}

export async function toggleWageTypeStatusAPIAction(
	ids: string[],
	targetStatus: "active" | "inactive",
): Promise<boolean> {
	const res = await axiosInstance.post(API_PATH.WAGE_TYPES.TOGGLE_STATUS, {
		ids,
		status: targetStatus,
	});
	return res.data?.success ?? true;
}