"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { QualityDocument, QualityMainCategory, QualitySubCategory } from "../../types/quality";
import { MOCK_QUALITY_PLAN_CATEGORIES } from "../../constants/qualityMock";

// ── CreateRiskTemplatePage ────────────────────────────────────────────────────

export function CreateRiskTemplatePage({ onBack }: { onBack: () => void }) {
	const t = useTranslate();
	const [name, setName] = useState("");
	const [errors, setErrors] = useState<{ name?: boolean }>({});
	const [isSaving, setIsSaving] = useState(false);
	const [isDirty, setIsDirty] = useState(false);

	const [expandedCatIds, setExpandedCatIds] = useState<Set<string>>(
		new Set(MOCK_QUALITY_PLAN_CATEGORIES.map((c) => c.id)),
	);
	const [expandedSubIds, setExpandedSubIds] = useState<Set<string>>(
		new Set([MOCK_QUALITY_PLAN_CATEGORIES[0]?.subcategories[0]?.id ?? ""]),
	);
	const [checkedDocIds, setCheckedDocIds] = useState<Set<string>>(new Set());
	const [addedDocs, setAddedDocs] = useState<QualityDocument[]>([]);
	const [selectedRightIdx, setSelectedRightIdx] = useState<number | null>(null);

	useEffect(() => {
		if (!isDirty) return;
		function handleBeforeUnload(e: BeforeUnloadEvent) {
			e.preventDefault();
			e.returnValue = "";
		}
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [isDirty]);

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
		setIsDirty(true);
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
		setIsDirty(true);
	}

	function handleRemoveDoc() {
		if (selectedRightIdx === null) return;
		setAddedDocs((prev) => prev.filter((_, i) => i !== selectedRightIdx));
		setSelectedRightIdx(null);
		setIsDirty(true);
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
							<Translate text={localizationConstants.kmaCreateRiskTemplateTitle} />
						</h1>
					</div>
					<p className="mt-0.5 pl-6 text-sm text-slate-400">
						<Translate text={localizationConstants.kmaCreateRiskTemplateSubtitle} />
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
				{/* General info */}
				<div className="border-b border-slate-200 px-6 py-5">
					<h2 className="mb-4 text-sm font-semibold text-slate-700">
						<Translate text={localizationConstants.kmaCreateRiskSectionDetails} />
					</h2>
					<div className="flex flex-col gap-4">
						{/* Template name */}
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaCreateRiskTemplateNameLabel} />
								{" "}<span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => { setName(e.target.value); setIsDirty(true); if (errors.name) setErrors({}); }}
								placeholder="Badrum"
								aria-label={t(localizationConstants.kmaCreateRiskTemplateNameLabel)}
								className={cn(
									"h-9 w-full rounded border bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300",
									errors.name ? "border-red-400 focus:ring-red-300" : "border-slate-200",
								)}
							/>
							{errors.name && (
								<p className="mt-1 text-xs text-red-500">
									<Translate text={localizationConstants.kmaCreateRiskValidationName} />
								</p>
							)}
						</div>
						{/* ID + Version */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaCreateRiskIdLabel} />
								</label>
								<input
									type="text"
									defaultValue="RM-001"
									readOnly
									className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none"
								/>
							</div>
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaCreateRiskVersionLabel} />
								</label>
								<input
									type="text"
									defaultValue="2025-12"
									readOnly
									className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none"
								/>
							</div>
						</div>
						{/* Created by + Date */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaCreateRiskCreatedByLabel} />
								</label>
								<input
									type="text"
									defaultValue="Jake Jamtsson"
									readOnly
									className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none"
								/>
							</div>
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaCreateRiskDateLabel} />
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
					{/* Left: document tree */}
					<div className="flex flex-1 flex-col border-r border-slate-200">
						<div className="border-b border-slate-200 px-5 py-3">
							<h3 className="text-xs font-semibold tracking-wide text-slate-500">
								<Translate text={localizationConstants.kmaCreateRiskMainStructure} />
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

					{/* Right: selected docs */}
					<div className="flex w-72 shrink-0 flex-col">
						<div className="border-b border-slate-200 px-5 py-3">
							<h3 className="truncate text-xs font-semibold tracking-wide text-slate-500">
								{name || <Translate text={localizationConstants.kmaCreateRiskTemplateTitle} />}
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
