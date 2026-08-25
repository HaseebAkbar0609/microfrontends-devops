import { CalendarDays, Image as ImageIcon, Truck } from "lucide-react";

import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import {
	WidgetAction,
	WidgetActions,
	WidgetCalendarPreview,
	WidgetChip,
	WidgetChips,
	WidgetContent as Content,
	WidgetImagePlaceholder,
	WidgetListItem,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
	WidgetTag,
	type WidgetCalendarDay,
	type WidgetCalendarWeekDay,
} from "@/features/widgetdashboard/components/WidgetContent";
import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

const CALENDAR_WEEK_DAYS: WidgetCalendarWeekDay[] = [
	{ id: "mon", label: "M" },
	{ id: "tue", label: "T" },
	{ id: "wed", label: "W" },
	{ id: "thu", label: "T" },
	{ id: "fri", label: "F" },
	{ id: "sat", label: "S" },
	{ id: "sun", label: "S" },
];

/** July 2026 starts on a Wednesday, so the grid opens with two blank cells. */
const JULY_2026: WidgetCalendarDay[] = [
	null,
	null,
	...Array.from({ length: 31 }, (_, index) => index + 1),
	null,
	null,
];

/** Jul 28 delivery, Jul 30 order deadline. */
const JULY_2026_HIGHLIGHTS: Record<number, string> = {
	28: "bg-blue-600",
	30: "bg-amber-500",
};

/** Deliveries, purchasing calendar and the image placeholder. */
export const PURCHASE_LOGISTICS_WIDGETS: Record<string, WidgetProps> = {
	purchaseDeliveries: {
		title: localizationConstants.purchaseWidgetDeliveriesTitle,
		icon: Truck,
		content: (
			<Content>
				<Row
					label={
						localizationConstants.purchaseWidgetDeliveriesUpcoming
					}
					value="6"
				/>
				<Row
					label={
						localizationConstants.purchaseWidgetDeliveriesOverdue
					}
					value="2"
				/>
				<Row
					label={
						localizationConstants.purchaseWidgetDeliveriesThisWeek
					}
					value="9"
				/>
				<WidgetListItem
					title="AB Stålpartner"
					meta={
						<span className="flex flex-wrap items-center gap-1.5">
							<Translate
								text={
									localizationConstants.purchaseWidgetDeliveriesExpected
								}
							/>
							{` ${mockDate(9)} - 1 200 kg`}
							<WidgetTag
								label={
									localizationConstants.purchaseWidgetDeliveriesStatusOnTime
								}
								color="bg-green-100 text-green-700"
							/>
						</span>
					}
				/>
				<WidgetListItem
					title="Byggmaterial AB"
					meta={
						<span className="flex flex-wrap items-center gap-1.5">
							<Translate
								text={
									localizationConstants.purchaseWidgetDeliveriesExpected
								}
							/>
							{` ${mockDate(1)} - 500 st`}
							<WidgetTag
								label={
									localizationConstants.purchaseWidgetDeliveriesStatusDelayed
								}
								color="bg-red-100 text-red-700"
							/>
						</span>
					}
				/>
				<WidgetActions>
					<WidgetAction
						label={localizationConstants.purchaseCtaViewDeliveries}
					/>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	purchaseCalendar: {
		title: localizationConstants.purchaseWidgetCalendarTitle,
		icon: CalendarDays,
		content: (
			<Content>
				<WidgetCalendarPreview
					title={localizationConstants.purchaseWidgetCalendarMonth}
					weekDays={CALENDAR_WEEK_DAYS}
					days={JULY_2026}
					highlights={JULY_2026_HIGHLIGHTS}
				/>
				<Row
					label={
						localizationConstants.purchaseWidgetCalendarUpcoming
					}
					value="3"
				/>
				<WidgetChips>
					<WidgetChip
						label={
							localizationConstants.purchaseWidgetCalendarFilterDeliveries
						}
						active
					/>
					<WidgetChip
						label={
							localizationConstants.purchaseWidgetCalendarFilterDeadlines
						}
					/>
					<WidgetChip
						label={
							localizationConstants.purchaseWidgetCalendarFilterMeetings
						}
					/>
				</WidgetChips>
				<WidgetActions>
					<WidgetAction
						label={localizationConstants.purchaseCtaViewCalendar}
					/>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	purchaseImage: {
		title: localizationConstants.purchaseWidgetImageTitle,
		icon: ImageIcon,
		content: (
			<Content>
				<WidgetImagePlaceholder
					description={
						localizationConstants.purchaseWidgetImageDescription
					}
				/>
				<p className="text-xs text-slate-400">
					<Translate
						text={
							localizationConstants.purchaseWidgetImageFormats
						}
					/>
				</p>
				<MockTag />
			</Content>
		),
	},
};
