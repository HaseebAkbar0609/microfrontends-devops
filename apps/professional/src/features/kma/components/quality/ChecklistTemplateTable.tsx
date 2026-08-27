"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Archive, ArrowUpDown, ChevronDown, MoreVertical, Pencil, Search, Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ChecklistTemplate {
	id: string;
	templateNr: string;
	name: string;
	version: string;
	lastUpdate: string;
	createdBy: string;
}

export const MOCK_CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
	{ id: "CH001", templateNr: "CH001", name: "Checklistor 1", version: "V2025-12", lastUpdate: "2026-01-28", createdBy: "Lars Andersson" },
	{ id: "CH002", templateNr: "CH002", name: "Checklistor 2", version: "v1.8",     lastUpdate: "2025-01-08", createdBy: "Lars Andersson" },
	{ id: "CH003", templateNr: "CH003", name: "Checklistor 3", version: "v2.1",     lastUpdate: "2025-04-09", createdBy: "Lars Andersson" },
	{ id: "CH004", templateNr: "CH004", name: "Checklistor 4", version: "v1.8",     lastUpdate: "2026-01-09", createdBy: "Lars Andersson" },
];

// ── RowActionMenu ─────────────────────────────────────────────────────────────

function RowActionMenu({
	onEdit,
	onDelete,
	onArchive,
	onClose,
}: {
	onEdit: () => void;
	onDelete: () => void;
	onArchive: () => void;
	onClose: () => void;
}) {
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				onClose();
			}
		}
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [onClose]);

	return (
		<div
			ref={ref}
			className="absolute right-0 top-full z-30 mt-1 w-40 rounded-md border border-slate-200 bg-white py-1 shadow-md"
		>
			<button
				type="button"
				onClick={onEdit}
				className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
			>
				<Pencil className="h-3.5 w-3.5 text-slate-400" />
				<Translate text={localizationConstants.kmaRiskTemplateActionEdit} />
			</button>
			<button
				type="button"
				onClick={onDelete}
				className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
			>
				<Trash2 className="h-3.5 w-3.5" />
				<Translate text={localizationConstants.actionDelete} />
			</button>
			<button
				type="button"
				onClick={onArchive}
				className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
			>
				<Archive className="h-3.5 w-3.5 text-slate-400" />
				<Translate text={localizationConstants.kmaRiskTemplateActionArchive} />
			</button>
		</div>
	);
}

// ── ChecklistTemplateTable ────────────────────────────────────────────────────

