import {
	Folder,
	DollarSign,
	ShieldCheck,
	PanelsTopLeft,
	User,
	Image as ImageIcon,
	Newspaper,
	CircleDollarSign,
	Focus,
	ArrowRight,
	ClipboardList,
	Layers,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { PlacedWidgetEntry, WidgetProps } from "../types/dashboard";
import React from "react";
import { Translate } from "@/utils/translation/translate";

/**
 * Maps a sidebar item id → widget render props (used when it is dropped into
 * the grid). Dropped widgets always use col-span-4.
 */
export const SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },

	personnel: {
		title: localizationConstants.personnel,
		icon: User,
		content: (
			<div className="space-y-1 text-sm text-slate-500">
				<div>
					<Translate text={localizationConstants.activeLabel} /> : 10
				</div>
				<div>
					<Translate text={localizationConstants.availableLabel} /> :
					2
				</div>
			</div>
		),
	},
	image: { title: localizationConstants.imageLabel, icon: ImageIcon },
	newsLabel: { title: localizationConstants.newsLabel, icon: Newspaper },
	turnOver: {
		title: localizationConstants.turnover90DaysTitle,
		icon: DollarSign,
		content: <div className="text-sm text-slate-500"> 1, 536,000 SEK </div>,
	},
	orderLabel: {
		title: localizationConstants.ordersLabel,
		icon: ClipboardList,
	},
	projectLabel: {
		title: localizationConstants.projectsLabel,
		icon: PanelsTopLeft,
		subtitle: (
			<>
				<Translate text={localizationConstants.activeOrders} />: 35{" "}
				<Translate text={localizationConstants.itemsLabel} />
			</>
		),
	},
	kma: {
		title: localizationConstants.kma,
		icon: ShieldCheck,
		content: (
			<div className="space-y-1 text-sm text-slate-500">
				<div>
					<Translate text={localizationConstants.activeProjects} /> :
					5
				</div>
				<div>
					<Translate text={localizationConstants.activeOrders} /> : 15
				</div>
				<div>
					<Translate text={localizationConstants.completedChecks} /> :
					45
				</div>
			</div>
		),
	},
	offer: {
		title: localizationConstants.offer,
		icon: CircleDollarSign,
		content: (
			<div className="space-y-1 text-sm text-slate-500">
				<div>
					<Translate text={localizationConstants.numberOfBids} /> : 7
				</div>
				<div>
					<Translate text={localizationConstants.totalLabel} /> :
					15,800,000
				</div>
			</div>
		),
	},
	onGoingQuotes: {
		title: localizationConstants.ongoingQuotesLabel,
		icon: Focus,
		content: (
			<div className="text-sm text-slate-500">
				<Translate text={localizationConstants.numberLabel} /> : 20
			</div>
		),
	},
	availableLabel: {
		title: localizationConstants.availableLabel,
		icon: ArrowRight,
	},
};

/**
 * The 9 default widgets already shown in the UI on first load.
 */
export const INITIAL_WIDGETS: PlacedWidgetEntry[] = [
	{
		uid: "init-karles",
		sidebarId: "projectLabel",
		colSpanClass: "col-span-12 md:col-span-4",
		widgetProps: {
			title: "Karles Bygg AB",
			icon: Folder,
			subtitle: (
				<>
					<Translate text={localizationConstants.activeOrders} />: 35{" "}
					<Translate text={localizationConstants.itemsLabel} />
				</>
			),
		},
	},
	{
		uid: "init-bidders",
		sidebarId: "offer",
		colSpanClass: "col-span-12 md:col-span-8",
		widgetProps: {
			title: localizationConstants.biddersTitle,
			icon: CircleDollarSign,
			content: (
				<div className="space-y-1 text-sm text-slate-500">
					<div>
						<Translate text={localizationConstants.numberOfBids} />{" "}
						: 7
					</div>
					<div>
						<Translate text={localizationConstants.totalLabel} /> :
						15,800,000
					</div>
				</div>
			),
		},
	},
	{
		uid: "init-personnel-2",
		sidebarId: "personnel",
		colSpanClass: "col-span-12 md:col-span-4",
		widgetProps: {
			title: "PERSONNEL",
			icon: User,
			subtitle: "Renovation Demolition",
		},
	},

	{
		uid: "empty-4",
		sidebarId: "emptyPage",
		colSpanClass: "col-span-12 md:col-span-4",
		widgetProps: SIDEBAR_WIDGET_MAP.emptyPage,
	},
	{
		uid: "empty-5",
		sidebarId: "emptyPage",
		colSpanClass: "col-span-12 md:col-span-4",
		widgetProps: SIDEBAR_WIDGET_MAP.emptyPage,
	},
	{
		uid: "empty-6",
		sidebarId: "emptyPage",
		colSpanClass: "col-span-12 md:col-span-8",
		widgetProps: SIDEBAR_WIDGET_MAP.emptyPage,
	},
	{
		uid: "empty-7",
		sidebarId: "emptyPage",
		colSpanClass: "col-span-12 md:col-span-4",
		widgetProps: SIDEBAR_WIDGET_MAP.emptyPage,
	},
	{
		uid: "empty-8",
		sidebarId: "emptyPage",
		colSpanClass: "col-span-12 md:col-span-4",
		widgetProps: SIDEBAR_WIDGET_MAP.emptyPage,
	},
	{
		uid: "empty-9",
		sidebarId: "emptyPage",
		colSpanClass: "col-span-12 md:col-span-8",
		widgetProps: SIDEBAR_WIDGET_MAP.emptyPage,
	},
];
