"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { MACHINE_HANDLING_BASE_URL } from "../data/handlingNav.config";
import { machineHandlingRepository } from "../data/machineHandlingRepository";
import type {
	MachineListDetail,
	MachineListRow,
} from "../types/machineHandling.types";
import { MachineListInformationStep } from "./components/MachineListInformationStep";
import { MachineSectionList } from "./components/MachineSectionList";
import {
	emptySectionRow,
	INITIAL_EXTERNAL_SECTIONS,
	INITIAL_OWN_SECTIONS,
	LINKABLE_OBJECTS,
	RESPONSIBLE_PEOPLE,
} from "./data/newMachineList.mock";
import type {
	LinkableObject,
	LinkableObjectType,
	MachineSection,
} from "./types/newMachineList.types";

type WizardTab = "information" | "own" | "external";

const TABS: { key: WizardTab; labelKey: TranslationKeys }[] = [
	{
		key: "information",
		labelKey: localizationConstants.machineCreateTabInformation,
	},
	{ key: "own", labelKey: localizationConstants.machineListTabOwn },
	{ key: "external", labelKey: localizationConstants.machineListTabExternal },
];

const TOTAL_STEPS = TABS.length;

/**
 * "Lagg till ny maskinlista" (TFS-807) — creates the machine list that
 * Maskinhantering lists. Step 1 links an order, project or service vehicle and
 * inherits its details; steps 2 and 3 build up the company's own and hired-in
 * machine sections.
 */
