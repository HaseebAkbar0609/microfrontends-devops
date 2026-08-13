"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
	ArrowLeft,
	ArrowRight,
	ChevronDown,
	ChevronRight,
	CirclePlus,
	FileText,
	Plus,
	Save,
	Search,
	Send,
	Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import type {
	KalkylberakningSection,
	KalkylSectionRow,
	KalkylTemplate,
	OverheadRow,
} from "../types/kalkyl";
import {
	DEFAULT_OVERHEAD_ROWS,
	DEFAULT_SECTIONS,
	DUMMY_TEMPLATES,
	TEMPLATE_SECTIONS,
} from "../constants/kalkylberakningMock";

// ── Types ────────────────────────────────────────────────────────────────────

type FlowState = "choose" | "edit";
type ActiveTab = "kalkyl" | "sammanfattning";
type WizardMode = "mall" | "ny";

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseNum(s: string): number {
	return parseFloat(s.replace(",", ".")) || 0;
}

function fmt(n: number): string {
	return Math.round(n).toLocaleString("sv-SE");
}

function rowBase(row: KalkylSectionRow): number {
	return parseNum(row.antal) * parseNum(row.aPris);
}

function overheadSummering(row: OverheadRow): number {
	return parseNum(row.antal) * parseNum(row.aPris);
}

function overheadPaslagKr(row: OverheadRow): number {
	return (overheadSummering(row) * parseNum(row.paslagPct)) / 100;
}

function overheadDelsumma(row: OverheadRow): number {
	return overheadSummering(row) + overheadPaslagKr(row) + parseNum(row.justering);
}

// ── Step 1 – Choose content ───────────────────────────────────────────────────

type TemplateSortField = keyof Pick<KalkylTemplate, "benamning" | "sektion" | "mall" | "datum">;

interface TemplateCardProps {
	selected: boolean;
	onSelect: () => void;
	title: string;
	description: string;
}

function TemplateCard({ selected, onSelect, title, description }: TemplateCardProps) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				"flex w-full cursor-pointer flex-col gap-2 rounded-lg border-2 px-5 py-4 text-left transition-colors",
				selected ? "border-slate-900 bg-white" : "border-neutral-200 bg-white hover:border-slate-300",
			)}
		>
			<div className="flex items-center gap-3">
				<div
					className={cn(
						"flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
						selected ? "border-slate-900" : "border-slate-300",
					)}
				>
					{selected && <div className="h-2 w-2 rounded-full bg-slate-900" />}
				</div>
				<span className="text-sm font-semibold text-zinc-950">{title}</span>
			</div>
			<p className="pl-7 text-xs text-zinc-500">{description}</p>
		</button>
	);
}

interface TemplateTableProps {
	templates: KalkylTemplate[];
	selectedId: string | null;
	onSelect: (id: string) => void;
}

