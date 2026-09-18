"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SALES_TEAM_ROLES } from "../../constants/salesTeamRoles";
import { getSalesRegionLabelKey } from "../../constants/salesTaxonomy";
import {
	SALES_STICKY_ACTION_CELL_CLASS,
	SALES_STICKY_ACTION_HEAD_CLASS,
} from "../../constants/salesTheme";
import type { SalesTeamMember, SalesTeamRole } from "../../types";
import { formatCurrency } from "../../utils/salesFormatters";
import type { TeamMemberStats } from "../../utils/salesTeam";

const HEAD_CLASS = "h-11 px-5 text-xs font-medium uppercase tracking-wide text-slate-500";
const NUMBER_CLASS = "text-right tabular-nums";

const NUMBER_COLUMNS = [
	localizationConstants.salesCompaniesTitle,
	localizationConstants.salesDashboardColumnQuotes,
	localizationConstants.salesDashboardColumnDeals,
	localizationConstants.salesDashboardColumnMeetings,
	localizationConstants.salesBookerColumnCalls,
	localizationConstants.salesDashboardColumnInvoiced,
];

type TeamTableProps = {
	members: SalesTeamMember[];
	stats: Record<string, TeamMemberStats>;
	onRoleChange: (memberId: string, role: SalesTeamRole) => void;
	onRemove: (memberId: string) => void;
};

/** Who is in the organisation, what they do, and what they have delivered. */
export function TeamTable({
	members,
	stats,
	onRoleChange,
	onRemove,
}: TeamTableProps) {
	const t = useTranslate();

	return (
		<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
			<h2 className="border-b border-slate-200 px-5 py-4 text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.salesTeamTableTitle} />
			</h2>

			{members.length === 0 ? (
				<p className="px-5 py-8 text-center text-sm text-slate-500">
					<Translate text={localizationConstants.salesTeamEmpty} />
				</p>
			) : (
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								{[
									localizationConstants.salesBookerColumnName,
									localizationConstants.salesTeamColumnRole,
									localizationConstants.salesColumnRegion,
									localizationConstants.salesTeamColumnContact,
								].map((labelKey) => (
									<TableHead key={labelKey} className={HEAD_CLASS}>
										<Translate text={labelKey} />
									</TableHead>
								))}
								{NUMBER_COLUMNS.map((labelKey) => (
									<TableHead key={labelKey} className={`${HEAD_CLASS} ${NUMBER_CLASS}`}>
										<Translate text={labelKey} />
									</TableHead>
								))}
								<TableHead
									className={`${HEAD_CLASS} ${NUMBER_CLASS} ${SALES_STICKY_ACTION_HEAD_CLASS}`}
								>
									<Translate text={localizationConstants.salesColumnAction} />
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{members.map((member) => {
								const row = stats[member.id];
								const regionKey = getSalesRegionLabelKey(member.region);

								return (
									<TableRow key={member.id} className="group">
										<TableCell className="px-5 py-3 font-medium text-slate-900">
											{member.name}
										</TableCell>
										<TableCell className="px-5">
											<Select
												value={member.role}
												onValueChange={(value) =>
													onRoleChange(member.id, value as SalesTeamRole)
												}
											>
												<SelectTrigger
													aria-label={t(localizationConstants.salesTeamColumnRole)}
													className="h-9 w-[150px]"
												>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{SALES_TEAM_ROLES.map((role) => (
														<SelectItem key={role.id} value={role.id}>
															<Translate text={role.labelKey} />
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</TableCell>
										<TableCell className="px-5 text-slate-600">
											{regionKey ? t(regionKey) : member.region}
										</TableCell>
										<TableCell className="px-5 text-slate-600">
											<a className="block hover:underline" href={`mailto:${member.email}`}>
												{member.email}
											</a>
											<a
												className="block text-xs tabular-nums text-slate-500 hover:underline"
												href={`tel:${member.phone}`}
											>
												{member.phone}
											</a>
										</TableCell>
										<TableCell className={NUMBER_CLASS}>{row.customers}</TableCell>
										<TableCell className={NUMBER_CLASS}>{row.quotes}</TableCell>
										<TableCell className={NUMBER_CLASS}>{row.deals}</TableCell>
										<TableCell className={NUMBER_CLASS}>{row.meetings}</TableCell>
										<TableCell className={NUMBER_CLASS}>{row.calls}</TableCell>
										<TableCell className={NUMBER_CLASS}>
											{formatCurrency(row.invoiced)}
										</TableCell>
										<TableCell
											className={`${NUMBER_CLASS} px-5 ${SALES_STICKY_ACTION_CELL_CLASS}`}
										>
											<ConfirmDialog
												title={t(localizationConstants.salesTeamRemoveConfirmTitle)}
												description={t(
													localizationConstants.salesTeamRemoveConfirmDescription,
												)}
												confirmText={t(localizationConstants.salesConfirmLabel)}
												cancelText={t(localizationConstants.salesCancelButton)}
												onConfirm={() => onRemove(member.id)}
												trigger={
													<Button
														type="button"
														variant="ghost"
														size="icon"
														aria-label={t(localizationConstants.salesTeamRemoveAction)}
														className="cursor-pointer text-slate-500 hover:text-red-600 active:scale-[0.98]"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												}
											/>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			)}
		</section>
	);
}
