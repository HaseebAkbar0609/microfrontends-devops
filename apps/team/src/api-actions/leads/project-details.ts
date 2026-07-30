import axiosInstance from "@/lib/axiosInstance";
import type {
	LeadProjectDetailsApiResponse,
	LeadRequestDetails,
} from "@/features/leads/types";
import { getFileType, mapProjectType } from "@/api-actions/leads/shared";

export async function getLeadProjectDetailsAPIAction(
	leadId: string
): Promise<LeadRequestDetails | null> {
	const response = await axiosInstance.get<LeadProjectDetailsApiResponse>(
		`/api/v1/teams/lead/${leadId}/project-details`
	);
	const payload = response.data.data;

	if (!payload) {
		return null;
	}

	const projectDetails = payload.project_details;
	const projectDescription = payload.project_description;
	const invitedSuppliers = payload.suppliers?.invited_suppliers ?? [];

	return {
		projectName: projectDetails?.project_name || "-",
		isExpress: Boolean(projectDetails?.is_express),
		orderNumber: projectDetails?.client_no || "-",
		category:
			(projectDetails?.categories ?? [])
				.map((category) => category.name)
				.filter(Boolean)
				.join(", ") || "-",
		projectType: mapProjectType(projectDetails?.project_type ?? ""),
		address: projectDetails?.project_address || "-",
		city: projectDetails?.city_name || projectDetails?.city || "-",
		postalCode: projectDetails?.postal_code || "-",
		directions: projectDetails?.directions || "-",
		description: projectDescription?.project_description || "-",
		documents: (projectDescription?.media ?? []).map((media) => ({
			id: media.media_id,
			date: "-",
			name: media.file_name || "File",
			fileType: getFileType(media.file_name),
			url: media.url,
		})),
		suppliers: invitedSuppliers.map((supplier, index) => ({
			id: `${leadId}-supplier-${index + 1}`,
			companyName: supplier.company_name || "-",
			orgNumber: supplier.organization_number || "-",
			contactName: supplier.contact_person_name || "-",
			email: supplier.email || "-",
		})),
	};
}
