"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { SalesTeamMember } from "../../types";
import { countByRole } from "../../utils/salesTeam";

/** Headcount for the organisation, split by role. */
export function TeamKpis({ members }: { members: SalesTeamMember[] }) {
	const counts = countByRole(members);

	const cards = [
		{
			id: "members",
			labelKey: localizationConstants.salesTeamKpiMembers,
			value: counts.total,
			hintKey: localizationConstants.salesTeamKpiMembersHint,
			accentClassName: "bg-teal-50 text-teal-700",
		},
		{
			id: "sellers",
			labelKey: localizationConstants.salesTeamKpiSellers,
			value: counts.seller,
			hintKey: null,
			accentClassName: "bg-emerald-50 text-emerald-700",
		},
		{
			id: "bookers",
			labelKey: localizationConstants.salesTeamKpiBookers,
			value: counts.booker,
			hintKey: null,
			accentClassName: "bg-slate-100 text-slate-700",
		},
		{
			id: "account-managers",
			labelKey: localizationConstants.salesTeamKpiAccountManagers,
			value: counts.accountManager,
			hintKey: null,
			accentClassName: "bg-amber-50 text-amber-600",
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @5xl:grid-cols-4">
			{cards.map((card) => (
				<div
					key={card.id}
					className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs"
				>
					<span
						className={`inline-flex rounded-md px-2 py-0.5 text-sm font-medium ${card.accentClassName}`}
					>
						<Translate text={card.labelKey} />
					</span>
					<p className="mt-3 text-3xl font-semibold tabular-nums text-slate-900">
						{card.value}
					</p>
					{card.hintKey && (
						<p className="text-sm text-slate-500">
							<Translate text={card.hintKey} />
						</p>
					)}
				</div>
			))}
		</div>
	);
}
