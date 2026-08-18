"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
	ArrowLeft,
	ArrowUpDown,
	ChevronDown,
	ChevronRight,
	Download,
	FileText,
	MoreVertical,
	Plus,
	Search,
	Star,
	Upload,
	X,
	ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { QualityDocument, QualityMainCategory, QualitySubCategory } from "../../types/quality";
import { MOCK_QUALITY_CATEGORIES, MOCK_QUALITY_PLAN_CATEGORIES } from "../../constants/qualityMock";

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

// ── Use Template Modal ────────────────────────────────────────────────────────

function UseTemplateModal({ onClose, onUse }: { onClose: () => void; onUse: (tpl: PlanTemplate) => void }) {
	const [selectedId, setSelectedId] = useState<string>("KP002");
	const selected = MOCK_TEMPLATES.find((t) => t.id === selectedId) ?? null;

	const COLS: { label: string }[] = [
		{ label: localizationConstants.kmaQualityPlanTemplateNrCol },
		{ label: localizationConstants.kmaQualityPlanTemplateNameCol },
		{ label: localizationConstants.kmaQualityPlanTemplateVersionCol },
		{ label: localizationConstants.kmaQualityPlanTemplateUpdatedCol },
		{ label: localizationConstants.kmaQualityPlanTemplateCreatedByCol },
	];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="w-[660px] max-w-full rounded-lg bg-white shadow-xl">
				<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
					<h2 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.kmaQualityPlanTemplateModalTitle} />
					</h2>
					<button type="button" onClick={onClose} className="cursor-pointer rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
						<X className="h-4 w-4" />
					</button>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-slate-200 bg-slate-50">
								<th className="w-10 px-4 py-3" />
								{COLS.map((col) => (
									<th key={col.label} className="px-4 py-3 text-left">
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
								<tr key={tpl.id} onClick={() => setSelectedId(tpl.id)} className={cn("cursor-pointer border-b border-slate-100 hover:bg-slate-50", selectedId === tpl.id && "bg-slate-50")}>
									<td className="px-4 py-3">
										<input type="checkbox" checked={selectedId === tpl.id} onChange={() => setSelectedId(tpl.id)} className="h-4 w-4 cursor-pointer accent-slate-800" />
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
				<div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4">
					<button type="button" onClick={onClose} className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
						<Translate text={localizationConstants.cancel} />
					</button>
					<button type="button" onClick={() => selected && onUse(selected)} disabled={!selected} className="cursor-pointer rounded-md bg-[#18181B] px-4 py-2 text-sm font-medium text-white hover:bg-[#27272A] disabled:opacity-40">
						<Translate text={localizationConstants.kmaQualityPlanTemplateUseBtn} />
					</button>
				</div>
			</div>
		</div>
	);
}

// ── Create Kontrollplan Page ───────────────────────────────────────────────────

function CreateKontrollplanPage({ onBack, startWithTemplate = false }: { onBack: () => void; startWithTemplate?: boolean }) {
	const [name, setName] = useState("");
	const [objType, setObjType] = useState<"projekt" | "order">("projekt");
	const [templateModalOpen, setTemplateModalOpen] = useState(startWithTemplate);
	const [expandedCatIds, setExpandedCatIds] = useState<Set<string>>(new Set(MOCK_QUALITY_PLAN_CATEGORIES.map((c) => c.id)));
	const [expandedSubIds, setExpandedSubIds] = useState<Set<string>>(new Set([MOCK_QUALITY_PLAN_CATEGORIES[0]?.subcategories[0]?.id ?? ""]));
	const [checkedDocIds, setCheckedDocIds] = useState<Set<string>>(new Set());
	const [addedDocs, setAddedDocs] = useState<QualityDocument[]>([]);
	const [selectedRightIdx, setSelectedRightIdx] = useState<number | null>(null);

	const allDocs = useMemo(() => MOCK_QUALITY_PLAN_CATEGORIES.flatMap((c) => c.subcategories.flatMap((s) => s.documents)), []);
	const addedIds = useMemo(() => new Set(addedDocs.map((d) => d.id)), [addedDocs]);
	const availableCount = allDocs.length - addedDocs.length;
	const allCheckable = allDocs.filter((d) => !addedIds.has(d.id));
	const allChecked = allCheckable.length > 0 && allCheckable.every((d) => checkedDocIds.has(d.id));

	function toggleCat(id: string) { setExpandedCatIds((p) => { const n = new Set(p); if (n.has(id)) { n.delete(id); } else { n.add(id); } return n; }); }
	function toggleSub(id: string) { setExpandedSubIds((p) => { const n = new Set(p); if (n.has(id)) { n.delete(id); } else { n.add(id); } return n; }); }
	function toggleDoc(docId: string) { setCheckedDocIds((p) => { const n = new Set(p); if (n.has(docId)) { n.delete(docId); } else { n.add(docId); } return n; }); }

	function selectAllInSub(sub: QualitySubCategory) {
		setCheckedDocIds((p) => { const n = new Set(p); sub.documents.filter((d) => !addedIds.has(d.id)).forEach((d) => n.add(d.id)); return n; });
	}
	function selectAllInCat(cat: QualityMainCategory) {
		setCheckedDocIds((p) => { const n = new Set(p); cat.subcategories.flatMap((s) => s.documents).filter((d) => !addedIds.has(d.id)).forEach((d) => n.add(d.id)); return n; });
	}
	function toggleAll() {
		setCheckedDocIds(allChecked ? new Set() : new Set(allCheckable.map((d) => d.id)));
	}
	function handleAddDocs() {
		setAddedDocs((p) => [...p, ...allDocs.filter((d) => checkedDocIds.has(d.id) && !addedIds.has(d.id))]);
		setCheckedDocIds(new Set());
	}
	function handleRemoveDoc() {
		if (selectedRightIdx === null) return;
		setAddedDocs((p) => p.filter((_, i) => i !== selectedRightIdx));
		setSelectedRightIdx(null);
	}

	return (
		<>
			{templateModalOpen && (
				<UseTemplateModal onClose={() => setTemplateModalOpen(false)} onUse={(tpl) => { setName(tpl.name); setTemplateModalOpen(false); }} />
			)}
			<div className="flex flex-1 flex-col overflow-hidden bg-white">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
					<div>
						<div className="flex items-center gap-2">
							<button type="button" onClick={onBack} className="cursor-pointer text-slate-500 hover:text-slate-800"><ArrowLeft className="h-4 w-4" /></button>
							<h1 className="text-xl font-semibold text-slate-900"><Translate text={localizationConstants.kmaQualityPlanCreateBtn} /></h1>
						</div>
						<p className="mt-0.5 pl-6 text-sm text-slate-400"><Translate text={localizationConstants.kmaQualityPlanCreateSubtitle} /></p>
					</div>
					<div className="flex items-center gap-2">
						<button type="button" onClick={onBack} className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"><Translate text={localizationConstants.cancel} /></button>
						<button type="button" className="cursor-pointer rounded-md bg-[#18181B] px-4 py-2 text-sm font-medium text-white hover:bg-[#27272A]"><Translate text={localizationConstants.save} /></button>
					</div>
				</div>
				{/* Scrollable body */}
				<div className="flex flex-1 flex-col overflow-y-auto">
					{/* Kontrollplan detaljer form */}
					<div className="border-b border-slate-200 px-6 py-5">
						<h2 className="mb-4 text-sm font-semibold text-slate-700"><Translate text={localizationConstants.kmaQualityPlanCreateDetailsHeader} /></h2>
						<div className="flex flex-col gap-4">
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500"><Translate text={localizationConstants.kmaQualityPlanCreateNameLabel} /></label>
								<input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Badrum" className="h-9 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300" />
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="mb-1 block text-xs font-medium text-slate-500"><Translate text={localizationConstants.kmaQualityPlanCreateIdLabel} /></label>
									<input type="text" defaultValue="KP001" readOnly className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none" />
								</div>
								<div>
									<label className="mb-1 block text-xs font-medium text-slate-500"><Translate text={localizationConstants.kmaQualityPlanCreateVersionLabel} /></label>
									<input type="text" defaultValue="2025-12" readOnly className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none" />
								</div>
							</div>
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500"><Translate text={localizationConstants.kmaQualityPlanCreateKmaIdLabel} /></label>
								<input type="text" defaultValue="KMA001" readOnly className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none" />
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="mb-1.5 block text-xs font-medium text-slate-500"><Translate text={localizationConstants.kmaQualityPlanCreateObjTypeLabel} /></label>
									<div className="flex gap-4">
										<label className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-700">
											<input type="radio" name="objType" value="projekt" checked={objType === "projekt"} onChange={() => setObjType("projekt")} className="h-3.5 w-3.5 accent-slate-800" />
											<Translate text={localizationConstants.kmaQualityPlanCreateObjTypeProject} />
										</label>
										<label className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-700">
											<input type="radio" name="objType" value="order" checked={objType === "order"} onChange={() => setObjType("order")} className="h-3.5 w-3.5 accent-slate-800" />
											<Translate text={localizationConstants.kmaQualityPlanCreateObjTypeOrder} />
										</label>
									</div>
								</div>
								<div>
									<label className="mb-1 block text-xs font-medium text-slate-500"><Translate text={localizationConstants.kmaQualityPlanCreateObjectLabel} /></label>
									<select className="h-9 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300">
										<option>Projekt 2025-001</option>
										<option>Projekt 2025-002</option>
										<option>Projekt 2024-012</option>
									</select>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="mb-1 block text-xs font-medium text-slate-500"><Translate text={localizationConstants.kmaQualityPlanCreateCreatedByLabel} /></label>
									<input type="text" defaultValue="Jake Jamisson" readOnly className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none" />
								</div>
								<div>
									<label className="mb-1 block text-xs font-medium text-slate-500"><Translate text={localizationConstants.kmaQualityPlanCreateDateLabel} /></label>
									<input type="date" defaultValue="2026-01-15" readOnly className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none" />
								</div>
							</div>
						</div>
					</div>
					{/* Dual panel: tree + right */}
					<div className="flex min-h-64 flex-1">
						{/* Left: tree */}
						<div className="flex flex-1 flex-col border-r border-slate-200">
							<div className="border-b border-slate-200 px-5 py-3">
								<h3 className="text-xs font-semibold tracking-wide text-slate-500"><Translate text={localizationConstants.kmaQualityPlanCreateStructureHeader} /></h3>
							</div>
							<div className="flex-1 overflow-y-auto px-5 py-3">
								<label className="mb-3 flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
									<input type="checkbox" checked={allChecked} onChange={toggleAll} className="h-4 w-4 accent-slate-800" />
									<Translate text={localizationConstants.kmaQualityPlanCreateSelectAll} />
								</label>
								{MOCK_QUALITY_PLAN_CATEGORIES.map((cat) => (
									<div key={cat.id} className="mb-2">
										<button type="button" onClick={() => toggleCat(cat.id)} className="flex w-full cursor-pointer items-center gap-1.5 py-1 text-sm font-medium text-slate-700 hover:text-slate-900">
											{expandedCatIds.has(cat.id) ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
											<FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
											{cat.label}
										</button>
										{expandedCatIds.has(cat.id) && (
											<div className="mt-1 pl-5">
												{cat.subcategories.map((sub) => (
													<div key={sub.id} className="mb-1">
														<button type="button" onClick={() => toggleSub(sub.id)} className="flex w-full cursor-pointer items-center gap-1.5 py-1 text-sm text-slate-600 hover:text-slate-800">
															{expandedSubIds.has(sub.id) ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
															<FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
															<span>{sub.label}</span>
															{sub.documents.some((d) => checkedDocIds.has(d.id)) && (
																<span className="ml-1 rounded-full bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600">
																	{sub.documents.filter((d) => checkedDocIds.has(d.id)).length}
																</span>
															)}
														</button>
														{expandedSubIds.has(sub.id) && (
															<div className="mt-1 pl-5">
																{sub.documents.filter((d) => !addedIds.has(d.id)).map((doc) => (
																	<label key={doc.id} className="mb-1 flex cursor-pointer items-center gap-2 text-xs text-slate-600 hover:text-slate-800">
																		<input type="checkbox" checked={checkedDocIds.has(doc.id)} onChange={() => toggleDoc(doc.id)} className="h-3.5 w-3.5 accent-slate-800" />
																		{doc.title}
																	</label>
																))}
																{sub.documents.some((d) => !addedIds.has(d.id)) && (
																	<button type="button" onClick={() => selectAllInSub(sub)} className="mt-1 cursor-pointer text-xs text-blue-600 hover:underline">
																		<Translate text={localizationConstants.kmaQualityPlanCreateSelectAllSub} />
																	</button>
																)}
															</div>
														)}
													</div>
												))}
												<button type="button" onClick={() => selectAllInCat(cat)} className="mt-1 cursor-pointer text-xs text-blue-600 hover:underline">
													<Translate text={localizationConstants.kmaQualityPlanCreateSelectAllCat} />
												</button>
											</div>
										)}
									</div>
								))}
							</div>
							<div className="border-t border-slate-200 px-5 py-2">
								<span className="text-xs text-slate-400">{availableCount} <Translate text={localizationConstants.kmaQualityPlanCreateAvailable} /></span>
							</div>
						</div>
						{/* Right: Ny kontrollplan */}
						<div className="flex w-72 shrink-0 flex-col">
							<div className="border-b border-slate-200 px-5 py-3">
								<h3 className="text-xs font-semibold tracking-wide text-slate-500"><Translate text={localizationConstants.kmaQualityPlanCreateNewPanelTitle} /></h3>
							</div>
							<div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4">
								<button type="button" onClick={handleAddDocs} disabled={checkedDocIds.size === 0} className="flex cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
									<Translate text={localizationConstants.kmaQualityPlanCreateAddBtn} />{" →"}
								</button>
								<button type="button" onClick={handleRemoveDoc} disabled={selectedRightIdx === null} className="flex cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
									{"← "}<Translate text={localizationConstants.kmaQualityPlanCreateRemoveBtn} />
								</button>
							</div>
							<div className="flex-1 overflow-y-auto px-3 py-2">
								{addedDocs.length === 0 ? (
									<p className="mt-6 text-center text-xs text-slate-400">—</p>
								) : (
									addedDocs.map((doc, i) => (
										<button key={doc.id} type="button" onClick={() => setSelectedRightIdx(i === selectedRightIdx ? null : i)} className={cn("mb-1 flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs", selectedRightIdx === i ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50")}>
											<FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
											<span className="truncate">{doc.title}</span>
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

// ── Category Panel ─────────────────────────────────────────────────────────────

interface CategoryPanelProps {
	headerKey: string;
	items: { id: string; label: string; count?: number }[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	searchKey: string;
}

function CategoryPanel({ headerKey, items, selectedId, onSelect, searchKey }: CategoryPanelProps) {
	const t = useTranslate();
	const [search, setSearch] = useState("");

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		return items.filter((i) => i.label.toLowerCase().includes(q));
	}, [items, search]);

	return (
		<div className="flex w-56 shrink-0 flex-col border-r border-slate-200">
			{/* Header */}
			<div className="border-b border-slate-200 px-4 py-3">
				<p className="text-xs font-semibold tracking-wide text-slate-500">
					<Translate text={headerKey} />
				</p>
			</div>
			{/* Search */}
			<div className="relative border-b border-slate-200">
				<Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder={t(searchKey)}
					className="h-9 w-full bg-white pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none"
				/>
			</div>
			{/* Items */}
			<div className="flex-1 overflow-y-auto">
				{filtered.map((item) => (
					<button
						key={item.id}
						type="button"
						onClick={() => onSelect(item.id)}
						className={cn(
							"flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-left text-xs transition-colors hover:bg-slate-50",
							selectedId === item.id
								? "border-l-2 border-slate-800 bg-slate-50 font-medium text-slate-900"
								: "border-l-2 border-transparent text-slate-600",
						)}
					>
						<span className="flex items-center gap-2">
							<FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
							<span className="truncate">{item.label}</span>
						</span>
						{item.count !== undefined && (
							<span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
								{item.count}
							</span>
						)}
					</button>
				))}
			</div>
			{/* Add new */}
			<div className="border-t border-slate-200 px-4 py-3">
				<button
					type="button"
					className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700"
				>
					<Plus className="h-3.5 w-3.5" />
					<Translate text={localizationConstants.kmaQualityAddNew} />
				</button>
			</div>
		</div>
	);
}

// ── Documents Panel ────────────────────────────────────────────────────────────

interface DocsPanelProps {
	documents: QualityDocument[];
	onOpenDoc: (doc: QualityDocument) => void;
	selectedSubCatId: string | null;
}

function DocsPanel({ documents, onOpenDoc, selectedSubCatId }: DocsPanelProps) {
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
								onClick={() => onOpenDoc(doc)}
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
									<div className="absolute right-0 z-20 mt-1 w-32 rounded-md border border-slate-200 bg-white py-1 shadow-md">
										<button
											type="button"
											className="w-full cursor-pointer px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50"
											onClick={() => { onOpenDoc(doc); setOpenMenuDocId(null); }}
										>
											<Translate text={localizationConstants.actionEdit} />
										</button>
										<button
											type="button"
											className="w-full cursor-pointer px-3 py-1.5 text-left text-xs text-red-600 hover:bg-slate-50"
											onClick={() => setOpenMenuDocId(null)}
										>
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
	onOpenDoc,
	onCreateNew,
	onUseTemplate,
}: {
	onOpenDoc: (doc: QualityDocument) => void;
	onCreateNew: () => void;
	onUseTemplate: () => void;
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
	const [selectedSubId, setSelectedSubId] = useState<string | null>(
		MOCK_QUALITY_PLAN_CATEGORIES[0]?.subcategories[0]?.id ?? null,
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
	const selectedSub = selectedMain?.subcategories.find((s) => s.id === selectedSubId);

	function handleSelectMain(id: string) {
		setSelectedMainId(id);
		const cat = MOCK_QUALITY_PLAN_CATEGORIES.find((c) => c.id === id);
		setSelectedSubId(cat?.subcategories[0]?.id ?? null);
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

	const subItems = useMemo(
		() =>
			selectedMain?.subcategories.map((s) => ({
				id: s.id,
				label: s.label,
				count: s.documents.length,
			})) ?? [],
		[selectedMain],
	);

	const filteredDocs = useMemo(() => {
		const docs = selectedSub?.documents ?? [];
		return viewMode === "mallar" ? docs.filter((d) => d.isTemplate) : docs;
	}, [selectedSub, viewMode]);

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
				{/* Split create button */}
				<div ref={createBtnRef} className="relative flex">
					<button
						type="button"
						onClick={onCreateNew}
						className="flex cursor-pointer items-center gap-1.5 rounded-l-md bg-[#18181B] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#27272A]"
					>
						<Plus className="h-4 w-4" />
						<Translate text={localizationConstants.kmaQualityPlanCreateBtn} />
					</button>
					<button
						type="button"
						onClick={() => setCreateBtnOpen((v) => !v)}
						className="flex cursor-pointer items-center rounded-r-md border-l border-white/20 bg-[#18181B] px-2 py-1.5 text-white hover:bg-[#27272A]"
						aria-label="More create options"
					>
						<ChevronDown className="h-4 w-4" />
					</button>
					{createBtnOpen && (
						<div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-md">
							<button
								type="button"
								onClick={() => { onCreateNew(); setCreateBtnOpen(false); }}
								className="w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
							>
								<Translate text={localizationConstants.kmaQualityPlanCreateBtn} />
							</button>
							<button
								type="button"
								onClick={() => { onUseTemplate(); setCreateBtnOpen(false); }}
								className="w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
							>
								<Translate text={localizationConstants.kmaQualityPlanUseTemplate} />
							</button>
						</div>
					)}
				</div>
			</div>
			{/* Content */}
			{planType !== "kontrollplan" ? (
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
					<CategoryPanel
						headerKey={localizationConstants.kmaQualitySubCat}
						items={subItems}
						selectedId={selectedSubId}
						onSelect={setSelectedSubId}
						searchKey={localizationConstants.kmaQualitySearchSubCategories}
					/>
					<DocsPanel
						documents={filteredDocs}
						onOpenDoc={onOpenDoc}
						selectedSubCatId={selectedSubId}
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
				onBack={() => { setCreatePlanOpen(false); setCreateWithTemplate(false); }}
				startWithTemplate={createWithTemplate}
			/>
		);
	}

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-white">
			{/* Page title */}
			<div className="border-b border-slate-200 px-6 py-4">
				<h1 className="text-2xl font-semibold text-slate-900">
					<Translate text={localizationConstants.kmaListSidebarKvalite} />
				</h1>
				{/* Breadcrumb */}
				<nav className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
					<span>Home</span>
					<span>›</span>
					<span>Modul</span>
					<span>›</span>
					<span>Produktion</span>
					<span>›</span>
					<span>KMA</span>
					<span>›</span>
					<span className="text-slate-600">SecureCheck</span>
				</nav>
			</div>

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
						onOpenDoc={setOpenDoc}
						onCreateNew={() => { setCreateWithTemplate(false); setCreatePlanOpen(true); }}
						onUseTemplate={() => { setCreateWithTemplate(true); setCreatePlanOpen(true); }}
					/>
				)}
		</div>
	);
}
