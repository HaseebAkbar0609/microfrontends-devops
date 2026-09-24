"use client";

import { useState, Suspense } from "react";
import { notFound } from "next/navigation";
import {
	ArrowLeft,
	ArrowRight,
	Clock,
	Info,
	MoreVertical,
	Plus,
	Printer,
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
import localizationConstants from "@/utils/translation/constants";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { showToast } from "@/lib/toast";
import { DESIGN_MODULE_BASE_URL } from "../data/designNav.config";
import { getDesignProjektRecord } from "../projektinformation/data/designProjektInfo.mock";
import { designProjektTabs } from "../projektinformation/designProjektNavConfig";
import { DesignRecordTitle } from "../projektinformation/components/DesignRecordTitle";
import DesignProjectsGantt from "../oversikt/DesignProjectsGantt";
import { DESIGN_TIDSPLAN_ITEMS } from "./data/designTidsplan.mock";
import type { DesignTidsplanFormState, DesignTidsplanItem } from "./types/designTidsplan";

// ---- View state ----

type TidsplanView =
	| { type: "list" }
	| { type: "create" }
	| { type: "view"; item: DesignTidsplanItem };

// ---- Form constants ----

const FORM_INITIAL: DesignTidsplanFormState = {
	tidsplanType: localizationConstants.designTidsplanHuvudtidsplan,
	typ: "Standard",
	startDatum: "",
	slutDatum: "",
	orderNr: "",
	kund: "",
	skapadAv: "Katie Svensson",
	skapadDatum: "",
	revideradDatum: "",
	beskrivning: "",
};

const MOCK_USERS = ["Katie Svensson", "Stefan Eriksson", "Rachel Meyers"];

// ---- TidsplanFormField ----

interface TidsplanFormFieldProps {
	label: string;
	children: React.ReactNode;
	wide?: boolean;
}

function TidsplanFormField({ label, children, wide }: TidsplanFormFieldProps) {
	return (
		<div className={wide ? "sm:col-span-2 grid gap-1.5" : "grid gap-1.5"}>
			<label className="text-sm font-medium text-slate-700">{label}</label>
			{children}
		</div>
	);
}

// ---- TidsplanRow ----

interface TidsplanRowProps {
	item: DesignTidsplanItem;
	onView: (item: DesignTidsplanItem) => void;
	onDelete: (id: string) => void;
}

function TidsplanRow({ item, onView, onDelete }: TidsplanRowProps) {
	return (
		<tr className="border-b border-slate-200 last:border-0 hover:bg-slate-50">
			<td className="px-4 py-3 text-sm text-slate-700">{item.datum}</td>
			<td className="px-4 py-3 text-sm font-semibold text-slate-900">
				<Translate text={item.tidsplanType as TranslationKeys} />
			</td>
			<td className="px-4 py-3 text-sm text-slate-700">{item.skapadAv}</td>
			<td className="px-4 py-3">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => onView(item)}
					className="h-8 cursor-pointer rounded-md border-slate-200 text-xs text-slate-700 hover:bg-slate-50"
				>
					<Translate text={localizationConstants.designTidsplanViewBtn} />
				</Button>
			</td>
			<td className="w-12 px-2 py-3" />
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
					<DropdownMenuContent align="end" className="w-40">
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

// ---- TidsplanListContent ----

interface TidsplanListContentProps {
	items: DesignTidsplanItem[];
	onCreate: () => void;
	onView: (item: DesignTidsplanItem) => void;
	onDelete: (id: string) => void;
}

function TidsplanListContent({
	items,
	onCreate,
	onView,
	onDelete,
}: TidsplanListContentProps) {
	const t = useTranslate();

	return (
		<div className="px-6 pt-4 pb-8">
			<Suspense fallback={null}>
				<SectionTabs
					items={[
						{
							id: "projekterings",
							labelKey: localizationConstants.designTidsplanTabProjektering,
						},
						{
							id: "produktions",
							labelKey: localizationConstants.designTidsplanTabProduktion,
						},
					]}
					ariaLabel={t(localizationConstants.projectSectionTidsplan)}
				>
					<TabsContent value="projekterings" className="mt-4">
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
									<Translate text={localizationConstants.designTidsplanSkapaBtn} />
								</Button>
							</div>

							{items.length === 0 ? (
								<div className="rounded-md border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.designTidsplanEmpty} />
								</div>
							) : (
								<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
									<table className="w-full">
										<thead>
											<tr className="border-b border-slate-200 bg-slate-50">
												<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
													<Translate
														text={localizationConstants.designTidsplanDatumLabel}
													/>
												</th>
												<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
													<Translate
														text={localizationConstants.projectSectionTidsplan}
													/>
												</th>
												<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
													<Translate text={localizationConstants.lblSkapadAv} />
												</th>
												<th className="px-4 py-3" />
												<th className="w-12 px-2 py-3 text-center">
													<Plus className="mx-auto h-4 w-4 text-slate-300" />
												</th>
												<th className="w-12 px-2 py-3" />
											</tr>
										</thead>
										<tbody>
											{items.map((item) => (
												<TidsplanRow
													key={item.id}
													item={item}
													onView={onView}
													onDelete={onDelete}
												/>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>
					</TabsContent>

					<TabsContent value="produktions" className="mt-4">
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
									<Translate text={localizationConstants.designTidsplanSkapaBtn} />
								</Button>
							</div>
							<div className="rounded-md border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
								<Translate text={localizationConstants.designTidsplanEmpty} />
							</div>
						</div>
					</TabsContent>
				</SectionTabs>
			</Suspense>
		</div>
	);
}

// ---- TidsplanCreateContent ----

interface TidsplanCreateContentProps {
	onBack: () => void;
	onSave: (item: DesignTidsplanItem) => void;
	onSaveAndView: (item: DesignTidsplanItem) => void;
}

function TidsplanCreateContent({
	onBack,
	onSave,
	onSaveAndView,
}: TidsplanCreateContentProps) {
	const t = useTranslate();
	const [form, setForm] = useState<DesignTidsplanFormState>({ ...FORM_INITIAL });

	const setField =
		(key: keyof DesignTidsplanFormState) =>
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
			>,
		) =>
			setForm((prev) => ({ ...prev, [key]: e.target.value }));

	const buildItem = (): DesignTidsplanItem => ({
		id: `t${Date.now()}`,
		datum: new Date().toLocaleDateString("sv-SE").replaceAll("-", "/"),
		tidsplanType: form.tidsplanType,
		typ: form.typ,
		startDatum: form.startDatum,
		slutDatum: form.slutDatum,
		orderNr: form.orderNr,
		kund: form.kund,
		skapadAv: form.skapadAv,
		skapadDatum: form.skapadDatum,
		revideradDatum: form.revideradDatum,
		beskrivning: form.beskrivning,
		title: t(localizationConstants.projectSectionTidsplan),
	});

	const inputCls =
		"h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-slate-400 focus:outline-none";
	const selectCls =
		"h-9 w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-slate-400 focus:outline-none";

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
					<Translate text={localizationConstants.designTidsplanSkapaBtn} />
				</h2>
			</div>

			{/* Section 1: Tidsplan */}
			<div className="rounded-md border border-slate-200 bg-white p-5">
				<div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-700">
					<Clock className="h-4 w-4 text-slate-400" />
					<Translate text={localizationConstants.projectSectionTidsplan} />
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<TidsplanFormField label={t(localizationConstants.projectSectionTidsplan)}>
						<select
							className={selectCls}
							value={form.tidsplanType}
							onChange={setField("tidsplanType")}
						>
							<option value={localizationConstants.designTidsplanHuvudtidsplan}>
								{t(localizationConstants.designTidsplanHuvudtidsplan)}
							</option>
							<option value={localizationConstants.designTidsplanDeltidsplan}>
								{t(localizationConstants.designTidsplanDeltidsplan)}
							</option>
						</select>
					</TidsplanFormField>
					<TidsplanFormField label={t(localizationConstants.orderTypLabel)}>
						<select
							className={selectCls}
							value={form.typ}
							onChange={setField("typ")}
						>
							<option value="Standard">Standard</option>
						</select>
					</TidsplanFormField>
					<TidsplanFormField label={t(localizationConstants.orderStartDatumLabel)}>
						<input
							type="date"
							className={inputCls}
							value={form.startDatum}
							onChange={setField("startDatum")}
						/>
					</TidsplanFormField>
					<TidsplanFormField label={t(localizationConstants.orderSlutDatumLabel)}>
						<input
							type="date"
							className={inputCls}
							value={form.slutDatum}
							onChange={setField("slutDatum")}
						/>
					</TidsplanFormField>
				</div>
			</div>

			{/* Section 2: Other information */}
			<div className="rounded-md border border-slate-200 bg-white p-5">
				<div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-700">
					<Info className="h-4 w-4 text-slate-400" />
					<Translate text={localizationConstants.designTidsplanOtherInfoSection} />
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<TidsplanFormField label={t(localizationConstants.designTidsplanOrderNr)}>
						<input
							type="text"
							className={inputCls}
							value={form.orderNr}
							onChange={setField("orderNr")}
							placeholder="OR000001"
						/>
					</TidsplanFormField>
					<TidsplanFormField label={t(localizationConstants.orderKundLabel)}>
						<input
							type="text"
							className={inputCls}
							value={form.kund}
							onChange={setField("kund")}
							placeholder="Company AB"
						/>
					</TidsplanFormField>
					<TidsplanFormField
						label={t(localizationConstants.lblSkapadAv)}
						wide
					>
						<select
							className={selectCls}
							value={form.skapadAv}
							onChange={setField("skapadAv")}
						>
							{MOCK_USERS.map((u) => (
								<option key={u} value={u}>
									{u}
								</option>
							))}
						</select>
					</TidsplanFormField>
					<TidsplanFormField label={t(localizationConstants.designTidsplanDatumLabel)}>
						<input
							type="date"
							className={inputCls}
							value={form.skapadDatum}
							onChange={setField("skapadDatum")}
						/>
					</TidsplanFormField>
					<TidsplanFormField label={t(localizationConstants.designTidsplanRevDatum)}>
						<input
							type="date"
							className={inputCls}
							value={form.revideradDatum}
							onChange={setField("revideradDatum")}
						/>
					</TidsplanFormField>
					<TidsplanFormField
						label={t(localizationConstants.calcQABeskrivning)}
						wide
					>
						<textarea
							className="min-h-20 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
							value={form.beskrivning}
							onChange={setField("beskrivning")}
							placeholder={t(localizationConstants.calcQABeskrivning)}
						/>
					</TidsplanFormField>
				</div>
			</div>

			{/* Footer */}
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
					variant="outline"
					onClick={() => onSave(buildItem())}
					className="cursor-pointer"
				>
					<Translate text={localizationConstants.save} />
				</Button>
				<Button
					type="button"
					onClick={() => onSaveAndView(buildItem())}
					className="cursor-pointer gap-2 bg-zinc-900 text-white hover:bg-zinc-800"
				>
					<Translate text={localizationConstants.projectSectionTidsplan} />
					<ArrowRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}

// ---- TidsplanGanttContent ----

interface TidsplanGanttContentProps {
	item: DesignTidsplanItem;
	onBack: () => void;
}

function TidsplanGanttContent({ item, onBack }: TidsplanGanttContentProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-col gap-4 px-6 pt-4 pb-8">
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
					<Translate text={localizationConstants.designTidsplanViewBtn} />
				</h2>
			</div>

			<p className="text-sm font-medium text-slate-700">{item.title}</p>

			<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
				<DesignProjectsGantt />
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
						showToast("success", t(localizationConstants.save))
					}
					className="cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800"
				>
					<Translate text={localizationConstants.save} />
				</Button>
			</div>
		</div>
	);
}

// ---- DesignTidsplanPage ----

export interface DesignTidsplanPageProps {
	projektId: string;
}

export function DesignTidsplanPage({ projektId }: DesignTidsplanPageProps) {
	const found = getDesignProjektRecord(projektId);
	const [view, setView] = useState<TidsplanView>({ type: "list" });
	const [items, setItems] = useState<DesignTidsplanItem[]>(DESIGN_TIDSPLAN_ITEMS);

	if (!found) notFound();

	const handleCreate = () => setView({ type: "create" });
	const handleView = (item: DesignTidsplanItem) => setView({ type: "view", item });
	const handleDelete = (id: string) =>
		setItems((prev) => prev.filter((i) => i.id !== id));
	const handleSave = (item: DesignTidsplanItem) => {
		setItems((prev) => [...prev, item]);
		setView({ type: "list" });
	};
	const handleSaveAndView = (item: DesignTidsplanItem) => {
		setItems((prev) => [...prev, item]);
		setView({ type: "view", item });
	};
	const handleBack = () => setView({ type: "list" });

	return (
		<div className="flex h-full flex-col">
			<div className="shrink-0 border-b border-slate-200 bg-white px-5">
				<RecordNavRow
					title={
						<DesignRecordTitle
							projektNr={found.projektNr}
							sectionKey={localizationConstants.projectSectionTidsplan}
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
					<TidsplanListContent
						items={items}
						onCreate={handleCreate}
						onView={handleView}
						onDelete={handleDelete}
					/>
				)}
				{view.type === "create" && (
					<TidsplanCreateContent
						onBack={handleBack}
						onSave={handleSave}
						onSaveAndView={handleSaveAndView}
					/>
				)}
				{view.type === "view" && (
					<TidsplanGanttContent item={view.item} onBack={handleBack} />
				)}
			</div>
		</div>
	);
}

export default DesignTidsplanPage;
