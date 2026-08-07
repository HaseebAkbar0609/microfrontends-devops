"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MarkupRow } from "../types/kalkyl";

const PERCENTAGE_OPTIONS = ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50"];

const DEFAULT_ROW: MarkupRow = { id: "markup-default-1", title: "", markupPercentage: "" };

interface Props {
	titleKey: string;
	initialRows?: MarkupRow[];
}

export function CalculationMarkupSection({ titleKey, initialRows }: Props) {
	const t = useTranslate();
	const idCounterRef = useRef(100);
	const initial = initialRows ?? [DEFAULT_ROW];
	const [rows, setRows] = useState<MarkupRow[]>(initial);
	const [savedRows, setSavedRows] = useState<MarkupRow[]>(initial);

	function handleAddRow() {
		const newRow: MarkupRow = {
			id: `markup-row-${++idCounterRef.current}`,
			title: "",
			markupPercentage: "",
		};
		setRows((prev) => [...prev, newRow]);
	}

	function handleChangeTitle(id: string, value: string) {
		setRows((prev) =>
			prev.map((row) => (row.id === id ? { ...row, title: value } : row)),
		);
	}

	function handleChangePercentage(id: string, value: string) {
		setRows((prev) =>
			prev.map((row) => (row.id === id ? { ...row, markupPercentage: value } : row)),
		);
	}

	function handleSave() {
		setSavedRows(rows);
	}

	function handleCancel() {
		setRows(savedRows);
	}

	return (
		<div className="flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-5">
			<h2 className="text-base font-semibold text-slate-900">
				<Translate text={titleKey} />
			</h2>

			<div className="flex flex-col gap-2">
				<div className="grid grid-cols-[1fr_10rem] gap-3">
					<span className="text-xs font-medium uppercase tracking-wide text-slate-500">
						{t(localizationConstants.calcFieldTitle)}
					</span>
					<span className="text-xs font-medium uppercase tracking-wide text-slate-500">
						{t(localizationConstants.calcMarkupPercentage)}
					</span>
				</div>

				{rows.map((row) => (
					<div key={row.id} className="grid grid-cols-[1fr_10rem] gap-3">
						<Input
							value={row.title}
							onChange={(e) => handleChangeTitle(row.id, e.target.value)}
							placeholder={t(localizationConstants.calcMarkupPlaceholder)}
							className="h-9 border-slate-200 text-sm"
						/>
						<Select
							value={row.markupPercentage}
							onValueChange={(val) => handleChangePercentage(row.id, val)}
						>
							<SelectTrigger className="h-9 w-full border-slate-200 text-sm">
								<SelectValue placeholder="0%" />
							</SelectTrigger>
							<SelectContent>
								{PERCENTAGE_OPTIONS.map((opt) => (
									<SelectItem key={opt} value={opt}>
										{opt}%
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				))}
			</div>

			<div>
				<Button
					variant="outline"
					size="sm"
					onClick={handleAddRow}
					className="h-8 cursor-pointer gap-1.5 border-slate-200 text-sm font-medium text-slate-700"
				>
					<Plus size={13} aria-hidden />
					{t(localizationConstants.calcCreateNew)}
				</Button>
			</div>

			<div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
				<Button
					variant="outline"
					size="sm"
					onClick={handleCancel}
					className="h-8 cursor-pointer border-slate-200 text-sm text-slate-700"
				>
					<Translate text={localizationConstants.cancel} />
				</Button>
				<Button
					size="sm"
					onClick={handleSave}
					className="h-8 cursor-pointer bg-neutral-950 text-sm text-white hover:bg-neutral-800"
				>
					<Translate text={localizationConstants.save} />
				</Button>
			</div>
		</div>
	);
}
