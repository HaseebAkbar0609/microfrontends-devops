import {
	COMPANY_CONTACTS,
	COMPANY_INFO_ROWS,
	COMPANY_MESSAGES,
	COMPANY_NEWS,
	COMPANY_UPDATES,
	CompanyContact,
	CompanyInfoField,
	CompanyMessage,
	CompanyNewsItem,
	CompanyUpdate,
	ORG_ROOT,
	OrgNode,
} from "../constants/mockData";

export function getCompanyInfoRows(): CompanyInfoField[][] {
	return COMPANY_INFO_ROWS;
}

export function listCompanyContacts(): CompanyContact[] {
	return COMPANY_CONTACTS;
}

export function getOrganisationRoot(): OrgNode {
	return ORG_ROOT;
}

export function listCompanyMessages(): CompanyMessage[] {
	return COMPANY_MESSAGES;
}

export function listCompanyNews(): CompanyNewsItem[] {
	return COMPANY_NEWS;
}

export function listCompanyUpdates(): CompanyUpdate[] {
	return COMPANY_UPDATES;
}
