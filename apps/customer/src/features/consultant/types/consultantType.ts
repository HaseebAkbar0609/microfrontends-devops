export interface ConsultantTypeSection {
	title: string;
	bullets: string[];
}

export interface ConsultantTypeItem {
	id: string;
	name: string;
	sections: ConsultantTypeSection[];
}
