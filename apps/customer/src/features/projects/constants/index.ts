import localizationConstants from "@/utils/translation/constants";
import type {
  ActiveProject,
  ProjectDocument,
  PersonalDocument,
  MeetingMinute,
  ProjectQuestion,
  TimelineEvent,
  OrgMember,
} from "../types";

export const ACTIVE_PROJECT_MAIN_TABS = [
  { value: "project", label: localizationConstants.projectTabProject },
  { value: "contract", label: localizationConstants.projectTabContract },
  { value: "finance", label: localizationConstants.projectTabFinance },
  {
    value: "quality",
    label: localizationConstants.projectTabQualityManagement,
  },
] as const;

export type ActiveProjectMainTabValue =
  (typeof ACTIVE_PROJECT_MAIN_TABS)[number]["value"];

export const ACTIVE_PROJECT_MAIN_TAB_VALUES = ACTIVE_PROJECT_MAIN_TABS.map(
  (t) => t.value,
) as readonly ActiveProjectMainTabValue[];

export const ACTIVE_PROJECT_DEFAULT_TAB =
  ACTIVE_PROJECT_MAIN_TABS[0].value;

export const ACTIVE_PROJECT_SUB_TABS = [
  {
    value: "personal-info",
    label: localizationConstants.projectSubTabPersonalInfo,
  },
  {
    value: "documents",
    label: localizationConstants.projectSubTabDocuments,
  },
  {
    value: "meeting-minutes",
    label: localizationConstants.projectSubTabMeetingMinutes,
  },
  { value: "qa", label: localizationConstants.projectSubTabQA },
  {
    value: "timeline",
    label: localizationConstants.projectSubTabTimeline,
  },
  {
    value: "org-plan",
    label: localizationConstants.projectSubTabOrgPlan,
  },
] as const;

export type ActiveProjectSubTabValue =
  (typeof ACTIVE_PROJECT_SUB_TABS)[number]["value"];

export const ACTIVE_PROJECT_SUB_TAB_VALUES = ACTIVE_PROJECT_SUB_TABS.map(
  (t) => t.value,
) as readonly ActiveProjectSubTabValue[];

export const ACTIVE_PROJECT_DEFAULT_SUB_TAB =
  ACTIVE_PROJECT_SUB_TABS[0].value;

export const DUMMY_PROJECTS: ActiveProject[] = [
  {
    id: "1",
    name: "Bathroom",
    referenceNo: "O101",
    orderNo: "2024-01",
    quoteReferenceNo: "1554601",
    clientNo: "CL-10023",
    projectNo: "PRJ-2024-001",
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    contactPersonName: "Anna Andersson",
    mobileNumber: "070-560 50 50",
    email: "anna@example.com",
    address: "Stengatan 10",
    postalCode: "171 63",
    companyName: "Karles bygg AB",
    status: "received-quote",
    statusLabel: "Received Quote",
    category: "Bathroom",
    description: "Full bathroom renovation including new tiles, shower, and fixtures.",
  },
  {
    id: "2",
    name: "Kitchen",
    referenceNo: "O02",
    orderNo: "2024-02",
    quoteReferenceNo: "1578601",
    clientNo: "CL-10024",
    projectNo: "PRJ-2024-002",
    startDate: "2024-04-15",
    endDate: "2024-08-15",
    contactPersonName: "Erik Johansson",
    mobileNumber: "073-123 45 67",
    email: "erik@example.com",
    address: "Bergsgatan 5",
    postalCode: "113 25",
    companyName: "Kökbygg AB",
    status: "completed",
    statusLabel: "Completed",
    category: "Kitchen",
    description: "Complete kitchen remodel with new cabinets and countertops.",
  },
  {
    id: "3",
    name: "Kitchen",
    referenceNo: "O03",
    orderNo: "2024-02",
    quoteReferenceNo: "1578601",
    clientNo: "CL-10025",
    projectNo: "PRJ-2024-003",
    startDate: "2024-05-01",
    endDate: "2024-07-01",
    contactPersonName: "Maria Nilsson",
    mobileNumber: "076-987 65 43",
    email: "maria@example.com",
    address: "Tallvägen 22",
    postalCode: "182 31",
    companyName: "Kökbygg AB",
    status: "draft",
    statusLabel: "Draft",
    category: "Kitchen",
    description: "Complete roof replacement with new insulation.",
  },
];

