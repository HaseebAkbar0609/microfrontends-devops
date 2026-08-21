"use client";

import { Role, ROLES } from "@/constants/roles";
import { useAuthStatus } from "@/context/AuthContext";
import { hasPermission } from "@/lib/hasPermission";

export function useIsTeamAdmin(): boolean {
	const { user } = useAuthStatus();
	const role = (user as { role?: Role } | null)?.role ?? ROLES.WORKER;
	return hasPermission(role, "MANAGE_TEAM_WIDGETS");
}
