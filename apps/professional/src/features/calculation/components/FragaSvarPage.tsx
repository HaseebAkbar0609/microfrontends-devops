"use client";

import { CalculationQaPage } from "./qa/CalculationQaPage";
import type { QACard } from "../types/fragaSvar";

export interface FragaSvarPageProps {
	calcId: string;
	cards?: QACard[];
}

export function FragaSvarPage({ calcId }: FragaSvarPageProps) {
	return <CalculationQaPage calcId={calcId} />;
}

export default FragaSvarPage;