export const DUMMY_PERSONAL_DOCUMENTS: PersonalDocument[] = [
  { id: "1", name: "Bathroom Renovation", type: "Architecture Drawing" },
];

export const DUMMY_PROJECT_DOCUMENTS: ProjectDocument[] = [
  {
    id: "1",
    name: "Arbetsbeskrivning",
    specification: "Construction Drawing",
    type: "PDF",
    date: "2024-05-10",
    fileUrl: "#",
  },
  {
    id: "2",
    name: "Policy",
    specification: "Color Scheme",
    type: "PDF",
    date: "2024-05-10",
    fileUrl: "#",
  },
  {
    id: "3",
    name: "Material List",
    specification: "Specification",
    type: "XLSX",
    date: "2024-05-12",
    fileUrl: "#",
  },
];

export const DUMMY_MEETING_MINUTES: MeetingMinute[] = [
  {
    id: "1",
    title: "Meeting with IT Team",
    date: "2024-11-12",
    rating: "good",
    description:
      "Initial meeting to align on project scope and timeline. All parties present.",
  },
  {
    id: "2",
    title: "Mouse not working, need replacement",
    date: "2024-10-06",
    rating: "bad",
    description:
      "Inspection revealed quality issues. Contractor tasked with corrections.",
  },
  {
    id: "3",
    title: "Screen poor quality, needs review",
    date: "2024-10-06",
    rating: "moderate",
    description:
      "Reviewed progress. Minor delays due to material delivery. New schedule agreed upon.",
  },
];

export const DUMMY_PROJECT_QUESTIONS: ProjectQuestion[] = [
  {
    id: "1",
    question: "When will the tiles be delivered?",
    answer: "Tiles are scheduled for delivery on March 15th.",
    date: "2024-03-08",
    isAnswered: true,
  },
  {
    id: "2",
    question: "Can we change the shower position?",
    answer: undefined,
    date: "2024-03-12",
    isAnswered: false,
  },
  {
    id: "3",
    question: "What warranty is provided on the fixtures?",
    answer: "All fixtures come with a 5-year manufacturer warranty.",
    date: "2024-03-20",
    isAnswered: true,
  },
];

export const DUMMY_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "1",
    title: "Project Start",
    date: "2024-03-01",
    description: "Project officially started. Site preparation begins.",
    isCompleted: true,
  },
  {
    id: "2",
    title: "Demolition Complete",
    date: "2024-03-15",
    description: "Old bathroom fixtures and tiles removed.",
    isCompleted: true,
  },
  {
    id: "3",
    title: "Plumbing Rough-In",
    date: "2024-04-01",
    description: "New plumbing connections installed.",
    isCompleted: true,
  },
  {
    id: "4",
    title: "Tiling",
    date: "2024-04-20",
    description: "Wall and floor tiles being installed.",
    isCompleted: false,
  },
  {
    id: "5",
    title: "Fixture Installation",
    date: "2024-05-15",
    description: "Shower, toilet, and vanity installation.",
    isCompleted: false,
  },
  {
    id: "6",
    title: "Project Completion",
    date: "2024-06-30",
    description: "Final inspection and handover.",
    isCompleted: false,
  },
];

export const DUMMY_ORG_MEMBERS: OrgMember[] = [
  {
    id: "1",
    company: "Bygg & Co AB",
    category: "Construction",
    role: "Main Contractor",
    contactPerson: "Lars Pettersson",
    phone: "08-123 456 78",
    mail: "lars@byggco.se",
  },
  {
    id: "2",
    company: "VVS Expert AB",
    category: "Plumbing",
    role: "Subcontractor",
    contactPerson: "Karin Lindberg",
    phone: "08-987 654 32",
    mail: "karin@vvsexpert.se",
  },
  {
    id: "3",
    company: "El-Proffs AB",
    category: "Electrical",
    role: "Subcontractor",
    contactPerson: "Johan Holm",
    phone: "070-111 22 33",
    mail: "johan@elproffs.se",
  },
];
