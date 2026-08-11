import type { OrderOpenedData } from "../types/orderOpened.types";
import localizationConstants from "@/utils/translation/constants";

export const MOCK_ORDER_OPENED_DATA: OrderOpenedData = {
	id: "001",
	title: "Köksrenoveringsjobb",
	titleKey: localizationConstants.orderTitleKitchenRenovation,
	isDirect: true,
	postedDate: "18-12-2024",
	tags: ["Stockholm", "Järfälla"],
	tagKeys: [localizationConstants.tagStockholm, localizationConstants.tagJarfalla],
	budgetAmount: 1586000,
	customerInfo: {
		customerName: "Fastighetsbolaget AB",
		address: "Ange adressen",
		postCode: "12345432",
		city: "Info",
		email: "contact@email.com",
		phone: "-",
		orgNumber: "-",
	},
	contactPerson: {
		firstName: "Fastighetsbolaget AB",
		lastName: "Name",
		email: "anna@example.com",
		mobile: "000 7961 248",
		role: "-",
	},
	orderDetails: {
		serialNo: "001",
		orderName: "Renovation",
		quarterName: "-",
		orderAddress: "Storgatan 16, 18880 Stockholm.",
		postCode: "000892",
		city: "-",
	},
	orderInfo: {
		type: "-",
		category: "-",
		department: "-",
		contractAmount: "-",
		offerNo: "-",
		startDate: "12/10/2025",
		endDate: "12/10/2026",
	},
	documents: [
		{
			id: "doc-1",
			date: "2024-05-10",
			documentName: "Dockumentets namn",
			fileName: "Kontrakt.pdf",
			fileType: "pdf",
		},
		{
			id: "doc-2",
			date: "2024-05-10",
			documentName: "Dockumentets namn",
			fileName: "Kontrakt.pdf",
			fileType: "doc",
		},
	],
};
