import axiosInstance from "@/lib/axiosInstance";
import type { AdminModuleCategory, AdminOption, AdminResponse, AdminUserDetail, AdminUsersParams, AdminUsersResponse, CreateAdminUserRequest, UpdateAdminUserRequest } from "../types/adminUsers.types";

export const getAdminUsers = async (params: AdminUsersParams) => {
	const res = await axiosInstance.get<AdminUsersResponse>("/api/v1/teams/admin/users", { params });
	return res.data;
};

export const getAdminUsersSummary = async () => {
	const res = await axiosInstance.get("/api/v1/teams/admin/users/summary");
	return res.data;
};

export const createAdminUser = async (data: CreateAdminUserRequest) => {
	const res = await axiosInstance.post("/api/v1/teams/admin/users", data);
	return res.data;
};

export const updateAdminUser = async ({ userId, data }: { userId: string, data: UpdateAdminUserRequest }) => {
	const res = await axiosInstance.patch(`/api/v1/teams/admin/users/${userId}`, data);
	return res.data;
};

export const getAdminRoleOptions = async () => {
	const res = await axiosInstance.get<AdminResponse<AdminOption[]>>("/api/v1/teams/admin/roles/options");
	return res.data;
};

export const getAdminTypeOptions = async () => {
	const res = await axiosInstance.get<AdminResponse<AdminOption[]>>("/api/v1/teams/admin/positions/options");
	return res.data;
};

export const getAdminAccessOptions = async () => {
  const res = await axiosInstance.get<AdminResponse<AdminOption[]>>("/api/v1/teams/admin/types/options");
  return res.data;
};

export const getAdminGroups = async (params: Record<string, unknown>) => {
	const res = await axiosInstance.get("/api/v1/teams/admin/departments", { params });
	return res.data;
};

export const createAdminGroup = async (data: unknown) => {
	const res = await axiosInstance.post("/api/v1/teams/admin/departments", data);
	return res.data;
};

export const updateAdminGroup = async ({ groupId, data }: { groupId: string, data: unknown }) => {
	const res = await axiosInstance.patch(`/api/v1/teams/admin/departments/${groupId}`, data);
	return res.data;
};

export const getAdminGroupMembers = async ({ groupId, params }: { groupId: string, params?: Record<string, unknown> }) => {
	const res = await axiosInstance.get(`/api/v1/teams/admin/departments/${groupId}/members`, { params });
	return res.data;
};

export const getAdminModules = async () => {
	const res = await axiosInstance.get<AdminResponse<AdminModuleCategory[]>>(`/api/v1/teams/admin/modules`);
	return res.data;
};

export const getLicensesSummary = async () => {
	const res = await axiosInstance.get(`/api/v1/teams/admin/licenses/summary`);
	return res.data;
};

export const getAdminUserDetail = async (userId: string) => {
	const res = await axiosInstance.get<AdminResponse<AdminUserDetail>>(`/api/v1/teams/admin/users/${userId}`);
	return res.data;
};

export const updateUserPermissions = async ({ userId, module_permissions }: { userId: string, module_permissions: Record<string, boolean> }) => {
	const res = await axiosInstance.patch(`/api/v1/teams/admin/users/${userId}/permissions`, { module_permissions });
	return res.data;
};

export const assignUserLicense = async ({ userId, subscription_plan_id }: { userId: string, subscription_plan_id: string }) => {
	const res = await axiosInstance.post(`/api/v1/teams/admin/users/${userId}/licenses`, { subscription_plan_id });
	return res.data;
};

export const createCheckoutSession = async ({ items }: { items: { plan_key: string, quantity: number }[] }) => {
	const res = await axiosInstance.post(`/api/v1/teams/admin/licenses/checkout`, { items });
	return res.data;
};

export const deleteAdminUser = async (userId: string) => {
	const res = await axiosInstance.delete(`/api/v1/teams/admin/users/${userId}`);
	return res.data;
};

export const activateAdminUser = async (userId: string) => {
	const res = await axiosInstance.post(`/api/v1/teams/admin/users/${userId}/activate`);
	return res.data;
};

export const deactivateAdminUser = async (userId: string) => {
	const res = await axiosInstance.post(`/api/v1/teams/admin/users/${userId}/deactivate`);
	return res.data;
};

export const resendInvitation = async (userId: string) => {
	const res = await axiosInstance.post(`/api/v1/teams/admin/users/${userId}/resend-invitation`);
	return res.data;
};

