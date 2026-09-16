export interface DesignBudgetItem {
	id: string;
	datum: string;
	benamning: string;
	typ: string;
	belopp: number;
	pdfName: string;
	groupId: string;
}

export interface DesignBudgetGroup {
	id: string;
	name: string;
	items: DesignBudgetItem[];
}

export interface DesignBudgetLineItem {
	id: string;
	benamning: string;
	antal: number;
	enhet: string;
	aPris: number;
}

export interface DesignBudgetSection {
	id: string;
	title: string;
	rows: DesignBudgetLineItem[];
}

export interface DesignEkonomiFormState {
	projektnamn: string;
	projekteringsAnsvarig: string;
	mallTyp: "byggMall" | "laddaUpp" | "skapaNy" | "valjMall";
	mallName: string;
}
