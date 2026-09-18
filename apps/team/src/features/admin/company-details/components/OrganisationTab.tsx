"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Edit, Eye, EllipsisVertical, Save, UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ActionsToolbar } from "@/components/table/ActionsToolbar";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import {
	DUMMY_ORGANISATION_MEMBERS,
	EMPLOYEE_STATUS_CONFIG,
	EMPLOYMENT_TYPE_LABEL,
	type EmployeeStatus,
	type OrganisationMember,
} from "../constants/organisation";
import { NewEmployeeDialog } from "./NewEmployeeDialog";

const COLUMNS = [
	{ key: "contactNo", labelKey: localizationConstants.adminContactNoLabel, width: "w-[110px]" },
	{ key: "name", labelKey: localizationConstants.nameLabel, width: "w-[170px]" },
	{ key: "position", labelKey: localizationConstants.adminPositionLabel, width: "w-[140px]" },
	{ key: "idNumber", labelKey: localizationConstants.adminIdNumberLabel, width: "w-[140px]" },
	{ key: "status", labelKey: localizationConstants.statusLabel, width: "w-[170px]" },
	{ key: "type", labelKey: localizationConstants.typeLabel, width: "w-[110px]" },
	{ key: "startDate", labelKey: localizationConstants.startDateLabel, width: "w-[130px]" },
	{ key: "location", labelKey: localizationConstants.adminLocationLabel, width: "w-[130px]" },
] as const;

type SortKey = (typeof COLUMNS)[number]["key"];

function StatusBadge({ status }: { status: EmployeeStatus }) {
	const { labelKey, className } = EMPLOYEE_STATUS_CONFIG[status];
	return (
		<span className={`inline-flex items-center rounded-[6px] px-2.5 py-1 text-xs font-semibold ${className}`}>
			<Translate text={labelKey} />
		</span>
	);
}

export function OrganisationTab() {
	const t = useTranslate();
	const [members, setMembers] = useState<OrganisationMember[]>(DUMMY_ORGANISATION_MEMBERS);
	const [isNewEmployeeOpen, setIsNewEmployeeOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [sortKey, setSortKey] = useState<SortKey | null>(null);
	const [sortAsc, setSortAsc] = useState(true);

	function toggleSort(key: SortKey) {
		if (sortKey === key) {
			setSortAsc((prev) => !prev);
		} else {
			setSortKey(key);
			setSortAsc(true);
		}
	}

	const filteredMembers = useMemo(() => {
		let result = members;

		if (search.trim()) {
			const query = search.trim().toLowerCase();
			result = result.filter(
				(member) =>
					member.name.toLowerCase().includes(query) ||
					member.contactNo.toLowerCase().includes(query) ||
					member.position.toLowerCase().includes(query)
			);
		}

		if (statusFilter) {
			result = result.filter((member) => member.status === statusFilter);
		}

		if (sortKey) {
			result = [...result].sort((a, b) => {
				const diff = String(a[sortKey]).localeCompare(String(b[sortKey]));
				return sortAsc ? diff : -diff;
			});
		}

		return result;
	}, [members, search, statusFilter, sortKey, sortAsc]);

	return (
		<div className="flex h-full min-h-0 flex-col">
		<div className="flex min-h-0 flex-1 flex-col rounded-md border border-slate-200 bg-white shadow-sm">
			<div className="shrink-0">
			<ActionsToolbar
				searchValue={search}
				onSearchChange={setSearch}
				filters={[
					{
						label: localizationConstants.filterLabel,
						value: statusFilter,
						onFilterChange: setStatusFilter,
						options: Object.entries(EMPLOYEE_STATUS_CONFIG).map(([value, config]) => ({
							value,
							label: config.labelKey,
						})),
					},
				]}
				onCreateClick={() => setIsNewEmployeeOpen(true)}
				createButtonLabel={localizationConstants.adminNewEmployeeLabel}
			/>
			</div>

			<div className="min-h-0 flex-1 overflow-auto">
				<Table>
					<TableHeader>
						<TableRow className="border-slate-200 bg-slate-50">
							{COLUMNS.map((col) => (
								<TableHead key={col.key} className={`${col.width} h-10 px-4 text-xs font-semibold text-slate-500`}>
									<button
										type="button"
										className="flex cursor-pointer items-center gap-1"
										onClick={() => toggleSort(col.key)}
									>
										<Translate text={col.labelKey} />
										<ArrowUpDown className="h-3 w-3" />
									</button>
								</TableHead>
							))}
							<TableHead className="w-[140px]" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredMembers.length === 0 && (
							<TableRow>
								<TableCell colSpan={COLUMNS.length + 1} className="h-32 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.noResultsFound} />
								</TableCell>
							</TableRow>
						)}
						{filteredMembers.map((member) => (
							<TableRow key={member.id} className="h-14 border-slate-200 hover:bg-slate-50">
								<TableCell className="px-4 text-sm font-medium text-slate-900">
									{member.contactNo}
								</TableCell>
								<TableCell className="px-4 text-sm font-semibold text-slate-900">
									{member.name}
								</TableCell>
								<TableCell className="px-4 text-sm text-slate-600">
									{member.position}
								</TableCell>
								<TableCell className="px-4 text-sm text-slate-600">
									{member.idNumber}
								</TableCell>
								<TableCell className="px-4">
									<StatusBadge status={member.status} />
								</TableCell>
								<TableCell className="px-4 text-sm text-slate-600">
									<Translate text={EMPLOYMENT_TYPE_LABEL[member.type]} />
								</TableCell>
								<TableCell className="px-4 text-sm text-slate-600">
									{member.startDate}
								</TableCell>
								<TableCell className="px-4 text-sm text-slate-600">
									{member.location}
								</TableCell>
								<TableCell className="px-2">
									<div className="flex items-center justify-end gap-2">
										<Button
											variant="outline"
											size="sm"
											className="h-8 rounded-md border-slate-200 bg-white px-3 text-xs font-medium text-[#0F172A] hover:bg-slate-50"
										>
											<Translate text={localizationConstants.adminViewProfileLabel} />
										</Button>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon" className="h-8 w-8">
													<EllipsisVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-40">
												<DropdownMenuItem>
													<Eye className="mr-2 h-4 w-4" />
													<Translate text={localizationConstants.adminViewProfileLabel} />
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Edit className="mr-2 h-4 w-4" />
													<Translate text={localizationConstants.editLabel} />
												</DropdownMenuItem>
												<DropdownMenuItem className="text-red-500 focus:text-red-500">
													<UserX className="mr-2 h-4 w-4" />
													<Translate text={localizationConstants.deactivateLabel} />
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>

			<div className="shrink-0 flex items-center justify-end gap-3 py-3 bg-white border-t border-[#E2E8F0]">
				<button
					type="button"
					className="cursor-pointer h-9 px-4 text-sm font-medium text-[#374151] border border-[#E2E8F0] rounded-md hover:bg-slate-50 transition-colors"
				>
					<Translate text={localizationConstants.cancelLabel} />
				</button>
				<Button
					type="button"
					className="h-9 px-5 gap-1.5 bg-[#09090B] text-white text-sm font-medium hover:bg-[#27272A]"
					onClick={() => showToast("success", t(localizationConstants.save))}
				>
					<Save size={16} />
					<Translate text={localizationConstants.save} />
				</Button>
			</div>

			<NewEmployeeDialog
				open={isNewEmployeeOpen}
				onOpenChange={setIsNewEmployeeOpen}
				members={members}
				onCreated={(member) => setMembers((previous) => [...previous, member])}
			/>
		</div>
	);
}
