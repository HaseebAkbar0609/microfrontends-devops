"use client";

import { useState, Suspense } from "react";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	InfoField,
	InfoFieldGrid,
} from "@/features/purchase/components/shared/InfoFieldGrid";
import { ModuleTabs } from "@/components/layout/navigation";
import { RecordNavRow } from "@/components/layout/navigation/RecordNavRow";
import { SectionTabs } from "@/components/layout/navigation";
import { TabsContent } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	DESIGN_MODULE_BASE_URL,
} from "../data/designNav.config";
import {
	DESIGN_ORG_MEMBERS,
	getDesignProjektRecord,
} from "./data/designProjektInfo.mock";
import { designProjektTabs } from "./designProjektNavConfig";
import { DesignRecordTitle } from "./components/DesignRecordTitle";
import { DesignOrgTab } from "./DesignOrgTab";
import type {
	DesignInfoSectionKey,
	DesignKunduppgifterInfo,
	DesignProjektAnsvarigInfo,
	DesignProjekteringDetailsInfo,
	DesignProjekteringInfo,
	DesignProjektRecord,
} from "./types/designProjektInfo";

interface EditFieldProps {
	label: string;
	value: string;
	onChange: (v: string) => void;
}

function EditField({ label, value, onChange }: EditFieldProps) {
	return (
		<div className="grid gap-1.5">
			<label className="text-sm font-medium text-slate-900">{label}</label>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus-visible:border-slate-400 focus-visible:outline-none"
			/>
		</div>
	);
}

interface SectionEditDialogProps<TSection> {
	open: boolean;
	titleKey: (typeof localizationConstants)[keyof typeof localizationConstants];
	fields: { label: string; key: keyof TSection }[];
	value: TSection;
	onSave: (next: TSection) => void;
	onClose: () => void;
}

