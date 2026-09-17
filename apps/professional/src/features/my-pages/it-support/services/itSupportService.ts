import { listRecords } from "../../shared/api";
import { ItTicket } from "../constants/data";

export const listItTickets = () => listRecords<ItTicket>("ticket");
