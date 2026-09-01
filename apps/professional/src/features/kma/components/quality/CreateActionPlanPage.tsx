"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

// ── CreateActionPlanPage ──────────────────────────────────────────────────────

type Priority = "low" | "medium" | "high";
type ActionStatus = "not_started" | "in_progress" | "completed";

export function CreateActionPlanPage({ onBack }: { onBack: () => void }) {
	const t = useTranslate();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [responsible, setResponsible] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [priority, setPriority] = useState<Priority>("medium");
	const [status, setStatus] = useState<ActionStatus>("not_started");
	const [errors, setErrors] = useState<{ title?: boolean; responsible?: boolean; dueDate?: boolean }>({});
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

	function handleSave() {
		if (isSaving) return;
		const newErrors: { title?: boolean; responsible?: boolean; dueDate?: boolean } = {};
		if (!title.trim()) newErrors.title = true;
		if (!responsible.trim()) newErrors.responsible = true;
		if (!dueDate) newErrors.dueDate = true;
		if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
		setErrors({});
		setIsSaving(true);
		// backend integration pending
	}

	function mark() { setIsDirty(true); }

	const inputCls = (err?: boolean) =>
		cn(
			"h-9 w-full rounded border bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-1",
			err ? "border-red-400 focus:ring-red-300" : "border-slate-200 focus:ring-slate-300",
		);

	const selectCls = "h-9 w-full cursor-pointer rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300";

	const PRIORITY_OPTIONS: { value: Priority; key: string }[] = [
		{ value: "low", key: localizationConstants.kmaActionPlanPriorityLow },
		{ value: "medium", key: localizationConstants.kmaActionPlanPriorityMedium },
		{ value: "high", key: localizationConstants.kmaActionPlanPriorityHigh },
	];

	const STATUS_OPTIONS: { value: ActionStatus; key: string }[] = [
		{ value: "not_started", key: localizationConstants.kmaActionPlanStatusNotStarted },
		{ value: "in_progress", key: localizationConstants.kmaActionPlanStatusInProgress },
		{ value: "completed", key: localizationConstants.kmaActionPlanStatusCompleted },
	];

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
							<Translate text={localizationConstants.kmaActionPlanCreateTitle} />
						</h1>
					</div>
					<p className="mt-0.5 pl-6 text-sm text-slate-400">
						<Translate text={localizationConstants.kmaQualityPlanAtgardsplaner} />
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

			{/* Body */}
			<div className="flex-1 overflow-y-auto px-6 py-6">
				<div className="mx-auto max-w-150 space-y-5">
					{/* Title */}
					<div>
						<label className="mb-1 block text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.kmaActionPlanFieldTitle} />
							<span className="ml-0.5 text-red-500">*</span>
						</label>
						<input
							type="text"
							value={title}
							onChange={(e) => { setTitle(e.target.value); mark(); if (e.target.value.trim()) setErrors((p) => ({ ...p, title: false })); }}
							aria-invalid={!!errors.title}
							className={inputCls(errors.title)}
						/>
						{errors.title && (
							<p className="mt-1 text-xs text-red-500">
								<Translate text={localizationConstants.kmaControlPlanValidationName} />
							</p>
						)}
					</div>

					{/* Description */}
					<div>
						<label className="mb-1 block text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.kmaActionPlanFieldDesc} />
						</label>
						<textarea
							value={description}
							onChange={(e) => { setDescription(e.target.value); mark(); }}
							rows={4}
							className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300 resize-none"
						/>
					</div>

					{/* Responsible + Due Date */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaActionPlanFieldResponsible} />
								<span className="ml-0.5 text-red-500">*</span>
							</label>
							<input
								type="text"
								value={responsible}
								onChange={(e) => { setResponsible(e.target.value); mark(); if (e.target.value.trim()) setErrors((p) => ({ ...p, responsible: false })); }}
								aria-invalid={!!errors.responsible}
								className={inputCls(errors.responsible)}
							/>
							{errors.responsible && (
								<p className="mt-1 text-xs text-red-500">
									<Translate text={localizationConstants.kmaControlPlanValidationName} />
								</p>
							)}
						</div>
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaActionPlanFieldDueDate} />
								<span className="ml-0.5 text-red-500">*</span>
							</label>
							<input
								type="date"
								value={dueDate}
								onChange={(e) => { setDueDate(e.target.value); mark(); if (e.target.value) setErrors((p) => ({ ...p, dueDate: false })); }}
								aria-invalid={!!errors.dueDate}
								className={inputCls(errors.dueDate)}
							/>
							{errors.dueDate && (
								<p className="mt-1 text-xs text-red-500">
									<Translate text={localizationConstants.kmaControlPlanValidationName} />
								</p>
							)}
						</div>
					</div>

					{/* Priority + Status */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaActionPlanFieldPriority} />
							</label>
							<select
								value={priority}
								onChange={(e) => { setPriority(e.target.value as Priority); mark(); }}
								className={selectCls}
							>
								{PRIORITY_OPTIONS.map((o) => (
									<option key={o.value} value={o.value}>
										{t(o.key)}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaActionPlanFieldStatus} />
							</label>
							<select
								value={status}
								onChange={(e) => { setStatus(e.target.value as ActionStatus); mark(); }}
								className={selectCls}
							>
								{STATUS_OPTIONS.map((o) => (
									<option key={o.value} value={o.value}>
										{t(o.key)}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
