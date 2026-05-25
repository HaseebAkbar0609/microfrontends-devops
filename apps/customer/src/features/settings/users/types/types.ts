
export interface User {
	id: string;

	first_name: string;
	last_name: string;
	mobile_number: string;
	private_email: string;
	address: string;
	city: string;
	postal_code: string;
	personnal_number: string;

	date_created: string;
	account_type: string; // admin / users
	last_login: string;
	status: string;
}

export type UserStatus =
	| "active"
	| "deactive";


export type UserColumnField = keyof User | "actions";


