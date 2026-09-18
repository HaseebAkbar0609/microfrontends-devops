"use client";

import { useState } from "react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useMeetingBooker } from "../../hooks/useMeetingBooker";
import { AddCompanyForm } from "./AddCompanyForm";
import { BookedMeetingsPanel } from "./BookedMeetingsPanel";
import { BookingStatisticsPanel } from "./BookingStatisticsPanel";
import { CustomerCardPanel } from "./CustomerCardPanel";
import { MeetingBookerActions } from "./MeetingBookerActions";
import { MeetingBookerFilters } from "./MeetingBookerFilters";
import { MeetingBookerKpis } from "./MeetingBookerKpis";
import { PhoneListTable } from "./PhoneListTable";
import { RemindersPanel } from "./RemindersPanel";

/** Call lists, customer cards and bookings for the meeting bookers. */
export default function MeetingBookerPage() {
	const booker = useMeetingBooker();
	const [isAddOpen, setIsAddOpen] = useState(false);

	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-slate-50">
			<header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
				<div>
					<h1 className="text-2xl font-semibold text-slate-900">
						<Translate text={localizationConstants.salesNavMeetingBooker} />
					</h1>
					<p className="text-sm text-slate-500">
						<Translate text={localizationConstants.salesBookerSubtitle} />
					</p>
				</div>
				<MeetingBookerActions onAddCompany={() => setIsAddOpen(true)} />
			</header>

			<div className="flex flex-col gap-5 p-6">
				<MeetingBookerKpis
					stats={booker.stats}
					callListCount={booker.callList.length}
				/>

				{isAddOpen && <AddCompanyForm onClose={() => setIsAddOpen(false)} />}

				<MeetingBookerFilters
					booker={booker.booker}
					onBookerChange={booker.setBooker}
					category={booker.category}
					onCategoryChange={booker.setCategory}
					region={booker.region}
					onRegionChange={booker.setRegion}
				/>

				<RemindersPanel
					reminders={booker.stats.reminders}
					todayKey={booker.todayKey}
					onComplete={booker.completeReminder}
				/>

				<div className="grid grid-cols-1 gap-5 @5xl:grid-cols-[3fr_2fr]">
					<PhoneListTable
						companies={booker.callList}
						selectedCompanyId={booker.selectedCompany?.id ?? null}
						onSelect={booker.selectCompany}
					/>
					<CustomerCardPanel
						company={booker.selectedCompany}
						onLogCall={booker.logCall}
						onBookMeeting={booker.bookMeeting}
						onSaveReminder={booker.saveReminder}
					/>
				</div>

				<div className="grid grid-cols-1 gap-5 @5xl:grid-cols-2">
					<BookedMeetingsPanel meetings={booker.stats.bookedMeetings} />
					<BookingStatisticsPanel stats={booker.stats} />
				</div>
			</div>
		</div>
	);
}
