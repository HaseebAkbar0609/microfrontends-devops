"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Plus, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { DUMMY_PARTNER_REGISTER, type PartnerRegisterRow } from "../constants/partners";

const COLUMNS = [
	{ key: "company", labelKey: localizationConstants.companyLabel, width: "w-40" },
	{ key: "category", labelKey: localizationConstants.categoryLabel, width: "w-32" },
	{ key: "contact", labelKey: localizationConstants.contactLabel, width: "w-40" },
	{ key: "mobile", labelKey: localizationConstants.mobileLabel, width: "w-32" },
	{ key: "type", labelKey: localizationConstants.typeLabel, width: "w-28" },
] as const;

type SortKey = (typeof COLUMNS)[number]["key"];

export function PartnersRegisterTab() {
	const t = useTranslate();
	const router = useRouter();
	const [partners] = useState<PartnerRegisterRow[]>(DUMMY_PARTNER_REGISTER);
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

	const filteredPartners = useMemo(() => {
		let result = partners;

		if (search.trim()) {
			const query = search.trim().toLowerCase();
			result = result.filter(
				(row) =>
					row.company.toLowerCase().includes(query) ||
					row.contact.toLowerCase().includes(query)
			);
		}

		if (statusFilter) {
			result = result.filter((row) => row.status === statusFilter);
		}

		if (sortKey) {
			result = [...result].sort((a, b) => {
				const diff = String(a[sortKey]).localeCompare(String(b[sortKey]));
				return sortAsc ? diff : -diff;
			});
		}

		return result;
	}, [partners, search, statusFilter, sortKey, sortAsc]);

	return (
		<div className="flex flex-col gap-4 mb-10">
			<ActionsToolbar
				className="px-0 py-0"
				searchValue={search}
				onSearchChange={setSearch}
				filters={[
					{
						label: localizationConstants.filterLabel,
						value: statusFilter,
						onFilterChange: setStatusFilter,
						options: [
							{ value: "active", label: localizationConstants.activeLabel },
							{ value: "closed", label: localizationConstants.adminStatusClosed },
						],
					},
				]}
			/>

			<div className="flex flex-col rounded-md border border-slate-200 bg-white shadow-sm">
				<div className="flex min-h-14 items-center justify-between gap-4 border-b border-[#E4E4E7] bg-slate-200 px-4 py-2">
					<h2 className="text-base font-medium text-[#09090B]">
						<Translate text={localizationConstants.partnerListTitle} />
					</h2>
					<Button className="h-9 gap-2 rounded-md bg-[#18181B] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#18181B]/90">
						<Plus className="h-4 w-4" />
						<Translate text={localizationConstants.addPartner} />
					</Button>
				</div>

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
							<TableHead className="w-40 h-10 px-4 text-xs font-semibold text-slate-500">
								<Translate text={localizationConstants.actionColumnLabel} />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredPartners.length === 0 && (
							<TableRow>
								<TableCell colSpan={COLUMNS.length + 1} className="h-32 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.noResultsFound} />
								</TableCell>
							</TableRow>
						)}
						{filteredPartners.map((partner) => (
							<TableRow
								key={partner.id}
								className="h-14 cursor-pointer border-slate-200 hover:bg-slate-50"
								onClick={() => router.push(`/partners/admin/${partner.id}`)}
							>
								<TableCell className="px-4 text-sm font-semibold text-slate-900">{partner.company}</TableCell>
								<TableCell className="px-4 text-sm text-slate-600">{partner.category}</TableCell>
								<TableCell className="px-4 text-sm text-slate-600">
									<div className="flex items-center gap-2">
										<UserRound className="h-3.5 w-3.5 text-slate-400" />
										{partner.contact}
									</div>
								</TableCell>
								<TableCell className="px-4 text-sm text-slate-600">{partner.mobile}</TableCell>
								<TableCell className="px-4 text-sm text-slate-600">{partner.type}</TableCell>
								<TableCell className="px-4" onClick={(event) => event.stopPropagation()}>
									<div className="flex items-center gap-3">
										<span
											className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white ${
												partner.status === "active" ? "bg-green-500" : "bg-red-500"
											}`}
										>
											<Translate
												text={
													partner.status === "active"
														? localizationConstants.activeLabel
														: localizationConstants.adminStatusClosed
												}
											/>
										</span>
										<button
											type="button"
											className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
											onClick={() => showToast("info", t(localizationConstants.editLabel))}
										>
											<Translate text={localizationConstants.editLabel} />
										</button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
