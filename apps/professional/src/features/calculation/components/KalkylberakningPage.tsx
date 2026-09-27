"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTemplateCalculation } from "../hooks/useTemplateCalculation";
import { KalkylFlowSelector } from "./kalkylberakning/KalkylFlowSelector";
import { TemplateCalculationWorkspace } from "./kalkylberakning/TemplateCalculationWorkspace";
import { SammanfattningWorkspace } from "./kalkylberakning/sammanfattning/SammanfattningWorkspace";

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
	} = calcHook;

	const handleBack = () => {
		if (activeTab === "sammanfattning") {
			setActiveTab("kalkyl");
		} else {
			setFlowState("choose");
			setActiveTab("kalkyl");
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
						<Button
							type="button"
							variant="ghost"
							onClick={handleBack}
							className="flex h-auto p-0 cursor-pointer items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 hover:text-slate-700 hover:bg-transparent transition-colors shadow-none -ml-4 sm:-ml-10"
						>
							<ArrowLeft className="h-6 w-6 sm:h-8 sm:w-8 text-slate-900 shrink-0" strokeWidth={2.5} />
							<Translate text={localizationConstants.calcBerNyKalkyl} />
						</Button>
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
					<SammanfattningWorkspace
						calcHook={calcHook}
						onCancel={handleBack}
					/>
				)}
			</div>
		</div>
	);
}

