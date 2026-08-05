import { DIARY_ENTRIES, DiaryEntry } from "../constants/mockData";

let entries: DiaryEntry[] = DIARY_ENTRIES.map((entry) => ({ ...entry }));

export function listDiaryEntries(): DiaryEntry[] {
	return [...entries];
}

export function createDiaryEntry(entry: DiaryEntry): DiaryEntry[] {
	entries = [entry, ...entries];
	return [...entries];
}

export function updateDiaryEntry(
	id: string,
	changes: Partial<DiaryEntry>,
): DiaryEntry[] {
	entries = entries.map((entry) =>
		entry.id === id ? { ...entry, ...changes } : entry,
	);
	return [...entries];
}

export function markDiaryEntryRead(id: string): DiaryEntry[] {
	return updateDiaryEntry(id, { read: true });
}

export function removeDiaryEntry(id: string): DiaryEntry[] {
	entries = entries.filter((entry) => entry.id !== id);
	return [...entries];
}
