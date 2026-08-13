"use client";

import { useState } from "react";
import {
	UserPlus,
	CircleUserRound,
	ShoppingBag,
	Info,
	File,
	ChevronUp,
	ChevronDown,
	MoreHorizontal,
	ArrowUpDown,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderOpenedData } from "../types/orderOpened.types";

export interface OrderOpenedSectionsProps {
	data: OrderOpenedData;
}

export function OrderOpenedSections({ data }: OrderOpenedSectionsProps) {
	const [openSections, setOpenSections] = useState({
		customer: true,
		contact: true,
		order: true,
		info: true,
		documents: true,
	});

	const toggleSection = (key: keyof typeof openSections) => {
		setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	return (
		<div className="flex flex-col gap-6 pt-4">
			<h2 className="text-lg font-bold text-slate-900 tracking-tight">
				<Translate text={localizationConstants.detailedInfo} />
			</h2>

			<div className="flex flex-col gap-4">
				{/* Section 1: Kunduppgifter (user-plus icon) */}
				<div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
					<button
						type="button"
						onClick={() => toggleSection("customer")}
						className="flex w-full items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 transition-colors hover:bg-slate-50 text-left cursor-pointer"
					>
						<div className="flex items-center gap-3">
							<UserPlus className="h-5 w-5 text-slate-700" />
							<span className="text-sm font-semibold text-slate-900">
								<Translate text={localizationConstants.customerDetailsSection} />
							</span>
						</div>
						{openSections.customer ? (
							<ChevronUp className="h-5 w-5 text-slate-400" />
						) : (
							<ChevronDown className="h-5 w-5 text-slate-400" />
						)}
					</button>

					{openSections.customer && (
						<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-xs">
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.orderCustomer} />
								</span>
								<span className="text-slate-600">{data.customerInfo.customerName}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.addressLabel} />
								</span>
								<span className="text-slate-600">{data.customerInfo.address}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.postNrLabel} />
								</span>
								<span className="text-slate-600">{data.customerInfo.postCode}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.cityLabel} />
								</span>
								<span className="text-slate-600">{data.customerInfo.city}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.mailLabel} />
								</span>
								<span className="text-slate-600">{data.customerInfo.email}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.phoneLabel} />
								</span>
								<span className="text-slate-600">{data.customerInfo.phone}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.orgPersonNrLabel} />
								</span>
								<span className="text-slate-600">{data.customerInfo.orgNumber}</span>
							</div>
						</div>
					)}
				</div>

				{/* Section 2: Kontaktperson (circle-user-round icon) */}
				<div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
					<button
						type="button"
						onClick={() => toggleSection("contact")}
						className="flex w-full items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 transition-colors hover:bg-slate-50 text-left cursor-pointer"
					>
						<div className="flex items-center gap-3">
							<CircleUserRound className="h-5 w-5 text-slate-700" />
							<span className="text-sm font-semibold text-slate-900">
								<Translate text={localizationConstants.contactPersonSection} />
							</span>
						</div>
						{openSections.contact ? (
							<ChevronUp className="h-5 w-5 text-slate-400" />
						) : (
							<ChevronDown className="h-5 w-5 text-slate-400" />
						)}
					</button>

					{openSections.contact && (
						<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-xs">
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.firstNameLabel} />
								</span>
								<span className="text-slate-600">{data.contactPerson.firstName}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.lastNameLabel} />
								</span>
								<span className="text-slate-600">{data.contactPerson.lastName}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.mailLabel} />
								</span>
								<span className="text-slate-600">{data.contactPerson.email}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.mobileLabel} />
								</span>
								<span className="text-slate-600">{data.contactPerson.mobile}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.roleLabel} />
								</span>
								<span className="text-slate-600">{data.contactPerson.role}</span>
							</div>
						</div>
					)}
				</div>

				{/* Section 3: Order (shopping-bag icon) */}
				<div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
					<button
						type="button"
						onClick={() => toggleSection("order")}
						className="flex w-full items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 transition-colors hover:bg-slate-50 text-left cursor-pointer"
					>
						<div className="flex items-center gap-3">
							<ShoppingBag className="h-5 w-5 text-slate-700" />
							<span className="text-sm font-semibold text-slate-900">
								<Translate text={localizationConstants.orderSection} />
							</span>
						</div>
						{openSections.order ? (
							<ChevronUp className="h-5 w-5 text-slate-400" />
						) : (
							<ChevronDown className="h-5 w-5 text-slate-400" />
						)}
					</button>

					{openSections.order && (
						<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-xs">
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.serialNoHeader} />
								</span>
								<span className="text-slate-600">{data.orderDetails.serialNo}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.orderName} />
								</span>
								<span className="text-slate-600">{data.orderDetails.orderName}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.quarterName} />
								</span>
								<span className="text-slate-600">{data.orderDetails.quarterName}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.orderAddress} />
								</span>
								<span className="text-slate-600">{data.orderDetails.orderAddress}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.postNrLabel} />
								</span>
								<span className="text-slate-600">{data.orderDetails.postCode}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.cityLabel} />
								</span>
								<span className="text-slate-600">{data.orderDetails.city}</span>
							</div>
						</div>
					)}
				</div>

				{/* Section 4: Order information (info icon) */}
				<div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
					<button
						type="button"
						onClick={() => toggleSection("info")}
						className="flex w-full items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 transition-colors hover:bg-slate-50 text-left cursor-pointer"
					>
						<div className="flex items-center gap-3">
							<Info className="h-5 w-5 text-slate-700" />
							<span className="text-sm font-semibold text-slate-900">
								<Translate text={localizationConstants.orderInfoSection} />
							</span>
						</div>
						{openSections.info ? (
							<ChevronUp className="h-5 w-5 text-slate-400" />
						) : (
							<ChevronDown className="h-5 w-5 text-slate-400" />
						)}
					</button>

					{openSections.info && (
						<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-xs">
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.typeLabel} />
								</span>
								<span className="text-slate-600">{data.orderInfo.type}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.categoryLabel} />
								</span>
								<span className="text-slate-600">{data.orderInfo.category}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.departmentLabel} />
								</span>
								<span className="text-slate-600">{data.orderInfo.department}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.contractAmount} />
								</span>
								<span className="text-slate-600">{data.orderInfo.contractAmount}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.offerNoLabel} />
								</span>
								<span className="text-slate-600">{data.orderInfo.offerNo}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.orderStart} />
								</span>
								<span className="text-slate-600">{data.orderInfo.startDate}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-slate-900">
									<Translate text={localizationConstants.orderEnd} />
								</span>
								<span className="text-slate-600">{data.orderInfo.endDate}</span>
							</div>
						</div>
					)}
				</div>

				{/* Section 5: Documents (file icon + agreement document table styling) */}
				<div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
					<button
						type="button"
						onClick={() => toggleSection("documents")}
						className="flex w-full items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 transition-colors hover:bg-slate-50 text-left cursor-pointer"
					>
						<div className="flex items-center gap-3">
							<File className="h-5 w-5 text-slate-700" />
							<span className="text-sm font-semibold text-slate-900">
								<Translate text={localizationConstants.documentsSection} />
							</span>
						</div>
						{openSections.documents ? (
							<ChevronUp className="h-5 w-5 text-slate-400" />
						) : (
							<ChevronDown className="h-5 w-5 text-slate-400" />
						)}
					</button>

					{openSections.documents && (
						<div className="p-6">
							<div className="overflow-x-auto rounded border border-slate-200">
								<table className="w-full min-w-162.5 border-collapse">
									<thead>
										<tr className="h-11 border-b border-slate-200">
											<th className="font-sans px-4 text-left text-sm font-medium leading-6 tracking-normal text-slate-500">
												<div className="flex items-center gap-1">
													<Translate text={localizationConstants.dateHeaderLabel} />
													<ArrowUpDown className="h-4 w-4 text-slate-400" />
												</div>
											</th>
											<th className="font-sans px-4 text-left text-sm font-medium leading-6 tracking-normal text-slate-500">
												<div className="flex items-center gap-1">
													<Translate text={localizationConstants.documentNameHeader} />
													<ArrowUpDown className="h-4 w-4 text-slate-400" />
												</div>
											</th>
											<th className="font-sans px-4 text-left text-sm font-medium leading-6 tracking-normal text-slate-500">
												<div className="flex items-center gap-1">
													<Translate text={localizationConstants.fileHeader} />
													<ArrowUpDown className="h-4 w-4 text-slate-400" />
												</div>
											</th>
											<th />
										</tr>
									</thead>
									<tbody>
										{data.documents.map((doc) => (
											<tr key={doc.id} className="border-b border-slate-100 last:border-b-0">
												<td className="px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-slate-600">
													{doc.date}
												</td>
												<td className="px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-slate-700">
													<span className="inline-block rounded border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700">
														{doc.documentName}
													</span>
												</td>
												<td className="px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-slate-600">
													<div className="flex items-center gap-2">
														<div className="relative flex h-16 w-12 shrink-0 items-center justify-center">
															<File className="h-16 w-12 text-slate-300" strokeWidth={1.5} />
															<span
																className={`absolute -left-0.5 top-[60%] -translate-y-1/2 rounded-[2px] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white ${
																	doc.fileType === "pdf" ? "bg-red-600" : "bg-blue-600"
																}`}
															>
																{doc.fileType === "pdf" ? "PDF" : "DOC"}
															</span>
														</div>
														<span className="truncate text-sm">{doc.fileName}</span>
													</div>
												</td>
												<td className="px-2 py-2">
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<button
																type="button"
																className="h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-500 cursor-pointer"
															>
																<MoreHorizontal className="h-4 w-4 rotate-90" />
															</button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end" className="w-40">
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
		</div>
	);
}
