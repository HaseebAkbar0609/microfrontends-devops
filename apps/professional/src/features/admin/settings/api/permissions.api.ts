import axiosInstance from "@/lib/axiosInstance";

export interface LocalizedText {
	sv: string;
	en: string;
}

export interface ModuleAction {
	id: string;
	code: string;
	label: LocalizedText;
}

export interface PermissionModule {
	id: string;
	name: LocalizedText;
	icon: string;
	actions: ModuleAction[];
}

export interface ModuleCategory {
	id: string;
	title: LocalizedText;
	modules: PermissionModule[];
}

export const getAvailableModules = async (): Promise<ModuleCategory[]> => {
	const res = await axiosInstance.get(
		"/professionals/admin/permissions/modules",
	);
	return res.data?.data ?? [];
};
