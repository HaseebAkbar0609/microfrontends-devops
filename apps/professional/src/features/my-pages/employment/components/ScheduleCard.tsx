"use client";
import { useState } from "react";
import { eachDayOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, parseISO, isValid, format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { today } from "../../shared/api";
import { ABSENCE_TYPE_KEY, LEAVE_STATUS_KEY, Absence } from "../constants/data";

const RANGE_LABEL = {
  today: localizationConstants.myPagesEmpToday, week: localizationConstants.myPagesEmpWeek,
  month: localizationConstants.myPagesEmpMonth, year: localizationConstants.myPagesEmpYear,
};
const EVENT_CLASS = { sick: "bg-orange-50 text-orange-900", vab: "bg-green-50 text-green-900", leave: "bg-slate-100 text-slate-800" };
type Range = keyof typeof RANGE_LABEL;
export default function ScheduleCard({ events }: { events: Absence[] }) {
  const t = useTranslate();
  const [date, setDate] = useState(today);
  const [range, setRange] = useState<Range>("week");
  const [view, setView] = useState("calendar");
  const parsed = parseISO(date);
  const selected = isValid(parsed) ? parsed : parseISO(today());
  const start = range === "week" ? startOfWeek(selected, { weekStartsOn: 1 }) : range === "month" ? startOfMonth(selected) : range === "year" ? startOfYear(selected) : selected;
  const end = range === "week" ? endOfWeek(selected, { weekStartsOn: 1 }) : range === "month" ? endOfMonth(selected) : range === "year" ? endOfYear(selected) : selected;
  const days = eachDayOfInterval({ start, end });
  const active = events.filter(entry => entry.status !== "rejected");
  const matching = (day: string) => active.filter(entry => entry.startDate <= day && (!entry.endDate || entry.endDate >= day));
  return <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-200/60 px-5 py-3">
      <h2 className="text-base font-semibold"><Translate text={localizationConstants.myPagesAbsenceTitle} /></h2>
      <Select value={view} onValueChange={setView}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent>
        <SelectItem value="calendar"><Translate text={localizationConstants.myPagesEmpCalendarView} /></SelectItem>
        <SelectItem value="list"><Translate text={localizationConstants.myPagesEmpListView} /></SelectItem>
      </SelectContent></Select>
    </div>
    <div className="flex flex-wrap gap-3 border-b p-4">
      <Input type="date" value={date} aria-label={t(localizationConstants.myPagesEmpSickDate)} onChange={event => setDate(event.target.value)} className="w-44" />
      <div className="flex flex-wrap gap-1 rounded-md bg-slate-100 p-1">{(Object.keys(RANGE_LABEL) as Range[]).map(id =>
        <button type="button" key={id} aria-pressed={range === id} onClick={() => setRange(id)} className={`rounded px-3 py-1 text-sm ${range === id ? "bg-white shadow-sm" : ""}`}><Translate text={RANGE_LABEL[id]} /></button>)}</div>
    </div>
    <div className="overflow-x-auto">
      <div className={view === "calendar" ? "grid min-w-[40rem] grid-cols-7" : "divide-y"}>
        {days.map(day => { const key = format(day, "yyyy-MM-dd"); const entries = matching(key);
          return <div key={key} className={view === "calendar" ? "min-h-28 border-b border-r p-2" : "flex gap-4 p-3"}>
            <time dateTime={key} className="text-xs font-medium">{key}</time>
            <div className="mt-1 space-y-1">{entries.map(entry => <div key={entry.id} className={`rounded p-2 text-xs ${EVENT_CLASS[entry.type]}`}>
              <Translate text={ABSENCE_TYPE_KEY[entry.type]} /><span className="block"><Translate text={LEAVE_STATUS_KEY[entry.status]} /></span>
              <span className="block"><Translate text={localizationConstants.myPagesAllDay} /></span>
            </div>)}</div>
          </div>;
        })}
      </div>
    </div>
  </div>;
}
