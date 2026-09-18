import type {
	WeatherConditionKey,
	TempUnitKey,
	WorkdayTypeKey,
	ActivityStatusKey,
	DeviationStatusKey,
	DeviationTypeKey,
} from "../constants/constructionLog.constants";

export interface WorkforceItem {
	id: string;
	role: string;
	ownCount: number | null;
	subcontractorCount: number | null;
	hours: number;
	note: string;
}

export interface ActivityItem {
	id: string;
	title: string;
	status: ActivityStatusKey;
	note: string;
}

export interface MachineItem {
	id: string;
	name: string;
	quantity: string;
	hours: number;
	note: string;
}

export interface DeviationItem {
	id: string;
	number: number;
	type: DeviationTypeKey;
	status: DeviationStatusKey;
	note: string;
}

export interface WeatherInfo {
	location: string;
	date: string;
	temperature: number;
	tempUnit: TempUnitKey;
	weatherCondition: WeatherConditionKey;
	description: string;
	otherNote: string;
}

export interface SignerInfo {
	name: string;
	role: string;
	signed: boolean;
	signedAt?: string;
}

export interface SignaturesInfo {
	siteManager: SignerInfo;
	client: SignerInfo;
}

export interface ConstructionCalendarDay {
	date: string; // YYYY-MM-DD
	type: WorkdayTypeKey;
}

export interface ConstructionLogEntry {
	id: string;
	orderId: string;
	date: string;
	projectName: string;
	projectNo: string;
	constructionDay: string;
	address: string;
	weather: WeatherInfo;
	workforce: WorkforceItem[];
	activities: ActivityItem[];
	machines: MachineItem[];
	deviations: DeviationItem[];
	generalNotes: string;
	selfInspectionNote: string;
	signatures: SignaturesInfo;
	status: "draft" | "published";
	createdAt: string;
	updatedAt: string;
}

export interface CreateLogStep1Data {
	date: string;
	author: string;
	weather: WeatherInfo;
}

export interface CreateLogStep2Data {
	workforce: WorkforceItem[];
	activities: ActivityItem[];
	machines: MachineItem[];
	deviations: DeviationItem[];
	generalNotes: string;
	selfInspectionNote: string;
}

export interface CreateLogFormData {
	step1: CreateLogStep1Data;
	step2: CreateLogStep2Data;
}
