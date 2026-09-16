"use client";

import { useState, Suspense } from "react";
import { notFound } from "next/navigation";
import {
	Archive,
	ArrowLeft,
	FileText,
	MoreVertical,
	Plus,
	Printer,
	Settings2,
	Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModuleTabs } from "@/components/layout/navigation";
import { RecordNavRow } from "@/components/layout/navigation/RecordNavRow";
import { SectionTabs } from "@/components/layout/navigation";
import { TabsContent } from "@/components/ui/tabs";
import { CollapsibleSection } from "@/components/common";
import localizationConstants from "@/utils/translation/constants";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { showToast } from "@/lib/toast";
import { DESIGN_MODULE_BASE_URL } from "../data/designNav.config";
import { getDesignProjektRecord } from "../projektinformation/data/designProjektInfo.mock";
import { designProjektTabs } from "../projektinformation/designProjektNavConfig";
import { DesignRecordTitle } from "../projektinformation/components/DesignRecordTitle";
import {
	DESIGN_BUDGET_BREAKDOWN,
	DESIGN_BUDGET_GROUPS,
} from "./data/designEkonomi.mock";
import type {
	DesignBudgetGroup,
	DesignBudgetItem,
	DesignBudgetSection,
	DesignEkonomiFormState,
} from "./types/designEkonomi";

// ---- View state ----

type EkonomiView =
	| { type: "list" }
	| { type: "create" }
	| { type: "view"; item: DesignBudgetItem };

// ---- Wizard step ----

type WizardStep = "projektInfo" | "buildBudget";

// ---- Form constants ----

const FORM_INITIAL: DesignEkonomiFormState = {
	projektnamn: "",
	projekteringsAnsvarig: "Katie Svensson",
	mallTyp: "byggMall",
	mallName: "",
};

const MOCK_USERS = ["Katie Svensson", "Stefan Eriksson", "Rachel Meyers"];

// ---- BudgetTableRow ----

interface BudgetTableRowProps {
	item: DesignBudgetItem;
	onView: (item: DesignBudgetItem) => void;
	onDelete: (id: string) => void;
}

function BudgetTableRow({ item, onView, onDelete }: BudgetTableRowProps) {
	const t = useTranslate();

	return (
		<tr className="border-b border-slate-200 last:border-0 hover:bg-slate-50">
			<td className="px-4 py-3 text-sm text-slate-700">{item.datum}</td>
			<td className="px-4 py-3 text-sm font-semibold text-slate-900">
				{item.benamning}
			</td>
			<td className="px-4 py-3 text-sm text-slate-700">{item.typ}</td>
			<td className="px-4 py-3 text-sm tabular-nums text-slate-700">
				{item.belopp.toLocaleString("sv-SE")}
			</td>
			<td className="px-4 py-3 text-sm text-slate-500">
				{item.pdfName ? (
					<span className="flex items-center gap-1 text-slate-600">
						<FileText className="h-4 w-4" />
						{item.pdfName}
					</span>
				) : (
					"—"
				)}
			</td>
			<td className="px-4 py-3">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => onView(item)}
					className="h-8 cursor-pointer rounded-md border-slate-200 text-xs text-slate-700 hover:bg-slate-50"
				>
					<Translate text={localizationConstants.designEkonomiVisaBudget} />
				</Button>
			</td>
			<td className="w-12 px-2 py-3 text-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-8 w-8 cursor-pointer text-slate-400 hover:text-slate-900"
						>
							<MoreVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-44">
						<DropdownMenuItem
							onClick={() => showToast("success", t(localizationConstants.designEkonomiOppna))}
							className="cursor-pointer"
						>
							<FileText className="mr-2 h-4 w-4" />
							<Translate text={localizationConstants.designEkonomiOppna} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => showToast("success", t(localizationConstants.designEkonomiArkivera))}
							className="cursor-pointer"
						>
							<Archive className="mr-2 h-4 w-4" />
							<Translate text={localizationConstants.designEkonomiArkivera} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onDelete(item.id)}
							className="cursor-pointer text-red-600 focus:text-red-600"
						>
							<Trash2 className="mr-2 h-4 w-4" />
							<Translate text={localizationConstants.projectListDeleteAction} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</td>
		</tr>
	);
}

