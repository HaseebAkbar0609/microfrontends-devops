import { PERMISSIONS } from "@/constants/permissions";
import { Role } from "@/constants/roles";

export function hasPermission(
  role: Role,
  permission: keyof typeof PERMISSIONS
) {
  return (PERMISSIONS[permission] as Role[])?.includes(role);
}