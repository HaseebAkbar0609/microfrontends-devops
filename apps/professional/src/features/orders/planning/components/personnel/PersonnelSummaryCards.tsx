"use client";

import Image from "next/image";
import { Blocks, Calendar, Timer, Users } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PlanningResource, PlanningStatistics } from "../../types/planning.types";

import { Button } from "@/components/ui/button";

interface PersonnelSummaryCardsProps {
	topEmployees?: PlanningResource[];
	statistics?: PlanningStatistics;
	dateRangeText?: string;
}

const EVA_MENDES_AVATAR =
	"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120";
const AVATAR_2 =
	"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120";
const AVATAR_3 =
	"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120";

const DEFAULT_TOP_EMPLOYEES = [
	{
		id: "emp-1",
		name: "Göran Andersson",
		initials: "GA",
		hours: 40,
		percentage: 70,
		avatarUrl: undefined,
	},
	{
		id: "emp-2",
		name: "Eva Mendes",
		initials: "EM",
		hours: 20,
		percentage: 40,
		avatarUrl: EVA_MENDES_AVATAR,
	},
	{
		id: "emp-3",
		name: "Anders Larsson",
		initials: "AB",
		hours: 10,
		percentage: 20,
		avatarUrl: undefined,
	},
];

export function PersonnelSummaryCards({
	topEmployees,
	statistics,
	dateRangeText = "10/12/2025 - 17/12/2025",
}: PersonnelSummaryCardsProps) {
	const displayEmployees = (topEmployees && topEmployees.length > 0)
		? topEmployees.slice(0, 3).map((e) => ({
				id: e.id,
				name: e.name,
				initials: e.initials,
				hours: e.totalHours || e.allocatedHours || 40,
				percentage: e.percentage || 70,
				avatarUrl: e.avatarUrl,
		  }))
		: DEFAULT_TOP_EMPLOYEES;

	return (
		<div className="flex flex-col lg:flex-row gap-4 w-full font-sans">
			{/* Left Card: Bästa tilldelade */}
			<div className="flex-1 rounded-[8px] border border-slate-200 bg-[#EEF2FF] p-4 sm:p-5 shadow-2xs">
				<div className="flex items-center justify-between mb-3.5">
					<h2 className="font-sans font-medium text-lg leading-7 tracking-normal text-slate-900 flex items-center">
						<Translate text={localizationConstants.bastaTilldelade} />
					</h2>
					<Button
						type="button"
						variant="outline"
						className="w-[116px] h-[40px] px-4 py-2 bg-white border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-800 rounded-[8px] shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-2"
					>
						<Translate text={localizationConstants.visaDetaljer} />
					</Button>
				</div>

				<div className="space-y-3">
					{displayEmployees.map((emp) => (
						<div key={emp.id} className="flex items-center gap-3">
							{/* Left Column: Fixed Width for exact alignment across all rows */}
							<div className="w-[170px] sm:w-[190px] shrink-0 flex items-center gap-2.5 min-w-0">
								{emp.avatarUrl ? (
									<Image
										src={emp.avatarUrl}
										alt={emp.name}
										width={32}
										height={32}
										className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 shadow-2xs"
									/>
								) : (
									<div className="w-8 h-8 rounded-full bg-slate-200/80 border border-slate-300 text-slate-700 font-semibold text-xs flex items-center justify-center shrink-0">
										{emp.initials}
									</div>
								)}
								<p className="font-sans font-medium text-[14px] leading-[20px] tracking-normal text-slate-900 truncate">
									{emp.name}
								</p>
							</div>

							{/* Right Column: Progress Bar Track with height 8px & background: var(--border, #E5E5E5) */}
							<div className="flex-1 flex flex-col gap-1 min-w-0">
								<div className="text-xs text-slate-600 font-medium">
									{emp.hours} <Translate text={localizationConstants.timmarSuffix} />
								</div>
								<div className="flex items-center gap-3 w-full">
									<div className="flex-1 h-[8px] rounded-full bg-[#E5E5E5] overflow-hidden">
										<div
											className="h-full rounded-full bg-slate-900 transition-all duration-300"
											style={{ width: `${emp.percentage}%` }}
										/>
									</div>
									<span className="text-xs font-medium text-slate-500 w-9 text-right shrink-0">
										{emp.percentage}%
									</span>
								</div>
							</div>
						</div>
					))}

					{/* 4th row: 3 Avatars + 1 Number Circle (+12) */}
					<div className="flex items-center gap-3">
						{/* Left Column: 3 images + 1 number circle with slight overlap */}
						<div className="w-[170px] sm:w-[190px] shrink-0 flex items-center gap-2.5 min-w-0">
							<div className="flex items-center -space-x-1.5 shrink-0">
								<Image
									src={EVA_MENDES_AVATAR}
									alt="Team member 1"
									width={28}
									height={28}
									className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-2xs"
								/>
								<Image
									src={AVATAR_2}
									alt="Team member 2"
									width={28}
									height={28}
									className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-2xs"
								/>
								<Image
									src={AVATAR_3}
									alt="Team member 3"
									width={28}
									height={28}
									className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-2xs"
								/>
								<div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white text-slate-700 font-semibold text-[10px] flex items-center justify-center shadow-2xs">
									+12
								</div>
							</div>
						</div>

						{/* Right Column: Progress Bar Track with identical 8px height, background & width */}
						<div className="flex-1 flex flex-col gap-1 min-w-0">
							<div className="text-xs text-slate-600 font-medium">
								19 <Translate text={localizationConstants.timmarSuffix} />
							</div>
							<div className="flex items-center gap-3 w-full">
								<div className="flex-1 h-[8px] rounded-full bg-[#E5E5E5] overflow-hidden">
									<div
										className="h-full rounded-full bg-slate-900 transition-all duration-300"
										style={{ width: "40%" }}
									/>
								</div>
								<span className="text-xs font-medium text-slate-500 w-9 text-right shrink-0">
									40%
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Right Card: Övergripande statistik (bg-slate-100, width: 385px, gap: 12px) */}
			<div className="rounded-[8px] border border-slate-200 bg-slate-100 p-4 sm:p-5 shadow-2xs w-full lg:w-[385px] lg:shrink-0 flex flex-col gap-3">
				<h2 className="font-sans font-medium text-lg leading-7 tracking-normal text-slate-900 flex items-center">
					<Translate text={localizationConstants.overgripandeStatistik} />
				</h2>
				<div>
					<div className="w-[240px] h-[36px] inline-flex items-center gap-1 rounded-[8px] border border-slate-200 bg-white px-3 shadow-2xs text-xs sm:text-sm">
						<Calendar className="w-4 h-4 text-[#71717A] stroke-[1.85] shrink-0" />
						<span className="text-slate-700 font-medium">{dateRangeText}</span>
					</div>
				</div>

				{/* 3 Rows aligned to left with width: 160px label and 8px gap */}
				<div className="flex flex-col gap-2">
					<div className="h-[24px] flex items-center gap-2">
						<Blocks className="w-4 h-4 text-[#71717A] stroke-[1.85] shrink-0" />
						<span className="w-[160px] h-[20px] shrink-0 font-sans font-normal text-[14px] leading-[20px] tracking-normal text-slate-700 truncate">
							<Translate text={localizationConstants.totaltAntalProjekt} />
						</span>
						<span className="font-sans font-medium text-base leading-6 tracking-normal text-black shrink-0">
							{statistics?.totalProjects ?? 14}
						</span>
					</div>

					<div className="h-[24px] flex items-center gap-2">
						<Users className="w-4 h-4 text-[#71717A] stroke-[1.85] shrink-0" />
						<span className="w-[160px] h-[20px] shrink-0 font-sans font-normal text-[14px] leading-[20px] tracking-normal text-slate-700 truncate">
							<Translate text={localizationConstants.antalTilldelade} />
						</span>
						<span className="font-sans font-medium text-base leading-6 tracking-normal text-black shrink-0">
							{statistics?.assignedProjects ?? 12}
						</span>
					</div>

					<div className="h-[24px] flex items-center gap-2">
						<Timer className="w-4 h-4 text-[#71717A] stroke-[1.85] shrink-0" />
						<span className="w-[160px] h-[20px] shrink-0 font-sans font-normal text-[14px] leading-[20px] tracking-normal text-slate-700 truncate">
							<Translate text={localizationConstants.totalaArbetstimmar} />
						</span>
						<span className="font-sans font-medium text-base leading-6 tracking-normal text-black shrink-0">
							{statistics?.totalHours ?? 1420} <Translate text={localizationConstants.timmarSuffix} />
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PersonnelSummaryCards;
