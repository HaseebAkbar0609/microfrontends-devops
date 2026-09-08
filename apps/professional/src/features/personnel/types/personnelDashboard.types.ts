export interface WorkforceHealthScoreData {
	score: number;
	maxScore: number;
	attendanceRate: number;
	staffingCoverage: number;
	complianceRate: number;
	trendPoints: number;
	status: "good" | "warning" | "critical";
}

export interface PersonnelOverviewData {
	totalEmployees: number;
	activeToday: number;
	onLeave: number;
	newThisMonth: number;
	departuresThisMonth: number;
}

export interface AttendanceData {
	present: number;
	absentApproved: number;
	absentUnplanned: number;
	remote: number;
	onSite: number;
	weeklyRate: number;
}

export interface StaffingRoleItem {
	id: string;
	roleKey: string;
	assigned: number;
	needed: number;
	status: "met" | "shortage" | "critical";
}

export interface StaffingData {
	roles: StaffingRoleItem[];
	openPositions: number;
}

export interface TimeReportingData {
	submitted: number;
	total: number;
	approved: number;
	pending: number;
	missing: number;
	totalHoursLogged: number;
	overtimeHours: number;
}

export interface PersonnelCostsData {
	totalCostSek: number;
	salariesSek: number;
	overtimeSek: number;
	benefitsSek: number;
	budgetSek: number;
	varianceSek: number;
}

export interface AiAssistantMessage {
	id: string;
	sender: "user" | "assistant";
	text: string;
	timestamp: string;
}

export interface PersonnelCalendarEvent {
	id: string;
	dateKey: string;
	displayDate: string;
	titleKey: string;
	category: "leave" | "training" | "deadline" | "certification";
	participantCount?: number;
}

export interface RecentActivityItem {
	id: string;
	time: string;
	textKey: string;
	category: "approval" | "onboarding" | "absence" | "staffing";
}

export interface CompetenceItem {
	id: string;
	nameKey: string;
	employeeCount: number;
	certifiedOfficers?: number;
	isGap?: boolean;
}

export interface TrainingProgramItem {
	id: string;
	nameKey: string;
	enrolledCount: number;
	status: "active" | "upcoming" | "overdue";
	dateLabelKey?: string;
}

export interface CertificateItem {
	id: string;
	category: string;
	validCount: number;
	expiring30DaysCount: number;
	expiredCount: number;
	pendingRenewalCount: number;
}

export interface TeamImageData {
	imageUrl: string;
	captionKey: string;
	titleKey: string;
}

export interface PersonnelNewsItem {
	id: string;
	titleKey: string;
	dateKey: string;
	category: "policy" | "schedule" | "welcome" | "review";
}

export interface PersonnelDashboardState {
	healthScore: WorkforceHealthScoreData;
	overview: PersonnelOverviewData;
	attendance: AttendanceData;
	staffing: StaffingData;
	timeReporting: TimeReportingData;
	costs: PersonnelCostsData;
	calendarEvents: PersonnelCalendarEvent[];
	recentActivities: RecentActivityItem[];
	competences: CompetenceItem[];
	trainingPrograms: TrainingProgramItem[];
	certificates: CertificateItem[];
	teamImage: TeamImageData;
	news: PersonnelNewsItem[];
}
