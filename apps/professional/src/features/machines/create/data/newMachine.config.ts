import type { FormSelectOption } from "@/components/form";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { createElement } from "react";
import type { MachineDocumentItem } from "../types/newMachine.types";

/** Machine number is assigned by the backend; shown read-only while mocked. */
export const NEXT_MACHINE_NO = "M1001";

const option = (value: string, labelKey: string): FormSelectOption => ({
	value,
	label: createElement(Translate, { text: labelKey }),
	searchLabel: value,
});

/** Same three categories the machine list renders as pills. */
export const CATEGORY_OPTIONS: FormSelectOption[] = [
	option("hand_tool", localizationConstants.machineCategoryHandTool),
	option("establishment", localizationConstants.machineCategoryEstablishment),
	option("concrete", localizationConstants.machineCategoryConcrete),
];

/** Billing units, matching the "Enhet" column of the machine list. */
export const UNIT_OPTIONS: FormSelectOption[] = [
	option("hour", localizationConstants.machineUnitHour),
	option("day", localizationConstants.machineUnitDay),
	option("week", localizationConstants.machineUnitWeek),
	option("month", localizationConstants.machineUnitMonth),
];

/**
 * Placements a machine can be booked to. Mocked until the locations endpoint
 * exists; the design shows the warehouse option selected.
 */
export const LOCATION_OPTIONS: FormSelectOption[] = [
	{ value: "Lager", label: "Lager" },
	{ value: "Servicebil 1", label: "Servicebil 1" },
	{ value: "Service bil 3", label: "Service bil 3" },
	{ value: "P2025-001", label: "P2025-001" },
	{ value: "P2025-002", label: "P2025-002" },
];

/** Rows shown in the two document tables in the design. */
export const MOCK_MACHINE_DOCUMENTS: MachineDocumentItem[] = [
	{
		id: "spec-1",
		date: "2024-05-10",
		name: "filename.pdf",
		fileType: "pdf",
		kind: "specification",
	},
	{
		id: "spec-2",
		date: "2024-05-10",
		name: "filename.pdf",
		fileType: "pdf",
		kind: "specification",
	},
	{
		id: "eco-1",
		date: "2024-05-10",
		name: "filename.pdf",
		fileType: "pdf",
		kind: "economy",
	},
	{
		id: "eco-2",
		date: "2024-05-10",
		name: "filename.pdf",
		fileType: "pdf",
		kind: "economy",
	},
];

export const ACCEPTED_UPLOAD_TYPES = ".png,.jpg,.jpeg,.pdf";
