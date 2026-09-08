import localizationConstants from "@/utils/translation/constants";
import {
	WORKFORCE_HEALTH_SCORE_TARGET,
	WORKFORCE_HEALTH_MAX,
	WORKFORCE_ATTENDANCE_RATE,
	WORKFORCE_STAFFING_COVERAGE,
	WORKFORCE_COMPLIANCE_RATE,
	WORKFORCE_SCORE_TREND,
	PERSONNEL_TOTAL_EMPLOYEES,
	PERSONNEL_ACTIVE_TODAY,
	PERSONNEL_ON_LEAVE,
	PERSONNEL_NEW_THIS_MONTH,
	PERSONNEL_DEPARTURES_THIS_MONTH,
	PERSONNEL_PRESENT_EMPLOYEES,
	PERSONNEL_ABSENT_APPROVED,
	PERSONNEL_ABSENT_UNPLANNED,
	PERSONNEL_REMOTE_EMPLOYEES,
	PERSONNEL_ONSITE_EMPLOYEES,
	PERSONNEL_TOTAL_COST_SEK,
	PERSONNEL_SALARIES_SEK,
	PERSONNEL_OVERTIME_SEK,
	PERSONNEL_BENEFITS_SEK,
	PERSONNEL_BUDGET_SEK,
	PERSONNEL_VARIANCE_SEK,
	TIME_REPORTS_SUBMITTED,
	TIME_REPORTS_TOTAL,
	TIME_REPORTS_APPROVED,
	TIME_REPORTS_PENDING,
	TIME_REPORTS_MISSING,
	TIME_HOURS_LOGGED,
	TIME_OVERTIME_HOURS,
} from "../constants/personnelDashboard.constants";
import { PersonnelDashboardState } from "../types/personnelDashboard.types";

