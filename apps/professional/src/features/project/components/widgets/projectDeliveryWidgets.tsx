import {
	Award,
	CircleDollarSign,
	HardHat,
	Plus,
	ShieldCheck,
	Timer,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import {
	WidgetBarRow,
	WidgetContent as Content,
	WidgetListItem,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
} from "@/features/widgetdashboard/components/WidgetContent";
import {
	mockDate,
} from "@/features/project/constants/mockData";
import { Translate } from "@/utils/translation/translate";

export const PROJECT_DELIVERY_WIDGETS: Record<string, WidgetProps> = {
	projectResources: {
		title: localizationConstants.projWidgetResourcesTitle,
		icon: HardHat,
		content: (
			<Content>
				<Row
					label={localizationConstants.projWidgetResourcesTotal}
					value="24"
				/>
				<WidgetBarRow
					label={localizationConstants.projWidgetResourcesBooked}
					percent={75}
					value="18"
					color="bg-blue-600"
				/>
				<Row
					label={localizationConstants.projWidgetResourcesAvailable}
					value="4"
				/>
				<Row
					label={localizationConstants.projWidgetResourcesLeave}
					value="2"
				/>
				<Row
					label={localizationConstants.projWidgetResourcesTop}
					value="Storgatan 14 (95 %)"
				/>
				<MockTag />
			</Content>
		),
	},

	projectTimeReporting: {
		title: localizationConstants.projWidgetTimeTitle,
		icon: Timer,
		content: (
			<Content>
				<Row
					label={localizationConstants.projWidgetTimeTotal}
					value="342 h"
				/>
				<Row
					label={localizationConstants.projWidgetTimeReported}
					value="298 h"
				/>
				<Row
					label={localizationConstants.projWidgetTimeMissing}
					value="44 h"
				/>
				<Row
					label={localizationConstants.projWidgetTimeTop}
					value="Johan A. – 48 h"
				/>
				<Row
					label={localizationConstants.projWidgetTimePending}
					value="7"
				/>
				<MockTag />
			</Content>
		),
	},

	projectValue: {
		title: localizationConstants.projWidgetValueTitle,
		icon: CircleDollarSign,
		content: (
			<Content>
				<Row
					label={localizationConstants.projWidgetValueTotal}
					value="14 250 000 kr"
				/>
				<Row
					label={localizationConstants.projWidgetValueInvoiced}
					value="8 900 000 kr"
				/>
				<Row
					label={localizationConstants.projWidgetValueRemaining}
					value="5 350 000 kr"
				/>
				<Row
					label={localizationConstants.projWidgetValueMargin}
					value="18 %"
				/>
				<MockTag />
			</Content>
		),
	},

	projectAta: {
		title: localizationConstants.projWidgetAtaTitle,
		icon: Plus,
		content: (
			<Content>
				<Row
					label={localizationConstants.projWidgetAtaOpen}
					value="6"
				/>
				<Row
					label={localizationConstants.projWidgetAtaValue}
					value="320 000 kr"
				/>
				<Row
					label={localizationConstants.projWidgetAtaApproved}
					value="4 (240 000 kr)"
				/>
				<Row
					label={localizationConstants.projWidgetAtaPending}
					value="2 (80 000 kr)"
				/>
				<Row
					label={localizationConstants.projWidgetAtaLatest}
					value={
						<Translate
							text={
								localizationConstants.projWidgetAtaLatestValue
							}
						/>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	projectKma: {
		title: localizationConstants.projWidgetKmaTitle,
		icon: HardHat,
		content: (
			<Content>
				<Row
					label={localizationConstants.projWidgetKmaOpen}
					value="3"
				/>
				<Row
					label={localizationConstants.projWidgetKmaRisks}
					value="5"
				/>
				<Row
					label={localizationConstants.projWidgetKmaRounds}
					value="8/10"
				/>
				<Row
					label={localizationConstants.projWidgetKmaLast}
					value={mockDate(-6)}
				/>
				<MockTag />
			</Content>
		),
	},

	projectSecureCheck: {
		title: localizationConstants.projWidgetSecureTitle,
		icon: ShieldCheck,
		content: (
			<Content>
				<Row
					label={localizationConstants.projWidgetSecureCompleted}
					value="6/8"
				/>
				<Row
					label={localizationConstants.projWidgetSecurePending}
					value="4"
				/>
				<Row
					label={localizationConstants.projWidgetSecureOverdue}
					value={
						<Translate
							text={
								localizationConstants.projWidgetSecureOverdueValue
							}
						/>
					}
				/>
				<Row
					label={localizationConstants.projWidgetSecureNext}
					value={mockDate(6)}
				/>
				<MockTag />
			</Content>
		),
	},

	projectInspection: {
		title: localizationConstants.projWidgetInspectionTitle,
		icon: Award,
		content: (
			<Content>
				<Row
					label={localizationConstants.projWidgetInspectionUpcoming}
					value="2"
				/>
				<WidgetListItem
					title={localizationConstants.projWidgetInspection1}
					meta={mockDate(4)}
				/>
				<WidgetListItem
					title={localizationConstants.projWidgetInspection2}
					meta={mockDate(12)}
				/>
				<Row
					label={localizationConstants.projWidgetInspectionCompleted}
					value="3"
				/>
				<Row
					label={localizationConstants.projWidgetInspectionApproved}
					value="2"
				/>
				<Row
					label={localizationConstants.projWidgetInspectionRemarks}
					value="1"
				/>
				<MockTag />
			</Content>
		),
	},
};
