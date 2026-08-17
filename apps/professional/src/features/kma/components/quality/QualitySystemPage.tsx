"use client";

import { useEffect, useMemo, useState } from "react";
import {
	ArrowLeft,
	Download,
	FileText,
	MoreVertical,
	Plus,
	Search,
	Star,
	Upload,
	ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { QualityDocument, QualityMainCategory } from "../../types/quality";
import { MOCK_QUALITY_CATEGORIES } from "../../constants/qualityMock";

// ── Types ─────────────────────────────────────────────────────────────────────

type DetailTab = "details" | "comments" | "versions";

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
						<div className="flex flex-1 items-center justify-center text-sm text-slate-400">
							<Translate text={localizationConstants.noDataFound} />
						</div>
					)}

					{/* Versions tab */}
					{activeTab === "versions" && (
						<div className="flex flex-1 items-center justify-center text-sm text-slate-400">
							<Translate text={localizationConstants.noDataFound} />
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
						defaultValue=""
						placeholder="Description"
						onChange={() => {}}
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

function QualityPlanTab() {
	return (
		<div className="flex flex-1 items-center justify-center text-sm text-slate-400">
			<Translate text={localizationConstants.comingSoon} />
		</div>
	);
}

// ── Main Export ────────────────────────────────────────────────────────────────

type QualityTab = "system" | "plan";

export function QualitySystemPage() {
	const [activeTab, setActiveTab] = useState<QualityTab>("system");
	const [openDoc, setOpenDoc] = useState<QualityDocument | null>(null);

	const TABS: { id: QualityTab; key: string }[] = [
		{ id: "system", key: localizationConstants.kmaQualityTabSystem },
		{ id: "plan", key: localizationConstants.kmaQualityTabPlan },
	];

	if (openDoc) {
		return <DocDetailView doc={openDoc} onBack={() => setOpenDoc(null)} />;
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
			{activeTab === "plan" && <QualityPlanTab />}
		</div>
	);
}
