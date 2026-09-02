import React from "react";
import {
	Bot,
	CalendarDays,
	Image as ImageIcon,
	Wrench,
	Truck,
} from "lucide-react";

import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import {
	WidgetActions,
	WidgetContent as Content,
	WidgetListItem,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
	WidgetTag,
} from "@/features/widgetdashboard/components/WidgetContent";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { MachineModalType } from "../components/MachineDashboardModals";

export const getMachinePlanningWidgets = (
	onOpenModal: (type: MachineModalType, prompt?: string) => void,
): Record<string, WidgetProps> => ({
	// 8. AI Machine Assistant (AI Maskinassistent) 🤖
	machineAiAssistant: {
		title: localizationConstants.machineWidgetAiTitle,
		icon: Bot,
		content: (
			<Content>
				<div className="rounded-lg bg-indigo-50/70 border border-indigo-100 p-2.5 flex flex-col gap-1.5">
					<div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900">
						<Bot className="h-3.5 w-3.5 text-indigo-600" />
						<span>
							<Translate text={localizationConstants.machineWidgetAiInsightsHeader} />
						</span>
					</div>
					<p className="text-xs text-indigo-950 leading-relaxed">
						<Translate text={localizationConstants.machineWidgetAiInsight1} />
					</p>
					<p className="text-[11px] text-indigo-800">
						<Translate text={localizationConstants.machineWidgetAiInsight2} />
					</p>
				</div>

				<p className="text-xs text-slate-400 pt-1">
					<Translate text={localizationConstants.machineWidgetAiQuestionsHeader} />
				</p>
				<div className="flex flex-wrap gap-1.5">
					<button
						type="button"
						onClick={() => onOpenModal("ai", "Varför är tomgångstiden hög idag?")}
						className="cursor-pointer rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-slate-800 transition-colors"
					>
						<Translate text={localizationConstants.machineWidgetAiQuestion1} />
					</button>
					<button
						type="button"
						onClick={() => onOpenModal("ai", "Hur optimerar vi bränsleförbrukningen?")}
						className="cursor-pointer rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
					>
						<Translate text={localizationConstants.machineWidgetAiQuestion2} />
					</button>
				</div>

				<WidgetActions>
					<button
						type="button"
						onClick={() => onOpenModal("ai")}
						className="cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-2xs"
					>
						<Translate text={localizationConstants.machineWidgetAiOpenCta} />
					</button>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	// 9. Repairs (Reparationer) 🛠️
	machineRepairs: {
		title: localizationConstants.machineWidgetRepairsTitle,
		icon: Wrench,
		content: (
			<Content>
				<Row
					label={localizationConstants.machineWidgetRepairsActive}
					value={<Translate text={localizationConstants.machineWidgetRepairsActiveVal} />}
				/>

				<WidgetListItem
					title={localizationConstants.machineWidgetRepairsItem1}
					meta={
						<span className="flex items-center gap-1.5 text-[11px]">
							<Translate text={localizationConstants.machineWidgetRepairsItem1Meta} />
						</span>
					}
				/>

				<WidgetListItem
					title={localizationConstants.machineWidgetRepairsItem2}
					meta={
						<span className="flex items-center gap-1.5 text-[11px]">
							<span className="text-slate-400">
								<Translate text={localizationConstants.machineWidgetRepairsItem2Meta} />
							</span>
						</span>
					}
				/>

				<p className="text-xs text-slate-500 italic pt-0.5">
					<Translate text={localizationConstants.machineWidgetRepairsLastCompletedVal} />
				</p>

				<WidgetActions>
					<button
						type="button"
						onClick={() => onOpenModal("repair")}
						className="cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-2xs"
					>
						<Translate text={localizationConstants.machineWidgetRepairsCreateCta} />
					</button>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	// 10. Bookings (Bokningar) 📅
	machineBookings: {
		title: localizationConstants.machineWidgetBookingsTitle,
		icon: CalendarDays,
		content: (
			<Content>
				<div className="flex items-center justify-between">
					<span className="text-slate-600 font-medium">
						<Translate text={localizationConstants.machineWidgetBookingsConflicts} />
					</span>
					<WidgetTag
						label={localizationConstants.machineWidgetBookingsConflictNone}
						color="bg-emerald-100 text-emerald-800"
					/>
				</div>

				<WidgetListItem
					title={localizationConstants.machineWidgetBookingsItem1Title}
					meta={<Translate text={localizationConstants.machineWidgetBookingsItem1Meta} />}
				/>

				<WidgetListItem
					title={localizationConstants.machineWidgetBookingsItem2Title}
					meta={<Translate text={localizationConstants.machineWidgetBookingsItem2Meta} />}
				/>

				<WidgetActions>
					<button
						type="button"
						onClick={() => onOpenModal("booking")}
						className="cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-2xs"
					>
						<Translate text={localizationConstants.machineWidgetBookingsCreateCta} />
					</button>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	// 11. Image (Bild) 🖼️
	machineImage: {
		title: localizationConstants.machineWidgetImageTitle,
		icon: ImageIcon,
		content: (
			<Content>
				<div className="relative h-28 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 flex flex-col items-center justify-center p-3 text-center">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-700 shadow-2xs mb-1">
						<Truck className="h-6 w-6" />
					</div>
					<span className="text-xs font-semibold text-slate-800">
						<Translate text={localizationConstants.machineWidgetImageModelVal} />
					</span>
					<span className="text-[11px] text-slate-500">
						<Translate text={localizationConstants.machineWidgetImageIdVal} />
					</span>
				</div>

				<div className="flex items-center justify-between text-xs text-slate-400 pt-1">
					<span>
						<Translate text={localizationConstants.machineWidgetImageVerified} />
					</span>
					<span>
						<Translate text={localizationConstants.machineWidgetImageUpdatedVal} />
					</span>
				</div>

				<MockTag />
			</Content>
		),
	},
});