function TemplateTable({ templates, selectedId, onSelect }: TemplateTableProps) {
	const [search, setSearch] = useState("");
	const { sortField, sortDir, toggleSort } = useTableSort<TemplateSortField>();

	const filtered = useMemo(
		() =>
			templates.filter((tmpl) =>
				tmpl.benamning.toLowerCase().includes(search.toLowerCase()),
			),
		[templates, search],
	);

	const sorted = useMemo(
		() =>
			sortItems(
				filtered,
				sortField,
				sortDir,
				(item, field) => String(item[field as keyof KalkylTemplate]),
			),
		[filtered, sortField, sortDir],
	);

	const TH =
		"cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-slate-500 hover:text-slate-700";

	return (
		<div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
			{/* Section header */}
			<div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-3">
				<FileText className="h-4 w-4 text-slate-400" />
				<span className="text-sm font-semibold text-zinc-950">
					<Translate text={localizationConstants.calcBerAnvandMall} />
				</span>
			</div>

			{/* Search */}
			<div className="border-b border-zinc-100 px-4 py-2">
				<div className="relative">
					<Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Sök"
						className="h-8 pl-8 text-sm"
					/>
				</div>
			</div>

			{/* Table */}
			<table className="w-full border-collapse text-sm">
				<thead>
					<tr className="border-b border-zinc-100">
						<th className="w-10 px-4 py-3" />
						<th className={TH} onClick={() => toggleSort("benamning")}>
							<div className="flex items-center gap-1">
								<Translate text={localizationConstants.calcAPrisNaming} />
								{renderSortIcon("benamning", sortField, sortDir)}
							</div>
						</th>
						<th className={TH} onClick={() => toggleSort("sektion")}>
							<div className="flex items-center gap-1">
								<Translate text={localizationConstants.calcBerSektionCol} />
								{renderSortIcon("sektion", sortField, sortDir)}
							</div>
						</th>
						<th className={TH} onClick={() => toggleSort("mall")}>
							<div className="flex items-center gap-1">
								<Translate text={localizationConstants.calcBerMallCol} />
								{renderSortIcon("mall", sortField, sortDir)}
							</div>
						</th>
						<th className={TH} onClick={() => toggleSort("datum")}>
							<div className="flex items-center gap-1">
								<Translate text={localizationConstants.agreementDetailDatum} />
								{renderSortIcon("datum", sortField, sortDir)}
							</div>
						</th>
						<th className="px-4 py-3" />
					</tr>
				</thead>
				<tbody>
					{sorted.map((tmpl) => {
						const isSelected = selectedId === tmpl.id;
						return (
							<tr
								key={tmpl.id}
								onClick={() => onSelect(tmpl.id)}
								className={cn(
									"cursor-pointer border-b border-zinc-100 last:border-b-0 transition-colors hover:bg-slate-50",
									isSelected && "bg-slate-50",
								)}
							>
								<td className="px-4 py-3">
									<div className="flex items-center justify-center">
										<div
											className={cn(
												"flex h-4 w-4 items-center justify-center rounded-full border-2",
												isSelected ? "border-slate-900" : "border-slate-300",
											)}
										>
											{isSelected && (
												<div className="h-2 w-2 rounded-full bg-slate-900" />
											)}
										</div>
									</div>
								</td>
								<td className="px-4 py-3 font-medium text-zinc-950">{tmpl.benamning}</td>
								<td className="px-4 py-3 text-zinc-500">{tmpl.sektion}</td>
								<td className="px-4 py-3 text-zinc-500">{tmpl.mall}</td>
								<td className="px-4 py-3 text-zinc-500">{tmpl.datum}</td>
								<td className="px-4 py-3 text-right">
									<button
										type="button"
										onClick={(e) => e.stopPropagation()}
										className="cursor-pointer text-xs text-slate-500 hover:text-slate-800"
									>
										<Translate text={localizationConstants.calcBerSeMall} />
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

interface ChooseContentProps {
	mode: WizardMode;
	selectedTemplateId: string | null;
	onModeChange: (m: WizardMode) => void;
	onTemplateSelect: (id: string) => void;
}

function ChooseContent({ mode, selectedTemplateId, onModeChange, onTemplateSelect }: ChooseContentProps) {
	const t = useTranslate();
	return (
		<div className="flex flex-col gap-4">
			<div className="rounded-lg border border-neutral-200 bg-white p-5">
				<h2 className="mb-4 text-sm font-semibold text-zinc-950">
					<Translate text={localizationConstants.calcBerSkapeNy} />
				</h2>
				<div className="grid grid-cols-2 gap-4">
					<TemplateCard
						selected={mode === "mall"}
						onSelect={() => onModeChange("mall")}
						title={t(localizationConstants.calcBerKalkylMall)}
						description={t(localizationConstants.calcBerValjFranMallar)}
					/>
					<TemplateCard
						selected={mode === "ny"}
						onSelect={() => onModeChange("ny")}
						title={t(localizationConstants.calcBerNyKalkyl)}
						description={t(localizationConstants.calcBerBorjaFranBorjan)}
					/>
				</div>
			</div>

			{mode === "mall" && (
				<TemplateTable
					templates={DUMMY_TEMPLATES}
					selectedId={selectedTemplateId}
					onSelect={onTemplateSelect}
				/>
			)}
		</div>
	);
}

// ── Step 2 – Kalkyl tab ───────────────────────────────────────────────────────

type SectionSortField = keyof Pick<
	KalkylSectionRow,
	"artikel" | "benamning" | "antal" | "enhet" | "aPris" | "paslagPct"
>;

interface SectionPanelProps {
	section: KalkylberakningSection;
	onToggle: () => void;
	onAddRow: () => void;
	onUpdateRow: (rowId: string, patch: Partial<KalkylSectionRow>) => void;
	onDeleteRow: (rowId: string) => void;
	onDeleteSection: () => void;
	onUpdateName: (name: string) => void;
}

function SectionPanel({
	section,
	onToggle,
	onAddRow,
	onUpdateRow,
	onDeleteRow,
	onDeleteSection,
	onUpdateName,
}: SectionPanelProps) {
	const { sortField, sortDir, toggleSort } = useTableSort<SectionSortField>();
	const sorted = useMemo(
		() =>
			sortItems(
				section.rows,
				sortField,
				sortDir,
				(r, f) => r[f as keyof KalkylSectionRow],
			),
		[section.rows, sortField, sortDir],
	);

	const sectionTotal = section.rows.reduce((sum, r) => sum + rowBase(r), 0);

	const TH =
		"cursor-pointer select-none whitespace-nowrap px-3 py-2.5 text-left text-xs font-medium text-slate-500 hover:text-slate-800";

	return (
		<div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
			{/* Section header */}
			<div className="flex h-11 items-center gap-2 border-b border-zinc-200 px-4">
				<button
					type="button"
					onClick={onToggle}
					className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-zinc-950"
				>
					{section.isOpen ? (
						<ChevronDown className="h-4 w-4 text-slate-400" />
					) : (
						<ChevronRight className="h-4 w-4 text-slate-400" />
					)}
				</button>
				<Input
					value={section.name}
					onChange={(e) => onUpdateName(e.target.value)}
					className="h-8 w-44 border-transparent bg-transparent text-sm font-semibold text-zinc-950 shadow-none focus-visible:border-slate-300 focus-visible:bg-white"
				/>
			</div>

			{section.isOpen && (
				<>
					<div className="b2b-table-scroll overflow-x-auto">
						<table className="w-full min-w-max border-collapse text-sm">
							<thead>
								<tr className="border-b border-zinc-100 bg-slate-50/60">
									<th className={TH} onClick={() => toggleSort("artikel")}>
										<div className="flex items-center gap-1">
											<Translate text={localizationConstants.calcItemCol} />
											{renderSortIcon("artikel", sortField, sortDir)}
										</div>
									</th>
									<th className={TH} onClick={() => toggleSort("benamning")}>
										<div className="flex items-center gap-1">
											<Translate text={localizationConstants.calcAPrisNaming} />
											{renderSortIcon("benamning", sortField, sortDir)}
										</div>
									</th>
									<th className={TH} onClick={() => toggleSort("antal")}>
										<div className="flex items-center gap-1">
											<Translate text={localizationConstants.calcQuantityCol} />
											{renderSortIcon("antal", sortField, sortDir)}
										</div>
									</th>
									<th className={TH} onClick={() => toggleSort("enhet")}>
										<div className="flex items-center gap-1">
											<Translate text={localizationConstants.calcUnitCol} />
											{renderSortIcon("enhet", sortField, sortDir)}
										</div>
									</th>
									<th className={TH} onClick={() => toggleSort("aPris")}>
										<div className="flex items-center gap-1">
											<Translate text={localizationConstants.calcAPriceCol} />
											{renderSortIcon("aPris", sortField, sortDir)}
										</div>
									</th>
									<th className={TH} onClick={() => toggleSort("paslagPct")}>
										<div className="flex items-center gap-1">
											<Translate text={localizationConstants.calcBerPaslagCol} />
											{renderSortIcon("paslagPct", sortField, sortDir)}
										</div>
									</th>
									<th className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.calcBerDelsummaCol} />
									</th>
									<th className="w-9" />
								</tr>
							</thead>
							<tbody>
								{sorted.map((row) => (
									<tr key={row.id} className="border-b border-zinc-100 last:border-b-0">
										<td className="px-3 py-1.5">
											<Input
												value={row.artikel}
												onChange={(e) => onUpdateRow(row.id, { artikel: e.target.value })}
												className="h-8 w-20 text-sm"
												placeholder="—"
											/>
										</td>
										<td className="px-3 py-1.5">
											<Input
												value={row.benamning}
												onChange={(e) => onUpdateRow(row.id, { benamning: e.target.value })}
												className="h-8 w-36 text-sm"
												placeholder="—"
											/>
										</td>
										<td className="px-3 py-1.5">
											<Input
												value={row.antal}
												onChange={(e) => onUpdateRow(row.id, { antal: e.target.value })}
												className="h-8 w-16 text-sm"
												placeholder="0"
											/>
										</td>
										<td className="px-3 py-1.5">
											<Input
												value={row.enhet}
												onChange={(e) => onUpdateRow(row.id, { enhet: e.target.value })}
												className="h-8 w-16 text-sm"
												placeholder="—"
											/>
										</td>
										<td className="px-3 py-1.5">
											<Input
												value={row.aPris}
												onChange={(e) => onUpdateRow(row.id, { aPris: e.target.value })}
												className="h-8 w-24 text-sm"
												placeholder="0"
											/>
										</td>
										<td className="px-3 py-1.5">
											<Input
												value={row.paslagPct}
												onChange={(e) => onUpdateRow(row.id, { paslagPct: e.target.value })}
												className="h-8 w-16 text-sm"
												placeholder="0"
											/>
										</td>
										<td className="px-3 py-1.5 font-medium tabular-nums text-zinc-950">
											{fmt(rowBase(row))}
										</td>
										<td className="px-2 py-1.5">
											<button
												type="button"
												onClick={() => onDeleteRow(row.id)}
												className="flex cursor-pointer items-center justify-center rounded p-1 text-slate-300 hover:bg-red-50 hover:text-red-500"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Ny rad row */}
					<div className="border-t border-zinc-100">
						<button
							type="button"
							onClick={onAddRow}
							className="flex w-full cursor-pointer items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800"
						>
							<Plus className="h-4 w-4" />
							<Translate text={localizationConstants.calcNewRow} />
						</button>
					</div>

					{/* Summa + Delete row */}
					<div className="flex items-center justify-between border-t border-zinc-100 px-4 py-2">
						<span className="text-xs text-slate-500">
							Σ <Translate text={localizationConstants.calcBerSummering} />{" "}
							<span className="font-semibold tabular-nums text-zinc-950">{fmt(sectionTotal)}</span>
						</span>
						<button
							type="button"
							onClick={onDeleteSection}
							className="cursor-pointer text-xs font-medium text-slate-400 hover:text-red-500"
						>
							<Translate text={localizationConstants.calcDeleteSection} />
						</button>
					</div>
				</>
			)}
		</div>
	);
}

interface KalkylTabContentProps {
	sections: KalkylberakningSection[];
	onToggleSection: (id: string) => void;
	onAddRow: (sectionId: string) => void;
	onUpdateRow: (sectionId: string, rowId: string, patch: Partial<KalkylSectionRow>) => void;
	onDeleteRow: (sectionId: string, rowId: string) => void;
	onDeleteSection: (id: string) => void;
	onUpdateName: (sectionId: string, name: string) => void;
	onAddSection: () => void;
}

function KalkylTabContent({
	sections,
	onToggleSection,
	onAddRow,
	onUpdateRow,
	onDeleteRow,
	onDeleteSection,
	onUpdateName,
	onAddSection,
}: KalkylTabContentProps) {
	return (
		<div className="flex flex-col gap-3">
			{/* Toolbar */}
			<div className="flex items-center justify-between">
				<span className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">
					<Translate text={localizationConstants.calcKalkyl} />
				</span>
				<button
					type="button"
					onClick={onAddSection}
					className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
				>
					<CirclePlus className="h-4 w-4" />
					<Translate text={localizationConstants.calcBerNySektion} />
				</button>
			</div>

			{/* Sections */}
			{sections.map((section) => (
				<SectionPanel
					key={section.id}
					section={section}
					onToggle={() => onToggleSection(section.id)}
					onAddRow={() => onAddRow(section.id)}
					onUpdateRow={(rowId, patch) => onUpdateRow(section.id, rowId, patch)}
					onDeleteRow={(rowId) => onDeleteRow(section.id, rowId)}
					onDeleteSection={() => onDeleteSection(section.id)}
					onUpdateName={(name) => onUpdateName(section.id, name)}
				/>
			))}
		</div>
	);
}

// ── Step 2 – Sammanfattning tab ───────────────────────────────────────────────

type OverheadSortField = keyof Pick<
	OverheadRow,
	"artikel" | "benamning" | "antal" | "enhet" | "aPris"
>;

interface SammanfattningSectionRow {
	id: string;
	name: string;
	calc: number;
	pct: string;
	markupAmount: number;
	subtotal: number;
	adjustment: string;
}

interface CalcTableProps {
	rows: SammanfattningSectionRow[];
	onUpdatePct: (sectionId: string, pct: string) => void;
	onUpdateAdj: (sectionId: string, adj: string) => void;
}

function CalcTable({ rows, onUpdatePct, onUpdateAdj }: CalcTableProps) {
	const totCalc = rows.reduce((s, r) => s + r.calc, 0);
	const totMarkup = rows.reduce((s, r) => s + r.markupAmount, 0);
	const totSubtotal = rows.reduce((s, r) => s + r.subtotal, 0);

	const TH = "whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-slate-500";

	return (
		<div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
			<div className="flex h-11 items-center border-b border-zinc-200 px-4">
				<span className="text-sm font-semibold text-zinc-950">
					<Translate text={localizationConstants.calcBerCalculation} />
				</span>
			</div>
			<table className="w-full min-w-max border-collapse text-sm">
				<thead>
					<tr className="border-b border-zinc-100 bg-slate-50/60">
						<th className={TH}>
							<Translate text={localizationConstants.calcBerSektionCol} />
						</th>
						<th className={TH}>
							<Translate text={localizationConstants.calcBerCalculation} />
						</th>
						<th className={TH}>%</th>
						<th className={TH}>
							<Translate text={localizationConstants.calcBerMarkupSection} />
						</th>
						<th className={TH}>
							<Translate text={localizationConstants.calcBerSubtotal} />
						</th>
						<th className={TH}>
							<Translate text={localizationConstants.calcBerAdjustment} />
						</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((r) => (
						<tr key={r.id} className="border-b border-zinc-100 last:border-b-0">
							<td className="px-4 py-2.5 font-medium text-zinc-950">{r.name}</td>
							<td className="px-4 py-2.5 tabular-nums text-zinc-500">{fmt(r.calc)}</td>
							<td className="px-4 py-2.5">
								<Input
									value={r.pct}
									onChange={(e) => onUpdatePct(r.id, e.target.value)}
									className="h-7 w-16 text-sm"
									placeholder="0"
								/>
							</td>
							<td className="px-4 py-2.5 tabular-nums text-zinc-500">{fmt(r.markupAmount)}</td>
							<td className="px-4 py-2.5 font-medium tabular-nums text-zinc-950">
								{fmt(r.subtotal)}
							</td>
							<td className="px-4 py-2.5">
								<Input
									value={r.adjustment}
									onChange={(e) => onUpdateAdj(r.id, e.target.value)}
									className="h-7 w-20 text-sm"
									placeholder="0"
								/>
							</td>
						</tr>
					))}
					<tr className="border-t border-zinc-200 bg-slate-50">
						<td className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
							Σ Total
						</td>
						<td className="px-4 py-2.5 font-semibold tabular-nums text-zinc-950">
							{fmt(totCalc)}
						</td>
						<td className="px-4 py-2.5" />
						<td className="px-4 py-2.5 font-semibold tabular-nums text-zinc-950">
							{fmt(totMarkup)}
						</td>
						<td className="px-4 py-2.5 font-semibold tabular-nums text-zinc-950">
							{fmt(totSubtotal)}
						</td>
						<td className="px-4 py-2.5" />
					</tr>
				</tbody>
			</table>
		</div>
	);
}

interface OverheadTableProps {
	rows: OverheadRow[];
	onUpdateRow: (rowId: string, patch: Partial<OverheadRow>) => void;
	onDeleteRow: (rowId: string) => void;
	onAddRow: () => void;
}

function OverheadTable({ rows, onUpdateRow, onDeleteRow, onAddRow }: OverheadTableProps) {
	const { sortField, sortDir, toggleSort } = useTableSort<OverheadSortField>();
	const sorted = useMemo(
		() =>
			sortItems(rows, sortField, sortDir, (r, f) => r[f as keyof OverheadRow]),
		[rows, sortField, sortDir],
	);

	const TH =
		"cursor-pointer select-none whitespace-nowrap px-3 py-2.5 text-left text-xs font-medium text-slate-500 hover:text-slate-800";
	const TH_STATIC =
		"whitespace-nowrap px-3 py-2.5 text-left text-xs font-medium text-slate-500";

	return (
		<div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
			<div className="flex h-11 items-center border-b border-zinc-200 px-4">
				<span className="text-sm font-semibold text-zinc-950">
					<Translate text={localizationConstants.calcBerOverhead} />
				</span>
			</div>
			<div className="b2b-table-scroll overflow-x-auto">
				<table className="w-full min-w-max border-collapse text-sm">
					<thead>
						<tr className="border-b border-zinc-100 bg-slate-50/60">
							<th className={TH} onClick={() => toggleSort("artikel")}>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.calcItemCol} />
									{renderSortIcon("artikel", sortField, sortDir)}
								</div>
							</th>
							<th className={TH} onClick={() => toggleSort("benamning")}>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.calcAPrisNaming} />
									{renderSortIcon("benamning", sortField, sortDir)}
								</div>
							</th>
							<th className={TH} onClick={() => toggleSort("antal")}>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.calcQuantityCol} />
									{renderSortIcon("antal", sortField, sortDir)}
								</div>
							</th>
							<th className={TH} onClick={() => toggleSort("enhet")}>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.calcUnitCol} />
									{renderSortIcon("enhet", sortField, sortDir)}
								</div>
							</th>
							<th className={TH} onClick={() => toggleSort("aPris")}>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.calcAPriceCol} />
									{renderSortIcon("aPris", sortField, sortDir)}
								</div>
							</th>
							<th className={TH_STATIC}>
								<Translate text={localizationConstants.calcBerSummering} />
							</th>
							<th className={TH_STATIC}>%</th>
							<th className={TH_STATIC}>
								<Translate text={localizationConstants.calcBerPaslagKr} />
							</th>
							<th className={TH_STATIC}>
								<Translate text={localizationConstants.calcBerDelsummaCol} />
							</th>
							<th className={TH_STATIC}>
								<Translate text={localizationConstants.calcBerJustering} />
							</th>
							<th className="w-9" />
						</tr>
					</thead>
					<tbody>
						{sorted.map((row) => (
							<tr key={row.id} className="border-b border-zinc-100 last:border-b-0">
								<td className="px-3 py-1.5">
									<Input
										value={row.artikel}
										onChange={(e) => onUpdateRow(row.id, { artikel: e.target.value })}
										className="h-7 w-20 text-sm"
										placeholder="—"
									/>
								</td>
								<td className="px-3 py-1.5">
									<Input
										value={row.benamning}
										onChange={(e) => onUpdateRow(row.id, { benamning: e.target.value })}
										className="h-7 w-40 text-sm"
										placeholder="—"
									/>
								</td>
								<td className="px-3 py-1.5">
									<Input
										value={row.antal}
										onChange={(e) => onUpdateRow(row.id, { antal: e.target.value })}
										className="h-7 w-14 text-sm"
										placeholder="0"
									/>
								</td>
								<td className="px-3 py-1.5">
									<Input
										value={row.enhet}
										onChange={(e) => onUpdateRow(row.id, { enhet: e.target.value })}
										className="h-7 w-14 text-sm"
										placeholder="—"
									/>
								</td>
								<td className="px-3 py-1.5">
									<Input
										value={row.aPris}
										onChange={(e) => onUpdateRow(row.id, { aPris: e.target.value })}
										className="h-7 w-24 text-sm"
										placeholder="0"
									/>
								</td>
								<td className="px-3 py-1.5 tabular-nums text-zinc-500">
									{fmt(overheadSummering(row))}
								</td>
								<td className="px-3 py-1.5">
									<Input
										value={row.paslagPct}
										onChange={(e) => onUpdateRow(row.id, { paslagPct: e.target.value })}
										className="h-7 w-14 text-sm"
										placeholder="0"
									/>
								</td>
								<td className="px-3 py-1.5 tabular-nums text-zinc-500">
									{fmt(overheadPaslagKr(row))}
								</td>
								<td className="px-3 py-1.5 font-medium tabular-nums text-zinc-950">
									{fmt(overheadDelsumma(row))}
								</td>
								<td className="px-3 py-1.5">
									<Input
										value={row.justering}
										onChange={(e) => onUpdateRow(row.id, { justering: e.target.value })}
										className="h-7 w-20 text-sm"
										placeholder="0"
									/>
								</td>
								<td className="px-2 py-1.5">
									<button
										type="button"
										onClick={() => onDeleteRow(row.id)}
										className="flex cursor-pointer items-center justify-center rounded p-1 text-slate-300 hover:bg-red-50 hover:text-red-500"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="flex items-center justify-between border-t border-zinc-100 px-4 py-2.5">
				<button
					type="button"
					onClick={onAddRow}
					className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.calcNewRow} />
				</button>
				<span className="text-xs text-slate-400">
					Σ <Translate text={localizationConstants.calcBerSummering} />:{" "}
					<span className="font-medium tabular-nums text-zinc-950">
						{fmt(sorted.reduce((s, r) => s + overheadDelsumma(r), 0))}
					</span>
				</span>
			</div>
		</div>
	);
}

interface SammanstallningProps {
	summaKalkyl: number;
	summaOverhead: number;
	delsumma: number;
	vinstPct: string;
	offert: number;
	onVinstChange: (v: string) => void;
}

function Sammanstallning({
	summaKalkyl,
	summaOverhead,
	delsumma,
	vinstPct,
	offert,
	onVinstChange,
}: SammanstallningProps) {
	return (
		<div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
			<div className="flex h-11 items-center border-b border-zinc-200 px-4">
				<span className="text-sm font-semibold text-zinc-950">
					<Translate text={localizationConstants.calcBerSammanstallning} />
				</span>
			</div>
			<div className="divide-y divide-zinc-100">
				<div className="flex items-center justify-between px-5 py-3">
					<span className="text-sm text-zinc-500">
						<Translate text={localizationConstants.calcBerSummaKalkyl} />
					</span>
					<span className="font-medium tabular-nums text-zinc-950">{fmt(summaKalkyl)}</span>
				</div>
				<div className="flex items-center justify-between px-5 py-3">
					<span className="text-sm text-zinc-500">
						<Translate text={localizationConstants.calcBerSummaOverhead} />
					</span>
					<span className="font-medium tabular-nums text-zinc-950">{fmt(summaOverhead)}</span>
				</div>
				<div className="flex items-center justify-between bg-slate-50 px-5 py-3">
					<span className="text-sm font-semibold text-zinc-950">
						<Translate text={localizationConstants.calcBerDelsumma} />
					</span>
					<span className="font-semibold tabular-nums text-zinc-950">{fmt(delsumma)}</span>
				</div>
				<div className="flex items-center justify-between px-5 py-3">
					<span className="text-sm text-zinc-500">
						<Translate text={localizationConstants.calcBerVinstProcent} />
					</span>
					<Input
						value={vinstPct}
						onChange={(e) => onVinstChange(e.target.value)}
						className="h-8 w-20 text-right text-sm"
						placeholder="0"
					/>
				</div>
				<div className="flex items-center justify-between px-5 py-4">
					<span className="text-base font-bold uppercase tracking-wide text-zinc-950">
						<Translate text={localizationConstants.calcBerOffert} />
					</span>
					<span className="text-base font-bold tabular-nums text-zinc-950">{fmt(offert)}</span>
				</div>
			</div>
		</div>
	);
}

interface SammanfattningTabContentProps {
	calcRows: SammanfattningSectionRow[];
	overheadRows: OverheadRow[];
	summaKalkyl: number;
	summaOverhead: number;
	delsumma: number;
	vinstPct: string;
	offert: number;
	onUpdateCalcPct: (sectionId: string, pct: string) => void;
	onUpdateCalcAdj: (sectionId: string, adj: string) => void;
	onUpdateOverheadRow: (rowId: string, patch: Partial<OverheadRow>) => void;
	onDeleteOverheadRow: (rowId: string) => void;
	onAddOverheadRow: () => void;
	onVinstChange: (v: string) => void;
}

function SammanfattningTabContent({
	calcRows,
	overheadRows,
	summaKalkyl,
	summaOverhead,
	delsumma,
	vinstPct,
	offert,
	onUpdateCalcPct,
	onUpdateCalcAdj,
	onUpdateOverheadRow,
	onDeleteOverheadRow,
	onAddOverheadRow,
	onVinstChange,
}: SammanfattningTabContentProps) {
	return (
		<div className="flex flex-col gap-5">
			<CalcTable rows={calcRows} onUpdatePct={onUpdateCalcPct} onUpdateAdj={onUpdateCalcAdj} />
			<OverheadTable
				rows={overheadRows}
				onUpdateRow={onUpdateOverheadRow}
				onDeleteRow={onDeleteOverheadRow}
				onAddRow={onAddOverheadRow}
			/>
			<Sammanstallning
				summaKalkyl={summaKalkyl}
				summaOverhead={summaOverhead}
				delsumma={delsumma}
				vinstPct={vinstPct}
				offert={offert}
				onVinstChange={onVinstChange}
			/>
		</div>
	);
}

// ── Sidebar ──────────────────────────────────────────────────────────────────

interface StepSidebarProps {
	wizardStep: 1 | 2;
	progress: number;
	flowState: FlowState;
	activeTab: ActiveTab;
	saveAsTemplate: boolean;
	onSaveAsTemplateChange: (v: boolean) => void;
	onPrimary: () => void;
}

function StepSidebar({
	wizardStep,
	progress,
	flowState,
	activeTab,
	saveAsTemplate,
	onSaveAsTemplateChange,
	onPrimary,
}: StepSidebarProps) {
	const showCheckbox = flowState === "edit" && activeTab === "sammanfattning";

	return (
		<div className="flex w-64 shrink-0 flex-col gap-4 border-l border-slate-200 bg-white px-5 py-6">
			{/* Step indicator */}
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between text-sm">
					<span className="font-medium text-zinc-950">
						<Translate text={localizationConstants.stepLabel} /> {wizardStep}/2
					</span>
					<span className="text-zinc-500">{progress}%</span>
				</div>
				<div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
					<div
						className="h-full rounded-full bg-slate-900 transition-all duration-300"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>

			{/* Save as template checkbox — only on Sammanfattning tab */}
			{showCheckbox && (
				<label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-700">
					<input
						type="checkbox"
						checked={saveAsTemplate}
						onChange={(e) => onSaveAsTemplateChange(e.target.checked)}
						className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-slate-900"
					/>
					<Translate text={localizationConstants.calcBerSaveAsTemplate} />
				</label>
			)}

			{/* Primary action */}
			<Button
				type="button"
				onClick={onPrimary}
				className="h-10 w-full cursor-pointer gap-1.5 bg-[#111721] text-sm font-medium text-white hover:bg-slate-800"
			>
				{flowState === "choose" ? (
					<>
						<Send className="h-4 w-4" />
						<Translate text={localizationConstants.calcNewCreateBtn} />
					</>
				) : (
					<>
						<Save className="h-4 w-4" />
						<Translate text={localizationConstants.saveButton} />
					</>
				)}
			</Button>
		</div>
	);
}

// ── Main component ────────────────────────────────────────────────────────────

interface KalkylberakningPageProps {
	calcNo: string;
}

const TABS: { key: ActiveTab; labelKey: string }[] = [
	{ key: "kalkyl", labelKey: localizationConstants.calcKalkyl },
	{ key: "sammanfattning", labelKey: localizationConstants.calcBerSammanfattningTab },
];

export function KalkylberakningPage({ calcNo }: KalkylberakningPageProps) {
	const t = useTranslate();
	const idCounter = useRef(1000);

	// ── Flow state ──────────────────────────────────────────────────────────
	const [flowState, setFlowState] = useState<FlowState>("choose");
	const [mode, setMode] = useState<WizardMode>("mall");
	const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<ActiveTab>("kalkyl");

	// ── Kalkyl sections ─────────────────────────────────────────────────────
	const [sections, setSections] = useState<KalkylberakningSection[]>(DEFAULT_SECTIONS);
	const [sectionMarkups, setSectionMarkups] = useState<Record<string, string>>(() =>
		Object.fromEntries(DEFAULT_SECTIONS.map((s) => [s.id, "10"])),
	);
	const [sectionAdjustments, setSectionAdjustments] = useState<Record<string, string>>({});

	// ── Overhead ─────────────────────────────────────────────────────────────
	const [overheadRows, setOverheadRows] = useState<OverheadRow[]>(DEFAULT_OVERHEAD_ROWS);

	// ── Sammanfattning ───────────────────────────────────────────────────────
	const [vinstPct, setVinstPct] = useState("10");
	const [saveAsTemplate, setSaveAsTemplate] = useState(false);

	// ── Derived ──────────────────────────────────────────────────────────────
	const wizardStep: 1 | 2 = activeTab === "sammanfattning" ? 2 : 1;
	const progress = wizardStep === 1 ? 50 : 100;

	const modeLabel =
		mode === "mall"
			? t(localizationConstants.calcBerKalkylMall)
			: t(localizationConstants.calcBerNyKalkyl);

	// ── Section callbacks ────────────────────────────────────────────────────
	const handleToggleSection = useCallback((id: string) => {
		setSections((prev) => prev.map((s) => (s.id === id ? { ...s, isOpen: !s.isOpen } : s)));
	}, []);

	const handleAddRow = useCallback((sectionId: string) => {
		setSections((prev) =>
			prev.map((s) => {
				if (s.id !== sectionId) return s;
				return {
					...s,
					rows: [
						...s.rows,
						{
							id: `r-${++idCounter.current}`,
							artikel: "",
							benamning: "",
							antal: "",
							enhet: "",
							aPris: "",
							paslagPct: "",
						},
					],
				};
			}),
		);
	}, []);

	const handleUpdateRow = useCallback(
		(sectionId: string, rowId: string, patch: Partial<KalkylSectionRow>) => {
			setSections((prev) =>
				prev.map((s) => {
					if (s.id !== sectionId) return s;
					return { ...s, rows: s.rows.map((r) => (r.id === rowId ? { ...r, ...patch } : r)) };
				}),
			);
		},
		[],
	);

	const handleDeleteRow = useCallback((sectionId: string, rowId: string) => {
		setSections((prev) =>
			prev.map((s) => {
				if (s.id !== sectionId) return s;
				return { ...s, rows: s.rows.filter((r) => r.id !== rowId) };
			}),
		);
	}, []);

	const handleDeleteSection = useCallback((id: string) => {
		setSections((prev) => prev.filter((s) => s.id !== id));
		setSectionMarkups((prev) => {
			const next = { ...prev };
			delete next[id];
			return next;
		});
		setSectionAdjustments((prev) => {
			const next = { ...prev };
			delete next[id];
			return next;
		});
	}, []);

	const handleAddSection = useCallback(() => {
		const newId = `s-${++idCounter.current}`;
		setSections((prev) => [
			...prev,
			{
				id: newId,
				name: `Sektion ${prev.length + 1}`,
				isOpen: true,
				rows: [
					{
						id: `r-${++idCounter.current}`,
						artikel: "",
						benamning: "",
						antal: "",
						enhet: "",
						aPris: "",
						paslagPct: "",
					},
				],
			},
		]);
		setSectionMarkups((prev) => ({ ...prev, [newId]: "10" }));
	}, []);

	const handleUpdateName = useCallback((sectionId: string, name: string) => {
		setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, name } : s)));
	}, []);

	// ── Overhead callbacks ───────────────────────────────────────────────────
	const handleAddOverheadRow = useCallback(() => {
		setOverheadRows((prev) => [
			...prev,
			{
				id: `oh-${++idCounter.current}`,
				artikel: "",
				benamning: "",
				antal: "",
				enhet: "",
				aPris: "",
				paslagPct: "10",
				justering: "0",
			},
		]);
	}, []);

	const handleUpdateOverheadRow = useCallback((rowId: string, patch: Partial<OverheadRow>) => {
		setOverheadRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, ...patch } : r)));
	}, []);

	const handleDeleteOverheadRow = useCallback((rowId: string) => {
		setOverheadRows((prev) => prev.filter((r) => r.id !== rowId));
	}, []);

	// ── Markup/adjustment callbacks ──────────────────────────────────────────
	const handleUpdateCalcPct = useCallback((sectionId: string, pct: string) => {
		setSectionMarkups((prev) => ({ ...prev, [sectionId]: pct }));
	}, []);

	const handleUpdateCalcAdj = useCallback((sectionId: string, adj: string) => {
		setSectionAdjustments((prev) => ({ ...prev, [sectionId]: adj }));
	}, []);

	// ── Computed values ──────────────────────────────────────────────────────
	const calcRows: SammanfattningSectionRow[] = useMemo(
		() =>
			sections.map((section) => {
				const calc = section.rows.reduce((sum, r) => sum + rowBase(r), 0);
				const pct = sectionMarkups[section.id] ?? "10";
				const markupAmount = (calc * parseNum(pct)) / 100;
				const adjustment = sectionAdjustments[section.id] ?? "0";
				const subtotal = calc + markupAmount + parseNum(adjustment);
				return { id: section.id, name: section.name, calc, pct, markupAmount, subtotal, adjustment };
			}),
		[sections, sectionMarkups, sectionAdjustments],
	);

	const summaKalkyl = useMemo(
		() => calcRows.reduce((s, r) => s + r.subtotal, 0),
		[calcRows],
	);
	const summaOverhead = useMemo(
		() => overheadRows.reduce((s, r) => s + overheadDelsumma(r), 0),
		[overheadRows],
	);
	const delsumma = useMemo(() => summaKalkyl + summaOverhead, [summaKalkyl, summaOverhead]);
	const offert = useMemo(
		() => delsumma * (1 + parseNum(vinstPct) / 100),
		[delsumma, vinstPct],
	);

	// ── Navigation ───────────────────────────────────────────────────────────
	function handlePrimary() {
		if (flowState === "choose") {
			// Load sections based on mode
			if (mode === "mall") {
				const templateSections = TEMPLATE_SECTIONS.map((s) => ({ ...s }));
				setSections(templateSections);
				setSectionMarkups(Object.fromEntries(templateSections.map((s) => [s.id, "10"])));
				setSectionAdjustments({});
			} else {
				setSections(DEFAULT_SECTIONS.map((s) => ({ ...s })));
				setSectionMarkups(
					Object.fromEntries(DEFAULT_SECTIONS.map((s) => [s.id, "10"])),
				);
				setSectionAdjustments({});
			}
			setFlowState("edit");
		}
		// In edit mode: save — no-op (navigation handled externally)
	}

	function handleNext() {
		setActiveTab("sammanfattning");
	}

	function handleBack() {
		setFlowState("choose");
		setActiveTab("kalkyl");
	}

	function handleTabClick(tab: ActiveTab) {
		if (flowState === "choose") return; // disabled in choose state
		setActiveTab(tab);
	}

	// ── Render ───────────────────────────────────────────────────────────────
	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
			{/* Page header */}
			<div className="flex flex-col border-b border-slate-200 bg-white px-5">
				<div className="flex items-center py-3">
					{flowState === "choose" ? (
						<h1 className="text-2xl font-semibold">
							<span className="text-slate-400">{calcNo} / </span>
							<Translate text={localizationConstants.calcBerPageTitle} />
							<span className="text-zinc-950"> (standard)</span>
						</h1>
					) : (
						<button
							type="button"
							onClick={handleBack}
							className="flex cursor-pointer items-center gap-2 text-2xl font-semibold text-zinc-950 hover:text-slate-700"
						>
							<ArrowLeft className="h-6 w-6" />
							{modeLabel}
						</button>
					)}
				</div>

				{/* Tab bar — always visible */}
				<div className="flex">
					{TABS.map((tab) => {
						const isActive = activeTab === tab.key && flowState === "edit";
						const isDisabled = flowState === "choose" && tab.key === "sammanfattning";
						return (
							<button
								key={tab.key}
								type="button"
								onClick={() => handleTabClick(tab.key)}
								className={cn(
									"whitespace-nowrap border-b-2 px-4 text-sm font-semibold transition-colors",
									isActive
										? "border-slate-900 pb-3 pt-2 text-slate-950"
										: "border-transparent pb-3.5 pt-2",
									isDisabled
										? "cursor-not-allowed text-slate-300"
										: !isActive
											? "cursor-pointer text-slate-500 hover:text-slate-700"
											: "cursor-pointer",
								)}
							>
								<Translate text={tab.labelKey} />
							</button>
						);
					})}
				</div>
			</div>

			{/* Body */}
			<div className="flex flex-1 overflow-hidden">
				{/* Content area */}
				<div className="flex flex-1 flex-col overflow-hidden">
					<div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
						{activeTab === "kalkyl" && flowState === "choose" && (
							<ChooseContent
								mode={mode}
								selectedTemplateId={selectedTemplateId}
								onModeChange={setMode}
								onTemplateSelect={setSelectedTemplateId}
							/>
						)}
						{activeTab === "kalkyl" && flowState === "edit" && (
							<KalkylTabContent
								sections={sections}
								onToggleSection={handleToggleSection}
								onAddRow={handleAddRow}
								onUpdateRow={handleUpdateRow}
								onDeleteRow={handleDeleteRow}
								onDeleteSection={handleDeleteSection}
								onUpdateName={handleUpdateName}
								onAddSection={handleAddSection}
							/>
						)}
						{activeTab === "sammanfattning" && (
							<SammanfattningTabContent
								calcRows={calcRows}
								overheadRows={overheadRows}
								summaKalkyl={summaKalkyl}
								summaOverhead={summaOverhead}
								delsumma={delsumma}
								vinstPct={vinstPct}
								offert={offert}
								onUpdateCalcPct={handleUpdateCalcPct}
								onUpdateCalcAdj={handleUpdateCalcAdj}
								onUpdateOverheadRow={handleUpdateOverheadRow}
								onDeleteOverheadRow={handleDeleteOverheadRow}
								onAddOverheadRow={handleAddOverheadRow}
								onVinstChange={setVinstPct}
							/>
						)}
					</div>

					{/* Bottom bar */}
					<div
						className={cn(
							"flex items-center border-t border-slate-200 bg-white px-6 py-3.5",
							flowState === "edit" ? "justify-between" : "justify-end",
						)}
					>
						{/* Left: Avbryt — only shown in edit mode (right-aligned in choose mode instead) */}
						{flowState === "edit" && (
							<button
								type="button"
								className="cursor-pointer text-sm font-medium text-slate-500 hover:text-slate-800"
							>
								<Translate text={localizationConstants.cancelButton} />
							</button>
						)}

						{/* Right */}
						{flowState === "choose" && (
							<button
								type="button"
								className="cursor-pointer text-sm font-medium text-slate-500 hover:text-slate-800"
							>
								<Translate text={localizationConstants.cancelButton} />
							</button>
						)}
						{flowState === "edit" && activeTab === "kalkyl" && (
							<Button
								type="button"
								onClick={handleNext}
								className="h-9 cursor-pointer gap-1.5 bg-[#111721] text-sm text-white hover:bg-slate-800"
							>
								<Translate text={localizationConstants.nextButton} />
								<ArrowRight className="h-4 w-4" />
							</Button>
						)}
						{flowState === "edit" && activeTab === "sammanfattning" && (
							<Button
								type="button"
								className="h-9 cursor-pointer gap-1.5 bg-[#111721] text-sm text-white hover:bg-slate-800"
							>
								<Save className="h-4 w-4" />
								<Translate text={localizationConstants.saveButton} />
							</Button>
						)}
					</div>
				</div>

				{/* Right sidebar */}
				<StepSidebar
					wizardStep={wizardStep}
					progress={progress}
					flowState={flowState}
					activeTab={activeTab}
					saveAsTemplate={saveAsTemplate}
					onSaveAsTemplateChange={setSaveAsTemplate}
					onPrimary={handlePrimary}
				/>
			</div>
		</div>
	);
}
