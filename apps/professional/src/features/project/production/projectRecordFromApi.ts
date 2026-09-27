import type { Company } from "@/context/AuthContext";
import type { ProfessionalProjectRecord } from "../services/professionalProjectService";
import type { ProjectRecordInfo } from "./types";

export function projectRecordFromApi(
	project: ProfessionalProjectRecord,
	company: Company | null,
): ProjectRecordInfo {
	const { customer, contactPerson, details, documents } = project.data;
	return {
		customer,
		contactPerson,
		details,
		documents,
		company: {
			name: company?.company_name ?? "",
			email: "",
			phone: "",
			address: "",
			orgNo: company?.organization_number ?? "",
		},
		projectDescription: {
			projectName: details.projectName,
			workLocation: details.projectAddress,
			specifications: "",
		},
		offer: {
			offerNo: details.offerNo,
			work: "",
			material: "",
			totalOffer: "",
			rotDeductionLabor: "",
			paymentTerms: "",
			rotDeductionSettled: false,
		},
	};
}
