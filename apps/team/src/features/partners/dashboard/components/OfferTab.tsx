"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Plus } from "lucide-react";

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
import {
	DUMMY_PARTNER_OFFERS,
	type OfferPartyStatus,
	type PartnerOfferRow,
} from "../constants/offers";

const PARTY_STATUS_CONFIG: Record<OfferPartyStatus, { labelKey: string; className: string } | null> = {
	approved: { labelKey: localizationConstants.offerApprovedLabel, className: "bg-[#DCFCE7] text-[#16A34A]" },
	pending: { labelKey: localizationConstants.offerPendingLabel, className: "bg-[#FEF3C7] text-[#D97706]" },
	cancelled: { labelKey: localizationConstants.offerCancelLabel, className: "bg-[#FEE2E2] text-[#DC2626]" },
	"n/a": null,
};

const COLUMNS = [
	{ key: "startDate", labelKey: localizationConstants.startDateLabel, width: "w-32" },
	{ key: "endDate", labelKey: localizationConstants.endDateLabel, width: "w-32" },
	{ key: "offerName", labelKey: localizationConstants.partnerOfferTab, width: "w-40" },
	{ key: "b2c", labelKey: localizationConstants.b2cColumnLabel, width: "w-28" },
	{ key: "b2b", labelKey: localizationConstants.b2b, width: "w-28" },
	{ key: "discount", labelKey: localizationConstants.discountLabel, width: "w-28" },
] as const;

type SortKey = (typeof COLUMNS)[number]["key"];

function PartyStatusCell({ status }: { status: OfferPartyStatus }) {
	const config = PARTY_STATUS_CONFIG[status];
	if (!config) {
		return <Translate text={localizationConstants.notApplicableLabel} />;
	}
	return (
		<span className={`inline-flex items-center rounded-[6px] px-2.5 py-1 text-xs font-semibold ${config.className}`}>
			<Translate text={config.labelKey} />
		</span>
	);
}

export function OfferTab() {
	const t = useTranslate();
	const router = useRouter();
	const [offers] = useState<PartnerOfferRow[]>(DUMMY_PARTNER_OFFERS);
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

	const filteredOffers = useMemo(() => {
		let result = offers;

		if (search.trim()) {
			const query = search.trim().toLowerCase();
			result = result.filter((row) => row.offerName.toLowerCase().includes(query));
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
	}, [offers, search, statusFilter, sortKey, sortAsc]);

	return (
		<div className="flex flex-col rounded-md border border-slate-200 bg-white shadow-sm mb-10">
			<div className="flex min-h-14 items-center justify-between gap-4 border-b border-[#E4E4E7] bg-slate-100 px-4 py-2">
				<h2 className="text-base font-medium text-[#09090B]">
					<Translate text={localizationConstants.partnerOfferTab} />
				</h2>
				<Button className="h-9 gap-2 rounded-md bg-[#18181B] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#18181B]/90">
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.addOfferButton} />
				</Button>
			</div>

			<div className="border-b border-slate-200 px-4 py-3">
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
					{filteredOffers.length === 0 && (
						<TableRow>
							<TableCell colSpan={COLUMNS.length + 1} className="h-32 text-center text-sm text-slate-500">
								<Translate text={localizationConstants.noResultsFound} />
							</TableCell>
						</TableRow>
					)}
					{filteredOffers.map((offer) => (
						<TableRow
							key={offer.id}
							className="h-14 cursor-pointer border-slate-200 hover:bg-slate-50"
							onClick={() => router.push(`/partners/dashboard/offer/${offer.id}`)}
						>
							<TableCell className="px-4 text-sm text-slate-600">{offer.startDate}</TableCell>
							<TableCell className="px-4 text-sm text-slate-600">{offer.endDate}</TableCell>
							<TableCell className="px-4 text-sm font-semibold text-slate-900">{offer.offerName}</TableCell>
							<TableCell className="px-4">
								<PartyStatusCell status={offer.b2c} />
							</TableCell>
							<TableCell className="px-4">
								<PartyStatusCell status={offer.b2b} />
							</TableCell>
							<TableCell className="px-4 text-sm text-slate-600">{offer.discount}</TableCell>
							<TableCell className="px-4" onClick={(event) => event.stopPropagation()}>
								<div className="flex items-center gap-3">
									<span
										className={`inline-flex items-center rounded-[6px] px-2.5 py-1 text-xs font-semibold ${
											offer.status === "active"
												? "bg-[#DCFCE7] text-[#16A34A]"
												: "bg-[#FEE2E2] text-[#DC2626]"
										}`}
									>
										<Translate
											text={
												offer.status === "active"
													? localizationConstants.activeLabel
													: localizationConstants.adminStatusClosed
											}
										/>
									</span>
									<button
										type="button"
										className="cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
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
	);
}
