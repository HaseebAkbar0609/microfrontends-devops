"use client";

import React from "react";
import { BudgetCreateRoute } from "@/features/financial-management/components/budget/routes/BudgetCreateRoute";
import { FORECAST_BUDGET_BASE_ROUTE } from "@/features/financial-management/constants/budget.constants";

export default function ForecastCreateBudgetRoute() {
	return <BudgetCreateRoute basePath={FORECAST_BUDGET_BASE_ROUTE} />;
}
