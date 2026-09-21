export interface HandlingRitning {
	id: string;
	datum: string;
	ritningsNr: string;
	kategori: string;
	skapadAv: string;
}

export interface HandlingDokument {
	id: string;
	datum: string;
	dokumentNamn: string;
	kategori: string;
	skapadAv: string;
}

export interface HandlingFoto {
	id: string;
	datum: string;
	fotoNr: string;
	benamning: string;
	skapadAv: string;
}

export interface HandlingArkiverad {
	id: string;
	datum: string;
	type: string;
	benamning: string;
	skapadAv: string;
}

export interface HandlingarUploadForm {
	benamning: string;
	filNamn: string;
}
