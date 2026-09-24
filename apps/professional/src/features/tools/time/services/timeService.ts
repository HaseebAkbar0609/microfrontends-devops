import { getRecord, listRecords, readMyPages, useMyPagesQuery } from "@/features/my-pages/shared/api";
import { WorkDay } from "../constants/data";
export const listWorkDays = () => listRecords<WorkDay>("time");
export const getWorkDay = (id: string) => getRecord<WorkDay>(id);
export type TimeReference = { id: string; code: string; name: string; order: string; ata: string[] };
export const useTimeReferences = () => useMyPagesQuery(["time-references"], () => readMyPages<TimeReference[]>("time/references"));
