"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import {
	Archive,
	ArrowLeft,
	ArrowUpDown,
	ChevronDown,
	ChevronRight,
	Download,
	FileText,
	Filter,
	Mail,
	MoreVertical,
	Pencil,
	Plus,
	Search,
	Star,
	Trash2,
	Upload,
	X,
	ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ModulePageHeader } from "@/components/layout/navigation";
import {
	KMA_MODULE_TABS,
	KMA_MODULE_TITLE,
	kmaBreadcrumbs,
} from "@/features/kma/data/kmaNav.config";
import localizationConstants from "@/utils/translation/constants";
import type { QualityDocument, QualityMainCategory, QualitySubCategory } from "../../types/quality";
import { MOCK_QUALITY_CATEGORIES, MOCK_QUALITY_PLAN_CATEGORIES } from "../../constants/qualityMock";
import { MailListPage, NOTIFY_COLS } from "../mail-list/MailListPage";
import type { MailList, MailRecipient, NotifyField } from "../mail-list/MailListPage";
import { CategoryPanel } from "../shared/CategoryPanel";
import { RiskTable } from "../risk/RiskTable";
import { RiskTemplateTable } from "../risk/RiskTemplateTable";
import { CreateRiskhanteringPage } from "../risk/CreateRiskhanteringPage";
import { CreateRiskTemplatePage } from "../risk/CreateRiskTemplatePage";

// ── Types ─────────────────────────────────────────────────────────────────────

type DetailTab = "details" | "comments" | "versions";

interface PlanTemplate {
	id: string;
	name: string;
	version: string;
	lastUpdated: string;
	createdBy: string;
}

const MOCK_TEMPLATES: PlanTemplate[] = [
	{ id: "KP001", name: "Badrum", version: "V2025-12", lastUpdated: "2026-01-28", createdBy: "Lars Andersson" },
	{ id: "KP002", name: "Ombyggnad", version: "v1.8", lastUpdated: "2025-01-06", createdBy: "Lars Andersson" },
	{ id: "KP003", name: "Nybyggnad", version: "v2.1", lastUpdated: "2025-04-09", createdBy: "Lars Andersson" },
	{ id: "KP004", name: "Subcontractor Agreement – Construction", version: "v1.8", lastUpdated: "2025-04-09", createdBy: "Lars Andersson" },
];

interface ControlPoint {
	id: string;
	step: string;
	control: string;
	method: string;
	frequency: string;
	responsible: string;
	documentation: string;
}

const MOCK_MAIL_LISTS: MailList[] = [
	{
		id: "ML001",
		name: "Projekt Alpha",
		description: "Notifieringar för Projekt Alpha kontrollplaner",
		recipients: [
			{ id: "r1", name: "Lars Andersson", role: "Platschef", email: "lars.andersson@company.se", notifyNewPlan: true, notifyUpdates: true, notifyNonConformity: true, notifyVerification: false },
			{ id: "r2", name: "Anna Svensson", role: "Kvalitetsinspektör", email: "anna.svensson@company.se", notifyNewPlan: true, notifyUpdates: false, notifyNonConformity: true, notifyVerification: true },
			{ id: "r3", name: "Erik Lindqvist", role: "Projektledare", email: "erik.lindqvist@company.se", notifyNewPlan: false, notifyUpdates: true, notifyNonConformity: false, notifyVerification: true },
		],
	},
	{
		id: "ML002",
		name: "Infrastruktur 2025",
		description: "",
		recipients: [
			{ id: "r1", name: "Lars Andersson", role: "Platschef", email: "lars.andersson@company.se", notifyNewPlan: true, notifyUpdates: true, notifyNonConformity: false, notifyVerification: false },
		],
	},
	{
		id: "ML003",
		name: "Nybyggnad – Etapp 3",
		description: "Mottagare för nybyggnadsprojektets tredje etapp",
		recipients: [
			{ id: "r2", name: "Anna Svensson", role: "Kvalitetsinspektör", email: "anna.svensson@company.se", notifyNewPlan: true, notifyUpdates: true, notifyNonConformity: true, notifyVerification: true },
			{ id: "r3", name: "Erik Lindqvist", role: "Projektledare", email: "erik.lindqvist@company.se", notifyNewPlan: true, notifyUpdates: false, notifyNonConformity: false, notifyVerification: false },
		],
	},
];

// ── Category Tree ─────────────────────────────────────────────────────────────

interface CategoryTreeNode {
	id: string;
	label: string;
	children?: CategoryTreeNode[];
}

const MOCK_CATEGORY_TREE: CategoryTreeNode[] = [
	{
		id: "invoicing",
		label: "Invoicing",
		children: [
			{ id: "compliance-agreement", label: "Compliance Agreement" },
			{ id: "subcontractor-agreement", label: "Subcontractor Agreement" },
		],
	},
	{
		id: "project",
		label: "Project",
		children: [
			{ id: "offer", label: "Offer" },
			{ id: "doc-confirmation", label: "Doc Confirmation" },
			{ id: "employment-confirmation", label: "Employment Confirmation" },
		],
	},
	{ id: "draw", label: "Draw" },
	{ id: "legal", label: "Legal" },
	{ id: "hr-personnel", label: "HR / Personnel" },
	{ id: "marketing", label: "Marketing" },
	{ id: "support-it", label: "Support IT" },
	{ id: "debt-collection", label: "Debt Collection" },
	{ id: "other-modules", label: "Other modules" },
];

// ── Use Template Modal ────────────────────────────────────────────────────────

