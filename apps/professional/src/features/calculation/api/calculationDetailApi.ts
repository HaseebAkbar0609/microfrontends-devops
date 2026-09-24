import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type { KalkylDetailData, KalkylDocItem } from "../types/kalkyl";
import { DUMMY_KALKYL_DETAIL } from "../constants/detailMock";

export type UpdateCalculationDetailPayload = Partial<KalkylDetailData>;

export type AddCalculationDocPayload = {
	datum: string;
	namn: string;
	typ: string;
	fileType: KalkylDocItem["fileType"];
	file?: File;
};

// In-memory / session store for optimistic updates during local dev & offline fallback
const localDetailStore: Record<string, KalkylDetailData> = {};

function getFallbackDetail(id: string): KalkylDetailData {
	if (!localDetailStore[id]) {
		localDetailStore[id] = {
			...DUMMY_KALKYL_DETAIL,
			calcNo: id.startsWith("Kalkyl") ? id : `Kalkyl ${id}`,
			documents: [...DUMMY_KALKYL_DETAIL.documents],
		};
	}
	return localDetailStore[id];
}

export function mapCalculationDetailFromApi(
	item: Record<string, unknown>,
	id: string,
): KalkylDetailData {
	const fallback = getFallbackDetail(id);
	const contractor = (item.contractor as Record<string, unknown>) || {};
	const contractorResp = (contractor.responsible as Record<string, unknown>) || {};
	const client = (item.client as Record<string, unknown>) || {};
	const clientContact = (client.contact as Record<string, unknown>) || {};

	return {
		calcNo: String(item.calc_no ?? item.calcNo ?? item.code ?? fallback.calcNo),
		bestellareForetag: String(client.company_name ?? item.client_company ?? fallback.bestellareForetag),
		bestellareAddress: String(client.address ?? item.client_address ?? fallback.bestellareAddress),
		bestellarePostNr: String(client.postal_code ?? item.client_post_nr ?? fallback.bestellarePostNr),
		bestellareOrt: String(client.city ?? item.client_city ?? fallback.bestellareOrt),
		bestellareMail: String(client.email ?? item.client_email ?? fallback.bestellareMail),
		bestellareTelefon: String(client.phone ?? item.client_phone ?? fallback.bestellareTelefon),
		bestellareOrgNr: String(client.org_number ?? item.client_org_nr ?? fallback.bestellareOrgNr),
		kontaktFornamn: String(clientContact.first_name ?? item.contact_first_name ?? fallback.kontaktFornamn),
		kontaktEfternamn: String(clientContact.last_name ?? item.contact_last_name ?? fallback.kontaktEfternamn),
		kontaktAddress: String(clientContact.address ?? item.contact_address ?? fallback.kontaktAddress),
		kontaktPostnummer: String(clientContact.postal_code ?? item.contact_post_nr ?? fallback.kontaktPostnummer),
		kontaktMail: String(clientContact.email ?? item.contact_email ?? fallback.kontaktMail),
		kontaktMobil: String(clientContact.phone ?? item.contact_mobile ?? fallback.kontaktMobil),
		kontaktRoll: String(clientContact.role ?? item.contact_role ?? fallback.kontaktRoll),
		kontaktOrt: String(clientContact.city ?? item.contact_city ?? fallback.kontaktOrt),
		entreprenorForetag: String(contractor.company_name ?? item.contractor_company ?? fallback.entreprenorForetag),
		entreprenorAddress: String(contractor.address ?? item.contractor_address ?? fallback.entreprenorAddress),
		entreprenorPostNr: String(contractor.postal_code ?? item.contractor_post_nr ?? fallback.entreprenorPostNr),
		entreprenorOrt: String(contractor.city ?? item.contractor_city ?? fallback.entreprenorOrt),
		entreprenorMail: String(contractor.email ?? item.contractor_email ?? fallback.entreprenorMail),
		entreprenorTelefon: String(contractor.phone ?? item.contractor_phone ?? fallback.entreprenorTelefon),
		entreprenorOrgNr: String(contractor.org_number ?? item.contractor_org_nr ?? fallback.entreprenorOrgNr),
		kalkylFornamn: String(contractorResp.first_name ?? item.resp_first_name ?? fallback.kalkylFornamn),
		kalkylEfternamn: String(contractorResp.last_name ?? item.resp_last_name ?? fallback.kalkylEfternamn),
		kalkylMail: String(contractorResp.email ?? item.resp_email ?? fallback.kalkylMail),
		kalkylMobil: String(contractorResp.mobile ?? item.resp_mobile ?? fallback.kalkylMobil),
		kalkylRoll: String(contractorResp.role ?? item.resp_role ?? fallback.kalkylRoll),
		projekteringNr: String(item.project_number ?? item.projekteringNr ?? fallback.projekteringNr),
		projekteringNamn: String(item.project_name ?? item.projekteringNamn ?? fallback.projekteringNamn),
		kvartersNamn: String(item.block_name ?? item.kvartersNamn ?? fallback.kvartersNamn),
		projekteringAdress: String(item.project_address ?? item.projekteringAdress ?? fallback.projekteringAdress),
		postNr: String(item.postal_code ?? item.postNr ?? fallback.postNr),
		ort: String(item.city ?? item.ort ?? fallback.ort),
		type: String(item.type ?? fallback.type),
		kategori: String(item.category ?? fallback.kategori),
		avdelning: String(item.department ?? fallback.avdelning),
		kontraktsumma: String(item.contract_sum ?? fallback.kontraktsumma),
		offertNr: String(item.offer_number ?? item.offertNr ?? fallback.offertNr),
		startDatum: String(item.start_date ?? item.startDatum ?? fallback.startDatum),
		slutDatum: String(item.end_date ?? item.slutDatum ?? fallback.slutDatum),
		senatsDatumOffert: String(item.latest_offer_date ?? item.senatsDatumOffert ?? fallback.senatsDatumOffert),
		documents: Array.isArray(item.documents)
			? (item.documents as Record<string, unknown>[]).map((d) => ({
					id: String(d.id ?? `doc_${Date.now()}`),
					datum: String(d.datum ?? d.created_at ?? new Date().toISOString().split("T")[0]),
					namn: String(d.namn ?? d.name ?? d.filename ?? "document.pdf"),
					typ: String(d.typ ?? d.type ?? "A500-10"),
					fileType: (d.fileType as KalkylDocItem["fileType"]) ?? "pdf",
				}))
			: fallback.documents,
	};
}

