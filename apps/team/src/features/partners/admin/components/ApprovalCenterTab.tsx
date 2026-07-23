"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, UserRound } from "lucide-react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { DUMMY_PARTNER_REGISTER, type PartnerApprovalStatus, type PartnerRegisterRow } from "../constants/partners";

const COLUMNS = [
	{ key: "date", labelKey: localizationConstants.dateLabel, width: "w-28" },
	{ key: "company", labelKey: localizationConstants.companyLabel, width: "w-40" },
	{ key: "category", labelKey: localizationConstants.categoryLabel, width: "w-32" },
	{ key: "contact", labelKey: localizationConstants.contactLabel, width: "w-40" },
	{ key: "mobile", labelKey: localizationConstants.mobileLabel, width: "w-32" },
	{ key: "type", labelKey: localizationConstants.typeLabel, width: "w-28" },
] as const;

type SortKey = (typeof COLUMNS)[number]["key"];

const APPROVAL_STATUS_STYLES: Record<PartnerApprovalStatus, { className: string; labelKey: string }> = {
	approved: { className: "bg-green-500", labelKey: localizationConstants.approvalStatusApproved },
	declined: { className: "bg-red-500", labelKey: localizationConstants.approvalStatusDeclined },
	pending: { className: "bg-orange-500", labelKey: localizationConstants.approvalStatusPending },
	archived: { className: "bg-slate-400", labelKey: localizationConstants.approvalStatusArchived },
};

export function ApprovalCenterTab() {
	const t = useTranslate();
	const router = useRouter();
	const [partners] = useState<PartnerRegisterRow[]>(DUMMY_PARTNER_REGISTER);
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

	const sortedPartners = useMemo(() => {
		if (!sortKey) {
			return partners;
		}

		return [...partners].sort((a, b) => {
			const diff = String(a[sortKey]).localeCompare(String(b[sortKey]));
			return sortAsc ? diff : -diff;
		});
	}, [partners, sortKey, sortAsc]);

	return (
		<div className="flex flex-col rounded-md border border-slate-200 bg-white shadow-sm mb-10">
			<div className="flex min-h-14 items-center gap-4 border-b border-[#E4E4E7] bg-slate-200 px-4 py-2">
				<h2 className="text-base font-medium text-[#09090B]">
					<Translate text={localizationConstants.partnerListTitle} />
				</h2>
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
					{sortedPartners.length === 0 && (
						<TableRow>
							<TableCell colSpan={COLUMNS.length + 1} className="h-32 text-center text-sm text-slate-500">
								<Translate text={localizationConstants.noResultsFound} />
							</TableCell>
						</TableRow>
					)}
					{sortedPartners.map((partner) => {
						const statusStyle = APPROVAL_STATUS_STYLES[partner.approvalStatus];

						return (
							<TableRow
								key={partner.id}
								className="h-14 cursor-pointer border-slate-200 hover:bg-slate-50"
								onClick={() => router.push(`/partners/admin/${partner.id}`)}
							>
								<TableCell className="px-4 text-sm text-slate-600">{partner.date}</TableCell>
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
											className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white ${statusStyle.className}`}
										>
											<Translate text={statusStyle.labelKey} />
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
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
