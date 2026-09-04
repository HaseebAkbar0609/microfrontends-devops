import React from "react";
import Link from "next/link";
import {
	BarChart3,
	Clock,
	MapPin,
	Zap,
} from "lucide-react";

import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import {
	WidgetActions,
	WidgetContent as Content,
	WidgetListItem,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
	WidgetSparkBars,
	WidgetTag,
} from "@/features/widgetdashboard/components/WidgetContent";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { MachineModalType } from "../components/MachineDashboardModals";

export const getMachineOperationsWidgets = (
	onOpenModal: (type: MachineModalType, prompt?: string) => void,
): Record<string, WidgetProps> => ({
	// 5. Machine Usage (Maskinanvändning) 📊
	machineUsage: {
		title: localizationConstants.machineWidgetUsageTitle,
		icon: BarChart3,
		content: (
			<Content>
				<Row
					label={localizationConstants.machineWidgetUsageUtilization}
					value={<Translate text={localizationConstants.machineWidgetUsageUtilizationVal} />}
				/>
				<Row
					label={localizationConstants.machineWidgetUsageOperatingHours}
					value={<Translate text={localizationConstants.machineWidgetUsageOperatingHoursVal} />}
				/>
				<Row
					label={localizationConstants.machineWidgetUsageIdleHours}
					value={<Translate text={localizationConstants.machineWidgetUsageIdleHoursVal} />}
				/>
				<Row
					label={localizationConstants.machineWidgetUsageFuel}
					value={<Translate text={localizationConstants.machineWidgetUsageFuelVal} />}
				/>

				<div className="pt-1">
					<span className="text-xs text-slate-400">
						<Translate text={localizationConstants.machineWidgetUsageTrendLabel} />
					</span>
					<WidgetSparkBars
						values={[5.2, 6.1, 4.8, 5.9, 5.5, 0.0, 0.0]}
						color="bg-blue-600"
					/>
				</div>

				<WidgetActions>
					<Link
						href="/module/production/machine/statistics"
						className="cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-2xs inline-block"
					>
						<Translate text={localizationConstants.machineWidgetUsageReportCta} />
					</Link>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	// 6. Latest Activities (Senaste aktiviteter) ⚡
	machineActivities: {
		title: localizationConstants.machineWidgetActivitiesTitle,
		icon: Zap,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.machineWidgetActivity1Title}
					meta={
						<span className="flex items-center gap-1 text-[11px] text-slate-400">
							<Clock className="h-3 w-3" aria-hidden="true" />
							<Translate text={localizationConstants.machineWidgetActivity1Meta} />
						</span>
					}
				/>
				<WidgetListItem
					title={localizationConstants.machineWidgetActivity2Title}
					meta={
						<span className="flex items-center gap-1 text-[11px] text-slate-400">
							<Clock className="h-3 w-3" aria-hidden="true" />
							<Translate text={localizationConstants.machineWidgetActivity2Meta} />
						</span>
					}
				/>
				<WidgetListItem
					title={localizationConstants.machineWidgetActivity3Title}
					meta={
						<span className="flex items-center gap-1 text-[11px] text-slate-400">
							<Clock className="h-3 w-3" aria-hidden="true" />
							<Translate text={localizationConstants.machineWidgetActivity3Meta} />
						</span>
					}
				/>
				<WidgetListItem
					title={localizationConstants.machineWidgetActivity4Title}
					meta={
						<span className="flex items-center gap-1 text-[11px] text-slate-400">
							<Clock className="h-3 w-3" aria-hidden="true" />
							<Translate text={localizationConstants.machineWidgetActivity4Meta} />
						</span>
					}
				/>

				<WidgetActions>
					<Link
						href="/module/production/machine/handling"
						className="cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-2xs inline-block"
					>
						<Translate text={localizationConstants.machineWidgetActivitiesLogCta} />
					</Link>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	// 7. GPS & Position 📍
	machineGps: {
		title: localizationConstants.machineWidgetGpsTitle,
		icon: MapPin,
		content: (
			<Content>
				<Row
					label={localizationConstants.machineWidgetGpsCoords}
					value="59.3326° N, 18.0649° E"
				/>
				<div className="flex items-center justify-between">
					<span className="text-slate-600 font-medium">
						<Translate text={localizationConstants.machineWidgetGpsGeofence} />:
					</span>
					<WidgetTag
						label={localizationConstants.machineWidgetGpsGeofenceVal}
						color="bg-emerald-100 text-emerald-800"
					/>
				</div>
				<Row
					label={localizationConstants.machineWidgetGpsLastMoved}
					value={<Translate text={localizationConstants.machineWidgetGpsLastMovedVal} />}
				/>
				<Row
					label={localizationConstants.machineWidgetGpsAccuracy}
					value={<Translate text={localizationConstants.machineWidgetGpsAccuracyVal} />}
				/>

				{/* Mini Map Interactive Box */}
				<button
					type="button"
					onClick={() => onOpenModal("map")}
					className="relative mt-2 h-20 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center cursor-pointer hover:border-slate-400 transition-colors group"
				>
					<div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 opacity-80" />
					<div className="relative z-10 flex flex-col items-center gap-1 text-slate-600">
						<div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md group-hover:scale-110 transition-transform">
							<MapPin className="h-4 w-4" />
						</div>
						<span className="text-[10px] font-semibold text-slate-700 bg-white/80 px-1.5 py-0.5 rounded shadow-2xs">
							<Translate text={localizationConstants.machineWidgetGpsLocationLabel} />
						</span>
					</div>
				</button>

				<WidgetActions>
					<button
						type="button"
						onClick={() => onOpenModal("map")}
						className="cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-2xs"
					>
						<Translate text={localizationConstants.machineWidgetGpsMapCta} />
					</button>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},
});
