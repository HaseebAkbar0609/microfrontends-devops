import type { OrderOpenedData } from "../types/orderOpened.types";
import localizationConstants from "@/utils/translation/constants";
import { MOCK_ORDERS } from "../../data/orders.mock";

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
	companyInfo: {
		companyId: "comp-nesse-01",
		name: "Nesse bygg AB",
		email: "Per@nessebygg.com",
		phone: "076000000",
		address: "Storgatan 16, 18880 Stockholm.",
		orgNumber: "556310-1010",
	},
	projectDescription: {
		projectName: "Kök project",
		workLocation: "Adress där renoveringen ska utföra",
		specifications: "-",
	},
	offerDetails: {
		offerNo: "1234",
		work: "Total kostnad för projektet, inklusive material och arbete.",
		material: "Enter material",
		totalOffer: "Enter budget",
		rotDeductionLabor: "---",
		paymentTerms: "Info",
		rotDeductionSettled: "ja",
		secondaryPaymentTerms: "Info",
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

/**
 * Resolves order details from mock dataset by matching order ID or serial number
 */
export function getOrderOpenedMockById(orderId?: string): OrderOpenedData {
	if (!orderId) return MOCK_ORDER_OPENED_DATA;

	const cleanTarget = orderId.replace(/[#\s-]/g, "").toLowerCase();
	const matched = MOCK_ORDERS.find(
		(o) =>
			o.id === orderId ||
			o.orderNo === orderId ||
			o.orderNo.replace(/[#\s-]/g, "").toLowerCase() === cleanTarget
	);

	if (!matched) {
		return {
			...MOCK_ORDER_OPENED_DATA,
			id: orderId,
			orderDetails: {
				...MOCK_ORDER_OPENED_DATA.orderDetails,
				serialNo: orderId,
			},
		};
	}

	const serialNo = matched.orderNo ? matched.orderNo.replace("#", "").trim() : orderId;
	const parts = (matched.projectManager || "").split(" ");
	const firstName = parts[0] || matched.projectManager || "Projektledare";
	const lastName = parts.slice(1).join(" ") || "Manager";

	return {
		...MOCK_ORDER_OPENED_DATA,
		id: matched.id,
		title: matched.orderName || MOCK_ORDER_OPENED_DATA.title,
		customerInfo: {
			...MOCK_ORDER_OPENED_DATA.customerInfo,
			customerName: matched.customer || MOCK_ORDER_OPENED_DATA.customerInfo.customerName,
		},
		contactPerson: {
			...MOCK_ORDER_OPENED_DATA.contactPerson,
			firstName,
			lastName,
			role: "Projektledare",
			email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
		},
		orderDetails: {
			...MOCK_ORDER_OPENED_DATA.orderDetails,
			serialNo,
			orderName: matched.orderName || MOCK_ORDER_OPENED_DATA.orderDetails.orderName,
		},
		orderInfo: {
			...MOCK_ORDER_OPENED_DATA.orderInfo,
			category: matched.type === "ongoing" ? "Löpande" : "Fast pris",
			contractAmount: matched.orderSum ? `${matched.orderSum} kr` : MOCK_ORDER_OPENED_DATA.orderInfo.contractAmount,
			startDate: matched.start || MOCK_ORDER_OPENED_DATA.orderInfo.startDate,
			endDate: matched.end || MOCK_ORDER_OPENED_DATA.orderInfo.endDate,
		},
		projectDescription: {
			projectName: `${matched.orderName} (${matched.customer})`,
			workLocation: MOCK_ORDER_OPENED_DATA.projectDescription?.workLocation || "Adress där renoveringen ska utföra",
			specifications: "-",
		},
	};
}
