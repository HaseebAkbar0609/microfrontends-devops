import axiosInstance from "@/lib/axiosInstance";

export const getCompanyInformation = async () => {
	const res = await axiosInstance.get("/admin/company-information");
	return res.data;
};

export const updateCompanyInformation = async (data: unknown) => {
	const res = await axiosInstance.put("/admin/company-information", data);
	return res.data;
};
