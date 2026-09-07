"use client";

import { SUPPORT_COUNTRY_LOAD } from "../../constants/supportVolume.mock";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

/** Open load and staffing per country; an unstaffed country reads as a warning. */
export function CountryStaffingGrid() {
	return (
		<section className="@container rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<h2 className="text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.supportStaffingTitle} />
			</h2>
			<div className="mt-4 grid grid-cols-1 gap-2.5 @2xl:grid-cols-2 @4xl:grid-cols-4">
				{SUPPORT_COUNTRY_LOAD.map((entry) => {
					const isUnstaffed = entry.agents === 0;
					return (
						<div
							key={entry.country}
							className={`rounded-lg border p-4 ${
								isUnstaffed
									? "border-red-200 bg-red-50/50"
									: "border-slate-200 bg-white"
							}`}
						>
							<p className="text-sm font-medium text-slate-900">
								{entry.country}
							</p>
							<p
								className={`mt-1 text-2xl font-semibold tabular-nums ${
									isUnstaffed ? "text-red-600" : "text-slate-900"
								}`}
							>
								{entry.agents}
							</p>
							<p className="text-xs text-slate-500">
								<Translate text={localizationConstants.supportOnlineSuffix} />{" "}
								· {entry.open}{" "}
								<Translate text={localizationConstants.supportOpenSuffix} />
							</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
