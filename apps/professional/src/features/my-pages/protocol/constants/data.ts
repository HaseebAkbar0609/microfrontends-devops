import type { RecordMeta } from "../../shared/api";
export type { Participant } from "../../shared/api";
export type ProtocolType = "standard" | "action";
export type ProtocolStatus = "notSent" | "sent" | "received";
export type PointStatus = "done" | "ongoing" | "notDone";
export interface MeetingPoint {
  id: string; nr: string; subject: string; description: string; decision: string;
  responsible: string; status: PointStatus;
}
export interface MeetingDetails {
  host: string; startDate: string; startTime: string; endDate: string; endTime: string;
  subject: string; protocolNumber: string; participantIds: string[]; title: string; category: string;
  location: string; address: string; postalCode: string; city: string; information: string; comment: string;
}
export interface Protocol extends RecordMeta {
  archived: boolean;
  date: string; title: string; status: ProtocolStatus; department: string; type: ProtocolType;
  meeting: MeetingDetails; nextMeeting: MeetingDetails; points: MeetingPoint[];
}
export interface ProtocolNote extends RecordMeta { date: string; name: string; description: string }
export const EMPTY_MEETING: MeetingDetails = {
  host: "", startDate: "", startTime: "", endDate: "", endTime: "", subject: "", protocolNumber: "",
  participantIds: [], title: "", category: "", location: "", address: "", postalCode: "", city: "",
  information: "", comment: "",
};
