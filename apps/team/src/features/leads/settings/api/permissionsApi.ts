import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import type { PermissionRole } from "@/features/leads/settings/types";

export const PermissionRoleSchema = z.object({
  id: z.string().optional(),
  role: z.string().optional(),
  labelKey: z.string().optional(),
  canView: z.boolean().optional(),
  view_leads: z.boolean().optional(),
  canEdit: z.boolean().optional(),
  edit_leads: z.boolean().optional(),
  canDelete: z.boolean().optional(),
  delete_leads: z.boolean().optional(),
});

export const PermissionsResponseSchema = z.object({
  data: z.object({
    permissions_matrix: z.array(PermissionRoleSchema).optional().default([]),
  }).optional(),
});

export type PermissionsApiData = {
  permissions_matrix?: PermissionRole[];
};

export const fetchPermissions = async (): Promise<PermissionRole[]> => {
  const { data } = await axiosInstance.get("/api/v1/teams/leads/permissions");
  const parsed = PermissionsResponseSchema.parse(data);
  return (parsed.data?.permissions_matrix || []) as PermissionRole[];
};

export const updatePermissions = async (payload: { permissions_matrix: PermissionRole[] }): Promise<PermissionRole[]> => {
  const { data } = await axiosInstance.patch("/api/v1/teams/leads/permissions", payload);
  const parsed = PermissionsResponseSchema.parse(data);
  return (parsed.data?.permissions_matrix || []) as PermissionRole[];
};
