import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError, ApiResponse, AuthUserInfo } from "@/types/api";
import { authStorage } from "@/lib/authStorage";
import type { CustomerProfileData } from "../profile/get";

export interface UserPermissions {
	viewProjects: boolean;
	createProjects: boolean;
	editProjects: boolean;
	viewOffers: boolean;
	approveOffers: boolean;
	manageUsers: boolean;
}

export interface CustomerUserData extends CustomerProfileData {
	created_at?: number | string | null;
	permissions?: UserPermissions | null;
}

export interface CreateCustomerUserPayload {
	profile_picture_media_id?: string | null;
	first_name: string;
	last_name: string;
	email: string;
	phone_number?: string | null;
	postal_code?: string | null;
	address?: string | null;
	city_name?: string | null;
	city_id?: string | null;
	country_id?: string | null;
	personal_id?: string | null;
	status?: string;
	permissions?: Partial<UserPermissions>;
}

export interface UpdateCustomerUserPayload {
	profile_picture_media_id?: string | null;
	first_name?: string | null;
	last_name?: string | null;
	email?: string | null;
	phone_number?: string | null;
	postal_code?: string | null;
	address?: string | null;
	city_name?: string | null;
	city_id?: string | null;
	country_id?: string | null;
	personal_id?: string | null;
	status?: string | null;
	permissions?: Partial<UserPermissions>;
	version?: number; // Add version tracking for optimistic concurrency
}

/**
 * Fetch all users under the current customer account.
 * GET /api/v1/customers/users
 */
export async function getCustomerUsersAPIAction(): Promise<
	ActionResult<CustomerUserData[]>
> {
	try {
		const response = await axiosInstance.get<
			ApiResponse<CustomerUserData[]> | { data: CustomerUserData[] }
		>(API_PATH.USERS.BASE);

		const data =
			"data" in response.data ? response.data.data : response.data;

		return { success: true, data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage =
			apiError.response?.data?.message || "Failed to fetch users list";
		return { success: false, data: null, error: errorMessage };
	}
}

/**
 * Fetch a specific user under the current customer account.
 * GET /api/v1/customers/users/:userId
 */
export async function getCustomerUserByIdAPIAction(
	userId: string,
): Promise<ActionResult<CustomerUserData>> {
	try {
		const response = await axiosInstance.get<
			ApiResponse<CustomerUserData> | { data: CustomerUserData }
		>(API_PATH.USERS.detail(userId));

		const data =
			"data" in response.data ? response.data.data : response.data;

		return { success: true, data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage =
			apiError.response?.data?.message || "Failed to fetch user details";
		return { success: false, data: null, error: errorMessage };
	}
}

/**
 * Create a new sub-user under the current customer account.
 * POST /api/v1/customers/users
 */
export async function createCustomerUserAPIAction(
	payload: CreateCustomerUserPayload,
): Promise<ActionResult<CustomerUserData>> {
	try {
		const response = await axiosInstance.post<
			ApiResponse<CustomerUserData> | { data: CustomerUserData }
		>(API_PATH.USERS.BASE, payload);

		const data =
			"data" in response.data ? response.data.data : response.data;

		return { success: true, data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage =
			apiError.response?.data?.message || "Failed to create user";
		return { success: false, data: null, error: errorMessage };
	}
}

/**
 * Update details or permissions of a sub-user.
 * PATCH /api/v1/customers/users/:userId
 */
export async function updateCustomerUserAPIAction(
	userId: string,
	payload: UpdateCustomerUserPayload,
): Promise<ActionResult<CustomerUserData>> {
	try {
		// Strip email from payload since backend does not allow email updates (it uses strict schema validation)
		const requestPayload = { ...payload };
		const omittedFields: string[] = [];
		if (requestPayload.email !== undefined) {
			delete requestPayload.email;
			omittedFields.push("email");
		}

		const currentUser = authStorage.getUserData() as AuthUserInfo | null;
		if (currentUser && currentUser.id === userId) {
			if (requestPayload.permissions) {
				delete requestPayload.permissions;
				omittedFields.push("permissions");
			}
		}
		const response = await axiosInstance.patch<
			ApiResponse<CustomerUserData> | { data: CustomerUserData }
		>(API_PATH.USERS.detail(userId), requestPayload);

		const data =
			"data" in response.data ? response.data.data : response.data;

		if (omittedFields.length > 0) {
			const warning = `User saved, but the following fields were not updated: ${omittedFields.join(", ")}`;
			return { success: true, data, error: warning };
		}

		return { success: true, data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage =
			apiError.response?.data?.message || "Failed to update user";
		return { success: false, data: null, error: errorMessage };
	}
}

/**
 * Delete (deactivate) a sub-user.
 * DELETE /api/v1/customers/users/:userId
 */
export async function deleteCustomerUserAPIAction(
	userId: string,
): Promise<ActionResult<null>> {
	try {
		await axiosInstance.delete(API_PATH.USERS.detail(userId));
		return { success: true, data: null, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage =
			apiError.response?.data?.message || "Failed to delete user";
		return { success: false, data: null, error: errorMessage };
	}
}
