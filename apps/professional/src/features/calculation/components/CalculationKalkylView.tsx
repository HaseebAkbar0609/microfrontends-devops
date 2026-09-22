"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicBreadcrumb } from "@/components/common";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CalculationMarkupSection } from "./CalculationMarkupSection";
import { CalculationLaborSection } from "./CalculationLaborSection";
import { CalculationProContent } from "./CalculationProContent";
import { CalculationAPriceContent } from "./CalculationAPriceContent";
import { CalculationSkallKravContent } from "./CalculationSkallKravContent";
import { DUMMY_APRICE_LIST } from "../constants/apriceMock";
import { useStandardCalculation } from "../hooks/useStandardCalculation";

const TABS = [
	{ value: "standard", labelKey: localizationConstants.calcTabStandard },
	{ value: "pro", labelKey: localizationConstants.calcTabPro },
	{ value: "quick-ai", labelKey: localizationConstants.calcTabQuickAI },
	{ value: "a-price", labelKey: localizationConstants.calcTabAPrice },
	{ value: "required", labelKey: localizationConstants.calcTabRequired },
];

export function CalculationKalkylView() {
	const {
		markupRows,
		isSavingMarkup,
		handleAddMarkupRow,
		handleChangeMarkupTitle,
		handleChangeMarkupPercentage,
		handleDeleteMarkupRow,
		handleSaveMarkup,
		handleCancelMarkup,
		baseCostRows,
		isSavingBaseCosts,
		handleAddBaseCostRow,
		handleChangeBaseCostTitle,
		handleChangeBaseCostPercentage,
		handleDeleteBaseCostRow,
		handleSaveBaseCosts,
		handleCancelBaseCosts,
		sortedLaborRows,
		isLaborOpen,
		setIsLaborOpen,
		isLaborDeleted,
		isSavingLabor,
		sortField,
		sortDir,
		toggleSort,
		handleAddLaborRow,
		handleChangeLaborCell,
		handleDeleteLaborRow,
		handleSaveLaborCosts,
		handleCancelLaborCosts,
		handleDeleteLaborSectionConfirm,
	} = useStandardCalculation();

	return (
		<div className="flex flex-1 flex-col bg-white">
			{/* Top Page Header */}
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

			{/* Top Navigation Tabs */}
			<Tabs defaultValue="standard" className="flex flex-1 flex-col">
				<div className="px-5 border-b border-slate-200">
					<TabsList variant="line">
						{TABS.map((tab) => (
							<TabsTrigger key={tab.value} value={tab.value}>
								<Translate text={tab.labelKey} />
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				{/* Standard Calculation Content */}
				<TabsContent
					value="standard"
					className="flex flex-1 flex-col gap-4 bg-white p-5"
				>
					{/* Markup Section */}
					<CalculationMarkupSection
						titleKey={localizationConstants.calcMarkup}
						rows={markupRows}
						isSaving={isSavingMarkup}
						onAddRow={handleAddMarkupRow}
						onChangeTitle={handleChangeMarkupTitle}
						onChangePercentage={handleChangeMarkupPercentage}
						onDeleteRowConfirm={handleDeleteMarkupRow}
						onSave={() => void handleSaveMarkup()}
						onCancel={handleCancelMarkup}
					/>

					{/* Base costs Section */}
					<CalculationMarkupSection
						titleKey={localizationConstants.calcBaseCosts}
						rows={baseCostRows}
						isSaving={isSavingBaseCosts}
						onAddRow={handleAddBaseCostRow}
						onChangeTitle={handleChangeBaseCostTitle}
						onChangePercentage={handleChangeBaseCostPercentage}
						onDeleteRowConfirm={handleDeleteBaseCostRow}
						onSave={() => void handleSaveBaseCosts()}
						onCancel={handleCancelBaseCosts}
					/>

					{/* Labor cost Section */}
					{!isLaborDeleted && (
						<CalculationLaborSection
							rows={sortedLaborRows}
							isOpen={isLaborOpen}
							isSaving={isSavingLabor}
							sortField={sortField}
							sortDir={sortDir}
							onToggleOpen={() => setIsLaborOpen((prev) => !prev)}
							onToggleSort={toggleSort}
							onAddRow={handleAddLaborRow}
							onChangeCell={handleChangeLaborCell}
							onDeleteRowConfirm={handleDeleteLaborRow}
							onDeleteSectionConfirm={() => void handleDeleteLaborSectionConfirm()}
							onSave={() => void handleSaveLaborCosts()}
							onCancel={handleCancelLaborCosts}
						/>
					)}
				</TabsContent>

				{/* Other Calculation Tabs */}
				<TabsContent
					value="pro"
					className="flex flex-1 flex-col bg-white p-4 sm:p-5"
				>
					<CalculationProContent />
				</TabsContent>

				<TabsContent value="a-price" className="flex flex-1 flex-col">
					<CalculationAPriceContent items={DUMMY_APRICE_LIST} />
				</TabsContent>

				<TabsContent value="required" className="flex flex-1 flex-col">
					<CalculationSkallKravContent />
				</TabsContent>

				<TabsContent
					value="quick-ai"
					className="flex flex-1 items-center justify-center text-sm text-slate-400"
				>
					<Translate text={localizationConstants.comingSoon} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
