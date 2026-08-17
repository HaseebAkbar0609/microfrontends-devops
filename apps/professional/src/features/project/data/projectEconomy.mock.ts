export interface ProjectEconomyItem {
	id: string;
	projectNr: string;
	name: string;
	totalRevenue: string;
	totalCosts: string;
	tbContribution: string;
}

export const PROJECT_ECONOMY_TOTAL_TB = "15,360,000";

export const PROJECT_ECONOMY_ROWS: ProjectEconomyItem[] = [
	{
		id: "5000",
		projectNr: "#5000",
		name: "Renovation",
		totalRevenue: "Totalentreprenad",
		totalCosts: "Nyproduktion",
		tbContribution: "10.000",
	},
	{
		id: "5001",
		projectNr: "#5001",
		name: "Renovation",
		totalRevenue: "Generalentreprenad",
		totalCosts: "ROT",
		tbContribution: "10.000",
	},
	{
		id: "5002",
		projectNr: "#5002",
		name: "Renovation",
		totalRevenue: "Löpande",
		totalCosts: "Service",
		tbContribution: "10.000",
	},
	{
		id: "5003",
		projectNr: "#5003",
		name: "Renovation",
		totalRevenue: "Samverkan",
		totalCosts: "ROT",
		tbContribution: "10.000",
	},
	{
		id: "5004",
		projectNr: "#5004",
		name: "Renovation",
		totalRevenue: "Totalentreprenad",
		totalCosts: "ROT",
		tbContribution: "10.000",
	},
	{
		id: "5005",
		projectNr: "#5005",
		name: "Renovation",
		totalRevenue: "Totalentreprenad",
		totalCosts: "ROT",
		tbContribution: "10.000",
	},
];
