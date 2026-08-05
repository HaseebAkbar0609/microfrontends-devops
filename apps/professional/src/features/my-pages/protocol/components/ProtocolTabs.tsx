"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParams } from "@/hooks/useQueryParams";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import MeetingProtocolsTab from "./MeetingProtocolsTab";
import NotesTab from "./NotesTab";

const PROTOCOL_TAB_IDS = ["meetings", "notes"] as const;

export type ProtocolTabId = (typeof PROTOCOL_TAB_IDS)[number];

const PROTOCOL_TABS: { id: ProtocolTabId; label: string }[] = [
	{ id: "meetings", label: localizationConstants.protocolTabMeetings },
	{ id: "notes", label: localizationConstants.protocolTabNotes },
];

const isProtocolTabId = (value: string | null): value is ProtocolTabId =>
	PROTOCOL_TAB_IDS.includes(value as ProtocolTabId);

export default function ProtocolTabs() {
	const { query, changeQueries } = useQueryParams();
	const tabParam = query.get("tab");
	const activeTab: ProtocolTabId = isProtocolTabId(tabParam)
		? tabParam
		: "meetings";
	const setActiveTab = (value: string) =>
		changeQueries({ tab: value === "meetings" ? null : value });

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
			<div className="border-b border-slate-200 mb-6">
				<TabsList
					variant="line"
					className="h-auto gap-6 rounded-none px-0 p-0 -mb-px"
				>
					{PROTOCOL_TABS.map((tab) => (
						<TabsTrigger
							key={tab.id}
							value={tab.id}
							className="px-0 text-slate-600 data-[state=active]:px-3 data-[state=active]:text-slate-900"
						>
							<Translate text={tab.label} />
						</TabsTrigger>
					))}
				</TabsList>
			</div>
			<TabsContent value="meetings">
				<MeetingProtocolsTab />
			</TabsContent>
			<TabsContent value="notes">
				<NotesTab />
			</TabsContent>
		</Tabs>
	);
}