function UseTemplateModal({
	onClose,
	onUse,
}: {
	onClose: () => void;
	onUse: (template: PlanTemplate) => void;
}) {
	const [selectedId, setSelectedId] = useState<string>("KP002");

	const COLS: { key: string; label: string }[] = [
		{ key: "id", label: localizationConstants.kmaQualityPlanTemplateNrCol },
		{ key: "name", label: localizationConstants.kmaQualityPlanTemplateNameCol },
		{ key: "version", label: localizationConstants.kmaQualityPlanTemplateVersionCol },
		{ key: "lastUpdated", label: localizationConstants.kmaQualityPlanTemplateUpdatedCol },
		{ key: "createdBy", label: localizationConstants.kmaQualityPlanTemplateCreatedByCol },
	];

	const selected = MOCK_TEMPLATES.find((t) => t.id === selectedId) ?? null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="w-165 max-w-full rounded-lg bg-white shadow-xl">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
					<h2 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.kmaQualityPlanTemplateModalTitle} />
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="cursor-pointer rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
					>
						<X className="h-4 w-4" />
					</button>
				</div>
				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-slate-200 bg-slate-50">
								<th className="w-10 px-4 py-3" />
								{COLS.map((col) => (
									<th key={col.key} className="px-4 py-3 text-left">
										<div className="flex items-center gap-1 text-xs font-medium text-slate-500">
											<Translate text={col.label} />
											<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
										</div>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{MOCK_TEMPLATES.map((tpl) => (
								<tr
									key={tpl.id}
									onClick={() => setSelectedId(tpl.id)}
									className={cn(
										"cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50",
										selectedId === tpl.id && "bg-slate-50",
									)}
								>
									<td className="px-4 py-3">
										<input
											type="checkbox"
											checked={selectedId === tpl.id}
											onChange={() => setSelectedId(tpl.id)}
											className="h-4 w-4 cursor-pointer accent-slate-800"
										/>
									</td>
									<td className="px-4 py-3 text-sm text-slate-600">{tpl.id}</td>
									<td className="px-4 py-3 text-sm font-medium text-slate-800">{tpl.name}</td>
									<td className="px-4 py-3 text-sm text-slate-600">{tpl.version}</td>
									<td className="px-4 py-3 text-sm text-slate-600">{tpl.lastUpdated}</td>
									<td className="px-4 py-3 text-sm text-slate-600">{tpl.createdBy}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{/* Footer */}
				<div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4">
					<button
						type="button"
						onClick={onClose}
						className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
					>
						<Translate text={localizationConstants.cancel} />
					</button>
					<button
						type="button"
						onClick={() => selected && onUse(selected)}
						disabled={!selected}
						className="cursor-pointer rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-40"
					>
						<Translate text={localizationConstants.kmaQualityPlanTemplateUseBtn} />
					</button>
				</div>
			</div>
		</div>
	);
}

// ── Create Kontrollplan Page ───────────────────────────────────────────────────

function CreateKontrollplanPage({
	onBack,
	startWithTemplate = false,
}: {
	onBack: () => void;
	startWithTemplate?: boolean;
}) {
	const [name, setName] = useState("");
	const [objType, setObjType] = useState<"projekt" | "order">("projekt");
	const [templateModalOpen, setTemplateModalOpen] = useState(startWithTemplate);

	const [expandedCatIds, setExpandedCatIds] = useState<Set<string>>(
		new Set(MOCK_QUALITY_PLAN_CATEGORIES.map((c) => c.id)),
	);
	const [expandedSubIds, setExpandedSubIds] = useState<Set<string>>(
		new Set([MOCK_QUALITY_PLAN_CATEGORIES[0]?.subcategories[0]?.id ?? ""]),
	);
	const [checkedDocIds, setCheckedDocIds] = useState<Set<string>>(new Set());
	const [addedDocs, setAddedDocs] = useState<QualityDocument[]>([]);
	const [selectedRightIdx, setSelectedRightIdx] = useState<number | null>(null);

	const allDocs = useMemo(
		() =>
			MOCK_QUALITY_PLAN_CATEGORIES.flatMap((c) =>
				c.subcategories.flatMap((s) => s.documents),
			),
		[],
	);

	const addedIds = useMemo(() => new Set(addedDocs.map((d) => d.id)), [addedDocs]);
	const availableCount = allDocs.length - addedDocs.length;
	const allCheckable = allDocs.filter((d) => !addedIds.has(d.id));
	const allChecked =
		allCheckable.length > 0 && allCheckable.every((d) => checkedDocIds.has(d.id));

	function toggleCat(id: string) {
		setExpandedCatIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) { next.delete(id); } else { next.add(id); }
			return next;
		});
	}

	function toggleSub(id: string) {
		setExpandedSubIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) { next.delete(id); } else { next.add(id); }
			return next;
		});
	}

	function toggleDoc(docId: string) {
		setCheckedDocIds((prev) => {
			const next = new Set(prev);
			if (next.has(docId)) { next.delete(docId); } else { next.add(docId); }
			return next;
		});
	}

	function selectAllInSub(sub: QualitySubCategory) {
		setCheckedDocIds((prev) => {
			const next = new Set(prev);
			sub.documents.filter((d) => !addedIds.has(d.id)).forEach((d) => next.add(d.id));
			return next;
		});
	}

	function selectAllInCat(cat: QualityMainCategory) {
		setCheckedDocIds((prev) => {
			const next = new Set(prev);
			cat.subcategories
				.flatMap((s) => s.documents)
				.filter((d) => !addedIds.has(d.id))
				.forEach((d) => next.add(d.id));
			return next;
		});
	}

	function toggleAll() {
		if (allChecked) {
			setCheckedDocIds(new Set());
		} else {
			setCheckedDocIds(new Set(allCheckable.map((d) => d.id)));
		}
	}

	function handleAddDocs() {
		const toAdd = allDocs.filter(
			(d) => checkedDocIds.has(d.id) && !addedIds.has(d.id),
		);
		setAddedDocs((prev) => [...prev, ...toAdd]);
		setCheckedDocIds(new Set());
	}

	function handleRemoveDoc() {
		if (selectedRightIdx === null) return;
		setAddedDocs((prev) => prev.filter((_, i) => i !== selectedRightIdx));
		setSelectedRightIdx(null);
	}

	return (
		<>
			{templateModalOpen && (
				<UseTemplateModal
					onClose={() => setTemplateModalOpen(false)}
					onUse={(tpl) => {
						setName(tpl.name);
						setTemplateModalOpen(false);
					}}
				/>
			)}
			<div className="flex flex-1 flex-col overflow-hidden bg-white">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
					<div>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={onBack}
								className="cursor-pointer text-slate-500 hover:text-slate-800"
							>
								<ArrowLeft className="h-4 w-4" />
							</button>
							<h1 className="text-xl font-semibold text-slate-900">
								<Translate text={localizationConstants.kmaQualityPlanCreateBtn} />
							</h1>
						</div>
						<p className="mt-0.5 pl-6 text-sm text-slate-400">
							<Translate text={localizationConstants.kmaQualityPlanCreateSubtitle} />
						</p>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={onBack}
							className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
						>
							<Translate text={localizationConstants.cancel} />
						</button>
						<button
							type="button"
							className="cursor-pointer rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
						>
							<Translate text={localizationConstants.save} />
						</button>
					</div>
				</div>
				{/* Scrollable body */}
				<div className="flex flex-1 flex-col overflow-y-auto">
					{/* Kontrollplan detaljer form */}
					<div className="border-b border-slate-200 px-6 py-5">
						<h2 className="mb-4 text-sm font-semibold text-slate-700">
							<Translate text={localizationConstants.kmaQualityPlanCreateDetailsHeader} />
						</h2>
						<div className="flex flex-col gap-4">
							{/* Name */}
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaQualityPlanCreateNameLabel} />
								</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Badrum"
									className="h-9 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
								/>
							</div>
							{/* ID + Version */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="mb-1 block text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.kmaQualityPlanCreateIdLabel} />
									</label>
									<input
										type="text"
										defaultValue="KP001"
										readOnly
										className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none"
									/>
								</div>
								<div>
									<label className="mb-1 block text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.kmaQualityPlanCreateVersionLabel} />
									</label>
									<input
										type="text"
										defaultValue="2025-12"
										readOnly
										className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none"
									/>
								</div>
							</div>
							{/* KMA id */}
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaQualityPlanCreateKmaIdLabel} />
								</label>
								<input
									type="text"
									defaultValue="KMA001"
									readOnly
									className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none"
								/>
							</div>
							{/* Objekt typ + Objekt */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="mb-1.5 block text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.kmaQualityPlanCreateObjTypeLabel} />
									</label>
									<div className="flex gap-4">
										<label className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-700">
											<input
												type="radio"
												name="objType"
												value="projekt"
												checked={objType === "projekt"}
												onChange={() => setObjType("projekt")}
												className="h-3.5 w-3.5 accent-slate-800"
											/>
											<Translate text={localizationConstants.kmaQualityPlanCreateObjTypeProject} />
										</label>
										<label className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-700">
											<input
												type="radio"
												name="objType"
												value="order"
												checked={objType === "order"}
												onChange={() => setObjType("order")}
												className="h-3.5 w-3.5 accent-slate-800"
											/>
											<Translate text={localizationConstants.kmaQualityPlanCreateObjTypeOrder} />
										</label>
									</div>
								</div>
								<div>
									<label className="mb-1 block text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.kmaQualityPlanCreateObjectLabel} />
									</label>
									<select className="h-9 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300">
										<option>Projekt 2025-001</option>
										<option>Projekt 2025-002</option>
										<option>Projekt 2024-012</option>
									</select>
								</div>
							</div>
							{/* Skapad av + Date */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="mb-1 block text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.kmaQualityPlanCreateCreatedByLabel} />
									</label>
									<input
										type="text"
										defaultValue="Jake Jamisson"
										readOnly
										className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none"
									/>
								</div>
								<div>
									<label className="mb-1 block text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.kmaQualityPlanCreateDateLabel} />
									</label>
									<input
										type="date"
										defaultValue="2026-01-15"
										readOnly
										className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Dual panel: tree picker + right panel */}
					<div className="flex min-h-64 flex-1">
						{/* Left: Huvudmallstruktur tree */}
						<div className="flex flex-1 flex-col border-r border-slate-200">
							<div className="border-b border-slate-200 px-5 py-3">
								<h3 className="text-xs font-semibold tracking-wide text-slate-500">
									<Translate text={localizationConstants.kmaQualityPlanCreateStructureHeader} />
								</h3>
							</div>
							<div className="flex-1 overflow-y-auto px-5 py-3">
								{/* Alla */}
								<label className="mb-3 flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
									<input
										type="checkbox"
										checked={allChecked}
										onChange={toggleAll}
										className="h-4 w-4 accent-slate-800"
									/>
									<Translate text={localizationConstants.kmaQualityPlanCreateSelectAll} />
								</label>

								{MOCK_QUALITY_PLAN_CATEGORIES.map((cat) => {
									const catExpanded = expandedCatIds.has(cat.id);
									return (
										<div key={cat.id} className="mb-2">
											<button
												type="button"
												onClick={() => toggleCat(cat.id)}
												className="flex w-full cursor-pointer items-center gap-1.5 py-1 text-sm font-medium text-slate-700 hover:text-slate-900"
											>
												{catExpanded ? (
													<ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
												) : (
													<ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
												)}
												<FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
												{cat.label}
											</button>

											{catExpanded && (
												<div className="mt-1 pl-5">
													{cat.subcategories.map((sub) => {
														const subExpanded = expandedSubIds.has(sub.id);
														const subCheckedCount = sub.documents.filter(
															(d) => checkedDocIds.has(d.id),
														).length;
														return (
															<div key={sub.id} className="mb-1">
																<button
																	type="button"
																	onClick={() => toggleSub(sub.id)}
																	className="flex w-full cursor-pointer items-center gap-1.5 py-1 text-sm text-slate-600 hover:text-slate-800"
																>
																	{subExpanded ? (
																		<ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
																	) : (
																		<ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
																	)}
																	<FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
																	<span>{sub.label}</span>
																	{subCheckedCount > 0 && (
																		<span className="ml-1 rounded-full bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600">
																			{subCheckedCount}
																		</span>
																	)}
																</button>

																{subExpanded && (
																	<div className="mt-1 pl-5">
																		{sub.documents
																			.filter((d) => !addedIds.has(d.id))
																			.map((doc) => (
																				<label
																					key={doc.id}
																					className="mb-1 flex cursor-pointer items-center gap-2 text-xs text-slate-600 hover:text-slate-800"
																				>
																					<input
																						type="checkbox"
																						checked={checkedDocIds.has(doc.id)}
																						onChange={() => toggleDoc(doc.id)}
																						className="h-3.5 w-3.5 accent-slate-800"
																					/>
																					{doc.id} {doc.title}
																				</label>
																			))}
																		{sub.documents.some(
																			(d) => !addedIds.has(d.id),
																		) && (
																			<button
																				type="button"
																				onClick={() => selectAllInSub(sub)}
																				className="mt-1 cursor-pointer text-xs text-blue-600 hover:underline"
																			>
																				<Translate
																					text={
																						localizationConstants.kmaQualityPlanCreateSelectAllSub
																					}
																				/>
																			</button>
																		)}
																	</div>
																)}
															</div>
														);
													})}
													<button
														type="button"
														onClick={() => selectAllInCat(cat)}
														className="mt-1 cursor-pointer text-xs text-blue-600 hover:underline"
													>
														<Translate
															text={localizationConstants.kmaQualityPlanCreateSelectAllCat}
														/>
													</button>
												</div>
											)}
										</div>
									);
								})}
							</div>
							<div className="border-t border-slate-200 px-5 py-2">
								<span className="text-xs text-slate-400">
									{availableCount}{" "}
									<Translate text={localizationConstants.kmaQualityPlanCreateAvailable} />
								</span>
							</div>
						</div>

						{/* Right: Ny kontrollplan */}
						<div className="flex w-72 shrink-0 flex-col">
							<div className="border-b border-slate-200 px-5 py-3">
								<h3 className="text-xs font-semibold tracking-wide text-slate-500">
									<Translate text={localizationConstants.kmaQualityPlanCreateNewPanelTitle} />
								</h3>
							</div>

							{/* Add / Remove buttons */}
							<div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4">
								<button
									type="button"
									onClick={handleAddDocs}
									disabled={checkedDocIds.size === 0}
									className="flex cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
								>
									<Translate text={localizationConstants.kmaQualityPlanCreateAddBtn} />
									{" →"}
								</button>
								<button
									type="button"
									onClick={handleRemoveDoc}
									disabled={selectedRightIdx === null}
									className="flex cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
								>
									{"← "}
									<Translate text={localizationConstants.kmaQualityPlanCreateRemoveBtn} />
								</button>
							</div>

							{/* Added docs list */}
							<div className="flex-1 overflow-y-auto px-3 py-2">
								{addedDocs.length === 0 ? (
									<p className="mt-6 text-center text-xs text-slate-400">—</p>
								) : (
									addedDocs.map((doc, i) => (
										<button
											key={doc.id}
											type="button"
											onClick={() =>
												setSelectedRightIdx(i === selectedRightIdx ? null : i)
											}
											className={cn(
												"mb-1 flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs",
												selectedRightIdx === i
													? "bg-slate-100 text-slate-900"
													: "text-slate-600 hover:bg-slate-50",
											)}
										>
											<FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
											<span className="truncate">{doc.id} {doc.title}</span>
										</button>
									))
								)}
							</div>

							{/* Note */}
							{addedDocs.length > 0 && (
								<div className="border-t border-slate-200 px-3 py-2">
									<p className="rounded border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
										<Translate text={localizationConstants.kmaQualityPlanCreateNote} />
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

// ── Doc Detail View ───────────────────────────────────────────────────────────

interface DocDetailViewProps {
	doc: QualityDocument;
	onBack: () => void;
}

function DocDetailView({ doc, onBack }: DocDetailViewProps) {
	const [activeTab, setActiveTab] = useState<DetailTab>("details");
	const [starred, setStarred] = useState(doc.starred);

	const DETAIL_TABS: { id: DetailTab; key: string }[] = [
		{ id: "details", key: localizationConstants.kmaQualityDetailDetails },
		{ id: "comments", key: localizationConstants.kmaQualityDetailComments },
		{ id: "versions", key: localizationConstants.kmaQualityDetailVersions },
	];

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-white">
			{/* Back bar */}
			<div className="flex items-center gap-2 border-b border-slate-200 px-6 py-3">
				<button
					type="button"
					onClick={onBack}
					className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
				>
					<ArrowLeft className="h-4 w-4" />
					<Translate text={localizationConstants.backButton} />
				</button>
			</div>

			{/* Title row */}
			<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
				<div className="flex items-center gap-3">
					<h1 className="text-xl font-semibold text-slate-900">{doc.title}</h1>
					<button
						type="button"
						onClick={() => setStarred((v) => !v)}
						className="cursor-pointer text-slate-300 hover:text-amber-400"
					>
						<Star
							className="h-5 w-5"
							fill={starred ? "#F59E0B" : "none"}
							stroke={starred ? "#F59E0B" : "currentColor"}
						/>
					</button>
					{doc.status === "published" && (
						<span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
							<Translate text={localizationConstants.kmaQualityPublished} />
						</span>
					)}
				</div>
				<button
					type="button"
					className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
				>
					<Translate text={localizationConstants.kmaQualityEditMetadata} />
				</button>
			</div>

			{/* Content area */}
			<div className="flex flex-1 overflow-hidden">
				{/* Document preview */}
				<div className="flex flex-1 flex-col overflow-hidden border-r border-slate-200">
					{/* Preview toolbar */}
					<div className="flex items-center justify-between border-b border-slate-200 px-5 py-2">
						<span className="text-sm font-medium text-slate-600">
							<Translate text={localizationConstants.kmaQualityDetailZoom} />
						</span>
						<div className="flex items-center gap-3">
							<button
								type="button"
								className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
							>
								<ZoomIn className="h-4 w-4" />
								<Translate text={localizationConstants.kmaQualityDetailZoom} />
							</button>
							<button
								type="button"
								className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
							>
								<Download className="h-4 w-4" />
								<Translate text={localizationConstants.kmaQualityDetailDownload} />
							</button>
						</div>
					</div>

					{/* Mock document content */}
					<div className="flex-1 overflow-y-auto bg-slate-100 p-6">
						<div className="mx-auto max-w-2xl rounded-md bg-white px-12 py-10 shadow-sm">
							<h2 className="mb-1 text-center text-xl font-bold tracking-wide text-slate-900">
								KONSULTAVTAL
							</h2>
							<p className="mb-6 text-center text-xs text-slate-400">
								Avtalsnummer: KA-2025-001
							</p>
							<p className="mb-6 text-xs text-slate-500">Datum: 2025-01-10</p>

							<h3 className="mb-3 font-semibold text-slate-800">1. PARTER</h3>
							<p className="mb-4 text-xs leading-relaxed text-slate-600">
								Detta konsultavtal (&quot;Avtalet&quot;) har denna dag ingåtts mellan:
							</p>
							<div className="mb-4 pl-4 text-xs leading-loose text-slate-600">
								<p>
									<strong>Uppdragsgivare:</strong> [Företagsnamn]
								</p>
								<p>
									<strong>Organisationsnummer:</strong> [Org.nr]
								</p>
								<p>Adress: [Adress]</p>
								<br />
								<p>
									<strong>Konsult:</strong> [Konsultens namn]
								</p>
								<p>
									<strong>Personnummer:</strong> [Personnummer]
								</p>
								<p>Adress: [Adress]</p>
							</div>

							<h3 className="mb-3 font-semibold text-slate-800">
								2. UPPDRAGETS OMFATTNING
							</h3>
							<p className="mb-2 text-xs leading-relaxed text-slate-600">
								Konsulten åtar sig att utföra följande tjänster för Uppdragsgivaren:
							</p>
							<ul className="mb-4 list-disc pl-6 text-xs leading-loose text-slate-600">
								<li>Rådgivning och expertis inom [område]</li>
								<li>Deltagande i projektmöten och workshops</li>
								<li>Dokumentation och rapportering av utfört arbete</li>
							</ul>

							<h3 className="mb-3 font-semibold text-slate-800">3. AVTALSTID</h3>
							<p className="text-xs leading-relaxed text-slate-600">
								Avtalet gäller från och med [startdatum] till och med [slutdatum], vilket låter sägas upp
								eller förlängas enligt punkterna i detta avtal.
							</p>
						</div>
					</div>
				</div>

				{/* Right metadata panel */}
				<div className="flex w-72 shrink-0 flex-col overflow-hidden">
					{/* Tab bar */}
					<div className="flex border-b border-slate-200">
						{DETAIL_TABS.map((tab) => (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTab(tab.id)}
								className={cn(
									"flex-1 cursor-pointer border-b-2 py-3 text-center text-sm font-medium transition-colors",
									activeTab === tab.id
										? "border-slate-900 text-slate-900"
										: "border-transparent text-slate-500 hover:text-slate-700",
								)}
							>
								<Translate text={tab.key} />
							</button>
						))}
					</div>

					{/* Details tab */}
					{activeTab === "details" && (
						<div className="flex-1 overflow-y-auto px-4 py-4 text-sm">
							{/* Category From */}
							<div className="mb-4">
								<p className="mb-1.5 text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaQualityDetailCatFrom} />
								</p>
								<div className="flex gap-4">
									<label className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-700">
										<input
											type="radio"
											name="catFrom"
											defaultChecked
											className="h-3.5 w-3.5 accent-slate-800"
										/>
										{doc.categoryFrom}
									</label>
									<label className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-700">
										<input
											type="radio"
											name="catFrom"
											className="h-3.5 w-3.5 accent-slate-800"
										/>
										{doc.subCategoryFrom}
									</label>
								</div>
							</div>

							{/* Template type */}
							<div className="mb-4">
								<p className="mb-1.5 text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaQualityDetailTemplateType} />
								</p>
								<p className="text-sm text-slate-700">{doc.templateType}</p>
							</div>

							{/* Tags */}
							<div className="mb-4">
								<p className="mb-1.5 text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaQualityDetailTags} />
								</p>
								<div className="flex flex-wrap gap-1.5">
									{doc.tags.map((tag) => (
										<span
											key={tag}
											className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-600"
										>
											{tag}
										</span>
									))}
								</div>
							</div>

							{/* Owner */}
							<div className="mb-4">
								<p className="mb-1.5 text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaQualityDetailOwner} />
								</p>
								<p className="text-sm text-slate-700">{doc.owner}</p>
							</div>

							{/* Linked modules */}
							<div className="mb-4">
								<p className="mb-1.5 text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaQualityDetailLinkedModules} />
								</p>
								<div className="flex flex-wrap gap-1.5">
									{doc.linkedModules.map((mod) => (
										<span
											key={mod}
											className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700"
										>
											{mod}
										</span>
									))}
								</div>
							</div>

							<div className="my-3 border-t border-slate-100" />

							{/* Created */}
							<div className="mb-3">
								<p className="mb-0.5 text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaQualityDetailCreated} />
								</p>
								<p className="text-sm text-slate-700">{doc.created}</p>
							</div>

							{/* Last updated */}
							<div className="mb-3">
								<p className="mb-0.5 text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaQualityDetailLastUpdated} />
								</p>
								<p className="text-sm text-slate-700">{doc.lastUpdated}</p>
							</div>

							<div className="my-3 border-t border-slate-100" />

							{/* Recent activity */}
							<div className="mb-4">
								<p className="mb-1.5 text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaQualityDetailRecentActivity} />
								</p>
								<p className="text-xs text-slate-500">{doc.recentActivity}</p>
							</div>
						</div>
					)}

					{/* Comments tab */}
					{activeTab === "comments" && (
						<div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
							<div className="mb-3 flex flex-col gap-2">
								<div className="rounded-md border border-slate-200 bg-slate-50 p-3">
									<div className="mb-1 flex items-center justify-between">
										<span className="text-xs font-medium text-slate-700">Anna Svensson</span>
										<span className="text-xs text-slate-400">2 days ago</span>
									</div>
									<p className="text-xs text-slate-600">Document approved and published to the quality system.</p>
								</div>
								<div className="rounded-md border border-slate-200 bg-slate-50 p-3">
									<div className="mb-1 flex items-center justify-between">
										<span className="text-xs font-medium text-slate-700">Lars Andersson</span>
										<span className="text-xs text-slate-400">5 days ago</span>
									</div>
									<p className="text-xs text-slate-600">Initial draft reviewed. Minor revisions requested.</p>
								</div>
							</div>
							<textarea
								rows={2}
								placeholder="Add a comment..."
								className="w-full resize-none rounded border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
							/>
						</div>
					)}

					{/* Versions tab */}
					{activeTab === "versions" && (
						<div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
							{[
								{ version: "v1.2", date: "2025-01-18", author: "Anna Svensson", note: "Updated compliance section" },
								{ version: "v1.1", date: "2024-11-04", author: "Lars Andersson", note: "Minor wording changes" },
								{ version: "v1.0", date: "2024-01-15", author: "Anna Svensson", note: "Initial publication" },
							].map((v) => (
								<div key={v.version} className="mb-2 flex items-start gap-3 rounded-md border border-slate-200 bg-white p-3">
									<span className="mt-0.5 shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono font-medium text-slate-600">
										{v.version}
									</span>
									<div className="flex-1 min-w-0">
										<p className="text-xs text-slate-600">{v.note}</p>
										<p className="mt-0.5 text-xs text-slate-400">{v.author} · {v.date}</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}



// ── Documents Panel ────────────────────────────────────────────────────────────

interface DocsPanelProps {
	documents: QualityDocument[];
	onOpenDoc: (doc: QualityDocument) => void;
	selectedSubCatId: string | null;
	onOpenPlan?: () => void;
}

function DocsPanel({ documents, onOpenDoc, selectedSubCatId, onOpenPlan }: DocsPanelProps) {
	const t = useTranslate();
	const [search, setSearch] = useState("");
	const [openMenuDocId, setOpenMenuDocId] = useState<string | null>(null);

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		return documents.filter(
			(d) =>
				d.id.toLowerCase().includes(q) ||
				d.title.toLowerCase().includes(q),
		);
	}, [documents, search]);

	// reset search when selection changes
	useEffect(() => {
		setSearch("");
	}, [selectedSubCatId]);

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
				<p className="text-xs font-semibold tracking-wide text-slate-500">
					<Translate text={localizationConstants.kmaQualityDocs} />
				</p>
				<button
					type="button"
					className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
				>
					<Upload className="h-3.5 w-3.5" />
					<Translate text={localizationConstants.kmaQualityUpload} />
				</button>
			</div>
			{/* Search */}
			<div className="relative border-b border-slate-200">
				<Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder={t(localizationConstants.kmaQualitySearchDocs)}
					className="h-9 w-full bg-white pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none"
				/>
			</div>
			{/* Doc list */}
			<div className="flex-1 overflow-y-auto">
				{filtered.length === 0 ? (
					<div className="flex h-32 items-center justify-center text-xs text-slate-400">
						<Translate text={localizationConstants.noDataFound} />
					</div>
				) : (
					filtered.map((doc) => (
						<div
							key={doc.id}
							className="group flex items-start gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 hover:bg-slate-50"
						>
							{/* File icon */}
							<div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-red-500">
								<span className="text-xs font-bold uppercase text-white">
									{doc.fileType}
								</span>
							</div>
							{/* Info */}
							<button
								type="button"
								className="flex-1 cursor-pointer text-left"
								onClick={() => onOpenPlan ? onOpenPlan() : onOpenDoc(doc)}
							>
								<p className="text-xs font-semibold text-slate-800">
									{doc.id} {doc.title}
								</p>
								<p className="mt-0.5 text-xs text-slate-400">{doc.updatedText}</p>
							</button>
							{/* Menu */}
							<div className="relative shrink-0">
								<button
									type="button"
									onClick={() =>
										setOpenMenuDocId(openMenuDocId === doc.id ? null : doc.id)
									}
									className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-200 hover:text-slate-600"
								>
									<MoreVertical className="h-4 w-4" />
								</button>
								{openMenuDocId === doc.id && (
									<div className="absolute right-0 z-20 mt-1 w-36 rounded-md border border-slate-200 bg-white py-1 shadow-md">
										<button
											type="button"
											className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
											onClick={() => { if (onOpenPlan) { onOpenPlan(); } else { onOpenDoc(doc); } setOpenMenuDocId(null); }}
										>
											<Pencil className="h-3.5 w-3.5 text-slate-400" />
											<Translate text={localizationConstants.actionEdit} />
										</button>
										<button
											type="button"
											className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-slate-50"
											onClick={() => setOpenMenuDocId(null)}
										>
											<Trash2 className="h-3.5 w-3.5 text-red-400" />
											<Translate text={localizationConstants.actionDelete} />
										</button>
									</div>
								)}
							</div>
						</div>
					))
				)}
			</div>
			{/* Description textarea (visible when subcategory selected, per Figma) */}
			{selectedSubCatId && (
				<div className="border-t border-slate-200 px-4 py-3">
					<p className="mb-1.5 text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.kmaQualityDetailDescription} />
					</p>
					<textarea
						rows={3}
						placeholder="Description"
						className="w-full resize-none rounded border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
					/>
				</div>
			)}
		</div>
	);
}

// ── Discard Confirm Modal ─────────────────────────────────────────────────────

function DiscardConfirmModal({
	onConfirm,
	onCancel,
}: {
	onConfirm: () => void;
	onCancel: () => void;
}) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="w-96 rounded-lg bg-white p-6 shadow-xl">
				<h3 className="text-base font-semibold text-slate-900">
					<Translate text={localizationConstants.kmaControlPlanDiscardTitle} />
				</h3>
				<p className="mt-2 text-sm text-slate-600">
					<Translate text={localizationConstants.kmaControlPlanDiscardMsg} />
				</p>
				<div className="mt-5 flex justify-end gap-3">
					<button
						type="button"
						onClick={onCancel}
						className="cursor-pointer rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
					>
						<Translate text={localizationConstants.kmaControlPlanDiscardCancel} />
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
					>
						<Translate text={localizationConstants.kmaControlPlanDiscardConfirm} />
					</button>
				</div>
			</div>
		</div>
	);
}

// ── Open Kontrollplan Page ────────────────────────────────────────────────────

function OpenKontrollplanPage({ onBack }: { onBack: () => void }) {
	const t = useTranslate();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState<"draft" | "active">("draft");
	const version = "1.0";
	const [rows, setRows] = useState<ControlPoint[]>([
		{ id: crypto.randomUUID(), step: "", control: "", method: "", frequency: "", responsible: "", documentation: "" },
	]);
	const [discardOpen, setDiscardOpen] = useState(false);
	const [errors, setErrors] = useState<{ name?: boolean; rows?: boolean }>({});

	const isDirty =
		name.trim() !== "" ||
		description.trim() !== "" ||
		rows.some(
			(r) =>
				r.step !== "" ||
				r.control !== "" ||
				r.method !== "" ||
				r.frequency !== "" ||
				r.responsible !== "" ||
				r.documentation !== "",
		);

	useEffect(() => {
		if (!isDirty) return;
		function handleBeforeUnload(e: BeforeUnloadEvent) {
			e.preventDefault();
			e.returnValue = "";
		}
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [isDirty]);

	function handleCancel() {
		if (isDirty) {
			setDiscardOpen(true);
		} else {
			onBack();
		}
	}

	function handleSave() {
		const newErrors: { name?: boolean; rows?: boolean } = {};
		if (!name.trim()) newErrors.name = true;
		if (rows.some((r) => !r.step.trim() || !r.control.trim())) newErrors.rows = true;
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		setErrors({});
		// backend integration pending
	}

	function addRow() {
		setRows((prev) => [
			...prev,
			{ id: crypto.randomUUID(), step: "", control: "", method: "", frequency: "", responsible: "", documentation: "" },
		]);
	}

	function deleteRow(id: string) {
		setRows((prev) => prev.filter((r) => r.id !== id));
	}

	function updateRow(id: string, field: keyof Omit<ControlPoint, "id">, value: string) {
		setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
	}

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{discardOpen && (
				<DiscardConfirmModal
					onConfirm={onBack}
					onCancel={() => setDiscardOpen(false)}
				/>
			)}
			{/* Header */}
			<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={handleCancel}
						className="cursor-pointer rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
					>
						<ArrowLeft className="h-4 w-4" />
					</button>
					<h1 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.kmaControlPlanOpenTitle} />
					</h1>
				</div>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={handleCancel}
						className="cursor-pointer rounded-md border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
					>
						<Translate text={localizationConstants.kmaControlPlanCancelBtn} />
					</button>
					<button
						type="button"
						onClick={handleSave}
						className="cursor-pointer rounded-md bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
					>
						<Translate text={localizationConstants.kmaControlPlanSaveBtn} />
					</button>
				</div>
			</div>
			{/* Body */}
			<div className="flex-1 overflow-y-auto px-6 py-6">
				{/* General Information */}
				<div className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
					<h2 className="mb-4 text-sm font-semibold text-slate-800">
						<Translate text={localizationConstants.kmaControlPlanGeneralInfo} />
					</h2>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="mb-1.5 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaControlPlanNameLabel} />
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => { setName(e.target.value); if (e.target.value.trim()) setErrors((p) => ({ ...p, name: false })); }}
								aria-required="true"
								aria-invalid={!!errors.name}
								className={cn(
									"w-full rounded-md border px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1",
									errors.name
										? "border-red-400 focus:ring-red-300"
										: "border-slate-200 focus:ring-slate-300",
								)}
							/>
							{errors.name && (
								<p className="mt-1 text-xs text-red-500">
									<Translate text={localizationConstants.kmaControlPlanValidationName} />
								</p>
							)}
						</div>
						<div>
							<label className="mb-1.5 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaControlPlanStatusLabel} />
							</label>
							<select
								value={status}
								onChange={(e) => setStatus(e.target.value as "draft" | "active")}
								className="w-full cursor-pointer rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300"
							>
								<option value="draft">{t(localizationConstants.kmaControlPlanStatusDraft)}</option>
								<option value="active">{t(localizationConstants.kmaControlPlanStatusActive)}</option>
							</select>
						</div>
						<div>
							<label className="mb-1.5 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaControlPlanDescLabel} />
							</label>
							<textarea
								rows={3}
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
							/>
						</div>
						<div>
							<label className="mb-1.5 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaControlPlanVersionLabel} />
							</label>
							<input
								type="text"
								value={version}
								readOnly
								className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
							/>
						</div>
					</div>
				</div>
				{/* Control Points Table */}
				<div className="rounded-lg border border-slate-200 bg-white">
					{errors.rows && (
						<p className="border-b border-red-200 bg-red-50 px-5 py-2 text-xs text-red-600">
							<Translate text={localizationConstants.kmaControlPlanValidationRows} />
						</p>
					)}
					<div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
						<h2 className="text-sm font-semibold text-slate-800">
							<Translate text={localizationConstants.kmaControlPlanTableTitle} />
						</h2>
						<button
							type="button"
							onClick={addRow}
							className="flex cursor-pointer items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
						>
							<Plus className="h-3.5 w-3.5" />
							<Translate text={localizationConstants.kmaControlPlanAddRow} />
						</button>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-xs">
							<thead>
								<tr className="border-b border-slate-200 bg-slate-50">
									<th className="w-10 px-3 py-2.5 text-center font-medium text-slate-500">#</th>
									<th className="min-w-32 px-3 py-2.5 text-left font-medium text-slate-500">
										<Translate text={localizationConstants.kmaControlPlanColStep} />
									</th>
									<th className="min-w-32 px-3 py-2.5 text-left font-medium text-slate-500">
										<Translate text={localizationConstants.kmaControlPlanColControl} />
									</th>
									<th className="min-w-28 px-3 py-2.5 text-left font-medium text-slate-500">
										<Translate text={localizationConstants.kmaControlPlanColMethod} />
									</th>
									<th className="min-w-28 px-3 py-2.5 text-left font-medium text-slate-500">
										<Translate text={localizationConstants.kmaControlPlanColFrequency} />
									</th>
									<th className="min-w-28 px-3 py-2.5 text-left font-medium text-slate-500">
										<Translate text={localizationConstants.kmaControlPlanColResponsible} />
									</th>
									<th className="min-w-36 px-3 py-2.5 text-left font-medium text-slate-500">
										<Translate text={localizationConstants.kmaControlPlanColDoc} />
									</th>
									<th className="w-8 px-2 py-2.5" />
								</tr>
							</thead>
							<tbody>
								{rows.map((row, idx) => (
									<tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
										<td className="px-3 py-1.5 text-center text-slate-400">{idx + 1}</td>
										<td className="px-2 py-1">
											<input
												type="text"
												value={row.step}
												onChange={(e) => updateRow(row.id, "step", e.target.value)}
												aria-label={`${t(localizationConstants.kmaControlPlanColStep)} ${idx + 1}`}
												className="w-full rounded border border-transparent px-2 py-1 text-slate-700 focus:border-slate-300 focus:outline-none"
											/>
										</td>
										<td className="px-2 py-1">
											<input
												type="text"
												value={row.control}
												onChange={(e) => updateRow(row.id, "control", e.target.value)}
												aria-label={`${t(localizationConstants.kmaControlPlanColControl)} ${idx + 1}`}
												className="w-full rounded border border-transparent px-2 py-1 text-slate-700 focus:border-slate-300 focus:outline-none"
											/>
										</td>
										<td className="px-2 py-1">
											<input
												type="text"
												value={row.method}
												onChange={(e) => updateRow(row.id, "method", e.target.value)}
												aria-label={`${t(localizationConstants.kmaControlPlanColMethod)} ${idx + 1}`}
												className="w-full rounded border border-transparent px-2 py-1 text-slate-700 focus:border-slate-300 focus:outline-none"
											/>
										</td>
										<td className="px-2 py-1">
											<input
												type="text"
												value={row.frequency}
												onChange={(e) => updateRow(row.id, "frequency", e.target.value)}
												aria-label={`${t(localizationConstants.kmaControlPlanColFrequency)} ${idx + 1}`}
												className="w-full rounded border border-transparent px-2 py-1 text-slate-700 focus:border-slate-300 focus:outline-none"
											/>
										</td>
										<td className="px-2 py-1">
											<input
												type="text"
												value={row.responsible}
												onChange={(e) => updateRow(row.id, "responsible", e.target.value)}
												aria-label={`${t(localizationConstants.kmaControlPlanColResponsible)} ${idx + 1}`}
												className="w-full rounded border border-transparent px-2 py-1 text-slate-700 focus:border-slate-300 focus:outline-none"
											/>
										</td>
										<td className="px-2 py-1">
											<input
												type="text"
												value={row.documentation}
												onChange={(e) => updateRow(row.id, "documentation", e.target.value)}
												aria-label={`${t(localizationConstants.kmaControlPlanColDoc)} ${idx + 1}`}
												className="w-full rounded border border-transparent px-2 py-1 text-slate-700 focus:border-slate-300 focus:outline-none"
											/>
										</td>
										<td className="px-2 py-1">
											<button
												type="button"
												onClick={() => deleteRow(row.id)}
												className="flex cursor-pointer items-center justify-center rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
											>
												<X className="h-3.5 w-3.5" />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}



// ── Create Sändlista Page ─────────────────────────────────────────────────────

function CreateSandlistaPage({ onBack }: { onBack: () => void }) {
	const t = useTranslate();
	const [listName, setListName] = useState("");
	const [listDesc, setListDesc] = useState("");
	const [recipients, setRecipients] = useState<MailRecipient[]>([]);
	const [search, setSearch] = useState("");
	const [errors, setErrors] = useState<{ name?: boolean; invalidEmail?: boolean }>({});
	const [isDirty, setIsDirty] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (!isDirty) return;
		function handleBeforeUnload(e: BeforeUnloadEvent) {
			e.preventDefault();
			e.returnValue = "";
		}
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [isDirty]);

	const filtered = recipients.filter(
		(r) =>
			search === "" ||
			r.name.toLowerCase().includes(search.toLowerCase()) ||
			r.email.toLowerCase().includes(search.toLowerCase()) ||
			r.role.toLowerCase().includes(search.toLowerCase()),
	);

	function handleNameChange(val: string) {
		setListName(val);
		setIsDirty(true);
		if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
	}

	function handleSave() {
		if (isSaving) return;
		const newErrors: { name?: boolean; invalidEmail?: boolean } = {};
		if (!listName.trim()) newErrors.name = true;
		if (recipients.some((r) => r.email.trim() && !z.string().email().safeParse(r.email.trim()).success)) {
			newErrors.invalidEmail = true;
		}
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		setErrors({});
		setIsSaving(true);
		// backend integration pending
	}

	function addRecipient() {
		setRecipients((prev) => [
			...prev,
			{ id: `temp_${crypto.randomUUID()}`, name: "", role: "", email: "", notifyNewPlan: false, notifyUpdates: false, notifyNonConformity: false, notifyVerification: false },
		]);
		setIsDirty(true);
	}

	function updateRecipient(id: string, field: "name" | "role" | "email", value: string) {
		setRecipients((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
		setIsDirty(true);
	}

	function toggleNotifyCreate(id: string, field: NotifyField) {
		setRecipients((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: !r[field] } : r)));
		setIsDirty(true);
	}

	function removeRecipient(id: string) {
		setRecipients((prev) => prev.filter((r) => r.id !== id));
		setIsDirty(true);
	}

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-white">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={onBack}
						className="cursor-pointer rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
					>
						<ArrowLeft className="h-4 w-4" />
					</button>
					<h1 className="text-xl font-semibold text-slate-900">
						<Translate text={localizationConstants.kmaCreateSandlistaTitle} />
					</h1>
				</div>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={onBack}
						className="cursor-pointer rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
					>
						<Translate text={localizationConstants.cancel} />
					</button>
					<button
						type="button"
						onClick={handleSave}
						disabled={isSaving}
						className="cursor-pointer rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
					>
						<Translate text={localizationConstants.save} />
					</button>
				</div>
			</div>

			{/* Body */}
			<div className="flex-1 overflow-y-auto">
				{/* General info */}
				<div className="border-b border-slate-200 px-6 py-5">
					<h2 className="mb-4 text-sm font-semibold text-slate-700">
						<Translate text={localizationConstants.kmaCreateSandlistaGeneralInfo} />
					</h2>
					<div className="flex flex-col gap-4 max-w-lg">
						{/* List name */}
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaCreateSandlistaNameLabel} />
								{" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								value={listName}
								onChange={(e) => handleNameChange(e.target.value)}
								aria-label={t(localizationConstants.kmaCreateSandlistaNameLabel)}
								className={cn(
									"h-9 w-full rounded border bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300",
									errors.name ? "border-red-400 focus:ring-red-300" : "border-slate-200",
								)}
							/>
							{errors.name && (
								<p className="mt-1 text-xs text-red-500">
									<Translate text={localizationConstants.kmaCreateSandlistaValidationName} />
								</p>
							)}
						</div>
						{/* Description */}
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaCreateSandlistaDescLabel} />
							</label>
							<textarea
								value={listDesc}
								onChange={(e) => { setListDesc(e.target.value); setIsDirty(true); }}
								aria-label={t(localizationConstants.kmaCreateSandlistaDescLabel)}
								rows={3}
								className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 resize-none"
							/>
						</div>
					</div>
				</div>

				{/* Recipients section */}
				<div className="px-6 py-5">
					<div className="mb-3 flex items-center justify-between">
						<h2 className="text-sm font-semibold text-slate-700">
							<Translate text={localizationConstants.kmaSandlistaTitle} />
						</h2>
						<button
							type="button"
							onClick={addRecipient}
							className="flex cursor-pointer items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
						>
							<Plus className="h-3.5 w-3.5" />
							<Translate text={localizationConstants.kmaSandlistaAddBtn} />
						</button>
					</div>
					{/* Search */}
					<div className="relative mb-3 max-w-sm">
						<Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder={t(localizationConstants.kmaSandlistaSearchPlaceholder)}
							className="h-8 w-full rounded border border-slate-200 pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
						/>
					</div>
					{/* Email error banner */}
					{errors.invalidEmail && (
						<p className="mb-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
							<Translate text={localizationConstants.kmaCreateSandlistaValidationEmail} />
						</p>
					)}
					{/* Table */}
					<div className="overflow-x-auto rounded border border-slate-200">
						<table className="w-full text-xs">
							<thead>
								<tr className="border-b border-slate-200 bg-slate-50">
									<th className="px-3 py-2.5 text-left font-medium text-slate-500">
										<Translate text={localizationConstants.kmaSandlistaColName} />
									</th>
									<th className="px-3 py-2.5 text-left font-medium text-slate-500">
										<Translate text={localizationConstants.kmaSandlistaColRole} />
									</th>
									<th className="px-3 py-2.5 text-left font-medium text-slate-500">
										<Translate text={localizationConstants.kmaSandlistaColEmail} />
									</th>
									{NOTIFY_COLS.map((col) => (
										<th key={col.key} className="px-3 py-2.5 text-center font-medium text-slate-500">
											<Translate text={col.labelKey} />
										</th>
									))}
									<th className="w-8 px-3 py-2.5" />
								</tr>
							</thead>
							<tbody>
								{filtered.length === 0 ? (
									<tr>
										<td colSpan={8} className="px-3 py-8 text-center text-slate-400">
											<Translate text={localizationConstants.kmaSandlistaAddBtn} />
										</td>
									</tr>
								) : (
									filtered.map((r) => (
										<tr key={r.id} className="border-b border-slate-100 last:border-0">
											<td className="px-3 py-2">
												<input
													type="text"
													value={r.name}
													onChange={(e) => updateRecipient(r.id, "name", e.target.value)}
													aria-label={t(localizationConstants.kmaSandlistaColName)}
													className="h-7 w-full rounded border border-slate-200 px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
												/>
											</td>
											<td className="px-3 py-2">
												<input
													type="text"
													value={r.role}
													onChange={(e) => updateRecipient(r.id, "role", e.target.value)}
													aria-label={t(localizationConstants.kmaSandlistaColRole)}
													className="h-7 w-full rounded border border-slate-200 px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
												/>
											</td>
											<td className="px-3 py-2">
												<input
													type="email"
													value={r.email}
													onChange={(e) => updateRecipient(r.id, "email", e.target.value)}
													aria-label={t(localizationConstants.kmaSandlistaColEmail)}
													className={cn(
														"h-7 w-full rounded border px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300",
														errors.invalidEmail && r.email.trim() && !z.string().email().safeParse(r.email.trim()).success
															? "border-red-400 focus:ring-red-300"
															: "border-slate-200",
													)}
												/>
											</td>
											{NOTIFY_COLS.map((col) => (
												<td key={col.key} className="px-3 py-2 text-center">
													<label
														htmlFor={`notify-${r.id}-${col.key}`}
														className="sr-only"
													>
														<Translate text={col.labelKey} />
													</label>
													<input
														id={`notify-${r.id}-${col.key}`}
														type="checkbox"
														checked={r[col.key]}
														onChange={() => toggleNotifyCreate(r.id, col.key)}
														aria-label={t(col.labelKey)}
														className="h-4 w-4 cursor-pointer accent-slate-800"
													/>
												</td>
											))}
											<td className="px-3 py-2">
												<button
													type="button"
													onClick={() => removeRecipient(r.id)}
													className="cursor-pointer text-slate-300 hover:text-red-500"
												>
													<Trash2 className="h-3.5 w-3.5" />
												</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

// ── Sändlista Page ────────────────────────────────────────────────────────────

function SandlistaPage({ onBack }: { onBack: () => void }) {
	const t = useTranslate();
	const [createNewOpen, setCreateNewOpen] = useState(false);
	const [openedList, setOpenedList] = useState<MailList | null>(null);
	const [lists, setLists] = useState<MailList[]>(MOCK_MAIL_LISTS);
	const [search, setSearch] = useState("");

	if (createNewOpen) {
		return <CreateSandlistaPage onBack={() => setCreateNewOpen(false)} />;
	}

	if (openedList) {
		return (
			<MailListPage
				key={openedList.id}
				list={openedList}
				onBack={() => setOpenedList(null)}
				onDelete={(id) => setLists((prev) => prev.filter((l) => l.id !== id))}
			/>
		);
	}

	const filtered = lists.filter(
		(l) =>
			search === "" ||
			l.name.toLowerCase().includes(search.toLowerCase()) ||
			l.description.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={onBack}
						className="cursor-pointer rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
					>
						<ArrowLeft className="h-4 w-4" />
					</button>
					<h1 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.kmaSandlistaTitle} />
					</h1>
				</div>
				<button
					type="button"
					onClick={() => setCreateNewOpen(true)}
					className="flex cursor-pointer items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.kmaCreateSandlistaBtn} />
				</button>
			</div>
			{/* Search toolbar */}
			<div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
				<div className="relative w-72">
					<Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder={t(localizationConstants.kmaSandlistaSearchPlaceholder)}
						className="h-8 w-full rounded border border-slate-200 pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
					/>
				</div>
				<button
					type="button"
					className="flex cursor-pointer items-center gap-1.5 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
				>
					<Filter className="h-3.5 w-3.5" />
					<Translate text={localizationConstants.filter} />
				</button>
			</div>
			{/* Lists table */}
			<div className="flex-1 overflow-auto">
				<table className="w-full text-xs">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50">
							<th className="px-4 py-3 text-left font-medium text-slate-500">
								<Translate text={localizationConstants.kmaOpenSandlistaListNameCol} />
							</th>
							<th className="px-4 py-3 text-left font-medium text-slate-500">
								<Translate text={localizationConstants.kmaOpenSandlistaListDescCol} />
							</th>
							<th className="w-28 px-4 py-3 text-center font-medium text-slate-500">
								<Translate text={localizationConstants.kmaOpenSandlistaListRecipientsCol} />
							</th>
						</tr>
					</thead>
					<tbody>
						{filtered.length === 0 ? (
							<tr>
								<td colSpan={3} className="py-12 text-center text-slate-400">
									<Translate text={localizationConstants.noDataFound} />
								</td>
							</tr>
						) : (
							filtered.map((list) => (
								<tr
									key={list.id}
									onClick={() => setOpenedList(list)}
									className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50"
								>
									<td className="px-4 py-3 font-medium text-slate-800 hover:underline">
										{list.name}
									</td>
									<td className="px-4 py-3 text-slate-500">
										{list.description || "—"}
									</td>
									<td className="px-4 py-3 text-center text-slate-500">
										{list.recipients.length}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

// ── Quality System Tab ─────────────────────────────────────────────────────────

function QualitySystemTab({
	onOpenDoc,
}: {
	onOpenDoc: (doc: QualityDocument) => void;
}) {
	const [categories] = useState<QualityMainCategory[]>(MOCK_QUALITY_CATEGORIES);
	const [selectedMainId, setSelectedMainId] = useState<string | null>(
		MOCK_QUALITY_CATEGORIES[0]?.id ?? null,
	);
	const [selectedSubId, setSelectedSubId] = useState<string | null>(
		MOCK_QUALITY_CATEGORIES[0]?.subcategories[0]?.id ?? null,
	);

	const selectedMain = categories.find((c) => c.id === selectedMainId);
	const selectedSub = selectedMain?.subcategories.find((s) => s.id === selectedSubId);

	function handleSelectMain(id: string) {
		setSelectedMainId(id);
		const cat = categories.find((c) => c.id === id);
		setSelectedSubId(cat?.subcategories[0]?.id ?? null);
	}

	const mainItems = useMemo(
		() =>
			categories.map((c) => ({
				id: c.id,
				label: c.label,
				count: c.subcategories.reduce((acc, s) => acc + s.documents.length, 0),
			})),
		[categories],
	);

	const subItems = useMemo(
		() =>
			selectedMain?.subcategories.map((s) => ({
				id: s.id,
				label: s.label,
				count: s.documents.length,
			})) ?? [],
		[selectedMain],
	);

	return (
		<div className="flex flex-1 overflow-hidden">
			<CategoryPanel
				headerKey={localizationConstants.kmaQualityMainCat}
				items={mainItems}
				selectedId={selectedMainId}
				onSelect={handleSelectMain}
				searchKey={localizationConstants.kmaQualitySearchCategories}
			/>
			<CategoryPanel
				headerKey={localizationConstants.kmaQualitySubCat}
				items={subItems}
				selectedId={selectedSubId}
				onSelect={setSelectedSubId}
				searchKey={localizationConstants.kmaQualitySearchSubCategories}
			/>
			<DocsPanel
				documents={selectedSub?.documents ?? []}
				onOpenDoc={onOpenDoc}
				selectedSubCatId={selectedSubId}
			/>
		</div>
	);
}

// ── Category Tree Item ────────────────────────────────────────────────────────

function CategoryTreeItem({ node, depth = 0 }: { node: CategoryTreeNode; depth?: number }) {
	const [expanded, setExpanded] = useState(
		node.id === "invoicing" || node.id === "project",
	);
	const hasChildren = !!node.children?.length;

	return (
		<div>
			<button
				type="button"
				onClick={() => hasChildren && setExpanded((v) => !v)}
				style={{ paddingLeft: `${8 + depth * 16}px` }}
				className="flex w-full cursor-pointer items-center gap-1.5 py-1.5 pr-3 text-left text-xs text-slate-700 hover:bg-slate-100"
			>
				{hasChildren ? (
					expanded ? (
						<ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
					) : (
						<ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
					)
				) : (
					<span className="h-3.5 w-3.5 shrink-0" />
				)}
				<FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
				<span className="truncate">{node.label}</span>
			</button>
			{hasChildren && expanded && (
				<div>
					{node.children!.map((child) => (
						<CategoryTreeItem key={child.id} node={child} depth={depth + 1} />
					))}
				</div>
			)}
		</div>
	);
}

// ── Template Detail Modal ─────────────────────────────────────────────────────

function TemplateDetailModal({ template, onClose }: { template: PlanTemplate; onClose: () => void }) {
	const t = useTranslate();
	const [search, setSearch] = useState("");
	const [treeSearch, setTreeSearch] = useState("");
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);

	const MODAL_COLS = [
		{ key: "id", label: localizationConstants.kmaQualityPlanTemplateNrCol },
		{ key: "name", label: localizationConstants.kmaQualityPlanTemplateNameCol },
		{ key: "version", label: localizationConstants.kmaQualityPlanTemplateVersionCol },
		{ key: "lastUpdated", label: localizationConstants.kmaQualityPlanTemplateUpdatedCol },
		{ key: "createdBy", label: localizationConstants.kmaQualityPlanTemplateCreatedByCol },
	];

	const filtered = MOCK_TEMPLATES.filter(
		(tpl) =>
			search === "" ||
			tpl.name.toLowerCase().includes(search.toLowerCase()) ||
			tpl.id.toLowerCase().includes(search.toLowerCase()),
	);

	const filteredTree = treeSearch
		? MOCK_CATEGORY_TREE.filter((n) =>
				n.label.toLowerCase().includes(treeSearch.toLowerCase()) ||
				n.children?.some((c) => c.label.toLowerCase().includes(treeSearch.toLowerCase())),
			)
		: MOCK_CATEGORY_TREE;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			onClick={onClose}
		>
			<div
				className="flex h-[80vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Left: Category tree */}
				<div className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
					<div className="border-b border-slate-200 px-4 py-3">
						<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
							<Translate text={localizationConstants.kmaTemplateModalCategories} />
						</p>
					</div>
					<div className="relative border-b border-slate-200">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							value={treeSearch}
							onChange={(e) => setTreeSearch(e.target.value)}
							placeholder={t(localizationConstants.kmaTemplateModalSearchFolders)}
							className="h-8 w-full bg-white pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none"
						/>
					</div>
					<div className="flex-1 overflow-y-auto py-1">
						{filteredTree.map((node) => (
							<CategoryTreeItem key={node.id} node={node} />
						))}
					</div>
				</div>

				{/* Right: Template list */}
				<div className="flex flex-1 flex-col overflow-hidden">
					<div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
						<h2 className="text-base font-semibold text-slate-900">{template.name}</h2>
						<div className="flex items-center gap-2">
							<button
								type="button"
								className="flex cursor-pointer items-center gap-1.5 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
							>
								<Pencil className="h-3.5 w-3.5" />
								<Translate text={localizationConstants.actionEdit} />
							</button>
							<button
								type="button"
								onClick={onClose}
								className="cursor-pointer rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					</div>
					<div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2">
						<div className="relative flex-1">
							<Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder={t(localizationConstants.kmaQualitySearchDocs)}
								className="h-8 w-full rounded border border-slate-200 pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
							/>
						</div>
						<button
							type="button"
							className="flex cursor-pointer items-center gap-1.5 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
						>
							<Filter className="h-3.5 w-3.5" />
							Filter
						</button>
					</div>
					<div className="flex-1 overflow-auto">
						<table className="w-full text-xs">
							<thead>
								<tr className="border-b border-slate-200 bg-slate-50">
									<th className="w-9 px-3 py-2.5" />
									{MODAL_COLS.map((col) => (
										<th key={col.key} className="px-3 py-2.5 text-left">
											<div className="flex cursor-pointer items-center gap-1 font-medium text-slate-500 hover:text-slate-700">
												<Translate text={col.label} />
												<ArrowUpDown className="h-3 w-3 shrink-0" />
											</div>
										</th>
									))}
									<th className="w-9 px-3 py-2.5 text-center">
										<Plus className="inline h-3.5 w-3.5 text-slate-400" />
									</th>
									<th className="w-8 px-2 py-2.5" />
								</tr>
							</thead>
							<tbody>
								{filtered.map((tpl) => (
									<tr
										key={tpl.id}
										className={cn(
											"group border-b border-slate-100 last:border-0",
											tpl.id === template.id ? "bg-slate-100" : "hover:bg-slate-50",
										)}
									>
										<td className="px-3 py-2.5">
											<Star
												className={cn(
													"h-3.5 w-3.5",
													tpl.id === "KP002" ? "fill-amber-400 text-amber-400" : "text-slate-300",
												)}
											/>
										</td>
										<td className="px-3 py-2.5 text-slate-500">{tpl.id}</td>
										<td className="px-3 py-2.5 font-medium text-slate-800">{tpl.name}</td>
										<td className="px-3 py-2.5 text-slate-500">{tpl.version}</td>
										<td className="px-3 py-2.5 text-slate-500">{tpl.lastUpdated}</td>
										<td className="px-3 py-2.5 text-slate-500">{tpl.createdBy}</td>
										<td className="px-3 py-2.5 text-center">
											<Plus className="inline h-3.5 w-3.5 cursor-pointer text-slate-300 opacity-0 hover:text-slate-500 group-hover:opacity-100" />
										</td>
										<td className="relative px-2 py-2.5">
											<button
												type="button"
												onClick={() => setOpenMenuId(openMenuId === tpl.id ? null : tpl.id)}
												className="flex cursor-pointer items-center justify-center rounded p-1 text-slate-300 opacity-0 hover:bg-slate-200 hover:text-slate-600 group-hover:opacity-100"
											>
												<MoreVertical className="h-3.5 w-3.5" />
											</button>
											{openMenuId === tpl.id && (
												<div className="absolute right-0 z-20 mt-1 w-36 rounded-md border border-slate-200 bg-white py-1 shadow-md">
													<button
														type="button"
														className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
														onClick={() => setOpenMenuId(null)}
													>
														<Pencil className="h-3.5 w-3.5 text-slate-400" />
														<Translate text={localizationConstants.actionEdit} />
													</button>
													<button
														type="button"
														className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-slate-50"
														onClick={() => setOpenMenuId(null)}
													>
														<Trash2 className="h-3.5 w-3.5 text-red-400" />
														<Translate text={localizationConstants.actionDelete} />
													</button>
													<button
														type="button"
														className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
														onClick={() => setOpenMenuId(null)}
													>
														<Archive className="h-3.5 w-3.5 text-slate-400" />
														<Translate text={localizationConstants.kmaQualityPlanArchive} />
													</button>
												</div>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

// ── Kontrollplan Table ────────────────────────────────────────────────────────

function KontrollplanTable({
	title,
	onOpenPlan,
	onOpenSandlista,
	onCreateTemplate,
}: {
	title: string;
	onOpenPlan: () => void;
	onOpenSandlista: () => void;
	onCreateTemplate: () => void;
}) {
	const t = useTranslate();
	const [search, setSearch] = useState("");
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const [starred, setStarred] = useState<Set<string>>(new Set(["KP002"]));
	const [selectedTemplate, setSelectedTemplate] = useState<PlanTemplate | null>(null);

	const COLS = [
		{ key: "id", label: localizationConstants.kmaQualityPlanTemplateNrCol },
		{ key: "name", label: localizationConstants.kmaQualityPlanTemplateNameCol },
		{ key: "version", label: localizationConstants.kmaQualityPlanTemplateVersionCol },
		{ key: "lastUpdated", label: localizationConstants.kmaQualityPlanTemplateUpdatedCol },
		{ key: "createdBy", label: localizationConstants.kmaQualityPlanTemplateCreatedByCol },
	];

	const filtered = MOCK_TEMPLATES.filter(
		(tpl) =>
			search === "" ||
			tpl.name.toLowerCase().includes(search.toLowerCase()) ||
			tpl.id.toLowerCase().includes(search.toLowerCase()),
	);

	function toggleStar(id: string) {
		setStarred((prev) => {
			const next = new Set(prev);
			if (next.has(id)) { next.delete(id); } else { next.add(id); }
			return next;
		});
	}

	return (
		<div className="flex flex-1 flex-col overflow-hidden border-l border-slate-200">
			{selectedTemplate && (
				<TemplateDetailModal
					template={selectedTemplate}
					onClose={() => setSelectedTemplate(null)}
				/>
			)}
			{/* Section header */}
			<div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
				<h3 className="text-sm font-semibold text-slate-800">{title}</h3>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={onCreateTemplate}
						className="flex cursor-pointer items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
					>
						<Plus className="h-3.5 w-3.5" />
						<Translate text={localizationConstants.kmaCreateTemplateBtn} />
					</button>
					<button
						type="button"
						onClick={onOpenPlan}
						className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
					>
						<Pencil className="h-3.5 w-3.5" />
						<Translate text={localizationConstants.actionEdit} />
					</button>
				</div>
			</div>
			{/* Search + Filter */}
			<div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2">
				<div className="relative flex-1">
					<Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder={t(localizationConstants.kmaQualitySearchDocs)}
						className="h-8 w-full rounded border border-slate-200 pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
					/>
				</div>
				<button
					type="button"
					className="flex cursor-pointer items-center gap-1.5 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
				>
					<Filter className="h-3.5 w-3.5" />
					<Translate text={localizationConstants.filter} />
				</button>
			</div>
			{/* Table */}
			<div className="flex-1 overflow-auto">
				<table className="w-full text-xs">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50">
							<th className="w-9 px-3 py-2.5" />
							{COLS.map((col) => (
								<th key={col.key} className="px-3 py-2.5 text-left">
									<div className="flex cursor-pointer items-center gap-1 font-medium text-slate-500 hover:text-slate-700">
										<Translate text={col.label} />
										<ArrowUpDown className="h-3 w-3 shrink-0" />
									</div>
								</th>
							))}
							<th className="w-9 px-3 py-2.5 text-center">
								<Plus className="inline h-3.5 w-3.5 text-slate-400" />
							</th>
							<th className="w-8 px-2 py-2.5" />
						</tr>
					</thead>
					<tbody>
						{filtered.map((tpl) => (
							<tr key={tpl.id} className="group border-b border-slate-100 last:border-0 hover:bg-slate-50">
								<td className="px-3 py-2.5">
									<button
										type="button"
										onClick={() => toggleStar(tpl.id)}
										className="cursor-pointer text-slate-300 hover:text-amber-400"
									>
										<Star
											className="h-3.5 w-3.5"
											fill={starred.has(tpl.id) ? "#F59E0B" : "none"}
											stroke={starred.has(tpl.id) ? "#F59E0B" : "currentColor"}
										/>
									</button>
								</td>
								<td className="px-3 py-2.5 text-slate-500">{tpl.id}</td>
								<td className="px-3 py-2.5 font-medium text-slate-800">
									<button
										type="button"
										onClick={() => setSelectedTemplate(tpl)}
										className="cursor-pointer text-left hover:underline"
									>
										{tpl.name}
									</button>
								</td>
								<td className="px-3 py-2.5 text-slate-500">{tpl.version}</td>
								<td className="px-3 py-2.5 text-slate-500">{tpl.lastUpdated}</td>
								<td className="px-3 py-2.5 text-slate-500">{tpl.createdBy}</td>
								<td className="px-3 py-2.5 text-center">
									<Plus className="inline h-3.5 w-3.5 cursor-pointer text-slate-300 opacity-0 hover:text-slate-500 group-hover:opacity-100" />
								</td>
								<td className="relative px-2 py-2.5">
									<button
										type="button"
										onClick={() => setOpenMenuId(openMenuId === tpl.id ? null : tpl.id)}
										className="flex cursor-pointer items-center justify-center rounded p-1 text-slate-300 opacity-0 hover:bg-slate-200 hover:text-slate-600 group-hover:opacity-100"
									>
										<MoreVertical className="h-3.5 w-3.5" />
									</button>
									{openMenuId === tpl.id && (
										<div className="absolute right-0 z-20 mt-1 w-36 rounded-md border border-slate-200 bg-white py-1 shadow-md">
											<button
												type="button"
												className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
												onClick={() => { onOpenPlan(); setOpenMenuId(null); }}
											>
												<Pencil className="h-3.5 w-3.5 text-slate-400" />
												<Translate text={localizationConstants.actionEdit} />
											</button>
											<button
												type="button"
												className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-slate-50"
												onClick={() => setOpenMenuId(null)}
											>
												<Trash2 className="h-3.5 w-3.5 text-red-400" />
												<Translate text={localizationConstants.actionDelete} />
											</button>
											<button
												type="button"
												className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
												onClick={() => setOpenMenuId(null)}
											>
												<Archive className="h-3.5 w-3.5 text-slate-400" />
												<Translate text={localizationConstants.kmaQualityPlanArchive} />
											</button>
											<button
												type="button"
												className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
												onClick={() => { onOpenSandlista(); setOpenMenuId(null); }}
											>
												<Mail className="h-3.5 w-3.5 text-slate-400" />
												<Translate text={localizationConstants.kmaSandlistaMenuOption} />
											</button>
										</div>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}


// ── Create Template Page ──────────────────────────────────────────────────────

function CreateTemplatePage({ onBack }: { onBack: () => void }) {
	const [name, setName] = useState("");
	const [errors, setErrors] = useState<{ name?: boolean }>({});
	const [isSaving, setIsSaving] = useState(false);
	const [expandedCatIds, setExpandedCatIds] = useState<Set<string>>(
		new Set(MOCK_QUALITY_PLAN_CATEGORIES.map((c) => c.id)),
	);
	const [expandedSubIds, setExpandedSubIds] = useState<Set<string>>(
		new Set([MOCK_QUALITY_PLAN_CATEGORIES[0]?.subcategories[0]?.id ?? ""]),
	);
	const [checkedDocIds, setCheckedDocIds] = useState<Set<string>>(new Set());
	const [addedDocs, setAddedDocs] = useState<QualityDocument[]>([]);
	const [selectedRightIdx, setSelectedRightIdx] = useState<number | null>(null);

	const allDocs = useMemo(
		() => MOCK_QUALITY_PLAN_CATEGORIES.flatMap((c) => c.subcategories.flatMap((s) => s.documents)),
		[],
	);
	const addedIds = useMemo(() => new Set(addedDocs.map((d) => d.id)), [addedDocs]);
	const availableCount = allDocs.length - addedDocs.length;
	const allCheckable = allDocs.filter((d) => !addedIds.has(d.id));
	const allChecked = allCheckable.length > 0 && allCheckable.every((d) => checkedDocIds.has(d.id));

	function toggleCat(id: string) {
		setExpandedCatIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) { next.delete(id); } else { next.add(id); }
			return next;
		});
	}

	function toggleSub(id: string) {
		setExpandedSubIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) { next.delete(id); } else { next.add(id); }
			return next;
		});
	}

	function toggleDoc(docId: string) {
		setCheckedDocIds((prev) => {
			const next = new Set(prev);
			if (next.has(docId)) { next.delete(docId); } else { next.add(docId); }
			return next;
		});
	}

	function selectAllInSub(sub: QualitySubCategory) {
		setCheckedDocIds((prev) => {
			const next = new Set(prev);
			sub.documents.filter((d) => !addedIds.has(d.id)).forEach((d) => next.add(d.id));
			return next;
		});
	}

	function selectAllInCat(cat: QualityMainCategory) {
		setCheckedDocIds((prev) => {
			const next = new Set(prev);
			cat.subcategories.flatMap((s) => s.documents).filter((d) => !addedIds.has(d.id)).forEach((d) => next.add(d.id));
			return next;
		});
	}

	function toggleAll() {
		if (allChecked) {
			setCheckedDocIds(new Set());
		} else {
			setCheckedDocIds(new Set(allCheckable.map((d) => d.id)));
		}
	}

	function handleAddDocs() {
		const toAdd = allDocs.filter((d) => checkedDocIds.has(d.id) && !addedIds.has(d.id));
		setAddedDocs((prev) => [...prev, ...toAdd]);
		setCheckedDocIds(new Set());
	}

	function handleRemoveDoc() {
		if (selectedRightIdx === null) return;
		setAddedDocs((prev) => prev.filter((_, i) => i !== selectedRightIdx));
		setSelectedRightIdx(null);
	}

	function handleSave() {
		if (isSaving) return;
		if (!name.trim()) {
			setErrors({ name: true });
			return;
		}
		setErrors({});
		setIsSaving(true);
		// backend integration pending
	}

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-white">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
				<div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={onBack}
							className="cursor-pointer text-slate-500 hover:text-slate-800"
						>
							<ArrowLeft className="h-4 w-4" />
						</button>
						<h1 className="text-xl font-semibold text-slate-900">
							<Translate text={localizationConstants.kmaCreateTemplateBtn} />
						</h1>
					</div>
					<p className="mt-0.5 pl-6 text-sm text-slate-400">
						<Translate text={localizationConstants.kmaQualityPlanCreateSubtitle} />
					</p>
				</div>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={onBack}
						className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
					>
						<Translate text={localizationConstants.cancel} />
					</button>
					<button
						type="button"
						onClick={handleSave}
						disabled={isSaving}
						className="cursor-pointer rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
					>
						<Translate text={localizationConstants.save} />
					</button>
				</div>
			</div>

			{/* Scrollable body */}
			<div className="flex flex-1 flex-col overflow-y-auto">
				{/* Form */}
				<div className="border-b border-slate-200 px-6 py-5">
					<h2 className="mb-4 text-sm font-semibold text-slate-700">
						<Translate text={localizationConstants.kmaQualityPlanCreateDetailsHeader} />
					</h2>
					<div className="flex flex-col gap-4">
						{/* Name */}
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaQualityPlanCreateNameLabel} />
								{" "}<span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({}); }}
								placeholder="Badrum"
								className={cn(
									"h-9 w-full rounded border bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300",
									errors.name ? "border-red-400 focus:ring-red-300" : "border-slate-200",
								)}
							/>
							{errors.name && (
								<p className="mt-1 text-xs text-red-500">
									<Translate text={localizationConstants.kmaControlPlanValidationName} />
								</p>
							)}
						</div>
						{/* ID + Version */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaQualityPlanCreateIdLabel} />
								</label>
								<input
									type="text"
									defaultValue="KP001"
									readOnly
									className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none"
								/>
							</div>
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaQualityPlanCreateVersionLabel} />
								</label>
								<input
									type="text"
									defaultValue="2025-12"
									readOnly
									className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none"
								/>
							</div>
						</div>
						{/* KMA id */}
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaQualityPlanCreateKmaIdLabel} />
							</label>
							<input
								type="text"
								defaultValue="KMA001"
								readOnly
								className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none"
							/>
						</div>
						{/* Skapad av + Date */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaQualityPlanCreateCreatedByLabel} />
								</label>
								<input
									type="text"
									defaultValue="Jake Jamisson"
									readOnly
									className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none"
								/>
							</div>
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaQualityPlanCreateDateLabel} />
								</label>
								<input
									type="date"
									defaultValue="2026-01-15"
									readOnly
									className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Dual panel: tree picker + right panel */}
				<div className="flex min-h-64 flex-1">
					{/* Left: Huvudmallstruktur tree */}
					<div className="flex flex-1 flex-col border-r border-slate-200">
						<div className="border-b border-slate-200 px-5 py-3">
							<h3 className="text-xs font-semibold tracking-wide text-slate-500">
								<Translate text={localizationConstants.kmaQualityPlanCreateStructureHeader} />
							</h3>
						</div>
						<div className="flex-1 overflow-y-auto px-5 py-3">
							<label className="mb-3 flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
								<input
									type="checkbox"
									checked={allChecked}
									onChange={toggleAll}
									className="h-4 w-4 accent-slate-800"
								/>
								<Translate text={localizationConstants.kmaQualityPlanCreateSelectAll} />
							</label>
							{MOCK_QUALITY_PLAN_CATEGORIES.map((cat) => {
								const catExpanded = expandedCatIds.has(cat.id);
								return (
									<div key={cat.id} className="mb-2">
										<button
											type="button"
											onClick={() => toggleCat(cat.id)}
											className="flex w-full cursor-pointer items-center gap-1.5 py-1 text-sm font-medium text-slate-700 hover:text-slate-900"
										>
											{catExpanded ? (
												<ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
											) : (
												<ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
											)}
											<FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
											{cat.label}
										</button>
										{catExpanded && (
											<div className="mt-1 pl-5">
												{cat.subcategories.map((sub) => {
													const subExpanded = expandedSubIds.has(sub.id);
													const subCheckedCount = sub.documents.filter((d) => checkedDocIds.has(d.id)).length;
													return (
														<div key={sub.id} className="mb-1">
															<button
																type="button"
																onClick={() => toggleSub(sub.id)}
																className="flex w-full cursor-pointer items-center gap-1.5 py-1 text-sm text-slate-600 hover:text-slate-800"
															>
																{subExpanded ? (
																	<ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
																) : (
																	<ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
																)}
																<FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
																<span>{sub.label}</span>
																{subCheckedCount > 0 && (
																	<span className="ml-1 rounded-full bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600">
																		{subCheckedCount}
																	</span>
																)}
															</button>
															{subExpanded && (
																<div className="mt-1 pl-5">
																	{sub.documents.filter((d) => !addedIds.has(d.id)).map((doc) => (
																		<label
																			key={doc.id}
																			className="mb-1 flex cursor-pointer items-center gap-2 text-xs text-slate-600 hover:text-slate-800"
																		>
																			<input
																				type="checkbox"
																				checked={checkedDocIds.has(doc.id)}
																				onChange={() => toggleDoc(doc.id)}
																				className="h-3.5 w-3.5 accent-slate-800"
																			/>
																			{doc.id} {doc.title}
																		</label>
																	))}
																	{sub.documents.some((d) => !addedIds.has(d.id)) && (
																		<button
																			type="button"
																			onClick={() => selectAllInSub(sub)}
																			className="mt-1 cursor-pointer text-xs text-blue-600 hover:underline"
																		>
																			<Translate text={localizationConstants.kmaQualityPlanCreateSelectAllSub} />
																		</button>
																	)}
																</div>
															)}
														</div>
													);
												})}
												<button
													type="button"
													onClick={() => selectAllInCat(cat)}
													className="mt-1 cursor-pointer text-xs text-blue-600 hover:underline"
												>
													<Translate text={localizationConstants.kmaQualityPlanCreateSelectAllCat} />
												</button>
											</div>
										)}
									</div>
								);
							})}
						</div>
						<div className="border-t border-slate-200 px-5 py-2">
							<span className="text-xs text-slate-400">
								{availableCount}{" "}
								<Translate text={localizationConstants.kmaQualityPlanCreateAvailable} />
							</span>
						</div>
					</div>

					{/* Center: Add / Remove */}
					<div className="flex w-36 shrink-0 flex-col items-center justify-center gap-3 border-r border-slate-200 px-4">
						<button
							type="button"
							onClick={handleAddDocs}
							disabled={checkedDocIds.size === 0}
							className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
						>
							<Translate text={localizationConstants.kmaQualityPlanCreateAddBtn} />
							{" →"}
						</button>
						<button
							type="button"
							onClick={handleRemoveDoc}
							disabled={selectedRightIdx === null}
							className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
						>
							{"← "}
							<Translate text={localizationConstants.kmaQualityPlanCreateRemoveBtn} />
						</button>
					</div>

					{/* Right: Template panel */}
					<div className="flex w-72 shrink-0 flex-col">
						<div className="border-b border-slate-200 px-5 py-3">
							<h3 className="truncate text-xs font-semibold tracking-wide text-slate-500">
								{name || <Translate text={localizationConstants.kmaQualityPlanCreateNewPanelTitle} />}
							</h3>
						</div>
						<div className="flex-1 overflow-y-auto px-3 py-2">
							{addedDocs.length === 0 ? (
								<p className="mt-6 text-center text-xs text-slate-400">—</p>
							) : (
								addedDocs.map((doc, i) => (
									<button
										key={doc.id}
										type="button"
										onClick={() => setSelectedRightIdx(i === selectedRightIdx ? null : i)}
										className={cn(
											"mb-1 flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs",
											selectedRightIdx === i
												? "bg-slate-100 text-slate-900"
												: "text-slate-600 hover:bg-slate-50",
										)}
									>
										<FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
										<span className="truncate">{doc.id} {doc.title}</span>
									</button>
								))
							)}
						</div>
						{addedDocs.length > 0 && (
							<div className="border-t border-slate-200 px-3 py-2">
								<p className="rounded border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
									<Translate text={localizationConstants.kmaQualityPlanCreateNote} />
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

// ── Quality Plan Tab ───────────────────────────────────────────────────────────

type PlanType = "kontrollplan" | "riskhantering" | "checklistor" | "atgardsplaner";
type PlanView = "alla" | "mallar";

const PLAN_TYPE_IDS: PlanType[] = [
	"kontrollplan",
	"riskhantering",
	"checklistor",
	"atgardsplaner",
];

function planTypeLabelKey(id: PlanType): string {
	const map: Record<PlanType, string> = {
		kontrollplan: localizationConstants.kmaQualityPlanKontrollplan,
		riskhantering: localizationConstants.kmaQualityPlanRiskhantering,
		checklistor: localizationConstants.kmaQualityPlanChecklistor,
		atgardsplaner: localizationConstants.kmaQualityPlanAtgardsplaner,
	};
	return map[id];
}

function QualityPlanTab({
	onCreateNew,
	onUseTemplate,
	onCreateRiskhantering,
	onUseRiskTemplate,
	onOpenPlan,
	onOpenSandlista,
	onCreateTemplate,
	onCreateRiskTemplate,
}: {
	onCreateNew: () => void;
	onUseTemplate: () => void;
	onCreateRiskhantering: () => void;
	onUseRiskTemplate: () => void;
	onOpenPlan: () => void;
	onOpenSandlista: () => void;
	onCreateTemplate: () => void;
	onCreateRiskTemplate: () => void;
}) {
	const t = useTranslate();
	const [planType, setPlanType] = useState<PlanType>("kontrollplan");
	const [viewMode, setViewMode] = useState<PlanView>("alla");
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [createBtnOpen, setCreateBtnOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const createBtnRef = useRef<HTMLDivElement | null>(null);

	const [selectedMainId, setSelectedMainId] = useState<string | null>(
		MOCK_QUALITY_PLAN_CATEGORIES[0]?.id ?? null,
	);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setDropdownOpen(false);
			}
			if (createBtnRef.current && !createBtnRef.current.contains(e.target as Node)) {
				setCreateBtnOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const selectedMain = MOCK_QUALITY_PLAN_CATEGORIES.find((c) => c.id === selectedMainId);

	function handleSelectMain(id: string) {
		setSelectedMainId(id);
	}

	const mainItems = useMemo(
		() =>
			MOCK_QUALITY_PLAN_CATEGORIES.map((c) => ({
				id: c.id,
				label: c.label,
				count: c.subcategories.reduce((acc, s) => acc + s.documents.length, 0),
			})),
		[],
	);

	const currentPlanLabel = t(planTypeLabelKey(planType));

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{/* Toolbar */}
			<div className="flex items-center justify-between border-b border-slate-200 px-4 py-2">
				<div className="flex items-center gap-2">
					{/* Plan type dropdown */}
					<div ref={dropdownRef} className="relative">
						<button
							type="button"
							onClick={() => setDropdownOpen((v) => !v)}
							className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
						>
							{currentPlanLabel}
							<ChevronDown className="h-4 w-4 text-slate-400" />
						</button>
						{dropdownOpen && (
							<div className="absolute left-0 top-full z-20 mt-1 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-md">
								{PLAN_TYPE_IDS.filter((id) => id !== planType).map((id) => (
									<button
										key={id}
										type="button"
										onClick={() => {
											setPlanType(id);
											setDropdownOpen(false);
										}}
										className="w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
									>
										<Translate text={planTypeLabelKey(id)} />
									</button>
								))}
							</div>
						)}
					</div>
					{/* View mode toggle */}
					<div className="flex rounded-md border border-slate-200">
						<button
							type="button"
							onClick={() => setViewMode("alla")}
							className={cn(
								"cursor-pointer rounded-l-md px-3 py-1.5 text-sm font-medium transition-colors",
								viewMode === "alla"
									? "bg-slate-900 text-white"
									: "bg-white text-slate-600 hover:bg-slate-50",
							)}
						>
							<Translate text={localizationConstants.kmaQualityPlanViewAlla} />
						</button>
						<button
							type="button"
							onClick={() => setViewMode("mallar")}
							className={cn(
								"cursor-pointer rounded-r-md border-l border-slate-200 px-3 py-1.5 text-sm font-medium transition-colors",
								viewMode === "mallar"
									? "bg-slate-900 text-white"
									: "bg-white text-slate-600 hover:bg-slate-50",
							)}
						>
							<Translate text={localizationConstants.kmaQualityPlanViewMallar} />
						</button>
					</div>
				</div>
				{/* Create button — single for Mallar tab, split for all other views */}
				{planType === "riskhantering" && viewMode === "mallar" ? (
					<button
						type="button"
						onClick={onCreateRiskTemplate}
						className="flex cursor-pointer items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
					>
						<Plus className="h-4 w-4" />
						<Translate text={localizationConstants.kmaCreateRiskTemplateBtn} />
					</button>
				) : (
					<div ref={createBtnRef} className="relative flex">
						<button
							type="button"
							onClick={planType === "riskhantering" ? onCreateRiskhantering : onCreateNew}
							className="flex cursor-pointer items-center gap-1.5 rounded-l-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
						>
							<Plus className="h-4 w-4" />
							<Translate text={planType === "riskhantering" ? localizationConstants.kmaCreateRiskBtn : localizationConstants.kmaQualityPlanCreateBtn} />
						</button>
						<button
							type="button"
							onClick={() => setCreateBtnOpen((v) => !v)}
							className="flex cursor-pointer items-center rounded-r-md border-l border-white/20 bg-zinc-900 px-2 py-1.5 text-white hover:bg-zinc-800"
						>
							<ChevronDown className="h-4 w-4" />
						</button>
						{createBtnOpen && (
							<div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-md border border-slate-200 bg-white py-1 shadow-md">
								<button
									type="button"
									onClick={() => { (planType === "riskhantering" ? onCreateRiskhantering : onCreateNew)(); setCreateBtnOpen(false); }}
									className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
								>
									<Plus className="h-4 w-4 text-slate-400" />
									<Translate text={planType === "riskhantering" ? localizationConstants.kmaCreateRiskBtn : localizationConstants.kmaQualityPlanCreateBtn} />
								</button>
								<button
									type="button"
									onClick={() => { (planType === "riskhantering" ? onUseRiskTemplate : onUseTemplate)(); setCreateBtnOpen(false); }}
									className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
								>
									<FileText className="h-4 w-4 text-slate-400" />
									<Translate text={localizationConstants.kmaQualityPlanUseTemplate} />
								</button>
							</div>
						)}
					</div>
				)}
			</div>
			{/* Content */}
			{planType === "riskhantering" ? (
				viewMode === "mallar" ? <RiskTemplateTable /> : <RiskTable />
			) : planType !== "kontrollplan" ? (
				<div className="flex flex-1 items-center justify-center text-sm text-slate-400">
					<Translate text={localizationConstants.comingSoon} />
				</div>
			) : (
				<div className="flex flex-1 overflow-hidden">
					<CategoryPanel
						headerKey={localizationConstants.kmaQualityMainCat}
						items={mainItems}
						selectedId={selectedMainId}
						onSelect={handleSelectMain}
						searchKey={localizationConstants.kmaQualitySearchCategories}
					/>
					<KontrollplanTable
						title={selectedMain?.label ?? ""}
						onOpenPlan={onOpenPlan}
						onOpenSandlista={onOpenSandlista}
						onCreateTemplate={onCreateTemplate}
					/>
				</div>
			)}
		</div>
	);
}

// ── Main Export ────────────────────────────────────────────────────────────────

type QualityTab = "system" | "plan";

export function QualitySystemPage() {
	const [activeTab, setActiveTab] = useState<QualityTab>("system");
	const [openDoc, setOpenDoc] = useState<QualityDocument | null>(null);
	const [createPlanOpen, setCreatePlanOpen] = useState(false);
	const [createWithTemplate, setCreateWithTemplate] = useState(false);
	const [openPlanOpen, setOpenPlanOpen] = useState(false);
	const [sandlistaOpen, setSandlistaOpen] = useState(false);
	const [createTemplateOpen, setCreateTemplateOpen] = useState(false);
	const [createRiskhanteringOpen, setCreateRiskhanteringOpen] = useState(false);
	const [createRiskWithTemplate, setCreateRiskWithTemplate] = useState(false);
	const [createRiskTemplateOpen, setCreateRiskTemplateOpen] = useState(false);

	const TABS: { id: QualityTab; key: string }[] = [
		{ id: "system", key: localizationConstants.kmaQualityTabSystem },
		{ id: "plan", key: localizationConstants.kmaQualityTabPlan },
	];

	if (openDoc) {
		return <DocDetailView doc={openDoc} onBack={() => setOpenDoc(null)} />;
	}

	if (createPlanOpen) {
		return (
			<CreateKontrollplanPage
				onBack={() => {
					setCreatePlanOpen(false);
					setCreateWithTemplate(false);
				}}
				startWithTemplate={createWithTemplate}
			/>
		);
	}

	if (createTemplateOpen) {
		return <CreateTemplatePage onBack={() => setCreateTemplateOpen(false)} />;
	}

	if (createRiskhanteringOpen) {
		return (
			<CreateRiskhanteringPage
				startWithTemplate={createRiskWithTemplate}
				onBack={() => {
					setCreateRiskhanteringOpen(false);
					setCreateRiskWithTemplate(false);
				}}
			/>
		);
	}

	if (createRiskTemplateOpen) {
		return <CreateRiskTemplatePage onBack={() => setCreateRiskTemplateOpen(false)} />;
	}

	if (openPlanOpen) {
		return <OpenKontrollplanPage onBack={() => setOpenPlanOpen(false)} />;
	}

	if (sandlistaOpen) {
		return <SandlistaPage onBack={() => setSandlistaOpen(false)} />;
	}

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-white">
			<ModulePageHeader
				title={KMA_MODULE_TITLE}
				tabs={KMA_MODULE_TABS}
				breadcrumbs={kmaBreadcrumbs(
					localizationConstants.kmaListSidebarKvalite,
				)}
			/>

			{/* Sub-tab bar */}
			<div className="border-b border-slate-200 px-6">
				<div className="flex gap-6">
					{TABS.map((tab) => (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={cn(
								"cursor-pointer whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors",
								activeTab === tab.id
									? "border-slate-900 text-slate-900"
									: "border-transparent text-slate-500 hover:text-slate-700",
							)}
						>
							<Translate text={tab.key} />
						</button>
					))}
				</div>
			</div>

			{activeTab === "system" && <QualitySystemTab onOpenDoc={setOpenDoc} />}
			{activeTab === "plan" && (
				<QualityPlanTab
					onCreateNew={() => { setCreateWithTemplate(false); setCreatePlanOpen(true); }}
					onUseTemplate={() => {
						setCreateWithTemplate(true);
						setCreatePlanOpen(true);
					}}
					onCreateRiskhantering={() => { setCreateRiskWithTemplate(false); setCreateRiskhanteringOpen(true); }}
					onUseRiskTemplate={() => { setCreateRiskWithTemplate(true); setCreateRiskhanteringOpen(true); }}
					onOpenPlan={() => setOpenPlanOpen(true)}
					onOpenSandlista={() => setSandlistaOpen(true)}
					onCreateTemplate={() => setCreateTemplateOpen(true)}
					onCreateRiskTemplate={() => setCreateRiskTemplateOpen(true)}
				/>
			)}
		</div>
	);
}
