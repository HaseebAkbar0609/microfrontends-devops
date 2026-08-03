"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { COMPANY_NAME, COMPANY_ORG_NR } from "../constants/mockData";
import { getCompanyInfoRows } from "../services/companyService";

const CompanyInfoTab = () => {
	const rows = getCompanyInfoRows();

	return (
		<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
			<div className="flex flex-wrap items-center gap-2.5 bg-slate-200/60 px-5 py-3.5">
				<h2 className="text-base font-medium text-slate-800">
					<Translate text={localizationConstants.companyTabInfo} /> -{" "}
					<span className="font-bold">{COMPANY_NAME}</span>
				</h2>
				<span className="rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-medium text-white">
					{COMPANY_ORG_NR}
				</span>
			</div>
			<div className="flex flex-col gap-5 px-5 py-4">
				{rows.map((row) => (
					<div
						key={row[0].id}
						className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
					>
						{row.map((field) => (
							<div key={field.id}>
								<p className="text-sm font-medium text-slate-900">
									<Translate text={field.labelKey} />
								</p>
								<p className="mt-1 break-words text-sm text-slate-500">
									{field.value}
								</p>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default CompanyInfoTab;
