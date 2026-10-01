"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { forecastBreadcrumbs } from "../../../constants/economyNav.config";
import { DocumentsListPanel } from "./DocumentsListPanel";

export interface ForecastDocumentsPageProps {
	basePath?: string;
}

/**
 * Prognos › Dokumentcenter: every document the forecast work rests on.
 *
 * No section tabs — the frame draws none, and unlike Rapporter there is no
 * second view for a tab row to hold.
 */
export function ForecastDocumentsPage({ basePath }: ForecastDocumentsPageProps) {
	return (
		<div className="flex flex-1 flex-col bg-white">
			<PageHeader
				title={localizationConstants.forecastDocumentsTitle}
				breadcrumbs={forecastBreadcrumbs(localizationConstants.forecastDocumentsTitle)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			<div className="flex-1 px-6 pt-5 pb-8">
				<DocumentsListPanel basePath={basePath} />
			</div>
		</div>
	);
}

export default ForecastDocumentsPage;