function SectionEditDialog<TSection extends { [K in keyof TSection]: string }>({
	open,
	titleKey,
	fields,
	value,
	onSave,
	onClose,
}: SectionEditDialogProps<TSection>) {
	const [draft, setDraft] = useState<TSection>({ ...value });

	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			setDraft({ ...value });
			onClose();
		}
	};

	const handleSave = () => {
		onSave(draft);
		onClose();
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>
						<Translate text={titleKey} />
					</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-2">
					{fields.map(({ label, key }) => (
						<EditField
							key={String(key)}
							label={label}
							value={draft[key] ?? ""}
							onChange={(v) =>
								setDraft((prev) => ({ ...prev, [key]: v } as TSection))
							}
						/>
					))}
				</div>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						className="cursor-pointer"
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						type="button"
						onClick={handleSave}
						className="cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800"
					>
						<Translate text={localizationConstants.save} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export interface DesignProjektinformationPageProps {
	projektId: string;
}

const EMPTY_RECORD: DesignProjektRecord = {
	projektId: "",
	projektNr: "",
	kunduppgifter: {
		foretag: "",
		address: "",
		postNr: "",
		ort: "",
		mail: "",
		telefon: "",
		orgNr: "",
	},
	projektAnsvarig: {
		fornamn: "",
		efternamn: "",
		mail: "",
		mobil: "",
		roll: "",
	},
	projektering: {
		projekteringNr: "",
		projekteringNamn: "",
		kvarteraNamn: "",
		projekteringAdress: "",
		postNr: "",
		ort: "",
	},
	projekteringInfo: {
		typ: "",
		kategori: "",
		avdelning: "",
		startDatum: "",
		slutDatum: "",
	},
};

export function DesignProjektinformationPage({
	projektId,
}: DesignProjektinformationPageProps) {
	const t = useTranslate();
	const found = getDesignProjektRecord(projektId);
	const [record, setRecord] = useState<DesignProjektRecord>(
		found ?? EMPTY_RECORD,
	);
	const [editing, setEditing] = useState<DesignInfoSectionKey | null>(null);

	if (!found) notFound();

	const kunduppgifterFields: {
		label: string;
		key: keyof DesignKunduppgifterInfo;
	}[] = [
		{ label: t(localizationConstants.orderKundLabel), key: "foretag" },
		{ label: t(localizationConstants.agreementAddress), key: "address" },
		{ label: t(localizationConstants.orderPostNrLabel), key: "postNr" },
		{ label: t(localizationConstants.orderCityLabel), key: "ort" },
		{ label: t(localizationConstants.orderMailLabel), key: "mail" },
		{ label: t(localizationConstants.orderTelefonLabel), key: "telefon" },
		{ label: t(localizationConstants.orderOrgPersonNrLabel), key: "orgNr" },
	];

	const projektAnsvarigFields: {
		label: string;
		key: keyof DesignProjektAnsvarigInfo;
	}[] = [
		{ label: t(localizationConstants.orderFornamLabel), key: "fornamn" },
		{ label: t(localizationConstants.orderEfternamnLabel), key: "efternamn" },
		{ label: t(localizationConstants.orderMailLabel), key: "mail" },
		{ label: t(localizationConstants.orderMobilLabel), key: "mobil" },
		{ label: t(localizationConstants.orderRollLabel), key: "roll" },
	];

	const projekteringFields: {
		label: string;
		key: keyof DesignProjekteringInfo;
	}[] = [
		{
			label: t(localizationConstants.designRegNewProjekteringNr),
			key: "projekteringNr",
		},
		{
			label: t(localizationConstants.designRegNewProjekteringNamn),
			key: "projekteringNamn",
		},
		{
			label: t(localizationConstants.designRegNewKvarteraNamn),
			key: "kvarteraNamn",
		},
		{
			label: t(localizationConstants.designRegNewProjekteringAdress),
			key: "projekteringAdress",
		},
		{ label: t(localizationConstants.orderPostNrLabel), key: "postNr" },
		{ label: t(localizationConstants.orderCityLabel), key: "ort" },
	];

	const projekteringInfoFields: {
		label: string;
		key: keyof DesignProjekteringDetailsInfo;
	}[] = [
		{ label: t(localizationConstants.orderTypLabel), key: "typ" },
		{ label: t(localizationConstants.orderKategoriLabel), key: "kategori" },
		{ label: t(localizationConstants.orderAvdelningLabel), key: "avdelning" },
		{
			label: t(localizationConstants.orderStartDatumLabel),
			key: "startDatum",
		},
		{ label: t(localizationConstants.orderSlutDatumLabel), key: "slutDatum" },
	];

	const editButton = (section: DesignInfoSectionKey) => (
		<Button
			type="button"
			variant="outline"
			size="icon"
			onClick={() => setEditing(section)}
			aria-label={t(localizationConstants.actionEdit)}
			className="h-8 w-8 cursor-pointer rounded-md border-slate-200 text-slate-700 hover:bg-slate-50"
		>
			<Pencil className="h-3.5 w-3.5" />
		</Button>
	);

	return (
		<div className="flex h-full flex-col">
			<div className="shrink-0 border-b border-slate-200 bg-white px-5">
				<RecordNavRow
					title={
						<DesignRecordTitle
							projektNr={record.projektNr}
							sectionKey={localizationConstants.agreementProjectInfo}
						/>
					}
					backHref={`${DESIGN_MODULE_BASE_URL}/oversikt`}
				/>
				<div className="mt-3 -mb-px">
					<ModuleTabs items={designProjektTabs(projektId)} />
				</div>
			</div>

			<div className="flex-1 overflow-y-auto px-6 pt-4 pb-8">
				<Suspense fallback={null}>
					<SectionTabs
						items={[
							{
								id: "projektuppgifter",
								labelKey:
									localizationConstants.designInfoTabProjektuppgifter,
							},
							{
								id: "organisation",
								labelKey: localizationConstants.orderOrganisationTab,
							},
						]}
						ariaLabel={t(localizationConstants.agreementProjectInfo)}
					>
						<TabsContent value="projektuppgifter" className="mt-4">
							<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
								<InfoFieldGrid
									titleKey={localizationConstants.orderKunduppgifterSection}
									columns={2}
									action={editButton("kunduppgifter")}
								>
									<InfoField
										labelKey={localizationConstants.orderKundLabel}
										value={record.kunduppgifter.foretag}
									/>
									<InfoField
										labelKey={localizationConstants.agreementAddress}
										value={record.kunduppgifter.address}
									/>
									<InfoField
										labelKey={localizationConstants.orderPostNrLabel}
										value={record.kunduppgifter.postNr}
									/>
									<InfoField
										labelKey={localizationConstants.orderCityLabel}
										value={record.kunduppgifter.ort}
									/>
									<InfoField
										labelKey={localizationConstants.orderMailLabel}
										value={record.kunduppgifter.mail}
									/>
									<InfoField
										labelKey={localizationConstants.orderTelefonLabel}
										value={record.kunduppgifter.telefon}
									/>
									<InfoField
										labelKey={localizationConstants.orderOrgPersonNrLabel}
										value={record.kunduppgifter.orgNr}
									/>
								</InfoFieldGrid>

								<InfoFieldGrid
									titleKey={
										localizationConstants.designProjektAnsvarigSection
									}
									columns={2}
									action={editButton("projektAnsvarig")}
								>
									<InfoField
										labelKey={localizationConstants.orderFornamLabel}
										value={record.projektAnsvarig.fornamn}
									/>
									<InfoField
										labelKey={localizationConstants.orderEfternamnLabel}
										value={record.projektAnsvarig.efternamn}
									/>
									<InfoField
										labelKey={localizationConstants.orderMailLabel}
										value={record.projektAnsvarig.mail}
									/>
									<InfoField
										labelKey={localizationConstants.orderMobilLabel}
										value={record.projektAnsvarig.mobil}
									/>
									<InfoField
										labelKey={localizationConstants.orderRollLabel}
										value={record.projektAnsvarig.roll}
									/>
								</InfoFieldGrid>

								<InfoFieldGrid
									titleKey={localizationConstants.designRegNewProjektering}
									columns={2}
									action={editButton("projektering")}
								>
									<InfoField
										labelKey={localizationConstants.designRegNewProjekteringNr}
										value={record.projektering.projekteringNr}
									/>
									<InfoField
										labelKey={
											localizationConstants.designRegNewProjekteringNamn
										}
										value={record.projektering.projekteringNamn}
									/>
									<InfoField
										labelKey={localizationConstants.designRegNewKvarteraNamn}
										value={record.projektering.kvarteraNamn}
									/>
									<InfoField
										labelKey={
											localizationConstants.designRegNewProjekteringAdress
										}
										value={record.projektering.projekteringAdress}
									/>
									<InfoField
										labelKey={localizationConstants.orderPostNrLabel}
										value={record.projektering.postNr}
									/>
									<InfoField
										labelKey={localizationConstants.orderCityLabel}
										value={record.projektering.ort}
									/>
								</InfoFieldGrid>

								<InfoFieldGrid
									titleKey={localizationConstants.designRegNewProjekteringInfo}
									columns={2}
									action={editButton("projekteringInfo")}
								>
									<InfoField
										labelKey={localizationConstants.orderTypLabel}
										value={record.projekteringInfo.typ}
									/>
									<InfoField
										labelKey={localizationConstants.orderKategoriLabel}
										value={record.projekteringInfo.kategori}
									/>
									<InfoField
										labelKey={localizationConstants.orderAvdelningLabel}
										value={record.projekteringInfo.avdelning}
									/>
									<InfoField
										labelKey={localizationConstants.orderStartDatumLabel}
										value={record.projekteringInfo.startDatum}
									/>
									<InfoField
										labelKey={localizationConstants.orderSlutDatumLabel}
										value={record.projekteringInfo.slutDatum}
									/>
								</InfoFieldGrid>
							</div>
						</TabsContent>

						<TabsContent value="organisation" className="mt-4">
							<DesignOrgTab initialMembers={DESIGN_ORG_MEMBERS} />
						</TabsContent>
					</SectionTabs>
				</Suspense>
			</div>

			<SectionEditDialog
				open={editing === "kunduppgifter"}
				titleKey={localizationConstants.orderKunduppgifterSection}
				fields={kunduppgifterFields}
				value={record.kunduppgifter}
				onSave={(next) =>
					setRecord((r) => ({ ...r, kunduppgifter: next }))
				}
				onClose={() => setEditing(null)}
			/>

			<SectionEditDialog
				open={editing === "projektAnsvarig"}
				titleKey={localizationConstants.designProjektAnsvarigSection}
				fields={projektAnsvarigFields}
				value={record.projektAnsvarig}
				onSave={(next) =>
					setRecord((r) => ({ ...r, projektAnsvarig: next }))
				}
				onClose={() => setEditing(null)}
			/>

			<SectionEditDialog
				open={editing === "projektering"}
				titleKey={localizationConstants.designRegNewProjektering}
				fields={projekteringFields}
				value={record.projektering}
				onSave={(next) =>
					setRecord((r) => ({ ...r, projektering: next }))
				}
				onClose={() => setEditing(null)}
			/>

			<SectionEditDialog
				open={editing === "projekteringInfo"}
				titleKey={localizationConstants.designRegNewProjekteringInfo}
				fields={projekteringInfoFields}
				value={record.projekteringInfo}
				onSave={(next) =>
					setRecord((r) => ({ ...r, projekteringInfo: next }))
				}
				onClose={() => setEditing(null)}
			/>
		</div>
	);
}

export default DesignProjektinformationPage;
