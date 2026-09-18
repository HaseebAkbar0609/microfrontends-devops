"use client";

import React from "react";
import { PaymentPlanDetailView } from "./components/PaymentPlanDetailView";
import { PAYMENT_PLAN_CONSTANTS } from "./constants/paymentPlan.constants";
import { useOrderOpened } from "../opened/hooks/useOrderOpened";

export interface OrderPaymentPlanDetailPageProps {
	orderId?: string;
	planId?: string;
}

function sanitizeText(input?: string): string {
	if (!input) return "";
	return input.replace(/[<>'"`]/g, "").trim();
}

export function OrderPaymentPlanDetailPage({
	orderId = PAYMENT_PLAN_CONSTANTS.DEFAULT_ORDER_ID,
	planId = "1",
}: OrderPaymentPlanDetailPageProps) {
	const { orderData } = useOrderOpened(orderId);
	const rawSerialNo = orderData.orderDetails.serialNo || orderData.id || "";
	const serialNo = sanitizeText(rawSerialNo);

	return <PaymentPlanDetailView orderId={orderId} planId={planId} serialNo={serialNo} />;
}

export default OrderPaymentPlanDetailPage;