// ---- BudgetGroupSection ----

interface BudgetGroupSectionProps {
	group: DesignBudgetGroup;
	onView: (item: DesignBudgetItem) => void;
	onDelete: (id: string) => void;
}

function BudgetGroupSection({
	group,
	onView,
	onDelete,
}: BudgetGroupSectionProps) {
	return (
		<CollapsibleSection
			title={group.name}
			icon={<Settings2 className="h-4 w-4 text-slate-400" />}
			defaultOpen
			className="rounded-md border border-slate-200 bg-white"
		>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50">
							<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.designTidsplanDatumLabel} />
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.designEkonomiBenamning} />
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.orderTypLabel} />
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.designEkonomiBelopp} />
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.designEkonomiPdf} />
							</th>
							<th className="px-4 py-3" />
							<th className="w-12 px-2 py-3" />
						</tr>
					</thead>
					<tbody>
						{group.items.map((item) => (
							<BudgetTableRow
								key={item.id}
								item={item}
								onView={onView}
								onDelete={onDelete}
							/>
						))}
					</tbody>
				</table>
			</div>
		</CollapsibleSection>
	);
}

// ---- EkonomiListContent ----

interface EkonomiListContentProps {
	groups: DesignBudgetGroup[];
	onCreate: () => void;
	onView: (item: DesignBudgetItem) => void;
	onDelete: (id: string) => void;
}

function EkonomiListContent({
	groups,
	onCreate,
	onView,
	onDelete,
}: EkonomiListContentProps) {
	const t = useTranslate();
	const allItems = groups.flatMap((g) => g.items);

	return (
		<div className="px-6 pt-4 pb-8">
			<Suspense fallback={null}>
				<SectionTabs
					items={[
						{
							id: "kalkyl",
							labelKey: localizationConstants.designEkonomiKalkylTab,
						},
						{
							id: "budget",
							labelKey: localizationConstants.designEkonomiBudgetTab,
						},
					]}
					ariaLabel={t(localizationConstants.designEkonomiTab)}
				>
					<TabsContent value="kalkyl" className="mt-4">
						<div className="flex flex-col gap-4">
							<div className="flex items-center justify-end gap-3">
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={() => window.print()}
									aria-label={t(localizationConstants.projectListPrint)}
									className="h-10 w-10 cursor-pointer rounded-md border-slate-200 text-slate-700 hover:bg-slate-50"
								>
									<Printer className="h-4 w-4" />
								</Button>
								<Button
									type="button"
									onClick={onCreate}
									className="h-10 cursor-pointer gap-2 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
								>
									<Plus className="h-4 w-4" />
									<Translate text={localizationConstants.designEkonomiLaggTillNy} />
								</Button>
							</div>
							<div className="rounded-md border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
								<Translate text={localizationConstants.designEkonomiEmpty} />
							</div>
						</div>
					</TabsContent>

					<TabsContent value="budget" className="mt-4">
						<div className="flex flex-col gap-4">
							<div className="flex items-center justify-end gap-3">
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={() => window.print()}
									aria-label={t(localizationConstants.projectListPrint)}
									className="h-10 w-10 cursor-pointer rounded-md border-slate-200 text-slate-700 hover:bg-slate-50"
								>
									<Printer className="h-4 w-4" />
								</Button>
								<Button
									type="button"
									onClick={onCreate}
									className="h-10 cursor-pointer gap-2 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
								>
									<Plus className="h-4 w-4" />
									<Translate text={localizationConstants.designEkonomiSkapaBudget} />
								</Button>
							</div>

							{allItems.length === 0 ? (
								<div className="rounded-md border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.designEkonomiEmpty} />
								</div>
							) : (
								<div className="flex flex-col gap-4">
									{groups.map((group) => (
										<BudgetGroupSection
											key={group.id}
											group={group}
											onView={onView}
											onDelete={onDelete}
										/>
									))}
								</div>
							)}
						</div>
					</TabsContent>
				</SectionTabs>
			</Suspense>
		</div>
	);
}

