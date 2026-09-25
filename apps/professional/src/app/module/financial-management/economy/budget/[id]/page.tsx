"use client";

import React, { use } from "react";
import { BudgetDetailRoute } from "@/features/financial-management";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default function BudgetDetailRoutepage({ params }: PageProps) {
	const { id } = use(params);
	return <BudgetDetailRoute id={id} />;
}
