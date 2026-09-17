"use client";
import { MyPagesQueryState } from "../../shared/feedback";
import { useAbsences } from "../services/employmentService";
import ScheduleCard from "./ScheduleCard";
import SickInfoPanel from "./SickInfoPanel";
import SickRequestPanel from "./SickRequestPanel";
export default function SickReportTab() {
  const query = useAbsences();
  return <div className="grid grid-cols-12 items-start gap-6">
    <div className="col-span-12 xl:col-span-8"><MyPagesQueryState query={query} />
      <ScheduleCard events={(query.data ?? []).filter(entry => entry.type !== "leave")} />
    </div>
    <div className="col-span-12 flex flex-col gap-6 xl:col-span-4"><SickRequestPanel /><SickInfoPanel /></div>
  </div>;
}
