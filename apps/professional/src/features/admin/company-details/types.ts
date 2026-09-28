export interface CompanyMediaInfo {
	mediaId: string;
	url?: string | null;
	fileName?: string | null;
}

export interface CompanyReference {
	id: string;
	project: string;
	customer: string;
	municipality: string;
	contact: string;
	phone: string;
	file: CompanyMediaInfo | null;
}

export interface CompanyReview {
	id: string;
	reviewer: string;
	rating: number;
	text: string;
	date: number;
	reply: { text: string; date: number } | null;
}
