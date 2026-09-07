"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { SupportAgent } from "../../types";
import { initialsOf } from "../../utils/supportFormatters";
import { SupportLineBadge } from "../SupportBadges";

type AgentTableProps = {
	agents: SupportAgent[];
};

const COLUMN_KEYS = [
	localizationConstants.supportAgentColumnName,
	localizationConstants.supportAgentColumnCountry,
	localizationConstants.supportAgentColumnRole,
	localizationConstants.supportAgentColumnLine,
	localizationConstants.supportAgentColumnStatus,
	localizationConstants.supportAgentColumnTickets,
];

export function AgentTable({ agents }: AgentTableProps) {
	return (
		<div className="overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow>
						{COLUMN_KEYS.map((labelKey, index) => (
							<TableHead
								key={labelKey}
								className={`text-xs font-medium tracking-wide text-slate-500 ${
									index === COLUMN_KEYS.length - 1 ? "text-right" : ""
								}`}
							>
								<Translate text={labelKey} />
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{agents.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={COLUMN_KEYS.length}
								className="h-32 text-center text-sm text-slate-500"
							>
								<Translate text={localizationConstants.supportAgentsEmpty} />
							</TableCell>
						</TableRow>
					) : (
						agents.map((agent) => (
							<TableRow key={agent.id} className="hover:bg-slate-50/70">
								<TableCell>
									<span className="flex items-center gap-2.5">
										<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
											{initialsOf(agent.name)}
										</span>
										<span className="font-medium text-slate-900">
											{agent.name}
										</span>
									</span>
								</TableCell>
								<TableCell className="text-slate-600">
									{agent.country}
								</TableCell>
								<TableCell className="text-slate-600">
									<Translate text={agent.roleKey} />
								</TableCell>
								<TableCell>
									<SupportLineBadge line={agent.line} />
								</TableCell>
								<TableCell>
									<span
										className={`inline-flex items-center gap-1.5 text-sm ${
											agent.online ? "text-emerald-700" : "text-slate-500"
										}`}
									>
										<span
											aria-hidden
											className={`h-2 w-2 rounded-full ${
												agent.online ? "bg-emerald-500" : "bg-slate-300"
											}`}
										/>
										<Translate
											text={
												agent.online
													? localizationConstants.supportOnline
													: localizationConstants.supportOffline
											}
										/>
									</span>
								</TableCell>
								<TableCell className="text-right tabular-nums text-slate-900">
									{agent.activeTickets}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
