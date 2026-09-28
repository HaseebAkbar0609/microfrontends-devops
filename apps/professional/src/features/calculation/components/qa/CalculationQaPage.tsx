"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useCalculationQaBoard } from "../../hooks/useCalculationQaBoard";
import { CalculationQaBoard } from "./CalculationQaBoard";

export interface CalculationQaPageProps {
	calcId: string;
}

export function CalculationQaPage({ calcId }: CalculationQaPageProps) {
	const t = useTranslate();
	const board = useCalculationQaBoard(calcId);
	const [activeSubTab, setActiveSubTab] = useState<string>("all");

	const cleanId = calcId.replace(/^kalkyl\s*/i, "");
	const calcLabel = `${t(localizationConstants.calculation)} ${cleanId || calcId}`;
	const overviewHref = `/module/business/calculation/overview/${cleanId || calcId}`;

	return (
		<div className="flex flex-1 flex-col overflow-y-auto bg-slate-50 px-6 sm:pl-15 sm:pr-6 pt-5 pb-8">
			{/* Page Title: Kalkyl 3001 / Fråga/Svar directly above tabbar */}
			<div className="mb-4">
				<h1 className="flex items-center gap-1.5 font-sans text-xl sm:text-2xl font-bold tracking-tight">
					<Link
						href={overviewHref}
						className="font-medium text-[#8FA0B5] hover:text-slate-600 transition-colors"
					>
						{calcLabel}
					</Link>
					<span className="font-light text-[#8FA0B5]">/</span>
					<span className="font-bold text-slate-950">
						<Translate text={localizationConstants.calcQATitle} />
					</span>
				</h1>
			</div>

			{/* Subtabs Bar (All / Arkiv) using shadcn Tabs with variant="line" */}
			<Tabs
				value={activeSubTab}
				onValueChange={setActiveSubTab}
				className="w-full gap-4"
			>
				<TabsList variant="line" className="w-full">
					<TabsTrigger value="all" variant="line">
						<Translate text={localizationConstants.calcQAAll} />
					</TabsTrigger>
					<TabsTrigger value="archive" variant="line">
						<Translate text={localizationConstants.calcQAArchive} />
					</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="mt-0 focus-visible:outline-none">
					<CalculationQaBoard board={board} />
				</TabsContent>
				<TabsContent value="archive" className="mt-0 focus-visible:outline-none">
					<CalculationQaBoard board={board} archivedOnly />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default CalculationQaPage;
