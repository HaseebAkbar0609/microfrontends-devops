export type ReviewFeeling = "positiv" | "neutral" | "behover_uppmarksamhet";

export interface ReviewFollowupAction {
	id: string;
	title: string;
	assignedTo?: string;
	dueDate?: string;
	completed?: boolean;
}

export interface ReviewDocumentItem {
	id: string;
	date: string;
	name: string;
	fileType: "pdf" | "doc" | "image";
	fileName?: string;
	fileUrl?: string;
}

export interface MedarbetarsamtalItem {
	id: string;
	date: string;
	protocolTitle: string;
	person: string;
	feeling: ReviewFeeling;
	hasFile: boolean;

	// Section 1: Incheckningsdetaljer
	checkInDate: string;
	checkInType: string;
	manager: string;
	employee: string;

	// Section 2: Arbete & Roll
	jobTitle: string;
	currentStatus: string;
	worksWell: string;
	challenging: string;

	// Section 3: Mål & Utveckling
	rightPlace: boolean;
	progress: string;
	skillsToDevelop: string;
	needsTrainingSupport: boolean;

	// Section 4: Välbefinnande & Engagemang
	overallFeeling: ReviewFeeling;
	feelingChangedDate: string;
	negativeImpactNotes: string;

	// Section 5: Feedback & Dialog
	managerFeedback: string;
	employeeFeedback: string;
	additionalNotes: string;

	// Section 6: Åtgärder & Uppföljningar
	followups: ReviewFollowupAction[];
	nextCheckInDate: string;

	// Section 7: Protokoll dokument
	documents: ReviewDocumentItem[];
	isArchived?: boolean;
}

export interface MedarbetarsamtalKpiData {
	latestCheckIn: string;
	latestCheckInSub: string;
	nextScheduled: string;
	nextScheduledSub: string;
	overallFeeling: ReviewFeeling;
	openFollowupsCount: number;
	openFollowupsSub: string;
}

export type NyIncheckningFormData = Omit<MedarbetarsamtalItem, "id" | "hasFile">;
