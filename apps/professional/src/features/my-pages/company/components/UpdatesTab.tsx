"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { listCompanyUpdates } from "../services/companyService";

const UpdatesTab = () => (
	<div className="w-full overflow-x-auto rounded-md border border-slate-200 bg-white">
		<Table className="w-full min-w-[36rem]">
			<TableHeader>
				<TableRow className="border-b border-slate-200 hover:bg-transparent">
					{[
						localizationConstants.companyMsgColDate,
						localizationConstants.companyUpdColType,
						localizationConstants.companyUpdColFunction,
					].map((labelKey) => (
						<TableHead
							key={labelKey}
							className="px-4 py-3 text-sm font-medium text-slate-500"
						>
							<Translate text={labelKey} />
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{listCompanyUpdates().map((update) => (
					<TableRow
						key={update.id}
						className="border-b border-slate-100 hover:bg-slate-50/60"
					>
						<TableCell className="px-4 py-3.5 text-sm text-slate-700">
							{update.date}
						</TableCell>
						<TableCell className="px-4 py-3.5 text-sm text-slate-700">
							{update.type}
						</TableCell>
						<TableCell className="px-4 py-3.5 text-sm text-slate-700">
							{update.functionArea}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	</div>
);

export default UpdatesTab;