export function NewMachineListPage() {
	const t = useTranslate();
	const router = useRouter();

	const [activeTab, setActiveTab] = useState<WizardTab>("information");
	const [objectType, setObjectType] = useState<LinkableObjectType>("order");
	const [selectedObjectId, setSelectedObjectId] = useState("");
	const [linkedObject, setLinkedObject] = useState<LinkableObject | null>(null);
	const [responsible, setResponsible] = useState("");
	const [ownSections, setOwnSections] =
		useState<MachineSection[]>(INITIAL_OWN_SECTIONS);
	const [externalSections, setExternalSections] = useState<MachineSection[]>(
		INITIAL_EXTERNAL_SECTIONS
	);

	const currentStep = TABS.findIndex((tab) => tab.key === activeTab) + 1;
	const progress = (currentStep / TOTAL_STEPS) * 100;

	const contact = useMemo(
		() => RESPONSIBLE_PEOPLE.find((person) => person.value === responsible),
		[responsible]
	);

	/** Changing the object type invalidates a selection made under the old one. */
	const handleObjectTypeChange = (type: LinkableObjectType) => {
		setObjectType(type);
		setSelectedObjectId("");
	};

	const handleLink = () => {
		const found = LINKABLE_OBJECTS.find((obj) => obj.id === selectedObjectId);
		if (!found) {
			showToast("error", t(localizationConstants.machineListPickObject));
			return;
		}
		setLinkedObject(found);
		showToast("success", t(localizationConstants.machineListLinked));
	};

	const sectionsFor = (tab: WizardTab) =>
		tab === "external" ? externalSections : ownSections;

	const addSection = useCallback((tab: WizardTab) => {
		const setter = tab === "external" ? setExternalSections : setOwnSections;
		setter((prev) => [
			...prev,
			{
				id: `${tab}-section-${prev.length + 1}-${Date.now()}`,
				title: `Sektion ${prev.length + 1}`,
				rows: [],
				...(tab === "external"
					? {
							supplier: {
								companyName: "",
								companyAddress: "",
								startDate: "",
								endDate: "",
							},
						}
					: {}),
			},
		]);
	}, []);

	const deleteSection = useCallback((tab: WizardTab, sectionId: string) => {
		const setter = tab === "external" ? setExternalSections : setOwnSections;
		setter((prev) => prev.filter((section) => section.id !== sectionId));
	}, []);

	const addRow = useCallback((tab: WizardTab, sectionId: string) => {
		const setter = tab === "external" ? setExternalSections : setOwnSections;
		setter((prev) =>
			prev.map((section) =>
				section.id === sectionId
					? {
							...section,
							rows: [
								...section.rows,
								emptySectionRow(
									`${sectionId}-row-${section.rows.length + 1}-${Date.now()}`,
									tab === "external"
								),
							],
						}
					: section
			)
		);
	}, []);

	const deleteRow = useCallback(
		(tab: WizardTab, sectionId: string, rowId: string) => {
			const setter = tab === "external" ? setExternalSections : setOwnSections;
			setter((prev) =>
				prev.map((section) =>
					section.id === sectionId
						? { ...section, rows: section.rows.filter((row) => row.id !== rowId) }
						: section
				)
			);
		},
		[]
	);

	/** An object must be linked before the list can move on or be saved. */
	const requireLinkedObject = () => {
		if (!linkedObject) {
			showToast("error", t(localizationConstants.machineListLinkRequired));
			setActiveTab("information");
			return false;
		}
		return true;
	};

	const handleTabClick = (tab: WizardTab) => {
		if (tab !== "information" && !requireLinkedObject()) return;
		setActiveTab(tab);
	};

	const handleNext = () => {
		if (!requireLinkedObject()) return;
		setActiveTab("own");
	};

	const handleSave = () => {
		if (!requireLinkedObject() || !linkedObject) return;
		const newId = `list-${Date.now()}`;
		const row: MachineListRow = {
			id: newId,
			object: linkedObject.objectNo,
			label: linkedObject.objectName,
			customer: "Kunde",
			startDate: linkedObject.startDate || "2026-01-01",
			endDate: linkedObject.endDate || "2026-12-31",
			status: "active",
		};
		const detail: MachineListDetail = {
			id: newId,
			projectNo: linkedObject.objectNo,
			projectName: linkedObject.objectName,
			projectAddress: linkedObject.address || "Storgatan 1",
			postalCode: linkedObject.postalCode || "111 22",
			city: linkedObject.city || "Stockholm",
			startDate: linkedObject.startDate || "2026-01-01",
			endDate: linkedObject.endDate || "2026-12-31",
			responsibleName: contact?.label || "Kalle Andersson",
			responsibleEmail: contact?.email || "kalle@byggbolaget.se",
			responsiblePhone: contact?.phone || "070-000 00 00",
			totalCost: "0",
			internalCost: "0",
			externalCost: "0",
			internalGroups: ownSections.map((sec) => ({
				id: sec.id,
				titleKey: localizationConstants.machineCategoryEstablishment,
				rows: sec.rows.map((r, idx) => ({
					id: `sec-row-${idx}-${Date.now()}`,
					machineNo: r.machineNo,
					name: r.name,
					rate: r.rate,
					deliveryDate: r.fromDate || "2026-01-01",
					returnDate: r.returnDate || "2026-12-31",
					days: r.days || 30,
					cost: r.cost || "0",
					status: "active" as const,
				})),
			})),
			externalGroups: externalSections.map((sec) => ({
				id: sec.id,
				titleKey: localizationConstants.machineCategoryEstablishment,
				rows: sec.rows.map((r, idx) => ({
					id: `sec-ext-${idx}-${Date.now()}`,
					machineNo: r.machineNo,
					name: r.name,
					supplier: r.supplier || "Extern Leverantör",
					rate: r.rate,
					deliveryDate: r.fromDate || "2026-01-01",
					returnDate: r.returnDate || "2026-12-31",
					days: r.days || 30,
					cost: r.cost || "0",
					status: "active" as const,
				})),
			})),
		};

		machineHandlingRepository.createList(row, detail);
		showToast("success", t(localizationConstants.machineListSaved));
		router.push(MACHINE_HANDLING_BASE_URL);
	};

	return (
		<div className="flex h-full flex-col overflow-hidden bg-slate-50">
			<div className="flex-1 overflow-y-auto px-4 py-4">
				<div className="mb-3 flex items-center gap-2">
					<button
						type="button"
						aria-label={t(localizationConstants.backButton)}
						onClick={() => router.push(MACHINE_HANDLING_BASE_URL)}
						className="cursor-pointer rounded-md p-1.5 text-slate-700 hover:bg-slate-100"
					>
						<ArrowLeft className="h-5 w-5" />
					</button>
					<h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
						<Translate text={localizationConstants.machineListCreateTitle} />
					</h1>
				</div>

				<div className="mb-4 ml-9 overflow-x-auto border-b border-slate-200">
					<div className="flex gap-6">
						{TABS.map((tab) => (
							<button
								key={tab.key}
								type="button"
								onClick={() => handleTabClick(tab.key)}
								className={cn(
									"cursor-pointer border-b-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors",
									activeTab === tab.key
										? "border-slate-900 text-slate-900"
										: "border-transparent text-slate-500 hover:text-slate-700"
								)}
							>
								<Translate text={tab.labelKey} />
							</button>
						))}
					</div>
				</div>

				<div className="ml-9 flex flex-col items-start gap-6 xl:flex-row">
					<div className="w-full flex-1 overflow-hidden">
						{activeTab === "information" && (
							<MachineListInformationStep
								objectType={objectType}
								onObjectTypeChange={handleObjectTypeChange}
								selectedObjectId={selectedObjectId}
								onSelectedObjectChange={setSelectedObjectId}
								linkedObject={linkedObject}
								onLink={handleLink}
								responsible={responsible}
								onResponsibleChange={setResponsible}
								email={contact?.email ?? ""}
								phone={contact?.phone ?? ""}
							/>
						)}

						{activeTab !== "information" && (
							<MachineSectionList
								variant={activeTab === "external" ? "external" : "own"}
								sections={sectionsFor(activeTab)}
								onAddSection={() => addSection(activeTab)}
								onDeleteSection={(sectionId) =>
									deleteSection(activeTab, sectionId)
								}
								onAddRow={(sectionId) => addRow(activeTab, sectionId)}
								onDeleteRow={(sectionId, rowId) =>
									deleteRow(activeTab, sectionId, rowId)
								}
							/>
						)}
					</div>

					<div className="w-full shrink-0 xl:w-72">
						<div className="sticky top-6 rounded-lg border border-slate-200 bg-white p-4">
							<p className="mb-2 text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.stepLabel} />{" "}
								{currentStep}/{TOTAL_STEPS}
							</p>
							<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
								<div
									className="h-full bg-[#111721] transition-all duration-300"
									style={{ width: `${progress}%` }}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="sticky bottom-0 border-t border-slate-200 bg-white pt-4">
				<div className="flex flex-wrap items-center justify-end gap-3 px-4 pb-4">
					<Button
						type="button"
						variant="ghost"
						onClick={() => router.push(MACHINE_HANDLING_BASE_URL)}
						className="h-9 min-w-25 cursor-pointer border border-slate-300 bg-transparent px-5 text-sm text-slate-700 shadow-none hover:bg-slate-100 hover:text-slate-900"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>

					<Button
						type="button"
						onClick={handleSave}
						className="h-9 min-w-25 cursor-pointer gap-2 bg-[#111721] text-sm text-white hover:bg-slate-800"
					>
						<Translate text={localizationConstants.saveButton} />
						<Save className="h-4 w-4" />
					</Button>

					{/* The design only puts Nasta on the Information tab; the other two
					    are reached through the tab row. */}
					{activeTab === "information" && (
						<Button
							type="button"
							onClick={handleNext}
							className="h-9 min-w-25 cursor-pointer gap-2 bg-[#111721] text-sm text-white hover:bg-slate-800"
						>
							<Translate text={localizationConstants.nextButton} />
							<ArrowRight className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

export default NewMachineListPage;
