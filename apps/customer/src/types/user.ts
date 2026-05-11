import { Role } from "@/constants/roles";
export interface User {
	id: string;
	name: string;
	email: string;
	createdAt?: string;
	updatedAt?: string;
	role: Role;
}

export interface CreateUserInput {
	name: string;
	email: string;
}

export interface UpdateUserInput {
	id: string;
	data: Partial<CreateUserInput>;
}

export interface BreadcrumbItem {
	label: string;
	href?: string;
}
