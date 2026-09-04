import type { OrderOpenedData } from "../types/orderOpened.types";
import localizationConstants from "@/utils/translation/constants";
import {
  CONTACT_ROLES,
  ORDER_CATEGORIES,
} from "../constants/orderOpened.constants";
import { MOCK_ORDERS } from "../../data/orders.mock";

export const MOCK_ORDER_OPENED_DATA: OrderOpenedData = {
  id: "001",
  title: "Köksrenoveringsjobb",
  titleKey: localizationConstants.orderTitleKitchenRenovation,
  isDirect: true,
  postedDate: "2024-12-18",
  tags: ["Stockholm", "Järfälla"],
  tagKeys: [
    localizationConstants.tagStockholm,
    localizationConstants.tagJarfalla,
  ],
  budgetAmount: 1586000,
  customerInfo: {
    customerName: "Exempelföretag AB",
    address: "Exempelgatan 1",
    postCode: "12345",
    city: "Stockholm",
    email: "contact@example.com",
    phone: "08-000 000 00",
    orgNumber: "556000-0000",
  },
  contactPerson: {
    firstName: "Exempel",
    lastName: "Användare",
    email: "user@example.com",
    mobile: "08-000 000 00",
    role: CONTACT_ROLES.PROJECT_MANAGER,
  },
  orderDetails: {
    serialNo: "001",
    orderName: "Renovering",
    quarterName: "-",
    orderAddress: "Exempelgatan 1, 123 45 Stockholm",
    postCode: "12345",
    city: "Stockholm",
  },
  orderInfo: {
    type: "-",
    category: ORDER_CATEGORIES.CLIENT,
    department: "-",
    contractAmount: "-",
    offerNo: "-",
    startDate: "2025-10-12",
    endDate: "2026-10-12",
  },
  companyInfo: {
    companyId: "comp-example-01",
    name: "Exempel Bygg AB",
    email: "company@example.com",
    phone: "08-000 000 00",
    address: "Exempelgatan 1, 123 45 Stockholm",
    orgNumber: "556000-0000",
  },
  projectDescription: {
    projectName: "Köksprojekt",
    workLocation: "Exempelgatan 1, 123 45 Stockholm",
    specifications: "-",
  },
  offerDetails: {
    offerNo: "1234",
    work: "Total kostnad för projektet, inklusive material och arbete.",
    material: "Material",
    totalOffer: "10 000 kr",
    rotDeductionLabor: "---",
    paymentTerms: "30 dagar",
    rotDeductionSettled: "ja",
    secondaryPaymentTerms: "30 dagar",
  },
  documents: [
    {
      id: "doc-1",
      date: "2024-05-10",
      documentName: "Dokumentets namn",
      fileName: "Kontrakt.pdf",
      fileType: "pdf",
    },
    {
      id: "doc-2",
      date: "2024-05-10",
      documentName: "Dokumentets namn",
      fileName: "Underlag.docx",
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
      o.orderNo.replace(/[#\s-]/g, "").toLowerCase() === cleanTarget,
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

  const serialNo = matched.orderNo
    ? matched.orderNo.replace("#", "").trim()
    : orderId;
  const parts = (matched.projectManager || "").split(" ");
  const firstName = parts[0] || "Projektledare";
  const lastName = parts.slice(1).join(" ") || "Manager";

  return {
    ...MOCK_ORDER_OPENED_DATA,
    id: matched.id,
    title: matched.orderName || MOCK_ORDER_OPENED_DATA.title,
    customerInfo: {
      ...MOCK_ORDER_OPENED_DATA.customerInfo,
      customerName:
        matched.customer || MOCK_ORDER_OPENED_DATA.customerInfo.customerName,
    },
    contactPerson: {
      ...MOCK_ORDER_OPENED_DATA.contactPerson,
      firstName,
      lastName,
      role: CONTACT_ROLES.PROJECT_MANAGER,
      email: "contact@example.com",
    },
    orderDetails: {
      ...MOCK_ORDER_OPENED_DATA.orderDetails,
      serialNo,
      orderName:
        matched.orderName || MOCK_ORDER_OPENED_DATA.orderDetails.orderName,
    },
    orderInfo: {
      ...MOCK_ORDER_OPENED_DATA.orderInfo,
      category:
        matched.type === "ongoing"
          ? ORDER_CATEGORIES.ONGOING
          : ORDER_CATEGORIES.FIXED_PRICE,
      contractAmount: matched.orderSum
        ? `${matched.orderSum} kr`
        : MOCK_ORDER_OPENED_DATA.orderInfo.contractAmount,
      startDate: matched.start || MOCK_ORDER_OPENED_DATA.orderInfo.startDate,
      endDate: matched.end || MOCK_ORDER_OPENED_DATA.orderInfo.endDate,
    },
    projectDescription: {
      projectName: `${matched.orderName} (${matched.customer})`,
      workLocation:
        MOCK_ORDER_OPENED_DATA.projectDescription?.workLocation ||
        "Exempelgatan 1, 123 45 Stockholm",
      specifications: "-",
    },
  };
}
