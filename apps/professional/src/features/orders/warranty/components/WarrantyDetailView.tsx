"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Info,
	Calendar1,
	ChevronUp,
	ChevronDown,
	Plus,
	ArrowUpDown,
	MoreVertical,
	File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { WarrantyRow, InspectionDateItem } from "../types/warranty.types";
import { CreateVisitDateModal } from "./CreateVisitDateModal";

export interface WarrantyDetailViewProps {
	warranty: WarrantyRow;
	inspectionDates: InspectionDateItem[];
	onAddInspectionDate: (item: Omit<InspectionDateItem, "id">) => void;
}

export function WarrantyDetailView({
	warranty,
	inspectionDates,
	onAddInspectionDate,
}: WarrantyDetailViewProps) {
	const router = useRouter();
	const [openSections, setOpenSections] = useState({
		info: true,
		dates: true,
	});
	const [isModalOpen, setIsModalOpen] = useState(false);

	const toggleSection = (key: keyof typeof openSections) => {
		setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const handleBack = () => {
		router.push("/module/production/order/warranty");
	};

	return (
		<div className="flex flex-1 flex-col overflow-y-auto px-3 py-6 space-y-6">
			{/* Back arrow + Title header matching customer/1 detail page */}
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2 ml-0">
					<button
						type="button"
						aria-label="Go back"
						onClick={handleBack}
						className="rounded-md p-1 hover:bg-slate-100 cursor-pointer"
					>
						<ArrowLeft className="h-5 w-5 text-slate-700" />
					</button>
					<h1 className="text-xl font-semibold text-slate-900">
						<Translate text={localizationConstants.viewDetailTitle} />
					</h1>
				</div>

				<p className="text-sm text-slate-500 sm:ml-9">
					<Translate text={localizationConstants.orderNumberSubtitle} />: {warranty.orderNo}
				</p>
			</div>

			{/* Main Collapsible Sections starting at sm:ml-9 aligned with title text */}
			<div className="flex flex-col gap-6 ml-0 sm:ml-9">
				{/* Section 1: Garantiinformation */}
				<div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
					<button
						type="button"
						onClick={() => toggleSection("info")}
						className="flex w-full items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 transition-colors hover:bg-slate-50 text-left cursor-pointer"
					>
						<div className="flex items-center gap-3">
							<Info className="h-5 w-5 text-slate-700" />
							<span className="text-sm font-semibold text-slate-900">
								<Translate text={localizationConstants.warrantyInfoSection} />
							</span>
						</div>
						{openSections.info ? (
							<ChevronUp className="h-5 w-5 text-slate-400" />
						) : (
							<ChevronDown className="h-5 w-5 text-slate-400" />
						)}
					</button>

					{openSections.info && (
						<div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-y-6 gap-x-8 text-xs">
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.orderSection} />
								</span>
								<span className="text-slate-600">2025-001</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.orderName} />
								</span>
								<span className="text-slate-600">Ombyggnad villa</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.orderCustomer} />
								</span>
								<span className="text-slate-600">{warranty.customer}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.contactPersonSection} />
								</span>
								<span className="text-slate-600">{warranty.contactPerson || "Stina Andersson"}</span>
							</div>

							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.warrantyResponsibleLabel} />
								</span>
								<span className="text-slate-600">{warranty.warrantyResponsible || "Kalle Svensson"}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.orderStart} />
								</span>
								<span className="text-slate-600">2025-09-01</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.colApproved} />
								</span>
								<span className="text-slate-600">2026-02-28</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.colWarrantyPeriod} />
								</span>
								<span className="text-slate-600">
									{warranty.warrantyPeriod} / {warranty.warrantyEndDate || "2030-09-01"}
								</span>
							</div>

							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.mobileLabel} />:
								</span>
								<span className="text-slate-600">{warranty.phone || "-"}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.mailLabel} />:
								</span>
								<span className="text-slate-600">{warranty.email || "Ann@example.com"}</span>
							</div>
						</div>
					)}
				</div>

				{/* Section 2: Besöksdatum (calendar-1 icon) */}
				<div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
					<div className="flex w-full items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
						<button
							type="button"
							onClick={() => toggleSection("dates")}
							className="flex items-center gap-3 cursor-pointer text-left"
						>
							<Calendar1 className="h-5 w-5 text-slate-700" />
							<span className="text-sm font-semibold text-slate-900">
								<Translate text={localizationConstants.visitDatesSection} />
							</span>
						</button>

						<div className="flex items-center gap-3">
							<Button
								type="button"
								onClick={() => setIsModalOpen(true)}
								className="h-8 gap-1.5 rounded-md bg-[#111721] px-3 text-xs font-medium text-white hover:bg-slate-800 cursor-pointer shadow-2xs"
							>
								<Plus className="h-3.5 w-3.5" />
								<span><Translate text={localizationConstants.createVisitDateButton} /></span>
							</Button>
							<button
								type="button"
								onClick={() => toggleSection("dates")}
								className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
							>
								{openSections.dates ? (
									<ChevronUp className="h-5 w-5" />
								) : (
									<ChevronDown className="h-5 w-5" />
								)}
							</button>
						</div>
					</div>

					{openSections.dates && (
						<div className="p-6">
							<div className="overflow-x-auto rounded border border-slate-200">
								<table className="w-full min-w-162.5 border-collapse text-xs">
									<thead>
										<tr className="h-11 border-b border-slate-200 bg-white">
											<th className="font-sans px-4 text-left font-medium text-slate-500 whitespace-nowrap">
												<div className="flex items-center gap-1">
													<Translate text={localizationConstants.dateHeaderLabel} />
													<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
												</div>
											</th>
											<th className="font-sans px-4 text-left font-medium text-slate-500 whitespace-nowrap">
												<div className="flex items-center gap-1">
													<Translate text={localizationConstants.reminderEmailLabel} />
													<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
												</div>
											</th>
											<th className="font-sans px-4 text-left font-medium text-slate-500 whitespace-nowrap">
												<div className="flex items-center gap-1">
													<Translate text={localizationConstants.ruleLabel} />
													<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
												</div>
											</th>
											<th className="font-sans px-4 text-left font-medium text-slate-500 whitespace-nowrap">
												<div className="flex items-center gap-1">
													<Translate text={localizationConstants.documentNameHeader} />
													<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
												</div>
											</th>
											<th className="w-10" />
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-100 bg-white">
										{inspectionDates.map((item) => (
											<tr key={item.id} className="h-12 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50">
												<td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap">
													{item.date}
												</td>
												<td className="px-4 py-2 text-slate-600 whitespace-nowrap">
													{item.reminderEmail}
												</td>
												<td className="px-4 py-2 text-slate-600 whitespace-nowrap">
													{item.rule}
												</td>
												<td className="px-4 py-2 whitespace-nowrap">
													<div className="flex items-center gap-2">
														<div className="relative flex h-8 w-6 shrink-0 items-center justify-center">
															<File className="h-8 w-6 text-slate-300" strokeWidth={1.5} />
															<span className="absolute -left-0.5 top-[60%] -translate-y-1/2 rounded-[2px] px-1 py-0.2 text-[8px] font-bold text-white bg-red-600">
																PDF
															</span>
														</div>
														<span className="truncate text-xs font-medium text-slate-800">{item.documentName}</span>
													</div>
												</td>
												<td className="px-2 py-2 text-center">
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<button
																type="button"
																className="h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-500 cursor-pointer"
															>
																<MoreVertical className="h-4 w-4" />
															</button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end" className="w-36">
															<DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
																<Translate text={localizationConstants.actionDelete} />
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Modal for creating visit date */}
			<CreateVisitDateModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={onAddInspectionDate}
			/>
		</div>
	);
}
