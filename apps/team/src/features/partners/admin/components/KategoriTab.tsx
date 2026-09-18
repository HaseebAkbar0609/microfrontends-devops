"use client";

import { useMemo, useState } from "react";
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
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { DUMMY_PARTNER_REGISTER, type PartnerCategoryRow } from "../constants/partners";
import { AddCategoryDialog } from "./AddCategoryDialog";

const COLUMNS = [
	{ key: "date", labelKey: localizationConstants.dateLabel, width: "w-28" },
	{ key: "category", labelKey: localizationConstants.categoryLabel, width: "w-40" },
	{ key: "type", labelKey: localizationConstants.typeLabel, width: "w-32" },
] as const;

type SortKey = (typeof COLUMNS)[number]["key"];

export function KategoriTab() {
	const t = useTranslate();
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [categories, setCategories] = useState<PartnerCategoryRow[]>(() =>
		DUMMY_PARTNER_REGISTER.map((partner) => ({
			id: partner.id,
			date: partner.date,
			category: partner.category,
			type: partner.type,
		}))
	);
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

	const sortedCategories = useMemo(() => {
		if (!sortKey) {
			return categories;
		}

		return [...categories].sort((a, b) => {
			const diff = String(a[sortKey]).localeCompare(String(b[sortKey]));
			return sortAsc ? diff : -diff;
		});
	}, [categories, sortKey, sortAsc]);

	return (
		<div className="flex flex-col rounded-md border border-slate-200 bg-white shadow-sm mb-10">
			<div className="flex min-h-14 items-center justify-between gap-4 border-b border-[#E4E4E7] bg-slate-200 px-4 py-2">
				<h2 className="text-base font-medium text-[#09090B]">
					<Translate text={localizationConstants.categoryLabel} />
				</h2>
				<Button
					className="h-9 gap-2 rounded-md bg-[#18181B] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#18181B]/90"
					onClick={() => setIsAddOpen(true)}
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.partnerAddCategoryButton} />
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
					{sortedCategories.length === 0 && (
						<TableRow>
							<TableCell colSpan={COLUMNS.length + 1} className="h-32 text-center text-sm text-slate-500">
								<Translate text={localizationConstants.noResultsFound} />
							</TableCell>
						</TableRow>
					)}
					{sortedCategories.map((row) => (
						<TableRow key={row.id} className="h-14 border-slate-200 hover:bg-slate-50">
							<TableCell className="px-4 text-sm text-slate-600">{row.date}</TableCell>
							<TableCell className="px-4 text-sm font-semibold text-slate-900">{row.category}</TableCell>
							<TableCell className="px-4 text-sm text-slate-600">{row.type}</TableCell>
							<TableCell className="px-4">
								<button
									type="button"
									className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
									onClick={() => showToast("info", t(localizationConstants.editLabel))}
								>
									<Translate text={localizationConstants.editLabel} />
								</button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<AddCategoryDialog
				open={isAddOpen}
				onOpenChange={setIsAddOpen}
				existingNames={categories.map((row) => row.category)}
				onCreated={(category) => setCategories((previous) => [...previous, category])}
			/>
		</div>
	);
}
