"use client";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	DOCUMENT_STATUS_KEY,
	DocumentStatus,
	PERSONAL_DOCUMENTS,
} from "../constants/mockData";
import { PdfFileIcon } from "./PayslipTab";

const STATUS_CLASS: Record<DocumentStatus, string> = {
	read: "bg-amber-50 text-amber-600",
	needsSign: "bg-blue-50 text-blue-600",
	notOpened: "text-slate-600",
	signed: "bg-green-50 text-green-600",
};

const COLUMNS = [
	{ labelKey: localizationConstants.myPagesEmpDocCol, sortable: true },
	{ labelKey: localizationConstants.myPagesEmpVersionCol, sortable: true },
	{ labelKey: localizationConstants.myPagesEmpFileCol, sortable: true },
	{ labelKey: localizationConstants.myPagesEmpLeaveColStatus, sortable: true },
	{ labelKey: localizationConstants.economyActionCol, sortable: false },
];

const DocumentsTab = () => (
	<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
		<div className="bg-slate-200/60 px-5 py-3.5">
			<h2 className="text-base font-semibold text-slate-800">
				<Translate
					text={localizationConstants.myPagesEmpTabDocuments}
				/>
			</h2>
		</div>
		<div className="overflow-x-auto">
			<Table className="w-full min-w-[44rem]">
				<TableHeader>
					<TableRow className="border-b border-slate-200 hover:bg-transparent">
						{COLUMNS.map((column) => (
							<TableHead
								key={column.labelKey}
								className="px-5 py-3 text-sm font-medium text-slate-500"
							>
								<span className="flex items-center gap-1">
									<Translate text={column.labelKey} />
									{column.sortable && (
										<ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
									)}
								</span>
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{PERSONAL_DOCUMENTS.map((document) => (
						<TableRow
							key={document.id}
							className="border-b border-slate-100 hover:bg-slate-50/60"
						>
							<TableCell className="px-5 py-3.5 text-sm text-slate-700">
								{document.name}
							</TableCell>
							<TableCell className="px-5 py-3.5 text-sm text-slate-700">
								{document.version}
							</TableCell>
							<TableCell className="px-5 py-3.5">
								<span className="flex items-center gap-3 text-sm text-slate-700">
									<PdfFileIcon />
									{document.fileName}
								</span>
							</TableCell>
							<TableCell className="px-5 py-3.5">
								<span
									className={cn(
										"inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
										STATUS_CLASS[document.status],
									)}
								>
									<Translate
										text={
											DOCUMENT_STATUS_KEY[document.status]
										}
									/>
								</span>
							</TableCell>
							<TableCell className="px-5 py-3.5">
								<div className="flex items-center gap-2">
									<Button
										type="button"
										variant="secondary"
										className="h-8 rounded-md bg-slate-100 px-4 text-sm font-medium text-slate-900 hover:bg-slate-200"
									>
										<Translate
											text={
												localizationConstants.myPagesEmpOpenBadge
											}
										/>
									</Button>
									{document.status === "needsSign" && (
										<Button
											type="button"
											variant="outline"
											className="h-8 rounded-md border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50"
										>
											<Translate
												text={
													localizationConstants.myPagesEmpSign
												}
											/>
										</Button>
									)}
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	</div>
);

export default DocumentsTab;
