"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ActionsToolbar } from "@/components/table/ActionsToolbar";
import { TablePagination } from "@/components/table/TablePagination";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useTicketFilters } from "../hooks/useTicketFilters";
import type {
	SupportAgent,
	SupportTicket,
	TicketLineFilter,
} from "../types";
import { TicketTableRow } from "./TicketTableRow";

type TicketTableProps = {
	tickets: SupportTicket[];
	agents: SupportAgent[];
	onCreateTicket: () => void;
};

const COLUMN_KEYS = [
	localizationConstants.supportColumnTicket,
	localizationConstants.supportColumnCustomer,
	localizationConstants.supportColumnChannel,
	localizationConstants.supportColumnLine,
	localizationConstants.supportColumnPriority,
	localizationConstants.supportColumnStatus,
	localizationConstants.supportColumnAssignee,
	localizationConstants.supportColumnSla,
	localizationConstants.supportColumnAction,
];

const LINE_FILTERS: { id: TicketLineFilter; labelKey: string }[] = [
	{ id: "all", labelKey: localizationConstants.supportFilterAll },
	{ id: "first", labelKey: localizationConstants.supportLineFirst },
	{ id: "second", labelKey: localizationConstants.supportLineSecond },
	{ id: "escalated", labelKey: localizationConstants.supportFilterEscalated },
];

export function TicketTable({
	tickets,
	agents,
	onCreateTicket,
}: TicketTableProps) {
	const {
		lineFilter,
		query,
		currentPage,
		pageSize,
		totalPages,
		filteredCount,
		visibleTickets,
		changeLineFilter,
		changeQuery,
		changePageSize,
		setPage,
	} = useTicketFilters(tickets, agents);

	return (
		<section className="@container rounded-xl border border-slate-200 bg-white shadow-2xs">
			<div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 px-5 pt-5 pb-4">
				<div>
					<h2 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.supportTicketsTitle} />
					</h2>
					<p className="text-sm text-slate-500">
						<Translate text={localizationConstants.supportTicketsSubtitle} />
					</p>
				</div>
				<Tabs
					value={lineFilter}
					onValueChange={(value) =>
						changeLineFilter(value as TicketLineFilter)
					}
				>
					<TabsList variant="line" className="h-9">
						{LINE_FILTERS.map((filter) => (
							<TabsTrigger
								key={filter.id}
								value={filter.id}
								className="cursor-pointer px-3 text-sm"
							>
								<Translate text={filter.labelKey} />
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>

			<ActionsToolbar
				className="flex-wrap gap-y-3"
				searchValue={query}
				onSearchChange={changeQuery}
				searchPlaceholder={
					localizationConstants.supportSearchTicketsPlaceholder
				}
				onCreateClick={onCreateTicket}
				createButtonLabel={localizationConstants.supportNewTicketButton}
			/>

			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							{COLUMN_KEYS.map((labelKey, index) => (
								<TableHead
									key={labelKey}
									className={`text-xs font-medium tracking-wide text-slate-500 ${
										index >= COLUMN_KEYS.length - 2 ? "text-right" : ""
									}`}
								>
									<Translate text={labelKey} />
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{visibleTickets.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={COLUMN_KEYS.length}
									className="h-32 text-center text-sm text-slate-500"
								>
									<Translate
										text={localizationConstants.supportNoTicketsMatch}
									/>
								</TableCell>
							</TableRow>
						) : (
							visibleTickets.map((ticket) => (
								<TicketTableRow
									key={ticket.id}
									ticket={ticket}
									agents={agents}
								/>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{filteredCount > 0 ? (
				<TablePagination
					currentPage={currentPage}
					totalPages={totalPages}
					pageSize={pageSize}
					onPageChange={setPage}
					onPageSizeChange={changePageSize}
				/>
			) : null}
		</section>
	);
}
