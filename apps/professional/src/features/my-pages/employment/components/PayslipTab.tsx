"use client";

import { useState } from "react";
import { ArrowUpDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import {
	PAYSLIP_EMPLOYEE_NAME,
	PAYSLIP_YEARS,
	PAYSLIPS,
} from "../constants/mockData";

export const PdfFileIcon = () => (
	<span className="relative inline-flex" aria-hidden>
		<FileText className="h-6 w-6 text-slate-300" />
		<span className="absolute -bottom-0.5 -left-1 rounded-[3px] bg-red-600 px-1 text-[7px] font-bold leading-3 text-white">
			PDF
		</span>
	</span>
);

const PayslipTab = () => {
	const [year, setYear] = useState(PAYSLIP_YEARS[0]);

	return (
		<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
			<div className="flex flex-wrap items-center justify-between gap-3 bg-slate-200/60 px-5 py-3">
				<h2 className="text-base font-semibold text-slate-800">
					{PAYSLIP_EMPLOYEE_NAME}
				</h2>
				<Select value={year} onValueChange={setYear}>
					<SelectTrigger className="h-9 w-24 border-slate-200 bg-white text-sm font-medium text-slate-900 focus:ring-0">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{PAYSLIP_YEARS.map((option) => (
							<SelectItem key={option} value={option}>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="overflow-x-auto">
				<Table className="w-full min-w-[40rem]">
					<TableHeader>
						<TableRow className="border-b border-slate-200 hover:bg-transparent">
							<TableHead className="px-5 py-3 text-sm font-medium text-slate-500">
								<span className="flex items-center gap-1">
									<Translate
										text={
											localizationConstants.myPagesEmpPayslipMonthCol
										}
									/>
									<ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
								</span>
							</TableHead>
							<TableHead className="px-5 py-3 text-sm font-medium text-slate-500">
								<span className="flex items-center gap-1">
									<Translate
										text={
											localizationConstants.myPagesEmpTabPayslip
										}
									/>
									<ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
								</span>
							</TableHead>
							<TableHead className="px-5 py-3 text-sm font-medium text-slate-500">
								<Translate
									text={
										localizationConstants.economyActionCol
									}
								/>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{PAYSLIPS.map((payslip) => (
							<TableRow
								key={payslip.id}
								className="border-b border-slate-100 hover:bg-slate-50/60"
							>
								<TableCell className="px-5 py-3.5 text-sm text-slate-700">
									<Translate text={payslip.monthKey} />
								</TableCell>
								<TableCell className="px-5 py-3.5">
									<span className="flex items-center gap-3 text-sm text-slate-700">
										<PdfFileIcon />
										{payslip.fileName}
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
										<Button
											type="button"
											variant="outline"
											className="h-8 rounded-md border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50"
										>
											<Translate
												text={
													localizationConstants.myPagesEmpPrint
												}
											/>
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default PayslipTab;
