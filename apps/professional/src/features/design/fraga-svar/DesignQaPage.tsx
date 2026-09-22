"use client";

import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ModuleTabs, SectionTabs } from "@/components/layout/navigation";
import { RecordNavRow } from "@/components/layout/navigation/RecordNavRow";
import { TabsContent } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { DESIGN_MODULE_BASE_URL } from "../data/designNav.config";
import { DesignRecordTitle } from "../projektinformation/components/DesignRecordTitle";
import { designProjektTabs } from "../projektinformation/designProjektNavConfig";
import { DesignQaBoard } from "./components/DesignQaBoard";
import { useDesignQaBoard } from "./hooks/useDesignQaBoard";

export interface DesignQaPageProps {
	projektId: string;
}

export function DesignQaPage({ projektId }: DesignQaPageProps) {
	const t = useTranslate();
	const board = useDesignQaBoard(projektId);

	if (!board.projekt) notFound();

	return (
		<div className="flex h-full flex-col">
			<div className="shrink-0 border-b border-slate-200 bg-white px-5">
				<RecordNavRow
					title={
						<DesignRecordTitle
							projektNr={board.projekt.projektNr}
							sectionKey={localizationConstants.projectQaTitle}
						/>
					}
					backHref={`${DESIGN_MODULE_BASE_URL}/oversikt`}
				/>
				<div className="mt-3 -mb-px">
					<ModuleTabs items={designProjektTabs(projektId)} />
				</div>
			</div>

			<div className="flex-1 overflow-y-auto px-6 pt-4 pb-8">
				<Suspense fallback={null}>
					<SectionTabs
						items={[
							{ id: "all", labelKey: localizationConstants.projectQaTabAll },
							{ id: "archive", labelKey: localizationConstants.archive },
						]}
						ariaLabel={t(localizationConstants.projectQaTitle)}
					>
						<TabsContent value="all" className="mt-4">
							<DesignQaBoard board={board} />
						</TabsContent>
						<TabsContent value="archive" className="mt-4">
							<DesignQaBoard board={board} archivedOnly />
						</TabsContent>
					</SectionTabs>
				</Suspense>
			</div>
		</div>
	);
}

export default DesignQaPage;