export const INITIAL_PERSONNEL_DASHBOARD_DATA: PersonnelDashboardState = {
	// 1. Workforce Health Score
	healthScore: {
		score: WORKFORCE_HEALTH_SCORE_TARGET,
		maxScore: WORKFORCE_HEALTH_MAX,
		attendanceRate: WORKFORCE_ATTENDANCE_RATE,
		staffingCoverage: WORKFORCE_STAFFING_COVERAGE,
		complianceRate: WORKFORCE_COMPLIANCE_RATE,
		trendPoints: WORKFORCE_SCORE_TREND,
		status: "good",
	},

	// 2. Personalöversikt
	overview: {
		totalEmployees: PERSONNEL_TOTAL_EMPLOYEES,
		activeToday: PERSONNEL_ACTIVE_TODAY,
		onLeave: PERSONNEL_ON_LEAVE,
		newThisMonth: PERSONNEL_NEW_THIS_MONTH,
		departuresThisMonth: PERSONNEL_DEPARTURES_THIS_MONTH,
	},

	// 3. Närvaro
	attendance: {
		present: PERSONNEL_PRESENT_EMPLOYEES,
		absentApproved: PERSONNEL_ABSENT_APPROVED,
		absentUnplanned: PERSONNEL_ABSENT_UNPLANNED,
		remote: PERSONNEL_REMOTE_EMPLOYEES,
		onSite: PERSONNEL_ONSITE_EMPLOYEES,
		weeklyRate: WORKFORCE_ATTENDANCE_RATE,
	},

	// 4. Bemanning
	staffing: {
		roles: [
			{
				id: "electricians",
				roleKey: localizationConstants.wElectricians,
				assigned: 12,
				needed: 14,
				status: "shortage",
			},
			{
				id: "plumbers",
				roleKey: localizationConstants.wPlumbers,
				assigned: 8,
				needed: 8,
				status: "met",
			},
			{
				id: "pms",
				roleKey: localizationConstants.wProjectManagers,
				assigned: 3,
				needed: 3,
				status: "met",
			},
			{
				id: "apprentices",
				roleKey: localizationConstants.wApprentices,
				assigned: 6,
				needed: 10,
				status: "critical",
			},
		],
		openPositions: 3,
	},

	// 5. Tidrapportering
	timeReporting: {
		submitted: TIME_REPORTS_SUBMITTED,
		total: TIME_REPORTS_TOTAL,
		approved: TIME_REPORTS_APPROVED,
		pending: TIME_REPORTS_PENDING,
		missing: TIME_REPORTS_MISSING,
		totalHoursLogged: TIME_HOURS_LOGGED,
		overtimeHours: TIME_OVERTIME_HOURS,
	},

	// 6. Personalkostnader
	costs: {
		totalCostSek: PERSONNEL_TOTAL_COST_SEK,
		salariesSek: PERSONNEL_SALARIES_SEK,
		overtimeSek: PERSONNEL_OVERTIME_SEK,
		benefitsSek: PERSONNEL_BENEFITS_SEK,
		budgetSek: PERSONNEL_BUDGET_SEK,
		varianceSek: PERSONNEL_VARIANCE_SEK,
	},

	// 8. Kalender
	calendarEvents: [
		{
			id: "cal-1",
			dateKey: localizationConstants.wCalDateJul28,
			displayDate: "28 Jul",
			titleKey: localizationConstants.wCalEventParentalReturn,
			category: "leave",
		},
		{
			id: "cal-2",
			dateKey: localizationConstants.wCalDateJul29,
			displayDate: "29 Jul",
			titleKey: localizationConstants.wCalEventSafetyTraining,
			category: "training",
			participantCount: 12,
		},
		{
			id: "cal-3",
			dateKey: localizationConstants.wCalDateJul30,
			displayDate: "30 Jul",
			titleKey: localizationConstants.wCalEventPayrollDeadline,
			category: "deadline",
		},
		{
			id: "cal-4",
			dateKey: localizationConstants.wCalDateAug01,
			displayDate: "01 Aug",
			titleKey: localizationConstants.wCalEventSummerLeave,
			category: "leave",
			participantCount: 2,
		},
		{
			id: "cal-5",
			dateKey: localizationConstants.wCalDateAug05,
			displayDate: "05 Aug",
			titleKey: localizationConstants.wCalEventFirstAidCert,
			category: "certification",
			participantCount: 4,
		},
	],

	// 9. Senaste aktiviteter
	recentActivities: [
		{
			id: "act-1",
			time: "13:42",
			textKey: localizationConstants.wActTimeApproved,
			category: "approval",
		},
		{
			id: "act-2",
			time: "12:15",
			textKey: localizationConstants.wActNewEmployee,
			category: "onboarding",
		},
		{
			id: "act-3",
			time: "11:30",
			textKey: localizationConstants.wActAbsenceRegistered,
			category: "absence",
		},
		{
			id: "act-4",
			time: "10:05",
			textKey: localizationConstants.wActOvertimeApproved,
			category: "approval",
		},
		{
			id: "act-5",
			time: "09:20",
			textKey: localizationConstants.wActStaffingUpdate,
			category: "staffing",
		},
	],

	// 10. Kompetenser
	competences: [
		{
			id: "comp-1",
			nameKey: localizationConstants.wCompElectrical,
			employeeCount: 14,
		},
		{
			id: "comp-2",
			nameKey: localizationConstants.wCompPlumbing,
			employeeCount: 9,
		},
		{
			id: "comp-3",
			nameKey: localizationConstants.wCompProjectMgmt,
			employeeCount: 5,
		},
		{
			id: "comp-4",
			nameKey: localizationConstants.wCompBimCad,
			employeeCount: 3,
		},
		{
			id: "comp-5",
			nameKey: localizationConstants.wCompSafetyOfficers,
			employeeCount: 7,
			certifiedOfficers: 7,
		},
		{
			id: "comp-6",
			nameKey: localizationConstants.wCompSkillGaps,
			employeeCount: 4,
			isGap: true,
		},
	],

	// 11. Utbildningar
	trainingPrograms: [
		{
			id: "train-1",
			nameKey: localizationConstants.wActiveTrainingPrograms,
			enrolledCount: 3,
			status: "active",
		},
		{
			id: "train-2",
			nameKey: localizationConstants.wEmployeesInTraining,
			enrolledCount: 8,
			status: "active",
		},
		{
			id: "train-3",
			nameKey: localizationConstants.wCompletedThisMonth,
			enrolledCount: 12,
			status: "active",
		},
		{
			id: "train-4",
			nameKey: localizationConstants.wUpcomingTraining,
			enrolledCount: 15,
			status: "upcoming",
			dateLabelKey: localizationConstants.wAug10Date,
		},
		{
			id: "train-5",
			nameKey: localizationConstants.wOverdueTrainings,
			enrolledCount: 2,
			status: "overdue",
		},
	],

	// 12. Certifikat & Behörigheter
	certificates: [
		{
			id: "cert-overview",
			category: localizationConstants.wCertCategoriesList,
			validCount: 112,
			expiring30DaysCount: 6,
			expiredCount: 2,
			pendingRenewalCount: 4,
		},
	],

	// 13. Bild
	teamImage: {
		imageUrl: "/integrations-illustration.svg",
		captionKey: localizationConstants.wTeamImageCaption,
		titleKey: localizationConstants.wTeamImageTitle,
	},

	// 14. Nyheter
	news: [
		{
			id: "news-1",
			titleKey: localizationConstants.wNewsOvertimeTitle,
			dateKey: localizationConstants.wCalDateAug01,
			category: "policy",
		},
		{
			id: "news-2",
			titleKey: localizationConstants.wNewsSummerSchedule,
			dateKey: localizationConstants.wCalDateJul28,
			category: "schedule",
		},
		{
			id: "news-3",
			titleKey: localizationConstants.wNewsWelcomeSara,
			dateKey: localizationConstants.wCalDateJul29,
			category: "welcome",
		},
		{
			id: "news-4",
			titleKey: localizationConstants.wNewsPerfReviews,
			dateKey: localizationConstants.wCalDateJul30,
			category: "review",
		},
	],
};
