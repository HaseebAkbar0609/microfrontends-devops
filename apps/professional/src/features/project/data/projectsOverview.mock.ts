import { mockDate } from "@/features/widgetdashboard/utils/mockDates";

export interface ProjectListItem {
	id: string;
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
];
