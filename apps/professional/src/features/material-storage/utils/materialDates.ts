import { format } from "date-fns";

/** Today in the user's time zone, as yyyy-MM-dd (the format the date fields store). */
export const todayIso = () => format(new Date(), "yyyy-MM-dd");
