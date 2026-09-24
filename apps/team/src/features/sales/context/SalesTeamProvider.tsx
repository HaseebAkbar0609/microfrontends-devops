"use client";

import {
	createContext,
	useCallback,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { SALES_TEAM_SEED } from "../constants/salesTeam.mock";
import type { SalesTeamMember, SalesTeamRole } from "../types";
import { createId } from "../utils/salesFactories";

export type SalesTeamContextValue = {
	members: SalesTeamMember[];
	addMember: (draft: Omit<SalesTeamMember, "id">) => void;
	setMemberRole: (memberId: string, role: SalesTeamRole) => void;
	removeMember: (memberId: string) => void;
};

export const SalesTeamContext = createContext<SalesTeamContextValue | null>(null);

/**
 * The sales organisation for the length of the session. Held beside the CRM
 * companies so the meeting booker roster and the results table agree.
 */
export function SalesTeamProvider({ children }: { children: ReactNode }) {
	const [members, setMembers] = useState<SalesTeamMember[]>(SALES_TEAM_SEED);

	const addMember = useCallback((draft: Omit<SalesTeamMember, "id">) => {
		setMembers((previous) => [...previous, { ...draft, id: createId("tm") }]);
	}, []);

	const setMemberRole = useCallback((memberId: string, role: SalesTeamRole) => {
		setMembers((previous) =>
			previous.map((member) =>
				member.id === memberId ? { ...member, role } : member,
			),
		);
	}, []);

	const removeMember = useCallback((memberId: string) => {
		setMembers((previous) =>
			previous.filter((member) => member.id !== memberId),
		);
	}, []);

	const value = useMemo<SalesTeamContextValue>(
		() => ({ members, addMember, setMemberRole, removeMember }),
		[members, addMember, setMemberRole, removeMember],
	);

	return (
		<SalesTeamContext.Provider value={value}>
			{children}
		</SalesTeamContext.Provider>
	);
}
