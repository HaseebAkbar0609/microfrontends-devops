"use client";

import { skipToken, useQuery } from "@tanstack/react-query";
import { MATERIAL_QUERY_KEYS } from "../constants/materialStorage.constants";
import { materialWithdrawalService } from "../services/materialWithdrawalService";
import type {
	MaterialLinkTarget,
	MaterialWorkStep,
	WithdrawalLinkType,
} from "../types/materialTransaction.types";
import { WITHDRAWAL_LINK_RULES } from "../utils/materialWithdrawal";

const NO_TARGETS: MaterialLinkTarget[] = [];
const NO_WORK_STEPS: MaterialWorkStep[] = [];

/** The records "Koppla till" offers for the chosen link type, and the chosen project's arbetsmoment. */
export function useWithdrawalLinkOptions(linkType: WithdrawalLinkType, linkId: string) {
	const targetType = linkType === "internal" ? null : linkType;
	const projectId = WITHDRAWAL_LINK_RULES[linkType].hasWorkStep && linkId ? linkId : null;

	const targetsQuery = useQuery({
		queryKey: [...MATERIAL_QUERY_KEYS.linkTargets, targetType],
		queryFn: targetType ? () => materialWithdrawalService.getLinkTargets(targetType) : skipToken,
	});
	const workStepsQuery = useQuery({
		queryKey: [...MATERIAL_QUERY_KEYS.workSteps, projectId],
		queryFn: projectId ? () => materialWithdrawalService.getWorkSteps(projectId) : skipToken,
	});

	return {
		targets: (targetType && targetsQuery.data) || NO_TARGETS,
		workSteps: (projectId && workStepsQuery.data) || NO_WORK_STEPS,
	};
}
