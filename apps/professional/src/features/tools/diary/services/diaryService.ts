import { listRecords } from "@/features/my-pages/shared/api";
import { DiaryEntry } from "../constants/data";
export const listDiaryEntries = () => listRecords<DiaryEntry>("diary");
