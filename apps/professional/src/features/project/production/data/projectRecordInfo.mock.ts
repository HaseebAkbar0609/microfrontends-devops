import { PROJECT_LIST_ROWS } from "../../data/projectsOverview.mock";
import type { ProjectDocumentItem } from "../../create/types";
import type { ProjectRecordInfo } from "../types";

/**
 * The offer's attachments.
 *
 * Literal ISO dates — `new Date()` evaluated while rendering desynchronises the
 * server and client markup.
 */
const OFFER_DOCUMENTS: ProjectDocumentItem[] = [
	{
		id: "offer-doc-1",
		date: "2024-05-10",
		documentName: "Kontrakt",
		fileName: "Kontrakt.pdf",
		fileType: "pdf",
	},
	{
		id: "offer-doc-2",
		date: "2024-05-10",
		documentName: "Underlag",
		fileName: "Underlag.doc",
		fileType: "doc",
	},
];

/**
 * The fields a project record shows that its list row does not carry.
 *
 * `ProjectListItem` has six of the twenty-five the cards draw — number, name,
 * category, department, contract sum, offer number and the two dates — so the
 * rest are seeded here per project. Anything the list already knows is read
 * from the row instead, so the record, the list and Arkiv cannot disagree.
 *
 * Keyed by project id. A project with no entry still renders: the extra fields
 * come back empty and `InfoField` shows the missing-value mark.
 */
const SEEDED: Record<
	string,
	{
		address: string;
		postalCode: string;
		city: string;
		email: string;
		phone: string;
		orgOrPersonalNo: string;
		firstName: string;
		lastName: string;
		contactEmail: string;
		mobile: string;
		role: string;
		blockName: string;
		projectAddress: string;
		projectPostalCode: string;
		projectCity: string;
		type: string;
		/* Offert tab */
		workLocation: string;
		specifications: string;
		work: string;
		material: string;
		totalOffer: string;
		rotDeductionLabor: string;
		paymentTerms: string;
		rotDeductionSettled: boolean;
	}
> = {
	"5000": {
		address: "Storgatan 12",
		postalCode: "111 22",
		city: "Stockholm",
		email: "info@fastighetsbolag.se",
		phone: "+46 8 121 400",
		orgOrPersonalNo: "556060-2020",
		firstName: "Stina",
		lastName: "Andersson",
		contactEmail: "stina@fastighetsbolag.se",
		mobile: "+46 70 630 63 45",
		role: "Beställare",
		blockName: "Kv Eken 4",
		projectAddress: "Kungsgatan 3",
		projectPostalCode: "111 35",
		projectCity: "Stockholm",
		type: "Totalentreprenad",
		workLocation: "Kungsgatan 3, Stockholm",
		specifications: "Rivning, nytt kök, el och VVS enligt bifogad ritning.",
		work: "Total kostnad för projektet, inklusive material och arbete.",
		material: "120 000 kr",
		totalOffer: "410 000 kr",
		rotDeductionLabor: "87 000 kr",
		paymentTerms: "30 dagar netto",
		rotDeductionSettled: true,
	},
	"5001": {
		address: "Hantverkargatan 8",
		postalCode: "112 21",
		city: "Stockholm",
		email: "kontakt@locum.se",
		phone: "+46 8 123 45 00",
		orgOrPersonalNo: "556060-2020",
		firstName: "Anders",
		lastName: "Svensson",
		contactEmail: "anders.svensson@locum.se",
		mobile: "+46 70 555 12 34",
		role: "Beställare",
		blockName: "Kv Björken 2",
		projectAddress: "Sveavägen 44",
		projectPostalCode: "113 59",
		projectCity: "Stockholm",
		type: "Generalentreprenad",
		workLocation: "Sveavägen 44, Stockholm",
		specifications: "Stambyte samt ytskikt i badrum, 12 lägenheter.",
		work: "Total kostnad för projektet, inklusive material och arbete.",
		material: "260 000 kr",
		totalOffer: "890 000 kr",
		rotDeductionLabor: "---",
		paymentTerms: "Betalplan enligt avtal",
		rotDeductionSettled: false,
	},
	"5002": {
		address: "Drottninggatan 21",
		postalCode: "111 51",
		city: "Stockholm",
		email: "info@sisab.se",
		phone: "+46 8 508 460 00",
		orgOrPersonalNo: "556049-4390",
		firstName: "Karin",
		lastName: "Lund",
		contactEmail: "karin.lund@sisab.se",
		mobile: "+46 70 411 88 02",
		role: "Projektledare",
		blockName: "Kv Linden 7",
		projectAddress: "Odengatan 15",
		projectPostalCode: "113 51",
		projectCity: "Stockholm",
		type: "Löpande räkning",
		workLocation: "Odengatan 15, Stockholm",
		specifications: "Löpande serviceåtgärder enligt överenskommelse.",
		work: "Debiteras löpande per timme.",
		material: "Enligt självkostnad",
		totalOffer: "Löpande räkning",
		rotDeductionLabor: "---",
		paymentTerms: "15 dagar netto",
		rotDeductionSettled: false,
	},
};

