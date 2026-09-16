"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { DOCUMENTS_CONSTANTS, type DocumentsSubTab } from "../constants/documents.constants";

interface DocumentsHeaderProps {
	orderId?: string;
	activeSubtab: DocumentsSubTab;
	onSubtabChange: (subtab: DocumentsSubTab) => void;
	hideTitle?: boolean;
}

export function DocumentsHeader({
	orderId,
	activeSubtab,
	onSubtabChange,
	hideTitle = false,
}: DocumentsHeaderProps) {
	const displayOrderId = orderId || DOCUMENTS_CONSTANTS.DEFAULT_ORDER_ID;

	const subtabs: { id: DocumentsSubTab; labelKey: string }[] = [
		{
			id: DOCUMENTS_CONSTANTS.SUBTABS.DOCUMENTS,
			labelKey: localizationConstants.orderHandlingarSubtabHandlingar,
		},
		{
			id: DOCUMENTS_CONSTANTS.SUBTABS.DRAWINGS,
			labelKey: localizationConstants.orderHandlingarSubtabRitningar,
		},
		{
			id: DOCUMENTS_CONSTANTS.SUBTABS.ARCHIVE,
			labelKey: localizationConstants.orderHandlingarSubtabArkivera,
		},
	];

	return (
		<div className="flex flex-col gap-4">
			{!hideTitle && (
				<div className="flex items-center gap-1.5 text-xl sm:text-2xl font-semibold text-slate-900">
					<span className="text-slate-500 font-normal">
						<Translate text={localizationConstants.order} /> {displayOrderId} /
					</span>
					<span className="text-slate-900 font-semibold">
						<Translate text={localizationConstants.orderHandlingarTitle} />
					</span>
				</div>
			)}

			{/* 100% shadcn/ui Tabs primitive */}
			<Tabs value={activeSubtab} onValueChange={(val) => onSubtabChange(val as DocumentsSubTab)}>
				<TabsList variant="line" className="w-full justify-start gap-6 border-b border-slate-200">
					{subtabs.map((tab) => (
						<TabsTrigger key={tab.id} value={tab.id}>
							<Translate text={tab.labelKey} />
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>
		</div>
	);
}

export default DocumentsHeader;
