export type MarkupRow = {
	id: string;
	title: string;
	markupPercentage: string;
};

export type LaborRow = {
	id: string;
	item: string;
	description: string;
	quantity: string;
	unit: string;
	aPrice: string;
};

export type APriceRow = {
	id: string;
	artikel: string;
	benaming: string;
	specification: string;
	kategori: string;
	antal: number;
	enhet: string;
	aPrice: number;
};
