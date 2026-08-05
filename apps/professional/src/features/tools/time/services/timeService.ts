import { WORK_DAYS, WorkDay } from "../constants/mockData";

let workDays: WorkDay[] = WORK_DAYS.map((day) => ({
	...day,
	rows: day.rows.map((row) => ({ ...row })),
}));

export function listWorkDays(): WorkDay[] {
	return [...workDays];
}

export function getWorkDay(id: string): WorkDay | undefined {
	return workDays.find((day) => day.id === id);
}

export function createWorkDay(day: WorkDay): WorkDay[] {
	workDays = [day, ...workDays];
	return [...workDays];
}

export function updateWorkDay(
	id: string,
	changes: Partial<WorkDay>,
): WorkDay[] {
	workDays = workDays.map((day) =>
		day.id === id ? { ...day, ...changes } : day,
	);
	return [...workDays];
}

export function removeWorkDay(id: string): WorkDay[] {
	workDays = workDays.filter((day) => day.id !== id);
	return [...workDays];
}
