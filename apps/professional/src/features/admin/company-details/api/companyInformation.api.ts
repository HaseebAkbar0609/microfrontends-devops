import axiosInstance from "@/lib/axiosInstance";

const BASE = "/professionals/admin/company-information";

export interface MediaInfo {
	mediaId: string;
	url?: string | null;
	fileName?: string | null;
}

// --- Shared file upload ------------------------------------------------
// Every attachment in this module (logo, presentation file, reference file)
// is uploaded through the generic media endpoint first; the response's
// media id is what the company-information endpoints actually store.
export const uploadCompanyMedia = async (file: File): Promise<MediaInfo> => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("media_type", "general");

	const res = await axiosInstance.post("/media/upload", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	const media = res.data.data;
	return { mediaId: media.id, url: media.url, fileName: media.file_name };
};

// --- Company information tab -------------------------------------------
export const getCompanyInformation = async () => {
	const res = await axiosInstance.get(BASE);
	return res.data.data;
};

export const updateCompanyInformation = async (data: unknown) => {
	const res = await axiosInstance.put(BASE, data);
	return res.data.data;
};

// --- Bank tab ------------------------------------------------------------
export const getBankDetails = async () => {
	const res = await axiosInstance.get(`${BASE}/bank`);
	return res.data.data;
};

export const updateBankDetails = async (data: unknown) => {
	const res = await axiosInstance.put(`${BASE}/bank`, data);
	return res.data.data;
};

// --- Presentation tab ------------------------------------------------------
export const getPresentation = async () => {
	const res = await axiosInstance.get(`${BASE}/presentation`);
	return res.data.data;
};

export const updatePresentation = async (data: unknown) => {
	const res = await axiosInstance.put(`${BASE}/presentation`, data);
	return res.data.data;
};

// --- References tab --------------------------------------------------------
export const getReferences = async () => {
	const res = await axiosInstance.get(`${BASE}/references`);
	return res.data.data;
};

export const createReference = async (data: unknown) => {
	const res = await axiosInstance.post(`${BASE}/references`, data);
	return res.data.data;
};

export const updateReference = async ({ id, data }: { id: string; data: unknown }) => {
	const res = await axiosInstance.put(`${BASE}/references/${id}`, data);
	return res.data.data;
};

export const deleteReference = async (id: string) => {
	const res = await axiosInstance.delete(`${BASE}/references/${id}`);
	return res.data;
};

// --- Reviews tab -----------------------------------------------------------
export const getReviews = async () => {
	const res = await axiosInstance.get(`${BASE}/reviews`);
	return res.data.data;
};

export const replyToReview = async ({ id, reply }: { id: string; reply: string }) => {
	const res = await axiosInstance.post(`${BASE}/reviews/${id}/reply`, { reply });
	return res.data.data;
};

// --- Lead management tab -----------------------------------------------------
export const getLeadManagement = async () => {
	const res = await axiosInstance.get(`${BASE}/lead-management`);
	return res.data.data;
};

export const updateLeadManagement = async (data: unknown) => {
	const res = await axiosInstance.put(`${BASE}/lead-management`, data);
	return res.data.data;
};