export function ChecklistTemplateTable({ onOpenTemplate }: { onOpenTemplate: (id: string) => void }) {
	const t = useTranslate();
	const [templates, setTemplates] = useState<ChecklistTemplate[]>(MOCK_CHECKLIST_TEMPLATES);
	const [favorites, setFavorites] = useState<Set<string>>(new Set());
	const [search, setSearch] = useState("");
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

	const filtered = useMemo(
		() =>
			templates.filter(
				(tmpl) =>
					search === "" ||
					tmpl.name.toLowerCase().includes(search.toLowerCase()) ||
					tmpl.templateNr.toLowerCase().includes(search.toLowerCase()) ||
					tmpl.createdBy.toLowerCase().includes(search.toLowerCase()),
			),
		[templates, search],
	);

	function toggleFavorite(id: string) {
		setFavorites((prev) => {
			const next = new Set(prev);
			if (next.has(id)) { next.delete(id); } else { next.add(id); }
			return next;
		});
	}

	function handleDelete(id: string) {
		setTemplates((prev) => prev.filter((tmpl) => tmpl.id !== id));
		setDeleteConfirmId(null);
	}

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{/* Delete confirmation modal */}
			{deleteConfirmId && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
					<div className="w-80 rounded-lg bg-white shadow-xl">
						<div className="border-b border-slate-200 px-6 py-4">
							<h2 className="text-base font-semibold text-slate-900">
								<Translate text={localizationConstants.kmaRiskTemplateDeleteTitle} />
							</h2>
						</div>
						<div className="px-6 py-5">
							<p className="text-sm text-slate-600">
								<Translate text={localizationConstants.kmaRiskTemplateDeleteMsg} />
							</p>
						</div>
						<div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4">
							<button
								type="button"
								onClick={() => setDeleteConfirmId(null)}
								className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
							>
								<Translate text={localizationConstants.cancel} />
							</button>
							<button
								type="button"
								onClick={() => handleDelete(deleteConfirmId)}
								className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
							>
								<Translate text={localizationConstants.actionDelete} />
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Toolbar */}
			<div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
				<div className="relative max-w-xs flex-1">
					<Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder={t(localizationConstants.kmaRiskSearchPlaceholder)}
						className="h-8 w-full rounded border border-slate-200 pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
					/>
				</div>
				<button
					type="button"
					className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
				>
					<Translate text={localizationConstants.filter} />
					<ChevronDown className="h-3.5 w-3.5 text-slate-400" />
				</button>
			</div>

			{/* Table title */}
			<div className="px-5 pb-2 pt-4">
				<h3 className="text-base font-semibold text-slate-800">
					<Translate text={localizationConstants.kmaChecklistTemplateTableTitle} />
				</h3>
			</div>

			{/* Table */}
			<div className="flex-1 overflow-auto px-5 pb-5">
				<div className="overflow-x-auto rounded border border-slate-200">
					<table className="w-full text-xs">
						<thead>
							<tr className="border-b border-slate-200 bg-slate-50">
								<th className="w-8 px-3 py-2.5" />
								<th className="px-3 py-2.5 text-left font-medium text-slate-500">
									<span className="flex items-center gap-1">
										<Translate text={localizationConstants.kmaChecklistTemplateNrCol} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</span>
								</th>
								<th className="px-3 py-2.5 text-left font-medium text-slate-500">
									<span className="flex items-center gap-1">
										<Translate text={localizationConstants.kmaChecklistTemplateNameCol} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</span>
								</th>
								<th className="px-3 py-2.5 text-left font-medium text-slate-500">
									<span className="flex items-center gap-1">
										<Translate text={localizationConstants.kmaRiskTemplateColVersion} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</span>
								</th>
								<th className="px-3 py-2.5 text-left font-medium text-slate-500">
									<span className="flex items-center gap-1">
										<Translate text={localizationConstants.kmaRiskTemplateColLastUpdate} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</span>
								</th>
								<th className="px-3 py-2.5 text-left font-medium text-slate-500">
									<span className="flex items-center gap-1">
										<Translate text={localizationConstants.kmaRiskTemplateColCreatedBy} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</span>
								</th>
								<th className="w-8 px-3 py-2.5" />
							</tr>
						</thead>
						<tbody>
							{filtered.length === 0 ? (
								<tr>
									<td colSpan={7} className="py-12 text-center text-slate-400">
										<Translate text={localizationConstants.noDataFound} />
									</td>
								</tr>
							) : (
								filtered.map((tmpl) => (
									<tr
										key={tmpl.id}
										className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
									>
										<td className="px-3 py-3 text-center">
											<button
												type="button"
												onClick={() => toggleFavorite(tmpl.id)}
												aria-label={t(localizationConstants.kmaRiskTemplateFavoriteLabel)}
												className="cursor-pointer"
											>
												<Star
													className={cn(
														"h-4 w-4",
														favorites.has(tmpl.id)
															? "fill-amber-400 text-amber-400"
															: "text-slate-300",
													)}
												/>
											</button>
										</td>
										<td className="px-3 py-3 font-mono text-slate-500">{tmpl.templateNr}</td>
										<td className="px-3 py-3 font-medium text-slate-800">{tmpl.name}</td>
										<td className="px-3 py-3 text-slate-600">{tmpl.version}</td>
										<td className="px-3 py-3 text-slate-600">{tmpl.lastUpdate}</td>
										<td className="px-3 py-3 text-slate-600">{tmpl.createdBy}</td>
										<td className="relative px-3 py-3">
											<button
												type="button"
												onClick={() => setOpenMenuId(openMenuId === tmpl.id ? null : tmpl.id)}
												aria-label={t(localizationConstants.kmaRiskTemplateMenuLabel)}
												className="cursor-pointer text-slate-400 hover:text-slate-600"
											>
												<MoreVertical className="h-4 w-4" />
											</button>
											{openMenuId === tmpl.id && (
												<RowActionMenu
													onEdit={() => { onOpenTemplate(tmpl.id); setOpenMenuId(null); }}
													onDelete={() => { setDeleteConfirmId(tmpl.id); setOpenMenuId(null); }}
													onArchive={() => setOpenMenuId(null)}
													onClose={() => setOpenMenuId(null)}
												/>
											)}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
