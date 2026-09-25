"use client";

import React, { use } from "react";
import { RiskDetailRoute } from "@/features/financial-management";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default function ForecastRiskDetailRoute({ params }: PageProps) {
	const { id } = use(params);
	return <RiskDetailRoute id={id} />;
}
