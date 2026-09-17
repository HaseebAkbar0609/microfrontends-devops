"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useConstructionLog } from "./hooks/useConstructionLog";
import { ConstructionLogHeader } from "./components/ConstructionLogHeader";
import { ConstructionLogWeatherView } from "./components/ConstructionLogWeatherView";
import { ConstructionLogDetailsView } from "./components/ConstructionLogDetailsView";
import { ConstructionLogSignatures } from "./components/ConstructionLogSignatures";

export interface OrderConstructionLogOverviewPageProps {
	orderId?: string;
	hideTitle?: boolean;
}

export function OrderConstructionLogOverviewPage({
	orderId,
	hideTitle = false,
}: OrderConstructionLogOverviewPageProps) {
	const {
		log,
		selectedDate,
		calendarDays,
		searchQuery,
		setSearchQuery,
		categoryFilter,
		setCategoryFilter,
		handleDateChange,
		handleWeatherChange,
		handleGeneralNotesChange,
		handleSelfInspectionNoteChange,
		handleSave,
		handlePrint,
		filteredWorkforce,
		filteredActivities,
		filteredMachines,
		filteredDeviations,
	} = useConstructionLog(orderId);

	const t = useTranslate();

	const handleAddRow = useCallback(
		(_type: string) => {
			toast.info(t(localizationConstants.orderDagbokToastAddRowComingSoon));
		},
		[t]
	);

	const handleOpenNewLogModal = useCallback(() => {
		toast.info(t(localizationConstants.orderDagbokToastNewLogComingSoon));
	}, [t]);

	return (
		<div className="w-full flex flex-col gap-6 pb-16">
			{/* Top Header & Project Info & Toolbar */}
			<ConstructionLogHeader
				projectName={log.projectName}
				projectNo={log.projectNo}
				selectedDate={selectedDate}
				onDateChange={handleDateChange}
				constructionDay={log.constructionDay}
				address={log.address}
				hideTitle={hideTitle}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				categoryFilter={categoryFilter}
				onCategoryFilterChange={setCategoryFilter}
				onOpenNewLogModal={handleOpenNewLogModal}
				onPrint={handlePrint}
			/>

			{/* Section 1: Väderinformation & Calendar */}
			<ConstructionLogWeatherView
				weather={log.weather}
				onChange={handleWeatherChange}
				onSave={handleSave}
				selectedDate={selectedDate}
				onDateSelect={handleDateChange}
				calendarDays={calendarDays}
			/>

			{/* Section 2: Detaljerad information (Tables & Notes) */}
			<ConstructionLogDetailsView
				workforce={filteredWorkforce}
				activities={filteredActivities}
				machines={filteredMachines}
				deviations={filteredDeviations}
				generalNotes={log.generalNotes}
				onGeneralNotesChange={handleGeneralNotesChange}
				selfInspectionNote={log.selfInspectionNote}
				onSelfInspectionNoteChange={handleSelfInspectionNoteChange}
				onAddRow={handleAddRow}
			/>

			{/* Section 3: Bekräfta (Signatures) */}
			<ConstructionLogSignatures signatures={log.signatures} />
		</div>
	);
}

export default OrderConstructionLogOverviewPage;
