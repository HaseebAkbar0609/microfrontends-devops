"use client";

import React from "react";
import { CheckCircle2, MessageSquare, FileText, PlusCircle } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type { CaseItem } from "../../../types/cases.types";
import { CaseStatusBadge } from "../shared";

interface CaseActivityLogViewProps {
	caseItem: CaseItem;
}

interface TimelineEvent {
	id: string;
	titleKey: TranslationKeys;
	description: string;
	date: string;
	author: string;
	icon: React.ComponentType<{ className?: string }>;
	statusBadge?: CaseItem["status"];
}

export function CaseActivityLogView({ caseItem }: CaseActivityLogViewProps) {
	// Derive timeline events from caseItem
	const events: TimelineEvent[] = [
		{
			id: "evt-created",
			titleKey: localizationConstants.casesActivityCaseCreated,
			description: caseItem.title,
			date: caseItem.createdAt,
			author: caseItem.createdBy,
			icon: PlusCircle,
		},
		...(caseItem.messages || []).map((msg) => ({
			id: `evt-msg-${msg.id}`,
			titleKey: localizationConstants.casesActivityMessageAdded,
			description: msg.content,
			date: msg.createdAt,
			author: msg.author,
			icon: MessageSquare,
		})),
		...(caseItem.documents || []).map((doc) => ({
			id: `evt-doc-${doc.id}`,
			titleKey: localizationConstants.casesActivityFileUploaded,
			description: doc.name,
			date: doc.date,
			author: caseItem.createdBy,
			icon: FileText,
		})),
		{
			id: "evt-status",
			titleKey: localizationConstants.casesActivityStatusChangedTo,
			description: "",
			date: caseItem.updatedAt || caseItem.createdAt,
			author: caseItem.createdBy,
			icon: CheckCircle2,
			statusBadge: caseItem.status,
		},
	];

	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
			<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
				<Translate text={localizationConstants.casesActivityLogTitle} />
			</h2>

			<div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
				{events.map((evt) => {
					const Icon = evt.icon;
					return (
						<div key={evt.id} className="relative group">
							<div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center">
								<div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
							</div>

							<div className="space-y-1">
								<div className="flex flex-wrap items-center gap-2">
									<Icon className="w-3.5 h-3.5 text-slate-500" />
									<span className="text-xs font-semibold text-slate-900">
										<Translate text={evt.titleKey} />
									</span>
									{evt.statusBadge && (
										<CaseStatusBadge status={evt.statusBadge} />
									)}
								</div>

								{evt.description && (
									<p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 max-w-xl">
										{evt.description}
									</p>
								)}

								<div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
									<span>{evt.author}</span>
									<span>•</span>
									<span>{evt.date}</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default CaseActivityLogView;
