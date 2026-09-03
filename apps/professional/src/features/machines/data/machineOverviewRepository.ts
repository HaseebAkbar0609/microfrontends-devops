import type { MachineRow } from "../types/machine.types";
import { MOCK_MACHINES } from "./machines.mock";

/**
 * In-memory repository for Machine Overview register (Standard #6 & #7)
 * Reactive subscriber pattern allowing newly created machines to show up in
 * the table immediately and persist across tabs within the browser session.
 */

type RepositoryListener = () => void;
const listeners = new Set<RepositoryListener>();

function notify() {
	listeners.forEach((l) => {
		try {
			l();
		} catch (e) {
			console.error("Machine overview repo notification error", e);
		}
	});
}

let inMemoryMachines: MachineRow[] = [...MOCK_MACHINES];

export const machineOverviewRepository = {
	subscribe(listener: RepositoryListener): () => void {
		listeners.add(listener);
		return () => listeners.delete(listener);
	},

	getAllMachines(): MachineRow[] {
		return [...inMemoryMachines];
	},

	getMachineById(id: string): MachineRow | undefined {
		return inMemoryMachines.find((m) => m.id === id);
	},

	addMachine(machine: MachineRow): void {
		inMemoryMachines = [machine, ...inMemoryMachines];
		notify();
	},

	deleteMachine(id: string): void {
		inMemoryMachines = inMemoryMachines.filter((m) => m.id !== id);
		notify();
	},

	archiveMachine(id: string): void {
		inMemoryMachines = inMemoryMachines.map((m) =>
			m.id === id ? { ...m, status: "ended" } : m
		);
		notify();
	},
};
