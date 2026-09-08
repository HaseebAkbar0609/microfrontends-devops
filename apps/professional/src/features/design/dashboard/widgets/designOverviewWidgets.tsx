import React from "react";
import {
	Activity,
	CalendarDays,
	FileImage,
	Image as ImageIcon,
	Newspaper,
	PenTool,
	Users,
} from "lucide-react";

import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import {
	WidgetActions,
	WidgetCalendarPreview,
	WidgetContent as Content,
	WidgetListItem,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
	WidgetTag,
} from "@/features/widgetdashboard/components/WidgetContent";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { DesignModalType } from "../components/DesignDashboardModals";

const DESIGN_WEEK_DAYS = [
	{ id: "mo", label: "Mo" },
	{ id: "tu", label: "Tu" },
	{ id: "we", label: "We" },
	{ id: "th", label: "Th" },
	{ id: "fr", label: "Fr" },
	{ id: "sa", label: "Sa" },
	{ id: "su", label: "Su" },
];

const JULY_2026_DAYS: (number | null)[] = [
	null, null, null, 1, 2, 3, 4,
	5, 6, 7, 8, 9, 10, 11,
	12, 13, 14, 15, 16, 17, 18,
	19, 20, 21, 22, 23, 24, 25,
	26, 27, 28, 29, 30, 31, null,
];

const JULY_HIGHLIGHTS: Record<number, string> = {
	29: "bg-indigo-500",
	31: "bg-amber-500",
};

