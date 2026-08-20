"use client";

import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

// ── Shared types ──────────────────────────────────────────────────────────────

export interface MailRecipient {
	id: string;
	name: string;
	role: string;
	email: string;
	notifyNewPlan: boolean;
	notifyUpdates: boolean;
	notifyNonConformity: boolean;
	notifyVerification: boolean;
}

export interface MailList {
	id: string;
	name: string;
	description: string;
	recipients: MailRecipient[];
}

export type NotifyField = "notifyNewPlan" | "notifyUpdates" | "notifyNonConformity" | "notifyVerification";

export const NOTIFY_COLS: { key: NotifyField; labelKey: string }[] = [
	{ key: "notifyNewPlan", labelKey: localizationConstants.kmaSandlistaColNewPlan },
	{ key: "notifyUpdates", labelKey: localizationConstants.kmaSandlistaColUpdates },
	{ key: "notifyNonConformity", labelKey: localizationConstants.kmaSandlistaColNonConformity },
	{ key: "notifyVerification", labelKey: localizationConstants.kmaSandlistaColVerification },
];

const emailSchema = z.string().email();

function isValidEmail(email: string): boolean {
	return emailSchema.safeParse(email).success;
}

// ── MailListPage ──────────────────────────────────────────────────────────────

export function MailListPage({
	list: initialList,
	onBack,
	onDelete,
}: {
	list: MailList;
	onBack: () => void;
	onDelete: (id: string) => void;
}) {
	const t = useTranslate();
	const [isEditMode, setIsEditMode] = useState(false);
	const [listName, setListName] = useState(initialList.name);
	const [listDesc, setListDesc] = useState(initialList.description);
	const [recipients, setRecipients] = useState<MailRecipient[]>(initialList.recipients);
	const [search, setSearch] = useState("");
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

	const filtered = recipients.filter(
		(r) =>
			search === "" ||
			r.name.toLowerCase().includes(search.toLowerCase()) ||
			r.email.toLowerCase().includes(search.toLowerCase()),
	);

	function toggleNotify(id: string, field: NotifyField) {
		setRecipients((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: !r[field] } : r)));
	}

	function removeRecipient(id: string) {
		setRecipients((prev) => prev.filter((r) => r.id !== id));
	}

	function addRecipient() {
		setRecipients((prev) => [
			...prev,
			{
				id: `temp_${crypto.randomUUID()}`,
				name: "",
				role: "",
				email: "",
				notifyNewPlan: false,
				notifyUpdates: false,
				notifyNonConformity: false,
				notifyVerification: false,
			},
		]);
	}

	function updateRecipient(id: string, field: "name" | "role" | "email", value: string) {
		setRecipients((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
	}

	function handleSave() {
		setIsEditMode(false);
	}

	function handleDelete() {
		onDelete(initialList.id);
		onBack();
	}

	function handleCancelEdit() {
		setIsEditMode(false);
		setListName(initialList.name);
		setListDesc(initialList.description);
		setRecipients(initialList.recipients);
	}

	return (
		<>
			{/* Delete confirmation modal */}
			{deleteConfirmOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
					<div className="w-96 max-w-full rounded-lg bg-white shadow-xl">
						<div className="border-b border-slate-200 px-6 py-4">
							<h2 className="text-base font-semibold text-slate-900">
								<Translate text={localizationConstants.kmaOpenSandlistaDeleteConfirmTitle} />
							</h2>
						</div>
						<div className="px-6 py-5">
							<p className="text-sm text-slate-600">
								<Translate text={localizationConstants.kmaOpenSandlistaDeleteConfirmMsg} />
							</p>
						</div>
						<div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4">
							<button
								type="button"
								onClick={() => setDeleteConfirmOpen(false)}
								className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
							>
								<Translate text={localizationConstants.cancel} />
							</button>
							<button
								type="button"
								onClick={handleDelete}
								className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
							>
								<Translate text={localizationConstants.actionDelete} />
							</button>
						</div>
					</div>
				</div>
			)}

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
						<div>
							<p className="text-xs text-slate-400">
								<Translate text={localizationConstants.kmaOpenSandlistaTitle} />
							</p>
							<h1 className="text-base font-semibold text-slate-900">{listName}</h1>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{isEditMode ? (
							<>
								<button
									type="button"
									onClick={handleCancelEdit}
									className="cursor-pointer rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
								>
									<Translate text={localizationConstants.cancel} />
								</button>
								<button
									type="button"
									onClick={handleSave}
									className="cursor-pointer rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
								>
									<Translate text={localizationConstants.save} />
								</button>
							</>
						) : (
							<>
								<button
									type="button"
									onClick={() => setIsEditMode(true)}
									className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
								>
									<Pencil className="h-3.5 w-3.5" />
									<Translate text={localizationConstants.actionEdit} />
								</button>
								<button
									type="button"
									onClick={() => setDeleteConfirmOpen(true)}
									className="flex cursor-pointer items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
								>
									<Trash2 className="h-3.5 w-3.5" />
									<Translate text={localizationConstants.actionDelete} />
								</button>
								<button
									type="button"
									onClick={onBack}
									className="cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
								>
									<Translate text={localizationConstants.kmaOpenSandlistaCloseBtn} />
								</button>
							</>
						)}
					</div>
				</div>

				{/* Body */}
				<div className="flex-1 overflow-y-auto">
					{/* General info */}
					<div className="border-b border-slate-200 px-6 py-5">
						<h2 className="mb-4 text-sm font-semibold text-slate-700">
							<Translate text={localizationConstants.kmaCreateSandlistaGeneralInfo} />
						</h2>
						<div className="flex max-w-lg flex-col gap-4">
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaCreateSandlistaNameLabel} />
								</label>
								{isEditMode ? (
									<input
										type="text"
										value={listName}
										onChange={(e) => setListName(e.target.value)}
										aria-label={t(localizationConstants.kmaCreateSandlistaNameLabel)}
										className="h-9 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
									/>
								) : (
									<p className="text-sm text-slate-800">{listName || "—"}</p>
								)}
							</div>
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-500">
									<Translate text={localizationConstants.kmaCreateSandlistaDescLabel} />
								</label>
								{isEditMode ? (
									<textarea
										value={listDesc}
										onChange={(e) => setListDesc(e.target.value)}
										aria-label={t(localizationConstants.kmaCreateSandlistaDescLabel)}
										rows={2}
										className="w-full resize-none rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
									/>
								) : (
									<p className="text-sm text-slate-600">{listDesc || "—"}</p>
								)}
							</div>
						</div>
					</div>

					{/* Recipients */}
					<div className="px-6 py-5">
						<div className="mb-3 flex items-center justify-between">
							<h2 className="text-sm font-semibold text-slate-700">
								<Translate text={localizationConstants.kmaSandlistaTitle} />
								{" "}
								<span className="ml-1 text-xs font-normal text-slate-400">({recipients.length})</span>
							</h2>
							{isEditMode && (
								<button
									type="button"
									onClick={addRecipient}
									className="flex cursor-pointer items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
								>
									<Plus className="h-3.5 w-3.5" />
									<Translate text={localizationConstants.kmaSandlistaAddBtn} />
								</button>
							)}
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

						{/* Table */}
						<div className="overflow-x-auto rounded border border-slate-200">
							<table className="w-full text-xs">
								<thead>
									<tr className="border-b border-slate-200 bg-slate-50">
										<th className="px-4 py-2.5 text-left font-medium text-slate-500">
											<Translate text={localizationConstants.kmaSandlistaColName} />
										</th>
										<th className="px-4 py-2.5 text-left font-medium text-slate-500">
											<Translate text={localizationConstants.kmaSandlistaColEmail} />
										</th>
										{NOTIFY_COLS.map((col) => (
											<th key={col.key} className="px-3 py-2.5 text-center font-medium text-slate-500">
												<Translate text={col.labelKey} />
											</th>
										))}
										{isEditMode && <th className="w-8 px-3 py-2.5" />}
									</tr>
								</thead>
								<tbody>
									{filtered.length === 0 ? (
										<tr>
											<td colSpan={7} className="px-4 py-8 text-center text-slate-400">
												<Translate text={localizationConstants.noDataFound} />
											</td>
										</tr>
									) : (
										filtered.map((r) => (
											<tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
												<td className="px-4 py-2.5 font-medium text-slate-800">
													{isEditMode ? (
														<input
															type="text"
															value={r.name}
															onChange={(e) => updateRecipient(r.id, "name", e.target.value)}
															aria-label={t(localizationConstants.kmaSandlistaColName)}
															className="h-7 w-full rounded border border-slate-200 px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
														/>
													) : (
														r.name || "—"
													)}
												</td>
												<td className="px-4 py-2.5 text-slate-600">
													{isEditMode ? (
														<input
															type="email"
															value={r.email}
															onChange={(e) => updateRecipient(r.id, "email", e.target.value)}
															aria-label={t(localizationConstants.kmaSandlistaColEmail)}
															className={cn(
																"h-7 w-full rounded border px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300",
																r.email.trim() && !isValidEmail(r.email.trim())
																	? "border-red-300"
																	: "border-slate-200",
															)}
														/>
													) : (
														r.email || "—"
													)}
												</td>
												{NOTIFY_COLS.map((col) => (
													<td key={col.key} className="px-3 py-2.5 text-center">
														<label htmlFor={`open-notify-${r.id}-${col.key}`} className="sr-only">
															<Translate text={col.labelKey} />
														</label>
														<input
															id={`open-notify-${r.id}-${col.key}`}
															type="checkbox"
															checked={r[col.key]}
															onChange={() => isEditMode && toggleNotify(r.id, col.key)}
															aria-label={t(col.labelKey)}
															disabled={!isEditMode}
															className={cn(
																"h-4 w-4 accent-slate-800",
																isEditMode ? "cursor-pointer" : "cursor-default opacity-80",
															)}
														/>
													</td>
												))}
												{isEditMode && (
													<td className="px-3 py-2.5">
														<button
															type="button"
															onClick={() => removeRecipient(r.id)}
															className="cursor-pointer text-slate-300 hover:text-red-500"
															aria-label="Remove recipient"
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
		</>
	);
}
