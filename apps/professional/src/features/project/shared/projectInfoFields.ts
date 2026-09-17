import type { CustomerDetails } from "@/lib/validation/contactSchema";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type {
	ProjectContactPerson,
	ProjectDetailsData,
} from "../create/types";
import {
	DEPARTMENT_OPTIONS,
	PROJECT_CATEGORY_OPTIONS,
	PROJECT_TYPE_OPTIONS,
	ROLE_OPTIONS,
} from "../create/data/projectCreate.config";

/** The contact block as the record and the wizard's summary both hold it. */
export type ProjectContactDetails = Omit<ProjectContactPerson, "id">;

/**
 * How a field is entered when its card is edited. The read view ignores this
 * and prints the value.
 */
export type ProjectInfoFieldKind = "text" | "phone" | "select" | "date";

export interface ProjectInfoField<TSection> {
	name: keyof TSection & string;
	labelKey: TranslationKeys;
	kind: ProjectInfoFieldKind;
	/** For `"select"`. */
	options?: readonly string[];
	/**
	 * Shown on the card but absent from the edit dialog.
	 *
	 * Kunduppgifter's Mail and Telefon are exactly this: the frame's card lists
	 * them and its "Redigera Kunduppgifter" modal does not, and the order
	 * module's twin has the same asymmetry.
	 */
	readOnlyOnCard?: boolean;
}

/**
 * The four blocks that describe a project, shared by the create wizard's
 * Sammanställning step and the Projektinformation record screen.
 *
 * One list per block, so the read view, the edit dialog and the wizard's
 * summary cannot drift apart — which is what happened in the order module,
 * where the cards and their four modals each spell the fields out again.
 *
 * `agreementAddress` ("Adress") rather than `orderAddressLabel`, whose Swedish
 * value is the English spelling "Address".
 */
export const CUSTOMER_FIELDS: ProjectInfoField<CustomerDetails>[] = [
	{
		name: "customer",
		labelKey: localizationConstants.orderKundLabel,
		kind: "text",
	},
	{
		name: "address",
		labelKey: localizationConstants.agreementAddress,
		kind: "text",
	},
	{
		name: "postalCode",
		labelKey: localizationConstants.orderPostNrLabel,
		kind: "text",
	},
	{ name: "city", labelKey: localizationConstants.orderCityLabel, kind: "text" },
	{
		name: "email",
		labelKey: localizationConstants.orderMailLabel,
		kind: "text",
		readOnlyOnCard: true,
	},
	{
		name: "phone",
		labelKey: localizationConstants.orderTelefonLabel,
		kind: "phone",
		readOnlyOnCard: true,
	},
	{
		name: "orgOrPersonalNo",
		labelKey: localizationConstants.orderOrgPersonNrLabel,
		kind: "text",
	},
];

export const CONTACT_FIELDS: ProjectInfoField<ProjectContactDetails>[] = [
	{
		name: "firstName",
		labelKey: localizationConstants.orderFornamLabel,
		kind: "text",
	},
	{
		name: "lastName",
		labelKey: localizationConstants.orderEfternamnLabel,
		kind: "text",
	},
	{ name: "email", labelKey: localizationConstants.orderMailLabel, kind: "text" },
	{
		name: "mobile",
		labelKey: localizationConstants.orderMobilLabel,
		kind: "phone",
	},
	{
		name: "role",
		labelKey: localizationConstants.orderRollLabel,
		kind: "select",
		options: ROLE_OPTIONS,
	},
];

export const PROJECT_FIELDS: ProjectInfoField<ProjectDetailsData>[] = [
	{
		name: "projectNo",
		labelKey: localizationConstants.projectNumberLabel,
		kind: "text",
	},
	{
		name: "projectName",
		labelKey: localizationConstants.projectNameLabel,
		kind: "text",
	},
	{
		name: "blockName",
		labelKey: localizationConstants.orderBlockNameLabel,
		kind: "text",
	},
	{
		name: "projectAddress",
		labelKey: localizationConstants.agreementAddress,
		kind: "text",
	},
	{
		name: "postalCode",
		labelKey: localizationConstants.orderPostNrLabel,
		kind: "text",
	},
	{ name: "city", labelKey: localizationConstants.orderCityLabel, kind: "text" },
];

/**
 * "Koppla projekt", which the wizard collects but the record card does not
 * show — the frame's Projekt card lists six fields, not seven.
 */
export const PROJECT_LINKED_FIELD: ProjectInfoField<ProjectDetailsData> = {
	name: "linkedProjectNo",
	labelKey: localizationConstants.projectCreateLinkedNoLabel,
	kind: "text",
};

export const PROJECT_INFO_FIELDS: ProjectInfoField<ProjectDetailsData>[] = [
	{
		name: "type",
		labelKey: localizationConstants.orderTypLabel,
		kind: "select",
		options: PROJECT_TYPE_OPTIONS,
	},
	{
		name: "category",
		labelKey: localizationConstants.orderKategoriLabel,
		kind: "select",
		options: PROJECT_CATEGORY_OPTIONS,
	},
	{
		name: "department",
		labelKey: localizationConstants.orderAvdelningLabel,
		kind: "select",
		options: DEPARTMENT_OPTIONS,
	},
	{
		name: "contractSum",
		labelKey: localizationConstants.orderKontraktsummaLabel,
		kind: "text",
	},
	{
		name: "offerNo",
		labelKey: localizationConstants.orderOffertNrLabel,
		kind: "text",
	},
	{
		name: "startDate",
		labelKey: localizationConstants.orderStartDatumLabel,
		kind: "date",
	},
	{
		name: "endDate",
		labelKey: localizationConstants.orderSlutDatumLabel,
		kind: "date",
	},
];

/** `[label, value]` pairs for a read-only card, in the frame's order. */
export function toInfoPairs<TSection>(
	fields: ProjectInfoField<TSection>[],
	section: TSection,
): [TranslationKeys, string | undefined][] {
	/* `name` is already `keyof TSection`, so no index signature is needed —
	   constraining to `Record<string, unknown>` would reject every interface. */
	return fields.map((field) => [
		field.labelKey,
		section[field.name] as string | undefined,
	]);
}
