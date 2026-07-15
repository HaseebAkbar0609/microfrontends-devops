"use client";

import { MoreVertical, Plus, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { DUMMY_MEETING_MINUTES } from "../../constants";
import type { MeetingMinute } from "../../types";

const ratingStyle: Record<
	MeetingMinute["rating"],
	{ label: string; bg: string; text: string }
> = {
	good: {
		label: localizationConstants.projectProtocolGood,
		bg: "bg-[#F0FDF4]",
		text: "text-[#047857]",
	},
	moderate: {
		label: localizationConstants.projectProtocolModerate,
		bg: "bg-[#FEFCE8]",
		text: "text-[#A16207]",
	},
	bad: {
		label: localizationConstants.projectProtocolBad,
		bg: "bg-[#FEF2F2]",
		text: "text-[#DC2626]",
	},
};

const GRID_COLS = "grid-cols-[10rem_1fr_12rem_4rem]";

export function MeetingMinutesTab() {
	return (
		<div className="pb-10">
			{/* Toolbar */}
			<div className="flex items-center mb-4">
				<Button
					type="button"
					className="ml-auto h-9 gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.projectCreateNewLabel} />
				</Button>
			</div>

			{/* Table */}
			<div className="w-full bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
				{/* Header */}
				<div
					className={`grid ${GRID_COLS} border-b border-[#E2E8F0] bg-white`}
				>
					<button
						type="button"
						className="cursor-pointer flex items-center gap-1 h-12 px-4 text-sm font-medium text-[#64748B] hover:text-slate-700 text-left"
					>
						Date
						<ArrowUpDown className="h-3.5 w-3.5" />
					</button>
					<button
						type="button"
						className="cursor-pointer flex items-center gap-1 h-12 px-4 text-sm font-medium text-[#64748B] hover:text-slate-700 text-left"
					>
						Title
						<ArrowUpDown className="h-3.5 w-3.5" />
					</button>
					<button
						type="button"
						className="cursor-pointer flex items-center gap-1 h-12 px-4 text-sm font-medium text-[#64748B] hover:text-slate-700 text-left"
					>
						<Translate
							text={localizationConstants.projectActionProtocolLabel}
						/>
						<ArrowUpDown className="h-3.5 w-3.5" />
					</button>
					<div className="border-l border-[#E2E8F0] h-12" />
				</div>

				{/* Rows */}
				{DUMMY_MEETING_MINUTES.length === 0 ? (
					<div className="py-12 text-center text-sm text-slate-400">
						No meeting minutes found
					</div>
				) : (
					<div className="divide-y divide-slate-100">
						{DUMMY_MEETING_MINUTES.map((minute) => {
							const rating = ratingStyle[minute.rating];
							return (
								<div
									key={minute.id}
									className={`grid ${GRID_COLS} items-center hover:bg-slate-50 transition-colors`}
								>
									<span className="text-sm text-[#020617] h-14 flex items-center px-4">
										{minute.date}
									</span>
									<span className="text-sm text-[#020617] truncate h-14 flex items-center px-4 pr-4">
										{minute.title}
									</span>
									<div className="h-14 flex items-center px-4">
										<span
											className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-xs font-medium shadow-[0px_1px_2px_rgba(16,24,40,0.05)] ${rating.bg} ${rating.text}`}
										>
											<Translate text={rating.label} />
										</span>
									</div>
									<div className="h-14 flex items-center justify-center border-l border-[#E2E8F0]">
										<button
											type="button"
											className="cursor-pointer flex items-center justify-center h-9 w-9 rounded-[6px] text-[#18181B] hover:bg-slate-100 transition-colors"
											aria-label="Actions"
										>
											<MoreVertical className="h-4 w-4" />
										</button>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
