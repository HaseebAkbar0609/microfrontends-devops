import { format } from "date-fns";

/** Today in the user's time zone, as yyyy-MM-dd (the format the date fields store). */
export const todayIso = () => format(new Date(), "yyyy-MM-dd");

/** A timestamp's day in the user's time zone, as the Figma frames write dates: 2026-08-22. */
export const formatIsoDay = (timestamp: string) => format(new Date(timestamp), "yyyy-MM-dd");
