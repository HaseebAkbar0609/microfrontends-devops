import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getAdminUsers,
	getAdminUsersSummary,
	createAdminUser,
	updateAdminUser,
	getAdminRoleOptions,
	getAdminTypeOptions,
	getAdminGroups,
	createAdminGroup,
	updateAdminGroup,
	getAdminGroupMembers,
	getAvailableModules,
	getLicensesSummary,
	getAdminUserDetail,
	updateUserPermissions,
	assignUserLicense,
} from "../api/adminUsers.api";

export const useAdminUsers = (params: Record<string, unknown>) =>
	useQuery({
		queryKey: ["admin-users", params],
		queryFn: () => getAdminUsers(params),
	});

export const useAdminUsersSummary = () =>
	useQuery({
		queryKey: ["admin-users-summary"],
		queryFn: () => getAdminUsersSummary(),
	});

export const useAdminRoleOptions = () =>
	useQuery({
		queryKey: ["admin-role-options"],
		queryFn: () => getAdminRoleOptions(),
	});

export const useAdminTypeOptions = () =>
	useQuery({
		queryKey: ["admin-type-options"],
		queryFn: () => getAdminTypeOptions(),
	});

export const useCreateAdminUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createAdminUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
			queryClient.invalidateQueries({ queryKey: ["admin-users-summary"] });
		},
	});
};

export const useUpdateAdminUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateAdminUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
			queryClient.invalidateQueries({ queryKey: ["admin-users-summary"] });
		},
	});
};

export const useAdminGroups = (params: Record<string, unknown>) =>
	useQuery({
		queryKey: ["admin-groups", params],
		queryFn: () => getAdminGroups(params),
	});

export const useCreateAdminGroup = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createAdminGroup,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-groups"] });
		},
	});
};

export const useUpdateAdminGroup = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateAdminGroup,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-groups"] });
		},
	});
};

export const useAdminGroupMembers = (groupId: string, params?: Record<string, unknown>) =>
	useQuery({
		queryKey: ["admin-group-members", groupId, params],
		queryFn: () => getAdminGroupMembers({ groupId, params }),
		enabled: !!groupId,
	});

export const useAvailableModules = () =>
	useQuery({
		queryKey: ["admin-available-modules"],
		queryFn: () => getAvailableModules(),
	});

export const useLicensesSummary = () =>
	useQuery({
		queryKey: ["admin-licenses-summary"],
		queryFn: () => getLicensesSummary(),
	});

export const useAdminUserDetail = (userId: string) =>
	useQuery({
		queryKey: ["admin-user-detail", userId],
		queryFn: () => getAdminUserDetail(userId),
		enabled: !!userId,
	});

export const useUpdateUserPermissions = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateUserPermissions,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
		},
	});
};

export const useAssignUserLicense = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: assignUserLicense,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
		},
	});
};
