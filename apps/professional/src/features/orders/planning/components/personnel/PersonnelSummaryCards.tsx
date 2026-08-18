"use client";

import Image from "next/image";
import { Calendar, ChevronRight, Clock, LayoutGrid, Users } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PlanningResource, PlanningStatistics } from "../../types/planning.types";

interface PersonnelSummaryCardsProps {
	topEmployees: PlanningResource[];
	statistics?: PlanningStatistics;
	dateRangeText?: string;
}

export function PersonnelSummaryCards({
	topEmployees,
	statistics,
	dateRangeText = "10/12/2025 - 17/12/2025",
}: PersonnelSummaryCardsProps) {
	return (
		<div className="flex flex-col lg:flex-row gap-4 w-full font-sans">
			{/* Left Card: Bästa tilldelade */}
			<div className="flex-1 rounded-xl border border-gray-200 bg-[#F1F5F9] p-4 sm:p-5 shadow-2xs">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-sm sm:text-base font-semibold text-gray-900">
						<Translate text={localizationConstants.bastaTilldelade} />
					</h2>
					<button
						type="button"
						className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 cursor-pointer transition-colors"
					>
						<Translate text={localizationConstants.visaDetaljer} />
						<ChevronRight className="w-3.5 h-3.5" />
					</button>
				</div>

				<div className="space-y-4">
					{topEmployees.slice(0, 3).map((emp) => (
						<div key={emp.id} className="flex items-center gap-3">
							{emp.avatarUrl ? (
								<Image
									src={emp.avatarUrl}
									alt={emp.name}
									width={36}
									height={36}
									className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-100 shadow-2xs"
								/>
							) : (
								<div className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold text-xs flex items-center justify-center shrink-0">
									{emp.initials}
								</div>
							)}
							<div className="flex-1 min-w-0">
								<div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
									<div className="w-full sm:w-36 shrink-0 min-w-0">
										<p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{emp.name}</p>
										<p className="text-[11px] sm:text-xs text-gray-500 truncate">{emp.role || "Anställd"}</p>
									</div>
									<div className="flex-1 flex flex-col gap-1 w-full min-w-0">
										<div className="flex items-center justify-between text-xs sm:text-sm">
											<span className="text-gray-500 font-medium">
												{emp.totalHours} <Translate text={localizationConstants.timmarSuffix} />
											</span>
											<span className="text-gray-500 font-medium text-right shrink-0">{emp.percentage}%</span>
										</div>
										<div className="h-2 rounded-full bg-gray-200 overflow-hidden w-full">
											<div className="h-full rounded-full bg-gray-900" style={{ width: `${emp.percentage}%` }} />
										</div>
									</div>
								</div>
							</div>
						</div>
					))}

					{topEmployees.length > 3 && (
						<div className="flex items-center gap-3">
							<div className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold text-xs flex items-center justify-center shrink-0">
								+{topEmployees.length - 3}
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
									<div className="w-full sm:w-36 shrink-0 min-w-0">
										<p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
											<Translate text={localizationConstants.allEmployees} />
										</p>
										<p className="text-[11px] sm:text-xs text-gray-500 truncate">
											+{topEmployees.length - 3} <Translate text={localizationConstants.antalTilldelade} />
										</p>
									</div>
									<div className="flex-1 flex flex-col gap-1 w-full min-w-0">
										<div className="flex items-center justify-between text-xs sm:text-sm">
											<span className="text-gray-500 font-medium">
												{topEmployees.slice(3).reduce((sum, e) => sum + e.totalHours, 0)}{" "}
												<Translate text={localizationConstants.timmarSuffix} />
											</span>
											<span className="text-gray-500 font-medium text-right shrink-0">
												{topEmployees.slice(3).reduce((sum, e) => sum + e.percentage, 0) > 0
													? Math.round(
															topEmployees.slice(3).reduce((sum, e) => sum + e.percentage, 0) /
																(topEmployees.length - 3)
													  )
													: 0}
												%
											</span>
										</div>
										<div className="h-2 rounded-full bg-gray-200 overflow-hidden w-full">
											<div
												className="h-full rounded-full bg-gray-900"
												style={{
													width: `${
														topEmployees.slice(3).reduce((sum, e) => sum + e.percentage, 0) > 0
															? Math.round(
																	topEmployees.slice(3).reduce((sum, e) => sum + e.percentage, 0) /
																		(topEmployees.length - 3)
															  )
															: 0
													}%`,
												}}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Right Card: Övergripande statistik */}
			<div className="rounded-xl border border-gray-200 bg-[#F1F5F9] p-4 sm:p-5 shadow-2xs w-full lg:w-80 lg:shrink-0">
				<h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">
					<Translate text={localizationConstants.overgripandeStatistik} />
				</h2>
				<div className="mb-3 sm:mb-4">
					<div className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2.5 sm:px-3 py-1.5 shadow-2xs text-xs sm:text-sm">
						<Calendar className="w-3.5 h-3.5 text-gray-500 shrink-0" />
						<span className="text-gray-700 font-medium">{dateRangeText}</span>
					</div>
				</div>
				<div className="space-y-2.5 sm:space-y-3">
					<div className="flex items-center gap-3">
						<LayoutGrid className="w-4 h-4 text-gray-500 shrink-0" />
						<span className="text-xs sm:text-sm text-gray-600 flex-1 truncate">
							<Translate text={localizationConstants.totaltAntalProjekt} />
						</span>
						<span className="text-xs sm:text-sm font-bold text-gray-900 shrink-0">
							{statistics?.totalProjects ?? 23}
						</span>
					</div>
					<div className="flex items-center gap-3">
						<Users className="w-4 h-4 text-gray-500 shrink-0" />
						<span className="text-xs sm:text-sm text-gray-600 flex-1 truncate">
							<Translate text={localizationConstants.antalTilldelade} />
						</span>
						<span className="text-xs sm:text-sm font-bold text-gray-900 shrink-0">
							{statistics?.assignedProjects ?? 25}
						</span>
					</div>
					<div className="flex items-center gap-3">
						<Clock className="w-4 h-4 text-gray-500 shrink-0" />
						<span className="text-xs sm:text-sm text-gray-600 flex-1 truncate">
							<Translate text={localizationConstants.totalaArbetstimmar} />
						</span>
						<span className="text-xs sm:text-sm font-bold text-gray-900 shrink-0">
							{statistics?.totalHours ?? 546} <Translate text={localizationConstants.timmarSuffix} />
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PersonnelSummaryCards;
