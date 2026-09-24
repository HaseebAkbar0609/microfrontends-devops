import axiosInstance from "@/lib/axiosInstance";

export const getAdminUsers = async (params: Record<string, unknown>) => {
	const res = await axiosInstance.get("/professionals/admin/users", { params });
	return res.data;
};

export const getAdminUsersSummary = async () => {
	const res = await axiosInstance.get("/professionals/admin/users/summary");
	return res.data;
};

export const createAdminUser = async (data: unknown) => {
	const res = await axiosInstance.post("/professionals/admin/users", data);
	return res.data;
};

export const updateAdminUser = async ({ userId, data }: { userId: string, data: unknown }) => {
	const res = await axiosInstance.patch(`/professionals/admin/users/${userId}`, data);
	return res.data;
};

export const getAdminRoleOptions = async () => {
	const res = await axiosInstance.get("/professionals/admin/roles/options");
	return res.data;
};

export const getAdminTypeOptions = async () => {
	const res = await axiosInstance.get("/professionals/admin/types/options");
	return res.data;
};

export const getAdminGroups = async (params: Record<string, unknown>) => {
	const res = await axiosInstance.get("/professionals/admin/groups", { params });
	return res.data;
};

export const createAdminGroup = async (data: unknown) => {
	const res = await axiosInstance.post("/professionals/admin/groups", data);
	return res.data;
};

export const updateAdminGroup = async ({ groupId, data }: { groupId: string, data: unknown }) => {
	const res = await axiosInstance.patch(`/professionals/admin/groups/${groupId}`, data);
	return res.data;
};

export const getAdminGroupMembers = async ({ groupId, params }: { groupId: string, params?: Record<string, unknown> }) => {
	const res = await axiosInstance.get(`/professionals/admin/groups/${groupId}/members`, { params });
	return res.data;
};

export const getAvailableModules = async () => {
	const res = await axiosInstance.get(`/professionals/admin/permissions/modules`);
	return res.data;
};

export const getLicensesSummary = async () => {
	const res = await axiosInstance.get(`/professionals/admin/licenses/summary`);
	return res.data;
};

export const getAdminUserDetail = async (userId: string) => {
	const res = await axiosInstance.get(`/professionals/admin/users/${userId}`);
	return res.data;
};

export const updateUserPermissions = async ({ userId, module_permissions }: { userId: string, module_permissions: Record<string, boolean> }) => {
	const res = await axiosInstance.patch(`/professionals/admin/users/${userId}/permissions`, { module_permissions });
	return res.data;
};

export const assignUserLicense = async ({ userId, subscription_plan_id }: { userId: string, subscription_plan_id: string }) => {
	const res = await axiosInstance.post(`/professionals/admin/users/${userId}/licenses`, { subscription_plan_id });
	return res.data;
};

export const createCheckoutSession = async ({ items }: { items: { plan_key: string, quantity: number }[] }) => {
	const res = await axiosInstance.post(`/professionals/admin/licenses/checkout`, { items });
	return res.data;
};

export const getAdminUserOptions = async (params?: Record<string, unknown>) => {
	const res = await axiosInstance.get("/professionals/admin/users/options", { params });
	return res.data;
};
