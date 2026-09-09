"use client";

import React from "react";
import { PaymentPlanDetailView } from "./components/PaymentPlanDetailView";
import { PAYMENT_PLAN_CONSTANTS } from "./constants/paymentPlan.constants";

export interface OrderPaymentPlanDetailPageProps {
	orderId?: string;
	planId?: string;
}

export function OrderPaymentPlanDetailPage({
	orderId = PAYMENT_PLAN_CONSTANTS.DEFAULT_ORDER_ID,
	planId = "1",
}: OrderPaymentPlanDetailPageProps) {
	return <PaymentPlanDetailView orderId={orderId} planId={planId} />;
}

export default OrderPaymentPlanDetailPage;
