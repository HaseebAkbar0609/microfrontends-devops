import React from "react";
import Link from "next/link";
import {
	Activity,
	Building2,
	Radio,
	Truck,
} from "lucide-react";

import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import {
	WidgetActions,
	WidgetBarRow,
	WidgetChip,
	WidgetChips,
	WidgetContent as Content,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
	WidgetSparkBars,
	WidgetTag,
} from "@/features/widgetdashboard/components/WidgetContent";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { MachineModalType } from "../components/MachineDashboardModals";

export const getMachineFleetWidgets = (
	onOpenModal: (type: MachineModalType, prompt?: string) => void,
): Record<string, WidgetProps> => ({
	// 1. Machine Health Score 🟢🟡🔴
	machineHealth: {
		title: localizationConstants.machineWidgetHealthTitle,
		icon: Activity,
		content: (
			<Content>
				<div className="flex items-baseline justify-between gap-3">
					<span className="text-slate-600 font-medium whitespace-nowrap">
						<Translate text={localizationConstants.machineWidgetHealthScoreLabel} />
					</span>
					<div className="flex items-center gap-1.5">
						<span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
						<span className="text-base font-bold text-slate-900">82 / 100</span>
						<span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
							<Translate text={localizationConstants.machineWidgetHealthStatusGood} />
						</span>
					</div>
				</div>

				<div className="pt-1">
					<span className="text-xs text-slate-400">
						<Translate text={localizationConstants.machineWidgetHealthTrendLabel} />
					</span>
					<WidgetSparkBars
						values={[78, 80, 81, 80, 82, 81, 82]}
						color="bg-emerald-500"
					/>
				</div>

				<Row
					label={localizationConstants.machineWidgetHealthEngine}
					value={<Translate text={localizationConstants.machineWidgetHealthEngineVal} />}
				/>
				<Row
					label={localizationConstants.machineWidgetHealthHydraulics}
					value={<Translate text={localizationConstants.machineWidgetHealthHydraulicsVal} />}
				/>
				<Row
					label={localizationConstants.machineWidgetHealthBattery}
					value={<Translate text={localizationConstants.machineWidgetHealthBatteryVal} />}
				/>

				<WidgetActions>
					<button
						type="button"
						onClick={() => onOpenModal("diagnostic")}
						className="cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-2xs"
					>
						<Translate text={localizationConstants.machineWidgetHealthDiagnoseCta} />
					</button>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	// 2. Machine Overview (Maskinöversikt) 🚜
	machineOverview: {
		title: localizationConstants.machineWidgetOverviewTitle,
		icon: Truck,
		content: (
			<Content>
				<Row
					label={localizationConstants.machineWidgetOverviewModel}
					value={<Translate text={localizationConstants.machineWidgetOverviewModelVal} />}
				/>
				<Row
					label={localizationConstants.machineWidgetOverviewAssetId}
					value="EXC-0220"
				/>
				<Row
					label={localizationConstants.machineWidgetOverviewYear}
					value="2021"
				/>
				<Row
					label={localizationConstants.machineWidgetOverviewHours}
					value="3 420 h"
				/>
				<Row
					label={localizationConstants.machineWidgetOverviewSite}
					value={<Translate text={localizationConstants.machineWidgetOverviewSiteVal} />}
				/>
				<Row
					label={localizationConstants.machineWidgetOverviewDept}
					value={<Translate text={localizationConstants.machineWidgetOverviewDeptVal} />}
				/>
				<p className="text-xs text-slate-500 italic pt-0.5">
					<Translate text={localizationConstants.machineWidgetOverviewNoteVal} />
				</p>

				<WidgetActions>
					<Link
						href="/module/production/machine/handling"
						className="cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-2xs inline-block"
					>
						<Translate text={localizationConstants.machineWidgetOverviewDetailsCta} />
					</Link>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	// 3. Machine Status (Maskinstatus) 🚦
	machineStatus: {
		title: localizationConstants.machineWidgetStatusTitle,
		icon: Radio,
		content: (
			<Content>
				<div className="flex items-center justify-between">
					<span className="text-slate-600 font-medium">
						<Translate text={localizationConstants.machineWidgetStatusRunning} />
					</span>
					<WidgetTag
						label={localizationConstants.machineWidgetStatusRunningBadge}
						color="bg-emerald-100 text-emerald-800"
					/>
				</div>
				<Row
					label={localizationConstants.machineWidgetStatusTelemetry}
					value={<Translate text={localizationConstants.machineWidgetStatusTelemetryVal} />}
				/>
				<Row
					label={localizationConstants.machineWidgetStatusRpmLoad}
					value={<Translate text={localizationConstants.machineWidgetStatusRpmLoadVal} />}
				/>

				<p className="text-xs text-slate-400 pt-1">
					<Translate text={localizationConstants.machineWidgetStatusAlertsLabel} />
				</p>
				<WidgetChips>
					<WidgetChip
						label={localizationConstants.machineWidgetStatusAlertFuel}
						active
					/>
					<WidgetChip
						label={localizationConstants.machineWidgetStatusAlertMaintenance}
					/>
				</WidgetChips>

				<WidgetActions>
					<Link
						href="/module/production/machine/handling"
						className="cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-2xs inline-block"
					>
						<Translate text={localizationConstants.machineWidgetOverviewDetailsCta} />
					</Link>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	// 4. Machine Fleet (Maskinpark) 💰
	machineFleet: {
		title: localizationConstants.machineWidgetFleetTitle,
		icon: Building2,
		content: (
			<Content>
				<Row
					label={localizationConstants.machineWidgetFleetTotal}
					value={`48 ${localizationConstants.machineWidgetFleetUnitPcs}`}
				/>
				<WidgetBarRow
					label={localizationConstants.machineWidgetFleetActive}
					percent={65}
					value={<Translate text={localizationConstants.machineWidgetFleetActiveVal} />}
					color="bg-emerald-500"
				/>
				<WidgetBarRow
					label={localizationConstants.machineWidgetFleetIdle}
					percent={25}
					value={<Translate text={localizationConstants.machineWidgetFleetIdleVal} />}
					color="bg-amber-500"
				/>
				<WidgetBarRow
					label={localizationConstants.machineWidgetFleetOffline}
					percent={10}
					value={<Translate text={localizationConstants.machineWidgetFleetOfflineVal} />}
					color="bg-rose-500"
				/>
				<Row
					label={localizationConstants.machineWidgetFleetDailyCost}
					value={<Translate text={localizationConstants.machineWidgetFleetCostVal} />}
				/>

				<p className="text-xs text-slate-400 pt-1">
					<Translate text={localizationConstants.machineWidgetFleetTitle} />:
				</p>
				<WidgetChips>
					<WidgetChip
						label={localizationConstants.machineWidgetFleetExcavatorsVal}
						active
					/>
					<WidgetChip
						label={localizationConstants.machineWidgetFleetLoadersVal}
					/>
					<WidgetChip
						label={localizationConstants.machineWidgetFleetTrucksVal}
					/>
				</WidgetChips>

				<MockTag />
			</Content>
		),
	},
});
