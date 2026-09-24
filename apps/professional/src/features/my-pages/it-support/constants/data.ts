import type { RecordMeta } from "../../shared/api";
import localizationConstants from "@/utils/translation/constants";
export type ItTicketStatus = "notSent" | "done" | "ongoing";
export interface ItTicket extends RecordMeta {
  date: string; name: string; status: ItTicketStatus; description: string; files: string[];
}
export const IT_TICKET_STATUS_KEY: Record<ItTicketStatus, string> = {
  notSent: localizationConstants.itSupportStatusNotSent,
  done: localizationConstants.itSupportStatusDone,
  ongoing: localizationConstants.itSupportStatusOngoing,
};