/**
 * Builds the record's info from the list row plus the seeded extras.
 *
 * Returns `null` for an id that matches no project, so the page can 404 rather
 * than render an empty shell.
 */
export function buildProjectRecordInfo(
	projectId: string,
): ProjectRecordInfo | null {
	const row = PROJECT_LIST_ROWS.find((project) => project.id === projectId);
	if (!row) return null;

	const extra = SEEDED[projectId];

	return {
		customer: {
			customer: row.customer,
			address: extra?.address ?? "",
			postalCode: extra?.postalCode ?? "",
			city: extra?.city ?? "",
			email: extra?.email ?? "",
			phone: extra?.phone ?? "",
			orgOrPersonalNo: extra?.orgOrPersonalNo ?? "",
		},
		contactPerson: {
			firstName: extra?.firstName ?? "",
			lastName: extra?.lastName ?? "",
			email: extra?.contactEmail ?? "",
			mobile: extra?.mobile ?? "",
			role: extra?.role ?? "",
		},
		details: {
			projectNo: row.projectNr,
			projectName: row.name,
			blockName: extra?.blockName ?? "",
			projectAddress: extra?.projectAddress ?? "",
			postalCode: extra?.projectPostalCode ?? "",
			city: extra?.projectCity ?? "",
			linkedProjectNo: "",
			type: extra?.type ?? "",
			category: row.category,
			department: row.department,
			contractSum: row.contractSum,
			offerNo: row.offerNr,
			startDate: row.startDate,
			endDate: row.endDate,
		},
		/*
		 * The contracting company's own details. There is no Production-side
		 * source for these: `useCompanyInformation` is a react-query hook against
		 * the live API used only by the admin screen, and
		 * `authStorage.getCompanyData()` returns `unknown` out of localStorage.
		 * Seeded here until one exists.
		 */
		company: {
			name: "Byggbolaget AB",
			email: "offert@byggbolaget.se",
			phone: "+46 8 400 120 00",
			address: "Verkstadsgatan 4, 112 45 Stockholm",
			orgNo: "556712-3344",
		},
		projectDescription: {
			projectName: row.name,
			workLocation: extra?.workLocation ?? "",
			specifications: extra?.specifications ?? "",
		},
		offer: {
			offerNo: row.offerNr,
			work: extra?.work ?? "",
			material: extra?.material ?? "",
			totalOffer: extra?.totalOffer ?? "",
			rotDeductionLabor: extra?.rotDeductionLabor ?? "",
			paymentTerms: extra?.paymentTerms ?? "",
			rotDeductionSettled: extra?.rotDeductionSettled ?? false,
		},
		documents: extra ? [...OFFER_DOCUMENTS] : [],
	};
}
