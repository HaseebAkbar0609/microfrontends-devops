"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export function ProcessTableHeader() {
	return (
		<thead>
			<tr className="border-b border-slate-200 bg-white text-slate-500 font-semibold text-xs">
				<th className="py-3 px-4 w-28">
					<div className="flex items-center gap-1 cursor-pointer select-none hover:text-slate-800">
						<Translate text={localizationConstants.processColId} />
						<ArrowUpDown className="w-3 h-3 text-slate-400" />
					</div>
				</th>
				<th className="py-3 px-4">
					<div className="flex items-center gap-1 cursor-pointer select-none hover:text-slate-800">
						<Translate text={localizationConstants.processColTitle} />
						<ArrowUpDown className="w-3 h-3 text-slate-400" />
					</div>
				</th>
				<th className="py-3 px-4 w-40">
					<div className="flex items-center gap-1 cursor-pointer select-none hover:text-slate-800">
						<Translate text={localizationConstants.processColDate} />
						<ArrowUpDown className="w-3 h-3 text-slate-400" />
					</div>
				</th>
				<th className="py-3 px-4 w-32">
					<div className="flex items-center gap-1 cursor-pointer select-none hover:text-slate-800">
						<Translate text={localizationConstants.processColStatus} />
						<ArrowUpDown className="w-3 h-3 text-slate-400" />
					</div>
				</th>
				<th className="py-3 px-4 w-24 text-right">
					<span className="sr-only">
						<Translate text={localizationConstants.processColActions} />
					</span>
				</th>
			</tr>
		</thead>
	);
}