export async function getCalculationDetailAPIAction(id: string): Promise<KalkylDetailData> {
	try {
		const res = await axiosInstance.get(API_PATH.CALCULATIONS.GET(id));
		if (res.data?.data) {
			const mapped = mapCalculationDetailFromApi(res.data.data, id);
			localDetailStore[id] = mapped;
			return mapped;
		}
	} catch {
		// Fallback cleanly to local store
	}
	return getFallbackDetail(id);
}

export async function updateCalculationDetailAPIAction(
	id: string,
	data: UpdateCalculationDetailPayload,
): Promise<KalkylDetailData> {
	// Optimistically update local store
	const current = getFallbackDetail(id);
	const updated = { ...current, ...data };
	localDetailStore[id] = updated;

	try {
		await axiosInstance.put(API_PATH.CALCULATIONS.UPDATE(id), data);
	} catch {
		// Keep optimistic update in fallback mode
	}
	return updated;
}

export async function addCalculationDocumentAPIAction(
	id: string,
	doc: AddCalculationDocPayload,
): Promise<KalkylDocItem> {
	const newDoc: KalkylDocItem = {
		id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
		datum: doc.datum || new Date().toISOString().split("T")[0],
		namn: doc.namn,
		typ: doc.typ,
		fileType: doc.fileType,
	};

	const current = getFallbackDetail(id);
	current.documents = [newDoc, ...current.documents];
	localDetailStore[id] = current;

	try {
		const formData = new FormData();
		if (doc.file) {
			formData.append("file", doc.file);
		}
		formData.append("name", doc.namn);
		formData.append("type", doc.typ);
		formData.append("date", doc.datum);
		await axiosInstance.post(`${API_PATH.CALCULATIONS.BASE}/${id}/documents`, formData);
	} catch {
		// Keep optimistic document in fallback mode
	}

	return newDoc;
}

export async function deleteCalculationDocumentAPIAction(
	id: string,
	docId: string,
): Promise<boolean> {
	const current = getFallbackDetail(id);
	current.documents = current.documents.filter((d) => d.id !== docId);
	localDetailStore[id] = current;

	try {
		await axiosInstance.delete(`${API_PATH.CALCULATIONS.BASE}/${id}/documents/${docId}`);
		return true;
	} catch {
		return true;
	}
}
