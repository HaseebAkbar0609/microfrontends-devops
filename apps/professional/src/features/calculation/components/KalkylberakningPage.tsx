"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatCurrency } from "@/utils/formatCurrency";
import { useTemplateCalculation } from "../hooks/useTemplateCalculation";
import { KalkylFlowSelector } from "./kalkylberakning/KalkylFlowSelector";
import { TemplateCalculationWorkspace } from "./kalkylberakning/TemplateCalculationWorkspace";
import { useState } from "react";

interface KalkylberakningPageProps {
	calcNo?: string;
}

export function KalkylberakningPage({ calcNo = "Kalkyl 3001" }: KalkylberakningPageProps) {
	const router = useRouter();
	const calcHook = useTemplateCalculation(calcNo);

	const {
		flowState,
		setFlowState,
		selectedMode,
		setSelectedMode,
		activeTab,
		setActiveTab,
		handleStartWorkspace,
		sections,
		sectionTotals,
		totalCalculationSum,
		handleSave,
		isSaving,
	} = calcHook;

	const [vinstPct, setVinstPct] = useState<string>("10");
	const overheadAmount = 0;

	const vinstValue = (totalCalculationSum * (parseFloat(vinstPct) || 0)) / 100;
	const finalOfferSum = totalCalculationSum + overheadAmount + vinstValue;

	const handleBack = () => {
		if (flowState === "workspace") {
			setFlowState("choose");
			setActiveTab("kalkyl");
		} else {
			router.back();
		}
	};

	return (
		<div className="flex flex-1 flex-col bg-slate-50">
			{/* Page Header */}
			<div className="shrink-0 border-b border-slate-200 bg-white">
				{/* Title row */}
				<div className="px-6 pt-5 pb-3.5 sm:pl-15">
					{flowState === "choose" ? (
						<h1 className="text-2xl font-semibold tracking-tight text-slate-900">
							<span className="text-slate-400 font-normal">{calcNo} / </span>
							<Translate text={localizationConstants.calcBerPageTitle} />
							<span className="text-slate-900">
								<Translate text={localizationConstants.calcBerStandardSuffix} />
							</span>
						</h1>
					) : (
						<button
							type="button"
							onClick={handleBack}
							className="flex cursor-pointer items-center gap-2.5 text-2xl font-semibold tracking-tight text-slate-900 hover:text-slate-700 transition-colors -ml-7 sm:-ml-8.5"
						>
							<ArrowLeft className="h-6 w-6 text-slate-900" />
							<Translate text={localizationConstants.calcBerNyKalkyl} />
						</button>
					)}
				</div>

				{/* Subtabs Bar — exactly matching Information tab styling */}
				<div className="px-6 -mb-[1px] sm:pl-15">
					<div className="overflow-x-auto scrollbar-none">
						<nav
							className="inline-flex items-center gap-1 sm:gap-2 min-w-max h-[36px]"
							aria-label="Kalkylberäkning Tabs"
						>
							<button
								type="button"
								onClick={() => setActiveTab("kalkyl")}
								className={cn(
									"relative inline-flex items-center justify-center h-[36px] px-3 sm:px-4.5 pb-2 pt-1 font-sans text-sm font-semibold leading-none tracking-normal text-center whitespace-nowrap transition-colors cursor-pointer",
									activeTab === "kalkyl"
										? "text-slate-950 font-bold"
										: "text-slate-600 hover:text-slate-900 font-medium",
								)}
							>
								<Translate text={localizationConstants.calcKalkyl} />
								{activeTab === "kalkyl" && (
									<span className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-950 z-10" />
								)}
							</button>

							<button
								type="button"
								disabled={flowState === "choose"}
								onClick={() => setActiveTab("sammanfattning")}
								className={cn(
									"relative inline-flex items-center justify-center h-[36px] px-3 sm:px-4.5 pb-2 pt-1 font-sans text-sm font-semibold leading-none tracking-normal text-center whitespace-nowrap transition-colors",
									flowState === "choose"
										? "cursor-not-allowed text-slate-300 font-medium"
										: activeTab === "sammanfattning"
											? "cursor-pointer text-slate-950 font-bold"
											: "cursor-pointer text-slate-600 hover:text-slate-900 font-medium",
								)}
							>
								<Translate text={localizationConstants.calcBerSammanfattningTab} />
								{activeTab === "sammanfattning" && flowState !== "choose" && (
									<span className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-950 z-10" />
								)}
							</button>
						</nav>
					</div>
				</div>
			</div>

			{/* Main Tab Switcher Content */}
			<div className="flex flex-1 flex-col overflow-hidden">
				{activeTab === "kalkyl" && flowState === "choose" && (
					<KalkylFlowSelector
						selectedMode={selectedMode}
						onSelectMode={setSelectedMode}
						templates={calcHook.templates}
						selectedTemplateId={calcHook.selectedTemplateId}
						onSelectTemplate={(id) => void calcHook.handleSelectTemplate(id)}
						onStart={handleStartWorkspace}
						onCancel={() => router.back()}
					/>
				)}

				{activeTab === "kalkyl" && flowState === "workspace" && (
					<TemplateCalculationWorkspace
						calcHook={calcHook}
						onNextTab={() => setActiveTab("sammanfattning")}
						onCancel={handleBack}
					/>
				)}

				{activeTab === "sammanfattning" && flowState === "workspace" && (
					<div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
						<div className="flex-1 overflow-y-auto p-6 sm:pl-15 sm:pr-6 space-y-5">
							{/* Sections Summary Table */}
							<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-none">
								<div className="flex h-12 items-center border-b border-slate-200 px-5 bg-white">
									<span className="text-sm font-semibold text-slate-900">
										<Translate text={localizationConstants.calcBerCalculation} />
									</span>
								</div>
								<div className="divide-y divide-slate-100">
									{sections.map((sec) => (
										<div key={sec.id} className="flex items-center justify-between px-5 py-3">
											<span className="text-sm font-medium text-slate-800">{sec.title}</span>
											<span className="text-sm font-semibold tabular-nums text-slate-950">
												{formatCurrency(sectionTotals[sec.id] || 0)}
											</span>
										</div>
									))}
									<div className="flex items-center justify-between bg-slate-50 px-5 py-3.5 border-t border-slate-200">
										<span className="text-sm font-bold text-slate-900">
											<Translate text={localizationConstants.calcBerSummaKalkyl} />
										</span>
										<span className="text-base font-bold tabular-nums text-slate-950">
											{formatCurrency(totalCalculationSum)}
										</span>
									</div>
								</div>
							</Card>

							{/* Summary Breakdown Card */}
							<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-none">
								<div className="flex h-12 items-center border-b border-slate-200 px-5 bg-white">
									<span className="text-sm font-semibold text-slate-900">
										<Translate text={localizationConstants.calcBerSammanstallning} />
									</span>
								</div>
								<div className="divide-y divide-slate-100">
									<div className="flex items-center justify-between px-5 py-3">
										<span className="text-sm text-slate-600">
											<Translate text={localizationConstants.calcBerSummaKalkyl} />
										</span>
										<span className="text-sm font-medium tabular-nums text-slate-900">
											{formatCurrency(totalCalculationSum)}
										</span>
									</div>
									<div className="flex items-center justify-between px-5 py-3">
										<span className="text-sm text-slate-600">
											<Translate text={localizationConstants.calcBerVinstProcent} />
										</span>
										<div className="flex items-center gap-2">
											<Input
												type="number"
												min="0"
												value={vinstPct}
												onChange={(e) => setVinstPct(e.target.value)}
												className="h-8 w-20 text-right text-xs border-slate-200 bg-white font-medium"
											/>
											<span className="text-xs text-slate-500">%</span>
										</div>
									</div>
									<div className="flex items-center justify-between bg-slate-50 px-5 py-4 border-t border-slate-200">
										<span className="text-base font-bold uppercase text-slate-950">
											<Translate text={localizationConstants.calcBerOffert} />
										</span>
										<span className="text-lg font-bold tabular-nums text-slate-950">
											{formatCurrency(finalOfferSum)}
										</span>
									</div>
								</div>
							</Card>
						</div>

						{/* Sticky Bottom Bar */}
						<div className="flex h-16 items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 sm:pl-15 sm:pr-6">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setActiveTab("kalkyl")}
								className="h-9 min-w-24 cursor-pointer rounded-md border-slate-200 bg-white px-5 text-sm font-normal text-slate-900 hover:bg-slate-50 shadow-none"
							>
								<Translate text={localizationConstants.cancelButton} />
							</Button>

							<Button
								type="button"
								size="sm"
								onClick={() => void handleSave()}
								disabled={isSaving}
								className="h-9 min-w-24 cursor-pointer gap-2 rounded-md bg-neutral-950 px-5 text-sm font-medium text-white hover:bg-neutral-800 shadow-none disabled:opacity-50"
							>
								<Save className="h-4 w-4" />
								<Translate text={localizationConstants.saveButton} />
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
