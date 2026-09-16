"use client";

import { useState } from "react";
import { ChevronDown, Plus, Search } from "lucide-react";

import { QAThreadCreateDialog } from "@/components/common/QAThreadCreateDialog";
import { QAThreadFilterChips } from "@/components/common/QAThreadFilterChips";
import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuthStatus } from "@/context/AuthContext";
import { useCurrentUserName } from "@/hooks/useCurrentUserName";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { OrderQaBoardState } from "../hooks/useOrderQaBoard";
import {
	ORDER_QA_CHIP_LABELS,
	ORDER_QA_CREATE_LABELS,
	ORDER_QA_FILTER_ENTRIES,
	ORDER_QA_FUNCTION_OPTIONS,
	ORDER_QA_ROLE_LABELS,
	ORDER_QA_STATUS_OPTIONS,
	ORDER_QA_TYPE_OPTIONS,
} from "../orderQa.config";
import type { OrderQaRole, OrderQuestion } from "../types";
import { OrderQaColumns } from "./OrderQaColumns";

export interface OrderQaBoardProps {
	board: OrderQaBoardState;
	archivedOnly?: boolean;
}

/**
 * An order's Q&A board: Sök and Filter ▾ with Skapa ny fråga, the
 * Företag / Kund / Status chips, and the three columns.
 */
export function OrderQaBoard({ board, archivedOnly = false }: OrderQaBoardProps) {
	const t = useTranslate();
	const { company } = useAuthStatus();
	const currentUserName = useCurrentUserName(localizationConstants.projectQaYou);

	const [creating, setCreating] = useState(false);
	const [pendingDelete, setPendingDelete] = useState<OrderQuestion | null>(null);

	const filterOptions = ORDER_QA_FILTER_ENTRIES.map((entry) => ({
		value: entry.value,
		label: t(entry.label),
	}));

	const selectedFilterOption = filterOptions.find(
		(opt) => opt.value === board.filter,
	);

	const formatRole = (value: string) => {
		const key = ORDER_QA_ROLE_LABELS[value as OrderQaRole];
		return key ? t(key) : value;
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Top Controls Toolbar: Search, Filter Dropdown, and + Skapa ny fråga */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
				<div className="flex flex-1 flex-wrap items-center gap-3 sm:gap-4 min-w-0">
					<div className="relative w-full sm:w-72 max-w-full">
						<Search
							aria-hidden
							className="absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2 text-slate-400"
						/>
						<Input
							value={board.search}
							onChange={(event) => board.setSearch(event.target.value)}
							placeholder={t(localizationConstants.search)}
							aria-label={t(localizationConstants.search)}
							className="h-10 w-full rounded-none border-0 border-b border-slate-200 pl-6 shadow-none focus-visible:border-slate-900 focus-visible:ring-0 text-slate-900 placeholder:text-slate-400"
						/>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="outline"
								className="h-10 cursor-pointer gap-2 rounded-md border-slate-200 bg-transparent text-sm font-medium text-slate-900 shadow-none hover:bg-slate-100 hover:text-slate-950 transition-colors shrink-0"
							>
								{selectedFilterOption ? (
									selectedFilterOption.label
								) : (
									<Translate text={localizationConstants.filter} />
								)}
								<ChevronDown className="h-4 w-4 text-slate-900 shrink-0" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							className="w-56 rounded-md border border-slate-200 bg-white p-1 shadow-md"
						>
							<DropdownMenuItem
								onClick={() => board.setFilter(null)}
								className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
							>
								<Translate text={localizationConstants.projectListFilterAll} />
							</DropdownMenuItem>
							{filterOptions.map((option) => (
								<DropdownMenuItem
									key={option.value}
									onClick={() => board.setFilter(option.value)}
									className="cursor-pointer rounded-md px-3 py-2 text-sm text-slate-900 hover:bg-slate-100"
								>
									{option.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex items-center gap-3 shrink-0">
					<Button
						type="button"
						onClick={() => setCreating(true)}
						className="h-10 w-full sm:w-auto cursor-pointer gap-2 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white shadow-xs hover:bg-zinc-800 transition-colors"
					>
						<Plus size={20} aria-hidden />
						<Translate text={localizationConstants.projectQaCreate} />
					</Button>
				</div>
			</div>

			<QAThreadFilterChips
				companies={board.companies}
				companyOptions={board.companyOptions}
				onToggleCompany={board.toggleCompany}
				roles={board.roles}
				roleOptions={board.roleOptions}
				onToggleRole={board.toggleRole}
				formatRole={formatRole}
				statuses={board.statuses}
				statusOptions={ORDER_QA_STATUS_OPTIONS}
				onToggleStatus={board.toggleStatus}
				onReset={board.resetFilters}
				hasFilters={board.hasFilters}
				labels={ORDER_QA_CHIP_LABELS}
			/>

			<OrderQaColumns
				board={board}
				archivedOnly={archivedOnly}
				currentUserName={currentUserName}
				onRequestDelete={(question) =>
					/* Deferred so the row menu finishes closing first */
					setTimeout(() => setPendingDelete(question), 0)
				}
			/>

			<QAThreadCreateDialog
				open={creating}
				onOpenChange={setCreating}
				typeOptions={ORDER_QA_TYPE_OPTIONS}
				subjectOptions={ORDER_QA_FUNCTION_OPTIONS}
				labels={ORDER_QA_CREATE_LABELS}
				showSendIcon
				contentClassName="sm:max-w-[690px] min-h-[418px] rounded-[8px] border border-slate-200"
				onSubmit={(draft) =>
					board.create(draft, currentUserName, company?.company_name ?? "")
				}
			/>

			<ConfirmActionDialog
				open={pendingDelete !== null}
				onOpenChange={(next) => {
					if (!next) setPendingDelete(null);
				}}
				title={localizationConstants.projectQaDeleteTitle}
				description={localizationConstants.projectQaDeleteBody}
				confirmLabel={localizationConstants.projectQaDeleteAction}
				subject={pendingDelete?.sender}
				confirmButtonClassName="bg-zinc-900 hover:bg-zinc-800 text-white font-medium shadow-xs"
				onConfirm={() => {
					if (!pendingDelete) return;
					board.remove(pendingDelete.id);
					setPendingDelete(null);
				}}
			/>
		</div>
	);
}

export default OrderQaBoard;
