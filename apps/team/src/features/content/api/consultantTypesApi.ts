import axios from "@/lib/axiosInstance";
import { LANGUAGE_CODES } from "@/constants/constant";
import { getUserLanguage } from "@/utils/userLanguage";
import { API_LANGUAGE } from "../constants/content.constants";
import type { ConsultantType, ConsultantTypeInput } from "../types";

const ROOT = "/api/v1/teams/consultant-types";

type Single = { data: ConsultantType };

/**
 * The backend translates its error messages from Accept-Language. The team
 * client sends none, so the browser's own would win over the console language.
 */
function languageHeaders() {
	const language =
		getUserLanguage() === LANGUAGE_CODES.en ? API_LANGUAGE.en : API_LANGUAGE.swe;
	return { headers: { "Accept-Language": language } };
}

export async function listConsultantTypes(): Promise<ConsultantType[]> {
	return (await axios.get<{ data: ConsultantType[] }>(ROOT, languageHeaders())).data.data;
}

export async function createConsultantType(body: ConsultantTypeInput) {
	return (await axios.post<Single>(ROOT, body, languageHeaders())).data.data;
}

export async function patchConsultantType(id: string, patch: ConsultantTypeInput) {
	return (await axios.patch<Single>(`${ROOT}/${encodeURIComponent(id)}`, patch, languageHeaders())).data.data;
}

export async function deleteConsultantType(id: string) {
	await axios.delete(`${ROOT}/${encodeURIComponent(id)}`, languageHeaders());
}
