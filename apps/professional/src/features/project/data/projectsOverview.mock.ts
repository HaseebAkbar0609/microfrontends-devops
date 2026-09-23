import { mockDate } from "@/features/widgetdashboard/utils/mockDates";

export interface ProjectListItem {
	id: string;
	version?: number;
	projectNr: string;
	name: string;
	category: string;
	department: string;
	contractSum: string;
	projectManager: string;
	customer: string;
	offerNr: string;
	startDate: string;
	endDate: string;
	/**
	 * Archived rows leave the active list and appear under Arkiv.
	 *
	 * Optional so a row created without it — the create wizard appends one —
	 * is active, which is what a new project should be.
	 */
	archived?: boolean;
}

export const PROJECT_LIST_ROWS: ProjectListItem[] = [
	{
		id: "5000",
		projectNr: "#5000",
		name: "Renovation",
		category: "Totalentreprenad",
		department: "Nyproduktion",
		contractSum: "10.000",
		projectManager: "Lindsey Philips",
		customer: "Fastighetsbolag",
		offerNr: "12000",
		startDate: mockDate(-40),
		endDate: mockDate(20),
	},
	{
		id: "5001",
		projectNr: "#5001",
		name: "Renovation",
		category: "Generalentreprenad",
		department: "ROT",
		contractSum: "10.000",
		projectManager: "Abram Siphron",
		customer: "Locum",
		offerNr: "12000",
		startDate: mockDate(-35),
		endDate: mockDate(25),
	},
	{
		id: "5002",
		projectNr: "#5002",
		name: "Renovation",
		category: "Löpande",
		department: "Service",
		contractSum: "10.000",
		projectManager: "Jocelyn Gouse",
		customer: "Sisab",
		offerNr: "12000",
		startDate: mockDate(-30),
		endDate: mockDate(30),
	},
	{
		id: "5003",
		projectNr: "#5003",
		name: "Renovation",
		category: "Samverkan",
		department: "ROT",
		contractSum: "10.000",
		projectManager: "Wilson Dokidis",
		customer: "Anna Karlsson",
		offerNr: "12000",
		startDate: mockDate(-25),
		endDate: mockDate(35),
	},
	{
		id: "5004",
		projectNr: "#5004",
		name: "Renovation",
		category: "Totalentreprenad",
		department: "ROT",
		contractSum: "10.000",
		projectManager: "Carla Calzoni",
		customer: "Fabege",
		offerNr: "12000",
		startDate: mockDate(-20),
		endDate: mockDate(40),
	},
	{
		id: "5005",
		projectNr: "#5005",
		name: "Renovation",
		category: "Totalentreprenad",
		department: "ROT",
		contractSum: "10.000",
		projectManager: "Lindsey Philips",
		customer: "Drott",
		offerNr: "12000",
		startDate: mockDate(-15),
		endDate: mockDate(45),
	},

	/*
	 * Archived. Appended rather than flagging existing rows, so the active list
	 * still shows the six it always has and Arkiv is not empty on first load.
	 * Older dates and varied categories, managers and customers, so the Sök box
	 * and the Filter dropdown have something to narrow.
	 */
	{
		id: "5006",
		projectNr: "#5006",
		name: "Fasadrenovering",
		category: "Totalentreprenad",
		department: "ROT",
		contractSum: "8.500",
		projectManager: "Carla Calzoni",
		customer: "Locum",
		offerNr: "11800",
		startDate: mockDate(-400),
		endDate: mockDate(-120),
		archived: true,
	},
	{
		id: "5007",
		projectNr: "#5007",
		name: "Stambyte Kv Eken",
		category: "Generalentreprenad",
		department: "Service",
		contractSum: "14.200",
		projectManager: "Wilson Dokidis",
		customer: "Sisab",
		offerNr: "11750",
		startDate: mockDate(-360),
		endDate: mockDate(-90),
		archived: true,
	},
	{
		id: "5008",
		projectNr: "#5008",
		name: "Takomläggning",
		category: "Löpande",
		department: "Nyproduktion",
		contractSum: "6.900",
		projectManager: "Jocelyn Gouse",
		customer: "Fabege",
		offerNr: "11690",
		startDate: mockDate(-320),
		endDate: mockDate(-60),
		archived: true,
	},
];
