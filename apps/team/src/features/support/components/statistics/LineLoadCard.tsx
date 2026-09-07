"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { getSupportLineMeta } from "../../constants/supportStatuses";
import type { SupportLine } from "../../types";

type LineLoadCardProps = {
	lineLoad: { line: SupportLine; open: number; agents: number }[];
};

/** Open tickets and staffed agents per support line. */
export function LineLoadCard({ lineLoad }: LineLoadCardProps) {
	return (
		<section className="@container rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<h2 className="text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.supportLineLoadTitle} />
			</h2>
			<div className="mt-4 grid grid-cols-1 gap-2.5 @2xl:grid-cols-2">
				{lineLoad.map((entry) => (
					<div
						key={entry.line}
						className="rounded-lg border border-slate-200 p-4"
					>
						<p className="text-sm font-medium text-slate-900">
							<Translate text={getSupportLineMeta(entry.line).labelKey} />
						</p>
						<p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
							{entry.open}
						</p>
						<p className="text-xs text-slate-500">
							<Translate text={localizationConstants.supportOpenSuffix} /> ·{" "}
							{entry.agents}{" "}
							<Translate text={localizationConstants.supportOnlineSuffix} />
						</p>
					</div>
				))}
			</div>
		</section>
	);
}
