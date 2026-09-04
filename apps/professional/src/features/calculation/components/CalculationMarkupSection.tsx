"use client";

import { useRef, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
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
import { GRAY, SLATE } from "@/constants/colors";
import { MarkupRow } from "../types/kalkyl";

const PERCENTAGE_OPTIONS = [
	"5",
	"10",
	"15",
	"20",
	"25",
	"30",
	"35",
	"40",
	"45",
	"50",
];

const DEFAULT_ROW: MarkupRow = {
	id: "markup-default-1",
	title: "",
	markupPercentage: "",
};

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
			prev.map((row) =>
				row.id === id ? { ...row, markupPercentage: value } : row,
			),
		);
	}

	function handleDeleteRow(id: string) {
		setRows((prev) => prev.filter((row) => row.id !== id));
	}

	function handleSave() {
		setSavedRows(rows);
	}

	function handleCancel() {
		setRows(savedRows);
	}

	return (
		<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
			<div
				className="flex items-center justify-between px-5 py-3"
				style={{ backgroundColor: SLATE[200] }}
			>
				<h2 className="text-base font-semibold text-slate-900">
					<Translate text={titleKey} />
				</h2>
				<Button
					size="sm"
					onClick={handleAddRow}
					className="h-8 cursor-pointer gap-1.5 bg-[var(--color-primary-black)] text-sm font-medium text-white hover:bg-[var(--color-primary-black)]"
				>
					<Plus size={13} aria-hidden />
					{t(localizationConstants.calcCreateNew)}
				</Button>
			</div>

			<div className="flex flex-col gap-4 p-5">
				<div className="flex flex-col gap-3">
					{rows.map((row) => (
						<div
							key={row.id}
							className="grid grid-cols-[1fr_1fr_auto] items-end gap-3"
						>
							<div className="flex flex-col gap-1.5">
								<span className="text-sm font-medium text-slate-700">
									{t(localizationConstants.calcFieldTitle)}
								</span>
								<Input
									value={row.title}
									onChange={(e) =>
										handleChangeTitle(
											row.id,
											e.target.value,
										)
									}
									placeholder={t(
										localizationConstants.calcMarkupPlaceholder,
									)}
									className="h-10 border-slate-200 text-sm placeholder:text-gray-500"
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<span className="text-sm font-medium text-slate-700">
									{t(
										localizationConstants.calcMarkupPercentage,
									)}
								</span>
								<Select
									value={row.markupPercentage}
									onValueChange={(val) =>
										handleChangePercentage(row.id, val)
									}
								>
									<SelectTrigger className="h-10 w-full border-slate-200 text-sm data-[placeholder]:text-gray-500 [&_svg:not([class*='text-'])]:text-gray-500 [&_svg]:opacity-100">
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
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleDeleteRow(row.id)}
								className="h-10 w-10 cursor-pointer bg-card p-0"
								style={{
									color: GRAY[500],
									borderColor: GRAY[300],
								}}
								aria-label={t(
									localizationConstants.calcArchiveDelete,
								)}
							>
								<Trash2 size={15} aria-hidden />
							</Button>
						</div>
					))}
				</div>

				<div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
					<Button
						size="sm"
						onClick={handleCancel}
						className="h-9 cursor-pointer bg-[var(--color-bg-secondary)] text-sm font-medium text-[var(--color-primary-black)] shadow-none hover:bg-slate-200"
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						size="sm"
						onClick={handleSave}
						className="h-9 min-w-24 cursor-pointer items-center justify-center gap-2 bg-neutral-950 px-5 text-sm text-white hover:bg-neutral-800"
					>
						<Save
							size={15}
							className="shrink-0 text-primary-foreground"
							aria-hidden
						/>
						<Translate text={localizationConstants.save} />
					</Button>
				</div>
			</div>
		</div>
	);
}
