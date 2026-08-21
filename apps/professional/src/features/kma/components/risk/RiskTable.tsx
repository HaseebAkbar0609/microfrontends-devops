"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CategoryPanel } from "../shared/CategoryPanel";

// ── Types ─────────────────────────────────────────────────────────────────────

export type RiskStatus = "identified" | "mitigated" | "closed";

export interface RiskEntry {
	id: string;
	categoryId: string;
	hazard: string;
	consequence: string;
	probability: number;
	severity: number;
	mitigation: string;
	responsible: string;
	status: RiskStatus;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_RISK_CATS: { id: string; label: string; count: number }[] = [
	{ id: "riskinventering", label: "Riskinventering / Riskanalys", count: 12 },
	{ id: "riskbedomning", label: "Riskbedömning och åtgärder", count: 8 },
	{ id: "installation", label: "Installation", count: 5 },
	{ id: "badrum", label: "Badrum", count: 8 },
];

const DEFAULT_CAT_ID = MOCK_RISK_CATS[0]?.id ?? "";

const MOCK_RISKS: RiskEntry[] = [
	{ id: "R001", categoryId: "riskinventering", hazard: "Fall från höjd vid takarbete", consequence: "Allvarlig skada eller dödsfall", probability: 3, severity: 5, mitigation: "Säkerhetsnät, fallskyddsutrustning obligatorisk", responsible: "Lars Andersson", status: "identified" },
	{ id: "R002", categoryId: "riskinventering", hazard: "Elolycka vid installation", consequence: "Elchock, brännskador", probability: 2, severity: 4, mitigation: "Spänningslöst arbete, behörig elektriker", responsible: "Anna Svensson", status: "mitigated" },
	{ id: "R003", categoryId: "riskbedomning", hazard: "Damm från rivningsarbete", consequence: "Luftvägsproblem", probability: 4, severity: 2, mitigation: "Andningsskydd, ventilation", responsible: "Erik Lindqvist", status: "identified" },
	{ id: "R004", categoryId: "installation", hazard: "Tunga lyft utan lyftutrustning", consequence: "Ryggskada, muskelskada", probability: 3, severity: 3, mitigation: "Lyfthjälpmedel, instruktioner", responsible: "Lars Andersson", status: "closed" },
	{ id: "R005", categoryId: "badrum", hazard: "Fuktskada vid vattentätning", consequence: "Mögel, konstruktionsskada", probability: 2, severity: 4, mitigation: "Certifierad tätskiktsmontör, kontrollplan", responsible: "Anna Svensson", status: "mitigated" },
	{ id: "R006", categoryId: "riskinventering", hazard: "Fordonskollision på arbetsplatsen", consequence: "Personskada, materiell skada", probability: 2, severity: 5, mitigation: "Avspärrning, trafikplan", responsible: "Lars Andersson", status: "identified" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function riskLevel(r: number): "low" | "medium" | "high" {
	if (r <= 4) return "low";
	if (r <= 14) return "medium";
	return "high";
}

function RiskLevelBadge({ s, k, t }: { s: number; k: number; t: (key: string) => string }) {
	const r = s * k;
	const level = riskLevel(r);
	const cls =
		level === "low"
			? "bg-emerald-100 text-emerald-700"
			: level === "medium"
				? "bg-amber-100 text-amber-700"
				: "bg-red-100 text-red-700";
	const labelKey =
		level === "low"
			? localizationConstants.kmaRiskLevelLow
			: level === "medium"
				? localizationConstants.kmaRiskLevelMedium
				: localizationConstants.kmaRiskLevelHigh;
	return (
		<span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", cls)}>
			{r} — {t(labelKey)}
		</span>
	);
}

// ── AddRiskModal ──────────────────────────────────────────────────────────────

function AddRiskModal({
	categoryId,
	onClose,
	onSave,
}: {
	categoryId: string;
	onClose: () => void;
	onSave: (entry: RiskEntry) => void;
}) {
	const t = useTranslate();
	const [hazard, setHazard] = useState("");
	const [consequence, setConsequence] = useState("");
	const [probability, setProbability] = useState(1);
	const [severity, setSeverity] = useState(1);
	const [mitigation, setMitigation] = useState("");
	const [responsible, setResponsible] = useState("");
	const [status, setStatus] = useState<RiskStatus>("identified");
	const [isSaving, setIsSaving] = useState(false);
	const [nameError, setNameError] = useState(false);

	function handleSave() {
		if (isSaving) return;
		if (!hazard.trim()) { setNameError(true); return; }
		setIsSaving(true);
		onSave({
			id: `temp_${crypto.randomUUID()}`,
			categoryId,
			hazard,
			consequence,
			probability,
			severity,
			mitigation,
			responsible,
			status,
		});
		onClose();
	}

	const r = probability * severity;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
				<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
					<h2 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.kmaRiskModalTitle} />
					</h2>
					<button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
						<X className="h-4 w-4" />
					</button>
				</div>
				<div className="flex flex-col gap-3 px-6 py-4">
					<div>
						<label className="mb-1 block text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.kmaRiskHazardCol} />
							{" "}<span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							value={hazard}
							onChange={(e) => { setHazard(e.target.value); setNameError(false); }}
							aria-label={t(localizationConstants.kmaRiskHazardCol)}
							className={cn(
								"h-9 w-full rounded border bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300",
								nameError ? "border-red-400" : "border-slate-200",
							)}
						/>
						{nameError && (
							<p className="mt-1 text-xs text-red-500">
								<Translate text={localizationConstants.kmaControlPlanValidationName} />
							</p>
						)}
					</div>
					<div>
						<label className="mb-1 block text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.kmaRiskConsequenceCol} />
						</label>
						<input
							type="text"
							value={consequence}
							onChange={(e) => setConsequence(e.target.value)}
							aria-label={t(localizationConstants.kmaRiskConsequenceCol)}
							className="h-9 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
						/>
					</div>
					<div className="grid grid-cols-3 gap-3">
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaRiskProbabilityCol} />
							</label>
							<input
								type="number"
								min={1}
								max={5}
								value={probability}
								onChange={(e) => setProbability(Math.min(5, Math.max(1, Number(e.target.value))))}
								aria-label={t(localizationConstants.kmaRiskProbabilityCol)}
								className="h-9 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
							/>
						</div>
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaRiskSeverityCol} />
							</label>
							<input
								type="number"
								min={1}
								max={5}
								value={severity}
								onChange={(e) => setSeverity(Math.min(5, Math.max(1, Number(e.target.value))))}
								aria-label={t(localizationConstants.kmaRiskSeverityCol)}
								className="h-9 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
							/>
						</div>
						<div className="flex flex-col justify-end pb-1">
							<RiskLevelBadge s={probability} k={severity} t={t} />
							<span className="mt-0.5 text-center text-xs text-slate-400">R = {r}</span>
						</div>
					</div>
					<div>
						<label className="mb-1 block text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.kmaRiskMitigationCol} />
						</label>
						<textarea
							value={mitigation}
							onChange={(e) => setMitigation(e.target.value)}
							aria-label={t(localizationConstants.kmaRiskMitigationCol)}
							rows={2}
							className="w-full resize-none rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
						/>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaRiskResponsibleCol} />
							</label>
							<input
								type="text"
								value={responsible}
								onChange={(e) => setResponsible(e.target.value)}
								aria-label={t(localizationConstants.kmaRiskResponsibleCol)}
								className="h-9 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
							/>
						</div>
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.kmaRiskStatusCol} />
							</label>
							<select
								value={status}
								onChange={(e) => setStatus(e.target.value as RiskStatus)}
								aria-label={t(localizationConstants.kmaRiskStatusCol)}
								className="h-9 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
							>
								<option value="identified">{t(localizationConstants.kmaRiskStatusIdentified)}</option>
								<option value="mitigated">{t(localizationConstants.kmaRiskStatusMitigated)}</option>
								<option value="closed">{t(localizationConstants.kmaRiskStatusClosed)}</option>
							</select>
						</div>
					</div>
				</div>
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
						onClick={handleSave}
						disabled={isSaving}
						className="cursor-pointer rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
					>
						<Translate text={localizationConstants.save} />
					</button>
				</div>
			</div>
		</div>
	);
}

