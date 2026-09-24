import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

const required = z.string().trim().min(1, localizationConstants.protocolValRequired).max(500);
const text = z.string().max(500);
const body = z.string().max(20000);
const dates = { startDate: z.string(), startTime: z.string(), endDate: z.string(), endTime: z.string() };
type Dates = { startDate: string; startTime: string; endDate: string; endTime: string };
function validDates(value: Dates) {
  const { startDate, endDate, startTime, endTime } = value;
  return z.string().date().safeParse(startDate).success && z.string().date().safeParse(endDate).success &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(startTime) && /^([01]\d|2[0-3]):[0-5]\d$/.test(endTime) &&
    endDate + endTime > startDate + startTime;
}
const meetingBase = z.object({
  responsible: text, title: text, category: text, address: text, postalCode: text, city: text,
  participantIds: z.array(z.string().uuid()).max(100), location: text, ...dates, information: body,
});
export const meetingSchema = meetingBase.extend({ responsible: required, title: required, category: required })
  .refine(validDates, { message: localizationConstants.myPagesInvalid, path: ["endDate"] });
export type MeetingValues = z.infer<typeof meetingSchema>;
export const pointSchema = z.object({ nr: required, responsible: required, title: required, description: body, decision: body });
export type PointValues = z.infer<typeof pointSchema>;
export const noteSchema = z.object({ description: z.string().trim().min(1, localizationConstants.protocolValRequired).max(20000) });
export type NoteValues = z.infer<typeof noteSchema>;
const nextMeeting = meetingBase.refine(
  value => Object.values(value).every(item => Array.isArray(item) ? !item.length : !item) || (!!value.responsible.trim() && !!value.title.trim() && validDates(value)),
  { message: localizationConstants.myPagesInvalid, path: ["endDate"] },
);
export const editProtocolSchema = z.object({
  ...dates, host: required, participantIds: z.array(z.string().uuid()).max(100),
  protocolNumber: text, subject: text, title: required, category: required, location: text, address: text,
  postalCode: text, city: text, information: body, comment: body, next: nextMeeting,
}).refine(validDates, { message: localizationConstants.myPagesInvalid, path: ["endDate"] });
export type EditProtocolValues = z.infer<typeof editProtocolSchema>;