// ---- WizardProjektInfo ----

interface WizardProjektInfoProps {
	form: DesignEkonomiFormState;
	setField: (
		key: keyof DesignEkonomiFormState,
	) => (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => void;
	onNext: () => void;
	onCancel: () => void;
	projektnamn: string;
	bestellare: string;
}

function WizardProjektInfo({
	form,
	setField,
	onNext,
	onCancel,
	projektnamn,
	bestellare,
}: WizardProjektInfoProps) {
	const t = useTranslate();
	const inputCls =
		"h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-slate-400 focus:outline-none";
	const readonlyCls =
		"h-9 w-full rounded-md border border-slate-100 bg-slate-50 px-3 text-sm text-slate-500 cursor-not-allowed";
	const selectCls =
		"h-9 w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-slate-400 focus:outline-none";

	return (
		<div className="flex flex-col gap-6">
			<div className="rounded-md border border-slate-200 bg-white p-5">
				<div className="mb-4 text-sm font-medium text-slate-700">
					<Translate text={localizationConstants.designEkonomiProjektInfoTab} />
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div className="grid gap-1.5">
						<label className="text-sm font-medium text-slate-700">
							<Translate text={localizationConstants.designRegNewProjekteringNamn} />
						</label>
						<input
							type="text"
							className={readonlyCls}
							value={projektnamn}
							readOnly
						/>
					</div>
					<div className="grid gap-1.5">
						<label className="text-sm font-medium text-slate-700">
							<Translate text={localizationConstants.designEkonomiBestellare} />
						</label>
						<input
							type="text"
							className={readonlyCls}
							value={bestellare}
							readOnly
						/>
					</div>
					<div className="grid gap-1.5">
						<label className="text-sm font-medium text-slate-700">
							<Translate text={localizationConstants.designProjektAnsvarigSection} />
						</label>
						<select
							className={selectCls}
							value={form.projekteringsAnsvarig}
							onChange={setField("projekteringsAnsvarig")}
						>
							{MOCK_USERS.map((u) => (
								<option key={u} value={u}>
									{u}
								</option>
							))}
						</select>
					</div>
					<div className="grid gap-1.5">
						<label className="text-sm font-medium text-slate-700">
							<Translate text={localizationConstants.designEkonomiMall} />
						</label>
						<input
							type="text"
							className={inputCls}
							value={form.mallName}
							onChange={setField("mallName")}
							placeholder={t(localizationConstants.designEkonomiMall)}
						/>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-end gap-3">
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					className="cursor-pointer"
				>
					<Translate text={localizationConstants.cancel} />
				</Button>
				<Button
					type="button"
					onClick={onNext}
					className="cursor-pointer gap-2 bg-zinc-900 text-white hover:bg-zinc-800"
				>
					<Translate text={localizationConstants.designEkonomiBuildBudgetTab} />
				</Button>
			</div>
		</div>
	);
}

// ---- WizardBuildBudget ----

interface WizardBuildBudgetProps {
	form: DesignEkonomiFormState;
	setField: (
		key: keyof DesignEkonomiFormState,
	) => (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => void;
	onBack: () => void;
	onSave: () => void;
}

function WizardBuildBudget({
	form,
	setField,
	onBack,
	onSave,
}: WizardBuildBudgetProps) {
	const radioCls = "cursor-pointer accent-zinc-900";

	return (
		<div className="flex flex-col gap-6">
			<div className="rounded-md border border-slate-200 bg-white p-5">
				<div className="mb-4 text-sm font-medium text-slate-700">
					<Translate text={localizationConstants.designEkonomiBuildBudgetTab} />
				</div>
				<div className="flex flex-col gap-3">
					<label className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 p-3 hover:bg-slate-50">
						<input
							type="radio"
							name="mallTyp"
							value="byggMall"
							checked={form.mallTyp === "byggMall"}
							onChange={setField("mallTyp")}
							className={radioCls}
						/>
						<span className="text-sm text-slate-700">
							<Translate text={localizationConstants.designEkonomiByggMall} />
						</span>
					</label>
					<label className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 p-3 hover:bg-slate-50">
						<input
							type="radio"
							name="mallTyp"
							value="laddaUpp"
							checked={form.mallTyp === "laddaUpp"}
							onChange={setField("mallTyp")}
							className={radioCls}
						/>
						<span className="text-sm text-slate-700">
							<Translate text={localizationConstants.designEkonomiLaddaUpp} />
						</span>
					</label>
					<label className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 p-3 hover:bg-slate-50">
						<input
							type="radio"
							name="mallTyp"
							value="skapaNy"
							checked={form.mallTyp === "skapaNy"}
							onChange={setField("mallTyp")}
							className={radioCls}
						/>
						<span className="text-sm text-slate-700">
							<Translate text={localizationConstants.designEkonomiSkapaNy} />
						</span>
					</label>
					<label className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 p-3 hover:bg-slate-50">
						<input
							type="radio"
							name="mallTyp"
							value="valjMall"
							checked={form.mallTyp === "valjMall"}
							onChange={setField("mallTyp")}
							className={radioCls}
						/>
						<span className="text-sm text-slate-700">
							<Translate text={localizationConstants.designEkonomiValjMall} />
						</span>
					</label>
				</div>
			</div>

			<div className="flex items-center justify-end gap-3">
				<Button
					type="button"
					variant="outline"
					onClick={onBack}
					className="cursor-pointer"
				>
					<Translate text={localizationConstants.cancel} />
				</Button>
				<Button
					type="button"
					onClick={onSave}
					className="cursor-pointer gap-2 bg-zinc-900 text-white hover:bg-zinc-800"
				>
					<Translate text={localizationConstants.designEkonomiSkicka} />
				</Button>
			</div>
		</div>
	);
}

// ---- SkapaBudgetWizard ----

interface SkapaBudgetWizardProps {
	onBack: () => void;
	onSave: (item: DesignBudgetItem) => void;
	projektnamn: string;
	bestellare: string;
}

function SkapaBudgetWizard({
	onBack,
	onSave,
	projektnamn,
	bestellare,
}: SkapaBudgetWizardProps) {
	const t = useTranslate();
	const [step, setStep] = useState<WizardStep>("projektInfo");
	const [form, setForm] = useState<DesignEkonomiFormState>({ ...FORM_INITIAL });

	const setField =
		(key: keyof DesignEkonomiFormState) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
			setForm((prev) => ({ ...prev, [key]: e.target.value }));

	const handleSave = () => {
		const item: DesignBudgetItem = {
			id: `b${Date.now()}`,
			datum: new Date().toLocaleDateString("sv-SE"),
			benamning: t(localizationConstants.designEkonomiBudgetTab),
			typ: form.mallTyp,
			belopp: 0,
			pdfName: "",
			groupId: "g1",
		};
		onSave(item);
	};

	const steps: { id: WizardStep; labelKey: string }[] = [
		{
			id: "projektInfo",
			labelKey: localizationConstants.designEkonomiProjektInfoTab,
		},
		{
			id: "buildBudget",
			labelKey: localizationConstants.designEkonomiBuildBudgetTab,
		},
	];

	return (
		<div className="flex flex-col gap-6 px-6 pt-4 pb-8">
			<div className="flex items-center gap-2">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={onBack}
					className="h-8 w-8 cursor-pointer text-slate-600 hover:text-slate-900"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<h2 className="text-base font-semibold text-slate-900">
					<Translate text={localizationConstants.designEkonomiSkapaBudget} />
				</h2>
			</div>

			<div className="flex gap-6">
				<div className="flex-1">
					{step === "projektInfo" && (
						<WizardProjektInfo
							form={form}
							setField={setField}
							onNext={() => setStep("buildBudget")}
							onCancel={onBack}
							projektnamn={projektnamn}
							bestellare={bestellare}
						/>
					)}
					{step === "buildBudget" && (
						<WizardBuildBudget
							form={form}
							setField={setField}
							onBack={() => setStep("projektInfo")}
							onSave={handleSave}
						/>
					)}
				</div>

				<div className="hidden w-48 shrink-0 lg:block">
					<div className="rounded-md border border-slate-200 bg-white p-4">
						<p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
							Steps
						</p>
						<div className="flex flex-col gap-2">
							{steps.map((s, idx) => (
								<div
									key={s.id}
									className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
										step === s.id
											? "bg-zinc-900 font-medium text-white"
											: "text-slate-500"
									}`}
								>
									<span className="text-xs">{idx + 1}</span>
									<Translate text={s.labelKey as TranslationKeys} />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// ---- BudgetSectionView ----

interface BudgetSectionViewProps {
	section: DesignBudgetSection;
}

function BudgetSectionView({ section }: BudgetSectionViewProps) {
	const summa = section.rows.reduce(
		(acc, r) => acc + r.antal * r.aPris,
		0,
	);

	return (
		<div className="rounded-md border border-slate-200 bg-white overflow-hidden">
			<div className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-700">
				<Translate text={section.title as TranslationKeys} />
			</div>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-slate-200">
							<th className="px-4 py-2 text-left text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.designEkonomiBenamning} />
							</th>
							<th className="px-4 py-2 text-right text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.designEkonomiAntal} />
							</th>
							<th className="px-4 py-2 text-left text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.designEkonomiEnhet} />
							</th>
							<th className="px-4 py-2 text-right text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.designEkonomiAPris} />
							</th>
							<th className="px-4 py-2 text-right text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.designEkonomiDelsumma} />
							</th>
						</tr>
					</thead>
					<tbody>
						{section.rows.map((row) => (
							<tr
								key={row.id}
								className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
							>
								<td className="px-4 py-2.5 text-sm text-slate-700">
									{row.benamning}
								</td>
								<td className="px-4 py-2.5 text-right text-sm tabular-nums text-slate-700">
									{row.antal}
								</td>
								<td className="px-4 py-2.5 text-sm text-slate-500">
									{row.enhet}
								</td>
								<td className="px-4 py-2.5 text-right text-sm tabular-nums text-slate-700">
									{row.aPris.toLocaleString("sv-SE")}
								</td>
								<td className="px-4 py-2.5 text-right text-sm tabular-nums text-slate-700">
									{(row.antal * row.aPris).toLocaleString("sv-SE")}
								</td>
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr className="border-t border-slate-200 bg-slate-50">
							<td
								colSpan={4}
								className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-600"
							>
								<Translate text={localizationConstants.designEkonomiSumma} />
							</td>
							<td className="px-4 py-2.5 text-right text-sm font-semibold tabular-nums text-slate-900">
								{summa.toLocaleString("sv-SE")}
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	);
}

// ---- VisaBudgetContent ----

interface VisaBudgetContentProps {
	item: DesignBudgetItem;
	sections: DesignBudgetSection[];
	onBack: () => void;
}

function VisaBudgetContent({
	item,
	sections,
	onBack,
}: VisaBudgetContentProps) {
	const t = useTranslate();
	const totalSumma = sections.reduce(
		(acc, s) => acc + s.rows.reduce((a, r) => a + r.antal * r.aPris, 0),
		0,
	);

	return (
		<div className="flex flex-col gap-6 px-6 pt-4 pb-8">
			<div className="flex items-center gap-2">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={onBack}
					className="h-8 w-8 cursor-pointer text-slate-600 hover:text-slate-900"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<h2 className="text-base font-semibold text-slate-900">
					{item.benamning}
				</h2>
			</div>

			<div className="flex flex-col gap-4">
				{sections.map((section) => (
					<BudgetSectionView key={section.id} section={section} />
				))}
			</div>

			<div className="rounded-md border border-slate-200 bg-zinc-900 p-4">
				<div className="flex items-center justify-between">
					<span className="text-sm font-semibold uppercase tracking-wide text-white">
						<Translate text={localizationConstants.designEkonomiSumma} />
					</span>
					<span className="text-lg font-bold tabular-nums text-white">
						{totalSumma.toLocaleString("sv-SE")} kr
					</span>
				</div>
			</div>

			<div className="flex items-center justify-end gap-3">
				<Button
					type="button"
					variant="outline"
					onClick={onBack}
					className="cursor-pointer"
				>
					<Translate text={localizationConstants.cancel} />
				</Button>
				<Button
					type="button"
					onClick={() =>
						showToast("success", t(localizationConstants.designEkonomiForhandsgranskar))
					}
					variant="outline"
					className="cursor-pointer"
				>
					<Translate text={localizationConstants.designEkonomiForhandsgranskar} />
				</Button>
				<Button
					type="button"
					onClick={() =>
						showToast("success", t(localizationConstants.designEkonomiSkicka))
					}
					className="cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800"
				>
					<Translate text={localizationConstants.designEkonomiSkicka} />
				</Button>
			</div>
		</div>
	);
}

// ---- DesignEkonomiPage ----

export interface DesignEkonomiPageProps {
	projektId: string;
}

export function DesignEkonomiPage({ projektId }: DesignEkonomiPageProps) {
	const found = getDesignProjektRecord(projektId);
	const [view, setView] = useState<EkonomiView>({ type: "list" });
	const [groups, setGroups] = useState<DesignBudgetGroup[]>(DESIGN_BUDGET_GROUPS);

	if (!found) notFound();

	const handleCreate = () => setView({ type: "create" });
	const handleView = (item: DesignBudgetItem) =>
		setView({ type: "view", item });
	const handleDelete = (id: string) =>
		setGroups((prev) =>
			prev.map((g) => ({
				...g,
				items: g.items.filter((i) => i.id !== id),
			})),
		);
	const handleSave = (item: DesignBudgetItem) => {
		setGroups((prev) =>
			prev.map((g) =>
				g.id === item.groupId ? { ...g, items: [...g.items, item] } : g,
			),
		);
		setView({ type: "list" });
	};
	const handleBack = () => setView({ type: "list" });

	return (
		<div className="flex h-full flex-col">
			<div className="shrink-0 border-b border-slate-200 bg-white px-5">
				<RecordNavRow
					title={
						<DesignRecordTitle
							projektNr={found.projektNr}
							sectionKey={localizationConstants.designEkonomiTab}
						/>
					}
					backHref={`${DESIGN_MODULE_BASE_URL}/oversikt`}
				/>
				<div className="mt-3 -mb-px">
					<ModuleTabs items={designProjektTabs(projektId)} />
				</div>
			</div>

			<div className="flex-1 overflow-y-auto">
				{view.type === "list" && (
					<EkonomiListContent
						groups={groups}
						onCreate={handleCreate}
						onView={handleView}
						onDelete={handleDelete}
					/>
				)}
				{view.type === "create" && (
					<SkapaBudgetWizard
						onBack={handleBack}
						onSave={handleSave}
						projektnamn={found.projektering.projekteringNamn}
						bestellare={found.kunduppgifter.foretag}
					/>
				)}
				{view.type === "view" && (
					<VisaBudgetContent
						item={view.item}
						sections={DESIGN_BUDGET_BREAKDOWN}
						onBack={handleBack}
					/>
				)}
			</div>
		</div>
	);
}

export default DesignEkonomiPage;
