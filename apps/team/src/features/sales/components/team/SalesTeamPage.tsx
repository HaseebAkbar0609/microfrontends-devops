"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SALES_PRIMARY_BUTTON_CLASS } from "../../constants/salesTheme";
import { useSalesCompanies } from "../../hooks/useSalesCompanies";
import { useSalesTeam } from "../../hooks/useSalesTeam";
import { getTeamStats } from "../../utils/salesTeam";
import { AddTeamMemberForm } from "./AddTeamMemberForm";
import { TeamKpis } from "./TeamKpis";
import { TeamTable } from "./TeamTable";

/** The sales organisation: who is on the team, their role and their results. */
export default function SalesTeamPage() {
	const { companies } = useSalesCompanies();
	const { members, setMemberRole, removeMember } = useSalesTeam();
	const t = useTranslate();
	const [isAddOpen, setIsAddOpen] = useState(false);

	const stats = useMemo(
		() => getTeamStats(companies, members),
		[companies, members],
	);

	const handleRemove = (memberId: string) => {
		removeMember(memberId);
		showToast("success", t(localizationConstants.salesTeamMemberRemovedToast));
	};

	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-slate-50">
			<header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
				<div>
					<h1 className="text-2xl font-semibold text-slate-900">
						<Translate text={localizationConstants.salesNavSalesOrganisation} />
					</h1>
					<p className="text-sm text-slate-500">
						<Translate text={localizationConstants.salesTeamSubtitle} />
					</p>
				</div>

				<Button
					type="button"
					className={`h-10 cursor-pointer gap-2 active:scale-[0.98] ${SALES_PRIMARY_BUTTON_CLASS}`}
					onClick={() => setIsAddOpen(true)}
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.salesTeamAddButton} />
				</Button>
			</header>

			<div className="flex flex-col gap-5 p-6">
				<TeamKpis members={members} />

				{isAddOpen && <AddTeamMemberForm onClose={() => setIsAddOpen(false)} />}

				<TeamTable
					members={members}
					stats={stats}
					onRoleChange={setMemberRole}
					onRemove={handleRemove}
				/>
			</div>
		</div>
	);
}
