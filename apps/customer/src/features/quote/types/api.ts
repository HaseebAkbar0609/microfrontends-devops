import type { ProjectCreationMode } from "./types";

export interface SaveProjectPayload {
	project_id?: string;
	step: number;
	is_send?: boolean;
	data: {
		project_name?: string;
		is_express?: boolean;
		client_no?: string;
		category_ids?: string[];
		project_address?: string;
		project_contact_city?: string;
		project_contact_postal_code?: string;
		city?: string;
		postal_code?: string;
		directions?: string;
		project_type?: "express" | "b2c";
		/** Steps 1 and 2; step 1 only reads it when it creates the project */
		creation_mode?: ProjectCreationMode;
		// Step 1 fields (if needed by API)
		first_name?: string;
		last_name?: string;
		mobile_number?: string;
		personal_email?: string;
		address?: string;
		pincode?: string;
		// Step 3 fields
		project_description?: string;
		media_ids?: string[];
		// Step 4 fields
		suppliers?: Array<{
			company_name: string;
			/** Professional subcategory id */
			category?: string;
			organization_number: string;
			first_name: string;
			last_name: string;
			email: string;
			mobile_number: string;
		}>;
	};
}

export interface SaveProjectResponse {
	project_id: string;
	step: number;
	status: string;
}

export interface MediaUploadResponse {
	id: string;
	file_url_path: string;
	file_name: string;
	content_type: string;
}
