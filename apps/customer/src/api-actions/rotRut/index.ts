import axiosInstance from "@/lib/axiosInstance";

export interface RotPayload {
	propertyId: string;
	personalId: string;
	coOwner: boolean;
}

export interface Owner {
	id: string;
	name: string;
	personalId: string;
	share: string;
}

export const getOwners = async (_projectId: string): Promise<Owner[]> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve([
				{ id: "dummy-1", name: "Lars Andersson", personalId: "346 465 2416", share: "50%" },
				{ id: "dummy-2", name: "Anna Andersson", personalId: "346 465 2416", share: "50%" },
			]);
		}, 500);
	});
};

export const createRot = async (projectId: string, data: RotPayload) => {
	return axiosInstance.post(`/projects/${projectId}/rot`, data);
};