// ── RiskTable ─────────────────────────────────────────────────────────────────

export function RiskTable() {
	const t = useTranslate();
	const [risks, setRisks] = useState<RiskEntry[]>(MOCK_RISKS);
	const [selectedCatId, setSelectedCatId] = useState<string>(DEFAULT_CAT_ID);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<RiskStatus | "all">("all");
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);

	const filtered = useMemo(() => risks.filter((r) => {
		if (r.categoryId !== selectedCatId) return false;
		if (statusFilter !== "all" && r.status !== statusFilter) return false;
		if (search) {
			const q = search.toLowerCase();
			return (
				r.hazard.toLowerCase().includes(q) ||
				r.consequence.toLowerCase().includes(q) ||
				r.responsible.toLowerCase().includes(q) ||
				r.mitigation.toLowerCase().includes(q)
			);
		}
		return true;
	}), [risks, selectedCatId, search, statusFilter]);

	function updateRisk(id: string, patch: Partial<RiskEntry>) {
		setRisks((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
	}

	function deleteRisk(id: string) {
		setRisks((prev) => prev.filter((r) => r.id !== id));
		setDeleteId(null);
	}

	function addRisk(entry: RiskEntry) {
		setRisks((prev) => [...prev, entry]);
	}

	const selectedCat = MOCK_RISK_CATS.find((c) => c.id === selectedCatId);

	return (
		<div className="flex flex-1 overflow-hidden">
			{addModalOpen && (
				<AddRiskModal
					categoryId={selectedCatId}
					onClose={() => setAddModalOpen(false)}
					onSave={addRisk}
				/>
			)}
			{deleteId && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
					<div className="w-80 rounded-lg bg-white shadow-xl">
						<div className="px-6 py-5">
							<p className="text-sm font-medium text-slate-800">
								<Translate text={localizationConstants.kmaOpenSandlistaDeleteConfirmTitle} />
							</p>
							<p className="mt-1 text-xs text-slate-500">
								<Translate text={localizationConstants.kmaOpenSandlistaDeleteConfirmMsg} />
							</p>
						</div>
						<div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4">
							<button
								type="button"
								onClick={() => setDeleteId(null)}
								className="cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
							>
								<Translate text={localizationConstants.cancel} />
							</button>
							<button
								type="button"
								onClick={() => deleteRisk(deleteId)}
								className="cursor-pointer rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
							>
								<Translate text={localizationConstants.actionDelete} />
							</button>
						</div>
					</div>
				</div>
			)}

			<CategoryPanel
				headerKey={localizationConstants.kmaRiskMainCat}
				items={MOCK_RISK_CATS}
				selectedId={selectedCatId}
				onSelect={setSelectedCatId}
				searchKey={localizationConstants.kmaQualitySearchCategories}
			/>

			<div className="flex flex-1 flex-col overflow-hidden border-l border-slate-200">
				<div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
					<h3 className="text-sm font-semibold text-slate-800">{selectedCat?.label ?? ""}</h3>
					<button
						type="button"
						onClick={() => setAddModalOpen(true)}
						className="flex cursor-pointer items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
					>
						<Plus className="h-3.5 w-3.5" />
						<Translate text={localizationConstants.kmaRiskAddBtn} />
					</button>
				</div>
				<div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2">
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
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value as RiskStatus | "all")}
						aria-label={t(localizationConstants.kmaRiskStatusCol)}
						className="h-8 rounded border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
					>
						<option value="all">{t(localizationConstants.kmaRiskStatusCol)}: Alla</option>
						<option value="identified">{t(localizationConstants.kmaRiskStatusIdentified)}</option>
						<option value="mitigated">{t(localizationConstants.kmaRiskStatusMitigated)}</option>
						<option value="closed">{t(localizationConstants.kmaRiskStatusClosed)}</option>
					</select>
				</div>
				<div className="flex-1 overflow-auto">
					<table className="w-full text-xs">
						<thead>
							<tr className="border-b border-slate-200 bg-slate-50">
								<th className="min-w-44 px-3 py-2.5 text-left font-medium text-slate-500">
									<Translate text={localizationConstants.kmaRiskHazardCol} />
								</th>
								<th className="min-w-36 px-3 py-2.5 text-left font-medium text-slate-500">
									<Translate text={localizationConstants.kmaRiskConsequenceCol} />
								</th>
								<th className="w-14 px-3 py-2.5 text-center font-medium text-slate-500">S</th>
								<th className="w-14 px-3 py-2.5 text-center font-medium text-slate-500">K</th>
								<th className="w-28 px-3 py-2.5 text-left font-medium text-slate-500">
									<Translate text={localizationConstants.kmaRiskLevelCol} />
								</th>
								<th className="min-w-44 px-3 py-2.5 text-left font-medium text-slate-500">
									<Translate text={localizationConstants.kmaRiskMitigationCol} />
								</th>
								<th className="min-w-28 px-3 py-2.5 text-left font-medium text-slate-500">
									<Translate text={localizationConstants.kmaRiskResponsibleCol} />
								</th>
								<th className="w-28 px-3 py-2.5 text-left font-medium text-slate-500">
									<Translate text={localizationConstants.kmaRiskStatusCol} />
								</th>
								<th className="w-8 px-2 py-2.5" />
							</tr>
						</thead>
						<tbody>
							{filtered.length === 0 ? (
								<tr>
									<td colSpan={9} className="py-12 text-center text-slate-400">
										<Translate text={localizationConstants.noDataFound} />
									</td>
								</tr>
							) : (
								filtered.map((entry) => (
									<tr key={entry.id} className="group border-b border-slate-100 last:border-0 hover:bg-slate-50">
										<td className="px-2 py-1.5">
											<input
												type="text"
												value={entry.hazard}
												onChange={(e) => updateRisk(entry.id, { hazard: e.target.value })}
												aria-label={t(localizationConstants.kmaRiskHazardCol)}
												className="w-full rounded border border-transparent px-2 py-1 text-slate-800 focus:border-slate-300 focus:outline-none"
											/>
										</td>
										<td className="px-2 py-1.5">
											<input
												type="text"
												value={entry.consequence}
												onChange={(e) => updateRisk(entry.id, { consequence: e.target.value })}
												aria-label={t(localizationConstants.kmaRiskConsequenceCol)}
												className="w-full rounded border border-transparent px-2 py-1 text-slate-700 focus:border-slate-300 focus:outline-none"
											/>
										</td>
										<td className="px-2 py-1.5 text-center">
											<input
												type="number"
												min={1}
												max={5}
												value={entry.probability}
												onChange={(e) => updateRisk(entry.id, { probability: Math.min(5, Math.max(1, Number(e.target.value))) })}
												aria-label={t(localizationConstants.kmaRiskProbabilityCol)}
												className="w-10 rounded border border-transparent px-1 py-1 text-center text-slate-700 focus:border-slate-300 focus:outline-none"
											/>
										</td>
										<td className="px-2 py-1.5 text-center">
											<input
												type="number"
												min={1}
												max={5}
												value={entry.severity}
												onChange={(e) => updateRisk(entry.id, { severity: Math.min(5, Math.max(1, Number(e.target.value))) })}
												aria-label={t(localizationConstants.kmaRiskSeverityCol)}
												className="w-10 rounded border border-transparent px-1 py-1 text-center text-slate-700 focus:border-slate-300 focus:outline-none"
											/>
										</td>
										<td className="px-3 py-1.5">
											<RiskLevelBadge s={entry.probability} k={entry.severity} t={t} />
										</td>
										<td className="px-2 py-1.5">
											<input
												type="text"
												value={entry.mitigation}
												onChange={(e) => updateRisk(entry.id, { mitigation: e.target.value })}
												aria-label={t(localizationConstants.kmaRiskMitigationCol)}
												className="w-full rounded border border-transparent px-2 py-1 text-slate-700 focus:border-slate-300 focus:outline-none"
											/>
										</td>
										<td className="px-2 py-1.5">
											<input
												type="text"
												value={entry.responsible}
												onChange={(e) => updateRisk(entry.id, { responsible: e.target.value })}
												aria-label={t(localizationConstants.kmaRiskResponsibleCol)}
												className="w-full rounded border border-transparent px-2 py-1 text-slate-700 focus:border-slate-300 focus:outline-none"
											/>
										</td>
										<td className="px-3 py-1.5">
											<select
												value={entry.status}
												onChange={(e) => updateRisk(entry.id, { status: e.target.value as RiskStatus })}
												aria-label={t(localizationConstants.kmaRiskStatusCol)}
												className="w-full cursor-pointer rounded border border-transparent bg-transparent text-xs focus:border-slate-200 focus:outline-none"
											>
												<option value="identified">{t(localizationConstants.kmaRiskStatusIdentified)}</option>
												<option value="mitigated">{t(localizationConstants.kmaRiskStatusMitigated)}</option>
												<option value="closed">{t(localizationConstants.kmaRiskStatusClosed)}</option>
											</select>
										</td>
										<td className="px-2 py-1.5">
											<button
												type="button"
												onClick={() => setDeleteId(entry.id)}
												className="cursor-pointer text-slate-300 opacity-0 hover:text-red-500 group-hover:opacity-100"
												aria-label="Delete risk"
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
	);
}
