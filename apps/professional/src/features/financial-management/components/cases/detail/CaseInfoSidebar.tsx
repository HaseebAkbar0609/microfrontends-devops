"use client";

import React from "react";
import Image from "next/image";
import { Paperclip } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CaseItem } from "../../../types/cases.types";
import { getCategoryLabelKey } from "../shared";

interface CaseInfoSidebarProps {
	caseItem: CaseItem;
}

export function CaseInfoSidebar({ caseItem }: CaseInfoSidebarProps) {
	const attachments = [...(caseItem.documents || []), ...(caseItem.images || [])];

	return (
		<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-5">
			{/* Card Title matching Figma Image 2: Allmän information */}
			<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
				<Translate text={localizationConstants.casesCardGeneralInfo} />
			</h2>

			{/* Skapad av */}
			<div className="space-y-2">
				<p className="text-xs font-semibold text-slate-700">
					<Translate text={localizationConstants.casesFieldCreatedBy} />
				</p>
				<div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3 shadow-2xs">
					<div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0 overflow-hidden relative">
						<Image
							src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60"
							alt={caseItem.createdBy}
							fill
							unoptimized
							className="object-cover"
						/>
					</div>
					<div className="min-w-0">
						<p className="text-xs font-bold text-slate-900 truncate">
							{caseItem.createdBy || "Kalle Svensson"}
						</p>
						<p className="text-[11px] text-slate-500 truncate">
							{caseItem.createdRole || "Pelles Måleri"}
						</p>
					</div>
				</div>
			</div>

			{/* Kategori */}
			<div className="space-y-1.5">
				<p className="text-xs font-semibold text-slate-700">
					<Translate text={localizationConstants.casesFieldCategory} />
				</p>
				<div className="h-9 px-3 bg-white border border-slate-200 rounded-lg flex items-center text-xs text-slate-800">
					<Translate text={getCategoryLabelKey(caseItem.category)} />
				</div>
			</div>

			{/* Bilagor */}
			<div className="space-y-2">
				<p className="text-xs font-semibold text-slate-700">
					<Translate text={localizationConstants.casesFieldAttachments} />
				</p>
				{attachments.length === 0 ? (
					<div className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 shadow-2xs">
						<Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
						<span className="truncate font-mono text-[11px]">screenshooter_png</span>
					</div>
				) : (
					<div className="space-y-2">
						{attachments.map((file) => (
							<div
								key={file.id}
								className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
								onClick={() => window.open(file.url || "#", "_blank")}
							>
								<Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
								<span className="truncate font-mono text-[11px]">{file.name}</span>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default CaseInfoSidebar;
