"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStatus } from "@/context/AuthContext";
import { getProfessionalProject } from "../../services/professionalProjectService";

export function useProjectIdentity(projectId: string) {
	const { company, isAuthenticated } = useAuthStatus();
	const query = useQuery({
		queryKey: ["professional-project", company?.id, projectId],
		queryFn: () => getProfessionalProject(projectId),
		enabled: Boolean(company?.id && isAuthenticated && projectId),
		retry: false,
	});
	return { ...query, isLoading: query.isLoading || !company };
}
