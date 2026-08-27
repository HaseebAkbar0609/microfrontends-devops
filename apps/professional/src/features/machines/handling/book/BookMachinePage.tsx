"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { useTranslate, Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MACHINE_HANDLING_BASE_URL } from "../data/handlingNav.config";
import { getMachineListDetail } from "../data/machineHandling.mock";
import { BookMachineSelectStep } from "./components/BookMachineSelectStep";
import { BookedMachinesTable } from "./components/BookedMachinesTable";
import {
	bookableMachines,
	INITIAL_BOOKED_MACHINES,
} from "./data/bookMachine.mock";
import type {
	BookedMachineRow,
	BookedMachineSortKey,
	BookingKind,
} from "./types/bookMachine.types";

const TOTAL_STEPS = 2;

/**
 * "Boka maskin" (TFS-808) — reserves machines against one machine list. Step 1
 * picks the machines; nothing is persisted until Spara, because there is no
 * bookings endpoint yet.
 */
export function BookMachinePage({ listId }: { listId?: string }) {
	const t = useTranslate();
	const router = useRouter();

	const detail = getMachineListDetail(listId);
	const detailUrl = `${MACHINE_HANDLING_BASE_URL}/${detail.id}`;

	const [kind, setKind] = useState<BookingKind>("internal");
	const [selectedMachineId, setSelectedMachineId] = useState("");
	const [rows, setRows] = useState<BookedMachineRow[]>(INITIAL_BOOKED_MACHINES);
	const [expanded, setExpanded] = useState(true);
	const [sortKey, setSortKey] = useState<BookedMachineSortKey>(null);
	const [sortAsc, setSortAsc] = useState(true);

	const currentStep = 1;
	const progress = (currentStep / TOTAL_STEPS) * 100;

	const sortedRows = useMemo(() => {
		if (!sortKey) return rows;
		return [...rows].sort((a, b) => {
			const compared = a[sortKey].localeCompare(b[sortKey], "sv");
			return sortAsc ? compared : -compared;
		});
	}, [rows, sortKey, sortAsc]);

	const handleSort = (key: NonNullable<BookedMachineSortKey>) => {
		if (key === sortKey) {
			setSortAsc((prev) => !prev);
			return;
		}
		setSortKey(key);
		setSortAsc(true);
	};

	/** Picking a machine books it straight onto the list below. */
	const handleSelectMachine = (machineId: string) => {
		const machine = bookableMachines(kind).find((m) => m.id === machineId);
		if (!machine) return;

		if (rows.some((row) => row.machineNo === machine.machineNo)) {
			showToast("error", t(localizationConstants.machineBookAlreadyBooked));
			return;
		}

		setRows((prev) => [
			...prev,
			{
				id: `booked-${machine.id}`,
				machineNo: machine.machineNo,
				name: machine.name,
				// The list's start date is the earliest the machine can be needed.
				deliveryDate: detail.startDate,
				status: "booked",
			},
		]);
		// Reset so the same machine can be re-picked after it is removed again.
		setSelectedMachineId("");
	};

	const handleRemove = (id: string) => {
		setRows((prev) => prev.filter((row) => row.id !== id));
	};

	const handleSave = () => {
		if (rows.length === 0) {
			showToast("error", t(localizationConstants.machineBookNoneSelected));
			return;
		}
		// No bookings endpoint yet; confirm and return to the machine list.
		showToast("success", t(localizationConstants.machineBookSaved));
		router.push(detailUrl);
	};

	return (
		<div className="flex h-full flex-col overflow-hidden bg-slate-50">
			<div className="flex-1 overflow-y-auto px-4 py-4">
				<div className="mb-4 flex items-center gap-2">
					<button
						type="button"
						aria-label={t(localizationConstants.backButton)}
						onClick={() => router.push(detailUrl)}
						className="cursor-pointer rounded-md p-1.5 text-slate-700 hover:bg-slate-100"
					>
						<ArrowLeft className="h-5 w-5" />
					</button>
					<h1 className="text-lg font-semibold text-slate-900 sm:text-2xl">
						<Translate text={localizationConstants.machineListBookMachine} />
					</h1>
				</div>

				<div className="ml-9 flex flex-col items-start gap-6 xl:flex-row">
					<div className="flex w-full flex-1 flex-col gap-6 overflow-hidden">
						<BookMachineSelectStep
							kind={kind}
							onKindChange={setKind}
							selectedMachineId={selectedMachineId}
							onSelectMachine={handleSelectMachine}
						/>

						<BookedMachinesTable
							rows={sortedRows}
							expanded={expanded}
							onToggle={() => setExpanded((prev) => !prev)}
							sortKey={sortKey}
							sortAsc={sortAsc}
							onSort={handleSort}
							onRemove={handleRemove}
						/>
					</div>

					<div className="w-full shrink-0 xl:w-72">
						<div className="sticky top-6 rounded-lg border border-slate-200 bg-white p-4">
							<p className="mb-2 text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.stepLabel} />{" "}
								{currentStep}/{TOTAL_STEPS}
							</p>
							<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
								<div
									className="h-full bg-[#111721] transition-all duration-300"
									style={{ width: `${progress}%` }}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="sticky bottom-0 border-t border-slate-200 bg-white pt-4">
				<div className="flex flex-wrap items-center justify-end gap-3 px-4 pb-4">
					<Button
						type="button"
						variant="ghost"
						onClick={() => router.push(detailUrl)}
						className="h-9 min-w-25 cursor-pointer border border-slate-300 bg-transparent px-5 text-sm text-slate-700 shadow-none hover:bg-slate-100 hover:text-slate-900"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>

					<Button
						type="button"
						onClick={handleSave}
						className="h-9 min-w-25 cursor-pointer gap-2 bg-[#111721] text-sm text-white hover:bg-slate-800"
					>
						<Translate text={localizationConstants.saveButton} />
						<Save className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}

export default BookMachinePage;
