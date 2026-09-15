"use client";

import React from "react";
import { FolderKanban } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AuthorityProjectInfo } from "../../types/authorities.types";

interface AuthorityDetailProjectCardProps {
	project?: AuthorityProjectInfo;
	subject?: string;
}

export function AuthorityDetailProjectCard({
	project,
	subject,
}: AuthorityDetailProjectCardProps) {
	const projNumber = project?.projectNumber || "PRJ-8821";
	const projName =
		project?.projectName ||
		subject ||
		"Kontorsstädning och periodiskt underhåll Q2";

	return (
		<div className="p-4 px-6 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
			<div className="flex items-center gap-2.5">
				<div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
					<FolderKanban className="h-4 w-4" />
				</div>
				<div>
					<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
						<Translate text={localizationConstants.authorityProject} />
					</span>
					<span className="font-bold text-slate-900">{projName}</span>
				</div>
			</div>
			<div className="sm:text-right">
				<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
					<Translate text={localizationConstants.authorityProjectNumber} />
				</span>
				<span className="font-semibold text-slate-700">{projNumber}</span>
			</div>
		</div>
	);
}

export default AuthorityDetailProjectCard;
