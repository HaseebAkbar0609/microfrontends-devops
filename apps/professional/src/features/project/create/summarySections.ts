import localizationConstants from "@/utils/translation/constants";
import type {
	CreateProjectFormData,
	ProjectCreateSummarySection,
} from "./types";

/**
 * The four key/value blocks on the Sammanställning step, in the frames' order.
 *
 * Kept out of the component so the step reads as layout: which fields belong to
 * which section, and which step each pencil returns to, is data.
 */
export function buildSummarySections(
	data: CreateProjectFormData,
): ProjectCreateSummarySection[] {
	const { customer, contactPerson, details } = data;

	return [
		{
			key: "customer",
			step: 1,
			titleKey: localizationConstants.orderKunduppgifterSection,
			fields: [
				[localizationConstants.orderKundLabel, customer.customer],
				[localizationConstants.agreementAddress, customer.address],
				[localizationConstants.orderPostNrLabel, customer.postalCode],
				[localizationConstants.orderCityLabel, customer.city],
				[localizationConstants.orderMailLabel, customer.email],
				[localizationConstants.orderTelefonLabel, customer.phone],
				[
					localizationConstants.orderOrgPersonNrLabel,
					customer.orgOrPersonalNo,
				],
			],
		},
		{
			key: "contact",
			step: 1,
			titleKey: localizationConstants.orderKontaktpersonSection,
			fields: [
				[localizationConstants.orderFornamLabel, contactPerson.firstName],
				[localizationConstants.orderEfternamnLabel, contactPerson.lastName],
				[localizationConstants.orderMailLabel, contactPerson.email],
				[localizationConstants.orderMobilLabel, contactPerson.mobile],
				[localizationConstants.orderRollLabel, contactPerson.role],
			],
		},
		{
			key: "project",
			step: 2,
			titleKey: localizationConstants.projectLabel,
			fields: [
				[localizationConstants.projectNumberLabel, details.projectNo],
				[localizationConstants.projectNameLabel, details.projectName],
				[localizationConstants.orderBlockNameLabel, details.blockName],
				[localizationConstants.agreementAddress, details.projectAddress],
				[localizationConstants.orderPostNrLabel, details.postalCode],
				[localizationConstants.orderCityLabel, details.city],
				[
					localizationConstants.projectCreateLinkedNoLabel,
					details.linkedProjectNo,
				],
			],
		},
		{
			key: "projectInfo",
			step: 2,
			titleKey: localizationConstants.projectCreateInfoSection,
			fields: [
				[localizationConstants.orderTypLabel, details.type],
				[localizationConstants.orderKategoriLabel, details.category],
				[localizationConstants.orderAvdelningLabel, details.department],
				[localizationConstants.orderKontraktsummaLabel, details.contractSum],
				[localizationConstants.orderOffertNrLabel, details.offerNo],
				[localizationConstants.orderStartDatumLabel, details.startDate],
				[localizationConstants.orderSlutDatumLabel, details.endDate],
			],
		},
	];
}
