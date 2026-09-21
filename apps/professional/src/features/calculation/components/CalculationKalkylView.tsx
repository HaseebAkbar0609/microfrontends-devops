"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicBreadcrumb } from "@/components/common";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CalculationMarkupSection } from "./CalculationMarkupSection";
import { CalculationLaborSection } from "./CalculationLaborSection";
import { CalculationProContent } from "./CalculationProContent";
import { CalculationQuickAiContent } from "./CalculationQuickAiContent";
import { CalculationAPriceContent } from "./CalculationAPriceContent";
import { CalculationSkallKravContent } from "./CalculationSkallKravContent";
import { DUMMY_APRICE_LIST } from "../constants/apriceMock";

const TABS = [
	{ value: "standard", labelKey: localizationConstants.calcTabStandard },
	{ value: "pro", labelKey: localizationConstants.calcTabPro },
	{ value: "quick-ai", labelKey: localizationConstants.calcTabQuickAI },
	{ value: "a-price", labelKey: localizationConstants.calcTabAPrice },
	{ value: "required", labelKey: localizationConstants.calcTabRequired },
];

export function CalculationKalkylView() {
	return (
		<div className="flex flex-1 flex-col">
			<div className="px-5 pt-4 pb-2">
				<h1 className="mb-0.5 text-2xl font-semibold tracking-tight text-slate-950">
					<Translate text={localizationConstants.calcKalkyl} />
				</h1>
				<DynamicBreadcrumb
					variant="small"
					items={[
						{
							translationKey: localizationConstants.home,
							href: "/home",
						},
						{
							translationKey: localizationConstants.moduleItem,
							href: "/module/business",
						},
						{
							translationKey: localizationConstants.calculation,
							href: "/module/business/calculation/dashboard",
						},
						{ translationKey: localizationConstants.calcKalkyl },
					]}
				/>
			</div>

			<Tabs defaultValue="standard" className="flex flex-1 flex-col">
				<div className="border-b border-slate-200 px-5">
					<TabsList
						variant="line"
						className="h-auto gap-0 rounded-none bg-transparent px-0 pb-0"
					>
						{TABS.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className="cursor-pointer rounded-none px-4 py-3 text-sm text-slate-600 data-[state=active]:text-slate-900"
							>
								<Translate text={tab.labelKey} />
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				<TabsContent
					value="standard"
					className="flex flex-1 flex-col gap-4 bg-slate-50 p-5"
				>
					<CalculationMarkupSection
						titleKey={localizationConstants.calcMarkup}
					/>
					<CalculationMarkupSection
						titleKey={localizationConstants.calcBaseCosts}
					/>
					<CalculationLaborSection />
				</TabsContent>

				<TabsContent
					value="pro"
					className="flex flex-1 flex-col bg-white p-4 sm:p-5"
				>
					<CalculationProContent />
				</TabsContent>

				<TabsContent
					value="quick-ai"
					className="flex flex-1 flex-col bg-white p-4 sm:p-5"
				>
					<CalculationQuickAiContent />
				</TabsContent>

				<TabsContent value="a-price" className="flex flex-1 flex-col">
					<CalculationAPriceContent items={DUMMY_APRICE_LIST} />
				</TabsContent>

				<TabsContent value="required" className="flex flex-1 flex-col">
					<CalculationSkallKravContent />
				</TabsContent>
			</Tabs>
		</div>
	);
}
