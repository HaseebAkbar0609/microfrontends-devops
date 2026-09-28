import axiosInstance from "@/lib/axiosInstance";

export interface ProfessionalSubcategory {
	id: string;
	name: string;
}

export interface ProfessionalCategory {
	id: string;
	name: string;
	subcategories: ProfessionalSubcategory[];
}

// GET /teams/professionals/categories/hierarchical -- public, no auth needed.
export const getProfessionalCategoriesHierarchical = async (): Promise<
	ProfessionalCategory[]
> => {
	const res = await axiosInstance.get(
		"/teams/professionals/categories/hierarchical",
	);
	return res.data.data;
};

export interface City {
	id: string;
	name: string;
}

// GET /location/cities -- public, no auth needed. Defaults to Sweden.
export const getCities = async (): Promise<City[]> => {
	const res = await axiosInstance.get("/location/cities", {
		params: { page_size: 500 },
	});
	return res.data.data;
};
