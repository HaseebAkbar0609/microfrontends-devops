"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ChecklistTemplate } from "./ChecklistTemplateTable";

// ── ChecklistItem ─────────────────────────────────────────────────────────────

interface ChecklistItem {
	id: string;
	kontrollpunkt: string;
	category: string;
	krav: string;
	responsibleRole: string;
}

const MOCK_CHECKLIST_ITEMS: ChecklistItem[] = [
	{ id: "CI001", kontrollpunkt: "Kontrollera säkerhetsutrustning", category: "Säkerhet", krav: "AFS 2001:1", responsibleRole: "Platschef" },
	{ id: "CI002", kontrollpunkt: "Besiktiga fundament", category: "Grund", krav: "SS-EN 1997", responsibleRole: "Förman" },
	{ id: "CI003", kontrollpunkt: "Slutbesiktning invändigt", category: "Slutbesiktning", krav: "BBR 2023", responsibleRole: "Platschef" },
];

// ── OpenChecklistTemplatePage ─────────────────────────────────────────────────

export function OpenChecklistTemplatePage({
	template,
	onBack,
}: {
	template: ChecklistTemplate;
	onBack: () => void;
}) {
	const t = useTranslate();
	const [isEditMode, setIsEditMode] = useState(false);
	const [name, setName] = useState(template.name);
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [items, setItems] = useState<ChecklistItem[]>(MOCK_CHECKLIST_ITEMS);
	const [errors, setErrors] = useState<{ name?: boolean }>({});
	const [isSaving, setIsSaving] = useState(false);
	const [isDirty, setIsDirty] = useState(false);

	useEffect(() => {
		if (!isDirty) return;
		function handleBeforeUnload(e: BeforeUnloadEvent) {
			e.preventDefault();
			e.returnValue = "";
		}
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [isDirty]);

	function handleAddRow() {
		const newItem: ChecklistItem = {
			id: `CI${String(items.length + 1).padStart(3, "0")}`,
			kontrollpunkt: "",
			category: "",
			krav: "",
			responsibleRole: "",
		};
		setItems((prev) => [...prev, newItem]);
		setIsDirty(true);
	}

	function handleDeleteRow(id: string) {
		setItems((prev) => prev.filter((item) => item.id !== id));
		setIsDirty(true);
	}

	function handleItemChange(id: string, field: keyof Omit<ChecklistItem, "id">, value: string) {
		setItems((prev) =>
			prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
		);
		setIsDirty(true);
	}

	function handleCancelEdit() {
		setIsEditMode(false);
		setName(template.name);
		setDescription("");
		setCategory("");
		setItems(MOCK_CHECKLIST_ITEMS);
		setErrors({});
		setIsDirty(false);
	}

	function handleSave() {
		if (isSaving) return;
		if (!name.trim()) {
			setErrors({ name: true });
			return;
		}
		if (items.length === 0 || items.every((i) => !i.kontrollpunkt.trim())) {
			return;
		}
		setErrors({});
		setIsSaving(true);
		// backend integration pending
		setIsEditMode(false);
		setIsSaving(false);
		setIsDirty(false);
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
							{isEditMode
								? <Translate text={localizationConstants.kmaEditRiskTemplateTitle} />
								: <Translate text={localizationConstants.kmaOpenChecklistTemplateTitle} />
							}
						</h1>
					</div>
					<p className="mt-0.5 pl-6 text-sm text-slate-400">
						<Translate text={localizationConstants.kmaChecklistPageSubtitle} />
					</p>
				</div>
				<div className="flex items-center gap-2">
					{isEditMode ? (
						<>
							<button
								type="button"
								onClick={handleCancelEdit}
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
						</>
					) : (
						<>
							<button
								type="button"
								onClick={() => setIsEditMode(true)}
								className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
							>
								<Pencil className="h-3.5 w-3.5" />
								<Translate text={localizationConstants.actionEdit} />
							</button>
							<button
								type="button"
								onClick={onBack}
								className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
							>
								<Translate text={localizationConstants.kmaOpenSandlistaCloseBtn} />
							</button>
						</>
					)}
				</div>
			</div>

			{/* Scrollable body */}
			<div className="flex flex-1 flex-col overflow-y-auto">
				{/* General info */}
				<div className="border-b border-slate-200 px-6 py-5">
					<h2 className="mb-4 text-sm font-semibold text-slate-700">
						<Translate text={localizationConstants.kmaChecklistDetailsHeader} />
					</h2>
					<div className="flex flex-col gap-4">
						{/* Template name */}
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaChecklistNameLabel} />
								{isEditMode && <span className="ml-0.5 text-red-500">*</span>}
							</label>
							{isEditMode ? (
								<>
									<input
										type="text"
										value={name}
										onChange={(e) => { setName(e.target.value); setIsDirty(true); if (errors.name) setErrors({}); }}
										aria-label={t(localizationConstants.kmaChecklistNameLabel)}
										className={cn(
											"h-9 w-full rounded border bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300",
											errors.name ? "border-red-400 focus:ring-red-300" : "border-slate-200",
										)}
									/>
									{errors.name && (
										<p className="mt-1 text-xs text-red-500">
											<Translate text={localizationConstants.kmaControlPlanValidationName} />
										</p>
									)}
								</>
							) : (
								<p className="text-sm font-medium text-slate-800">{name || "—"}</p>
							)}
						</div>

						{/* Description */}
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaControlPlanDescLabel} />
							</label>
							{isEditMode ? (
								<textarea
									value={description}
									onChange={(e) => { setDescription(e.target.value); setIsDirty(true); }}
									rows={3}
									className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300 resize-none"
								/>
							) : (
								<p className="text-sm text-slate-700">{description || "—"}</p>
							)}
						</div>

						{/* Category + ID row */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaChecklistTemplateCategoryLabel} />
								</label>
								{isEditMode ? (
									<select
										value={category}
										onChange={(e) => { setCategory(e.target.value); setIsDirty(true); }}
										className="h-9 w-full cursor-pointer rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
									>
										<option value="">—</option>
										<option value="safety">Säkerhet</option>
										<option value="foundation">Grund</option>
										<option value="inspection">Slutbesiktning</option>
										<option value="quality">Kvalitet</option>
									</select>
								) : (
									<p className="text-sm text-slate-700">{category || "—"}</p>
								)}
							</div>
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaChecklistIdLabel} />
								</label>
								{isEditMode ? (
									<input
										type="text"
										value={template.templateNr}
										readOnly
										className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none"
									/>
								) : (
									<p className="text-sm text-slate-700">{template.templateNr}</p>
								)}
							</div>
						</div>

						{/* Version + Created by + Date */}
						<div className="grid grid-cols-3 gap-4">
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaChecklistVersionLabel} />
								</label>
								{isEditMode ? (
									<input
										type="text"
										value={template.version}
										readOnly
										className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none"
									/>
								) : (
									<p className="text-sm text-slate-700">{template.version}</p>
								)}
							</div>
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaChecklistCreatedByLabel} />
								</label>
								{isEditMode ? (
									<input
										type="text"
										value={template.createdBy}
										readOnly
										className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none"
									/>
								) : (
									<p className="text-sm text-slate-700">{template.createdBy}</p>
								)}
							</div>
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaChecklistDateLabel} />
								</label>
								{isEditMode ? (
									<input
										type="text"
										value={template.lastUpdate}
										readOnly
										className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus:outline-none"
									/>
								) : (
									<p className="text-sm text-slate-700">{template.lastUpdate}</p>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Checklist items */}
				<div className="flex flex-col px-6 py-5">
					<div className="mb-3 flex items-center justify-between">
						<h2 className="text-sm font-semibold text-slate-700">
							<Translate text={localizationConstants.kmaChecklistTemplateItemsHeader} />
						</h2>
						{isEditMode && (
							<button
								type="button"
								onClick={handleAddRow}
								className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
							>
								<Plus className="h-3.5 w-3.5" />
								<Translate text={localizationConstants.kmaChecklistTemplateAddRow} />
							</button>
						)}
					</div>
					<div className="overflow-x-auto rounded border border-slate-200">
						<table className="w-full text-xs">
							<thead>
								<tr className="border-b border-slate-200 bg-slate-50">
									<th className="px-3 py-2.5 text-left font-medium text-slate-500">
										<Translate text={localizationConstants.kmaChecklistTemplateColKontrollpunkt} />
									</th>
									<th className="px-3 py-2.5 text-left font-medium text-slate-500">
										<Translate text={localizationConstants.kmaChecklistTemplateColCategory} />
									</th>
									<th className="px-3 py-2.5 text-left font-medium text-slate-500">
										<Translate text={localizationConstants.kmaChecklistTemplateColKrav} />
									</th>
									<th className="px-3 py-2.5 text-left font-medium text-slate-500">
										<Translate text={localizationConstants.kmaChecklistTemplateColRole} />
									</th>
									{isEditMode && <th className="w-8 px-3 py-2.5" />}
								</tr>
							</thead>
							<tbody>
								{items.length === 0 ? (
									<tr>
										<td colSpan={isEditMode ? 5 : 4} className="py-8 text-center text-slate-400">
											<Translate text={localizationConstants.noDataFound} />
										</td>
									</tr>
								) : (
									items.map((item) => (
										<tr key={item.id} className="border-b border-slate-100 last:border-0">
											<td className="px-3 py-2.5">
												{isEditMode ? (
													<input
														type="text"
														value={item.kontrollpunkt}
														onChange={(e) => handleItemChange(item.id, "kontrollpunkt", e.target.value)}
														className="h-8 w-full rounded border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
													/>
												) : (
													<span className="text-slate-700">{item.kontrollpunkt}</span>
												)}
											</td>
											<td className="px-3 py-2.5">
												{isEditMode ? (
													<input
														type="text"
														value={item.category}
														onChange={(e) => handleItemChange(item.id, "category", e.target.value)}
														className="h-8 w-full rounded border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
													/>
												) : (
													<span className="text-slate-600">{item.category}</span>
												)}
											</td>
											<td className="px-3 py-2.5">
												{isEditMode ? (
													<input
														type="text"
														value={item.krav}
														onChange={(e) => handleItemChange(item.id, "krav", e.target.value)}
														className="h-8 w-full rounded border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
													/>
												) : (
													<span className="text-slate-600">{item.krav}</span>
												)}
											</td>
											<td className="px-3 py-2.5">
												{isEditMode ? (
													<input
														type="text"
														value={item.responsibleRole}
														onChange={(e) => handleItemChange(item.id, "responsibleRole", e.target.value)}
														className="h-8 w-full rounded border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
													/>
												) : (
													<span className="text-slate-600">{item.responsibleRole}</span>
												)}
											</td>
											{isEditMode && (
												<td className="px-3 py-2.5 text-center">
													<button
														type="button"
														onClick={() => handleDeleteRow(item.id)}
														className="cursor-pointer text-slate-400 hover:text-red-500"
													>
														<Trash2 className="h-3.5 w-3.5" />
													</button>
												</td>
											)}
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
