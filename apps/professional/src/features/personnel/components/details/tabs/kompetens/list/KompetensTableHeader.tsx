"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export function KompetensTableHeader() {
	return (
		<thead className="bg-slate-50/90 text-[11px] text-slate-500 font-medium border-b border-slate-200">
			<tr>
				<th className="py-3 px-4 w-16">
					<Translate text={localizationConstants.kompetensColNr} /> ↓↑
				</th>
				<th className="py-3 px-4">
					<Translate text={localizationConstants.kompetensColName} /> ↓↑
				</th>
				<th className="py-3 px-4">
					<Translate text={localizationConstants.kompetensColTraining} /> ↓↑
				</th>
				<th className="py-3 px-4">
					<Translate text={localizationConstants.kompetensColCertNo} /> ↓↑
				</th>
				<th className="py-3 px-4">
					<Translate text={localizationConstants.kompetensColExpiry} /> ↓↑
				</th>
				<th className="py-3 px-4">
					<Translate text={localizationConstants.kompetensColStatus} /> ↓↑
				</th>
				<th className="py-3 px-4 text-center w-14">
					<Translate text={localizationConstants.kompetensColFile} />
				</th>
				<th className="py-3 px-4 text-right w-12">+</th>
			</tr>
		</thead>
	);
}
