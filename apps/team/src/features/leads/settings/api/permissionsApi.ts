import axiosInstance from "@/lib/axiosInstance";
import type { PermissionRole } from "@/features/leads/settings/types";

export type PermissionsApiData = {
  permissions_matrix?: PermissionRole[];
};

export const fetchPermissions = async (): Promise<PermissionRole[]> => {
  const { data } = await axiosInstance.get<{ data: PermissionsApiData }>("/api/v1/teams/leads/permissions");
  return data.data?.permissions_matrix || [];
};

export const updatePermissions = async (payload: { permissions_matrix: PermissionRole[] }): Promise<PermissionRole[]> => {
  const { data } = await axiosInstance.patch<{ data: PermissionsApiData }>("/api/v1/teams/leads/permissions", payload);
  return data.data?.permissions_matrix || [];
};