export const getDesignOverviewWidgets = (
	onOpenModal: (type: DesignModalType, prompt?: string) => void,
): Record<string, WidgetProps> => ({
	// 1. Design Overview
	designOverview: {
		title: localizationConstants.designWidgetOverviewTitle,
		icon: PenTool,
		content: (
			<Content>
				<div className="grid grid-cols-2 gap-2">
					<div className="flex flex-col rounded-lg border border-slate-200 bg-slate-50/60 p-2.5">
						<span className="text-[11px] text-slate-500">
							<Translate text={localizationConstants.designWidgetOverviewActiveProjects} />
						</span>
						<span className="text-xl font-bold text-slate-900">8</span>
					</div>
					<div className="flex flex-col rounded-lg border border-slate-200 bg-slate-50/60 p-2.5">
						<span className="text-[11px] text-slate-500">
							<Translate text={localizationConstants.designWidgetOverviewDrawings} />
						</span>
						<span className="text-xl font-bold text-slate-900">14</span>
					</div>
					<div className="flex flex-col rounded-lg border border-slate-200 bg-slate-50/60 p-2.5">
						<span className="text-[11px] text-slate-500">
							<Translate text={localizationConstants.designWidgetOverviewReviews} />
						</span>
						<span className="text-xl font-bold text-amber-600">3</span>
					</div>
					<div className="flex flex-col rounded-lg border border-slate-200 bg-slate-50/60 p-2.5">
						<span className="text-[11px] text-slate-500">
							<Translate text={localizationConstants.designWidgetOverviewCompleted} />
						</span>
						<span className="text-xl font-bold text-emerald-600">5</span>
					</div>
				</div>

				<Row
					label={localizationConstants.designWidgetOverviewDeadline}
					value="2026-08-10"
				/>

				<WidgetActions>
					<button
						type="button"
						onClick={() => onOpenModal("overview")}
						className="cursor-pointer rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition-colors shadow-2xs"
					>
						<Translate text={localizationConstants.designWidgetOverviewViewAllCta} />
					</button>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	// 2. Design Meetings
	designMeetings: {
		title: localizationConstants.designWidgetMeetingsTitle,
		icon: Users,
		content: (
			<Content>
				<div className="flex items-center justify-between">
					<span className="text-slate-600 font-medium">
						<Translate text={localizationConstants.designWidgetMeetingsNextLabel} />
					</span>
					<WidgetTag
						label={localizationConstants.designWidgetMeetingsThisWeek}
						color="bg-indigo-100 text-indigo-800"
					/>
				</div>

				<div className="rounded-lg border border-indigo-200/70 bg-indigo-50/60 p-2.5 flex flex-col gap-1">
					<span className="text-xs font-semibold text-slate-800">Technical Review</span>
					<div className="flex items-center gap-3 text-[11px] text-slate-500">
						<span>2026-07-29 · 10:00</span>
						<span className="flex items-center gap-1">
							<Users className="h-3 w-3" />
							6 <Translate text={localizationConstants.designWidgetMeetingsParticipants} />
						</span>
					</div>
				</div>

				<WidgetListItem
					title="BIM-koordinering"
					meta={<span className="text-[11px] text-slate-400">2026-07-31 · 13:00</span>}
				/>
				<WidgetListItem
					title="Klientpresentation"
					meta={<span className="text-[11px] text-slate-400">2026-08-05 · 09:00</span>}
				/>

				<WidgetActions>
					<button
						type="button"
						onClick={() => onOpenModal("meeting")}
						className="cursor-pointer rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition-colors shadow-2xs"
					>
						<Translate text={localizationConstants.designWidgetMeetingsScheduleCta} />
					</button>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	// 3. Latest Activities
	designActivities: {
		title: localizationConstants.designWidgetActivitiesTitle,
		icon: Activity,
		content: (
			<Content>
				<WidgetListItem
					title="Ritning A-301 uppladdad"
					meta={
						<span className="flex items-center gap-1.5 text-[11px]">
							<span className="text-slate-400">Anna Lindström · 14 min sedan</span>
						</span>
					}
				/>
				<WidgetListItem
					title="Granskningskommentar tillagd"
					meta={
						<span className="flex items-center gap-1.5 text-[11px]">
							<span className="text-slate-400">Erik Johansson · 1 tim sedan</span>
						</span>
					}
				/>
				<WidgetListItem
					title="BIM-modell synkroniserad"
					meta={
						<span className="flex items-center gap-1.5 text-[11px]">
							<span className="text-slate-400">Maria Karlsson · 2 tim sedan</span>
						</span>
					}
				/>
				<WidgetListItem
					title="Revision R3 godkänd"
					meta={
						<span className="flex items-center gap-1.5 text-[11px]">
							<WidgetTag
								label="Godkänd"
								color="bg-emerald-100 text-emerald-800"
							/>
							<span className="text-slate-400">igår</span>
						</span>
					}
				/>
				<WidgetListItem
					title="Handling F-04 exporterad"
					meta={
						<span className="flex items-center gap-1.5 text-[11px]">
							<span className="text-slate-400">Lars Nilsson · igår</span>
						</span>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	// 6. Calendar
	designCalendar: {
		title: localizationConstants.designWidgetCalendarTitle,
		icon: CalendarDays,
		content: (
			<Content>
				<WidgetCalendarPreview
					title="Juli 2026"
					weekDays={DESIGN_WEEK_DAYS}
					days={JULY_2026_DAYS}
					highlights={JULY_HIGHLIGHTS}
				/>
				<div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
					<span className="flex items-center gap-1">
						<span className="h-2 w-2 rounded-full bg-indigo-500" />
						<span className="text-slate-600">Jul 29 – Technical Review</span>
					</span>
					<span className="flex items-center gap-1">
						<span className="h-2 w-2 rounded-full bg-amber-500" />
						<span className="text-slate-600">Jul 31 – BIM-koordinering</span>
					</span>
				</div>
				<MockTag />
			</Content>
		),
	},

	// 7. Image / Model
	designImage: {
		title: localizationConstants.designWidgetImageTitle,
		icon: ImageIcon,
		content: (
			<Content>
				<div className="relative h-28 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 flex flex-col items-center justify-center p-3 text-center">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-700 shadow-2xs mb-1">
						<FileImage className="h-6 w-6" />
					</div>
					<span className="text-xs font-semibold text-slate-800">3D_Office_Gothenburg_v1.png</span>
					<span className="text-[11px] text-slate-500">Göteborg Office · Revision 3</span>
				</div>

				<Row
					label={localizationConstants.designWidgetImageLatestLabel}
					value="3D_Office_Gothenburg_v1.png"
				/>
				<Row
					label={localizationConstants.designWidgetImageFilesLabel}
					value="24"
				/>
				<MockTag />
			</Content>
		),
	},

	// 8. News
	designNews: {
		title: localizationConstants.designWidgetNewsTitle,
		icon: Newspaper,
		content: (
			<Content>
				<WidgetListItem
					title="Ny IFC 4.3-standard antagen av ISO"
					meta={<span className="text-[11px] text-slate-400">buildingSMART · 2026-07-28</span>}
				/>
				<WidgetListItem
					title="Revit 2027 – nytt AI-baserat layout-verktyg"
					meta={<span className="text-[11px] text-slate-400">Autodesk Blog · 2026-07-25</span>}
				/>
				<WidgetListItem
					title="Branschrapport: BIM-adoption ökar 34%"
					meta={<span className="text-[11px] text-slate-400">Byggvärlden · 2026-07-22</span>}
				/>
				<WidgetListItem
					title="Hallbarhet i projektering – ny vägledning"
					meta={<span className="text-[11px] text-slate-400">Boverket · 2026-07-20</span>}
				/>
				<MockTag />
			</Content>
		),
	},
});
