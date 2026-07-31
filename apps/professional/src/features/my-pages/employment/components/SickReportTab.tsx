"use client";

import { SICK_SCHEDULE_EVENTS } from "../constants/mockData";
import ScheduleCard from "./ScheduleCard";
import SickInfoPanel from "./SickInfoPanel";
import SickRequestPanel from "./SickRequestPanel";

const SickReportTab = () => (
	<div className="grid grid-cols-12 items-start gap-6">
		<div className="col-span-12 xl:col-span-8">
			<ScheduleCard events={SICK_SCHEDULE_EVENTS} />
		</div>
		<div className="col-span-12 flex flex-col gap-6 xl:col-span-4">
			<SickRequestPanel />
			<SickInfoPanel />
		</div>
	</div>
);

export default SickReportTab;
