import type { ForecastListRow } from "../types/forecastList.types";

/**
 * Prognoslista's rows in the TFS-1052 frame's style until a forecast API
 * exists. Kostnader are negative, as the frame writes them; TB-bidrag is
 * derived from the two.
 */
export const INITIAL_FORECAST_LIST: ForecastListRow[] = [
	{ id: "fc-1", objectNo: "2021-1", customer: "Birgitta Andersson", category: "newBuild", customerType: "b2b", projectName: "Kv Solen", startDate: "2021-07-01", endDate: "2021-12-17", costCentre: "10", responsible: "Robert Hellgren", revenue: 5860, costs: -1560, status: "done" },
	{ id: "fc-2", objectNo: "2021-2", customer: "Johan Lindqvist", category: "service", customerType: "private", projectName: "Kv Månen", startDate: "2021-07-12", endDate: "2021-09-30", costCentre: "11 Service", responsible: "Robert Hellgren", revenue: 4200, costs: -2350, status: "done" },
	{ id: "fc-3", objectNo: "2021-3", customer: "Karin Holm", category: "contracting", customerType: "private", projectName: "Kv Stjärnan", startDate: "2021-08-02", endDate: "2022-03-31", costCentre: "15 Entreprenad", responsible: "Sara Ekström", revenue: 12480, costs: -8920, status: "done" },
	{ id: "fc-4", objectNo: "2021-4", customer: "Byggbolaget Norr AB", category: "service", customerType: "b2b", projectName: "Kv Kometen", startDate: "2021-08-16", endDate: "2021-11-26", costCentre: "10 Produktion", responsible: "Robert Hellgren", revenue: 7650, costs: -3100, status: "done" },
	{ id: "fc-5", objectNo: "2021-5", customer: "Lars Berglund", category: "service", customerType: "private", projectName: "Kv Solen", startDate: "2021-09-01", endDate: "2021-10-15", costCentre: "15", responsible: "Anna Nyberg", revenue: 2980, costs: -1240, status: "done" },
	{ id: "fc-6", objectNo: "2021-6", customer: "Fastighets AB Ekbacken", category: "newBuild", customerType: "b2b", projectName: "Kv Ekbacken", startDate: "2021-09-13", endDate: "2022-06-30", costCentre: "11", responsible: "Sara Ekström", revenue: 18900, costs: -14250, status: "done" },
	{ id: "fc-7", objectNo: "2021-7", customer: "Maria Sjöberg", category: "contracting", customerType: "private", projectName: "Kv Björken", startDate: "2021-10-04", endDate: "2022-01-28", costCentre: "15 Entreprenad", responsible: "Anna Nyberg", revenue: 9340, costs: -6780, status: "done" },
	{ id: "fc-8", objectNo: "2021-8", customer: "Åkesson Bygg AB", category: "newBuild", customerType: "b2b", projectName: "Kv Linden", startDate: "2021-10-18", endDate: "2022-08-31", costCentre: "10 Produktion", responsible: "Robert Hellgren", revenue: 24500, costs: -19800, status: "done" },
	{ id: "fc-9", objectNo: "2021-9", customer: "Erik Wallin", category: "service", customerType: "private", projectName: "Kv Månen", startDate: "2021-11-01", endDate: "2021-12-10", costCentre: "11 Service", responsible: "Sara Ekström", revenue: 1850, costs: -960, status: "done" },
	{ id: "fc-10", objectNo: "2021-10", customer: "Östermalms Förvaltning AB", category: "contracting", customerType: "b2b", projectName: "Kv Stjärnan", startDate: "2021-11-15", endDate: "2022-05-20", costCentre: "15", responsible: "Robert Hellgren", revenue: 15600, costs: -11450, status: "done" },
	{ id: "fc-11", objectNo: "2021-11", customer: "Birgitta Andersson", category: "service", customerType: "private", projectName: "Kv Solen", startDate: "2021-12-01", endDate: "2022-01-14", costCentre: "10", responsible: "Anna Nyberg", revenue: 3420, costs: -1780, status: "done" },
	{ id: "fc-12", objectNo: "2021-12", customer: "Nordbygg Entreprenad AB", category: "newBuild", customerType: "b2b", projectName: "Kv Kometen", startDate: "2021-12-13", endDate: "2022-09-30", costCentre: "11", responsible: "Sara Ekström", revenue: 21300, costs: -16900, status: "done" },
];
