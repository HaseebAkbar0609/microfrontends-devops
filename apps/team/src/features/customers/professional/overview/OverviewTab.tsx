"use client";

import { Users, CircleUserRound, PencilLine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ProfessionalDetail } from "@/api-actions";

interface OverviewTabProps {
	readonly data: ProfessionalDetail;
}

export function OverviewTab({ data }: OverviewTabProps) {
	return (
		<div className="flex flex-col gap-6">
			{/* Top Stats Cards Row */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{/* Plan Card */}
				<Card className="p-0 gap-0 border-slate-200 bg-white shadow-xs">
					<CardContent className="flex items-center justify-between p-5">
						<div className="flex flex-col gap-1">
							<span className="text-[14px] font-normal text-slate-500 leading-[20px] tracking-[-0.15px]">
								<Translate text={localizationConstants.planLabel} />
							</span>
							<span className="text-[18px] font-semibold text-slate-900 leading-[28px] tracking-[-0.44px]">
								{data.plan}
							</span>
						</div>
						<Users className="h-8 w-8 text-slate-800" aria-hidden />
					</CardContent>
				</Card>

				{/* Active Seats Card */}
				<Card className="p-0 gap-0 border-slate-200 bg-white shadow-xs">
					<CardContent className="flex items-center justify-between p-5">
						<div className="flex flex-col gap-1">
							<span className="text-[14px] font-normal text-slate-500 leading-[20px] tracking-[-0.15px]">
								<Translate text={localizationConstants.activeSeatsLabel} />
							</span>
							<span className="text-[18px] font-semibold text-slate-900 leading-[28px] tracking-[-0.44px]">
								{data.activeSeats}
							</span>
						</div>
						<Users className="h-8 w-8 text-[#009966]" aria-hidden />
					</CardContent>
				</Card>
			</div>

			{/* Middle Details Grid */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Företagsuppgifter Card */}
				<Card className="p-0 gap-0 overflow-hidden border-slate-200 bg-white shadow-xs">
					<div className="flex h-[56px] items-center justify-between border-b border-slate-200 px-6">
						<div className="flex items-center gap-2.5">
							<CircleUserRound className="h-6 w-6 text-slate-800 shrink-0" aria-hidden />
							<h3 className="text-[16px] font-medium text-slate-900 leading-[24px] tracking-normal">
								<Translate text={localizationConstants.companyDetailsSectionTitle} />
							</h3>
						</div>
						<Button
							variant="secondary"
							size="sm"
							className="h-[36px] gap-1.5 rounded-lg bg-[#F4F4F5] border border-slate-200/60 px-3 text-xs font-medium text-slate-700 hover:bg-[#E4E4E7]"
						>
							<PencilLine className="h-3.5 w-3.5 text-slate-700" aria-hidden />
							<Translate text={localizationConstants.editLabel} />
						</Button>
					</div>

					<CardContent className="p-6">
						<div className="grid grid-cols-2 gap-y-5 gap-x-4">
							<div className="flex flex-col gap-1">
								<span className="text-[14px] font-medium text-slate-900 leading-[20px] tracking-normal">
									<Translate text={localizationConstants.kundNrLabel} />
								</span>
								<span className="text-[14px] font-normal text-slate-500 leading-[20px] tracking-normal">
									{data.contactUserId || "-"}
								</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-[14px] font-medium text-slate-900 leading-[20px] tracking-normal">
									<Translate text={localizationConstants.orgNumberLabel} />
								</span>
								<span className="text-[14px] font-normal text-slate-500 leading-[20px] tracking-normal">
									{data.orgNo || "-"}
								</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-[14px] font-medium text-slate-900 leading-[20px] tracking-normal">
									<Translate text={localizationConstants.categoryLabel} />
								</span>
								<span className="text-[14px] font-normal text-slate-500 leading-[20px] tracking-normal">
									{data.category || "-"}
								</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-[14px] font-medium text-slate-900 leading-[20px] tracking-normal">
									<Translate text={localizationConstants.cityLabel} />
								</span>
								<span className="text-[14px] font-normal text-slate-500 leading-[20px] tracking-normal">
									{data.city || "-"}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Kontaktperson Card */}
				<Card className="p-0 gap-0 overflow-hidden border-slate-200 bg-white shadow-xs">
					<div className="flex h-[56px] items-center justify-between border-b border-slate-200 px-6">
						<div className="flex items-center gap-2.5">
							<CircleUserRound className="h-6 w-6 text-slate-800 shrink-0" aria-hidden />
							<h3 className="text-[16px] font-medium text-slate-900 leading-[24px] tracking-normal">
								<Translate text={localizationConstants.contactPersonSectionTitle} />
							</h3>
						</div>
						<Button
							variant="secondary"
							size="sm"
							className="h-[36px] gap-1.5 rounded-lg bg-[#F4F4F5] border border-slate-200/60 px-3 text-xs font-medium text-slate-700 hover:bg-[#E4E4E7]"
						>
							<PencilLine className="h-3.5 w-3.5 text-slate-700" aria-hidden />
							<Translate text={localizationConstants.editLabel} />
						</Button>
					</div>

					<CardContent className="p-6">
						<div className="grid grid-cols-2 gap-y-5 gap-x-4">
							<div className="flex flex-col gap-1">
								<span className="text-[14px] font-medium text-slate-900 leading-[20px] tracking-normal">
									<Translate text={localizationConstants.nameLabel} />
								</span>
								<span className="text-[14px] font-normal text-slate-500 leading-[20px] tracking-normal">
									{data.contactPerson || "-"}
								</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-[14px] font-medium text-slate-900 leading-[20px] tracking-normal">
									<Translate text={localizationConstants.emailLabel} />
								</span>
								<span className="text-[14px] font-normal text-slate-500 leading-[20px] tracking-normal truncate">
									{data.email || "-"}
								</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-[14px] font-medium text-slate-900 leading-[20px] tracking-normal">
									<Translate text={localizationConstants.phoneLabel} />
								</span>
								<span className="text-[14px] font-normal text-slate-500 leading-[20px] tracking-normal">
									{data.phone || "-"}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent Activity Card */}
			<Card className="p-0 gap-0 border-slate-200 bg-white shadow-xs">
				<CardContent className="p-6">
					<h3 className="text-[18px] font-semibold text-slate-900 leading-[28px] tracking-[-0.44px] mb-6">
						<Translate text={localizationConstants.recentActivityTitle} />
					</h3>

					<div className="flex flex-col">
						{data.recentActivities.map((act, index) => {
							const isLast = index === data.recentActivities.length - 1;
							return (
								<div key={act.id} className="relative flex items-start justify-between gap-4 pb-6 last:pb-0">
									<div className="flex items-start gap-3.5">
										<div className="relative flex flex-col items-center pt-1">
											<span className="h-2.5 w-2.5 rounded-full bg-slate-900 shrink-0 z-10" aria-hidden />
											{!isLast && (
												<span
													className="absolute top-3 left-1/2 -translate-x-1/2 w-[2px] h-[calc(100%+16px)] bg-slate-200"
													aria-hidden
												/>
											)}
										</div>
										<span className="text-[14px] font-normal text-slate-800 leading-[20px] tracking-[-0.15px]">
											{act.titleKey ? <Translate text={act.titleKey} /> : act.title}
										</span>
									</div>

									<span className="text-[12px] font-normal text-slate-400 leading-[16px] tracking-normal whitespace-nowrap">
										{act.date}
									</span>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
