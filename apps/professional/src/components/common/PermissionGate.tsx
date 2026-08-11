"use client";

import { ReactNode } from "react";
import { PERMISSIONS } from "@/constants/permissions";
import { ROLES, Role } from "@/constants/roles";
import { hasPermission } from "@/lib/hasPermission";

export interface PermissionGateProps {
	permission: keyof typeof PERMISSIONS;
	role?: Role;
	fallback?: ReactNode;
	children: ReactNode;
}

export function PermissionGate({
	permission,
	role = ROLES.MANAGER,
	fallback = null,
	children,
}: PermissionGateProps) {
	const allowed = hasPermission(role, permission);

	if (!allowed) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
