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
import { BookingKindRadio } from "./components/BookingKindRadio";
import { MachinePickerPane } from "./components/MachinePickerPane";
import {
	bookableMachines,
	INITIALLY_BOOKED_IDS,
} from "./data/bookMachine.mock";
import type { BookingKind } from "./types/bookMachine.types";

const TOTAL_STEPS = 2;

/** Case-insensitive match on machine number or name. */
function matches(term: string, machineNo: string, name: string) {
	const needle = term.trim().toLowerCase();
	if (!needle) return true;
	return (
		machineNo.toLowerCase().includes(needle) ||
		name.toLowerCase().includes(needle)
	);
}

/**
 * "Boka maskin" (TFS-808) — reserves machines against one machine list. The
 * available and booked panes are two views of the same catalogue: ticking a row
 * moves it from one side to the other. Nothing is persisted until Spara,
 * because there is no bookings endpoint yet.
 */
export function BookMachinePage({ listId }: { listId?: string }) {
	const t = useTranslate();
	const router = useRouter();

	const detail = getMachineListDetail(listId);
	const detailUrl = `${MACHINE_HANDLING_BASE_URL}/${detail.id}`;

	const [kind, setKind] = useState<BookingKind>("internal");
	// Booked ids are kept per kind so switching Intern/Extern does not lose a
	// selection made under the other one.
	const [bookedIds, setBookedIds] =
		useState<Record<BookingKind, string[]>>(INITIALLY_BOOKED_IDS);
	const [availableSearch, setAvailableSearch] = useState("");
	const [bookedSearch, setBookedSearch] = useState("");
	const [availableOpen, setAvailableOpen] = useState(true);
	const [bookedOpen, setBookedOpen] = useState(true);

	const currentStep = 1;
	const progress = (currentStep / TOTAL_STEPS) * 100;

	const catalogue = bookableMachines(kind);
	const bookedForKind = bookedIds[kind];

	const available = useMemo(
		() =>
			catalogue.filter(
				(machine) =>
					!bookedForKind.includes(machine.id) &&
					matches(availableSearch, machine.machineNo, machine.name)
			),
		[catalogue, bookedForKind, availableSearch]
	);

	const booked = useMemo(
		() =>
			catalogue
				.filter((machine) => bookedForKind.includes(machine.id))
				.filter((machine) =>
					matches(bookedSearch, machine.machineNo, machine.name)
				)
				// The booking runs to the end of the machine list it belongs to.
				.map((machine) => ({ ...machine, bookedUntil: detail.endDate })),
		[catalogue, bookedForKind, bookedSearch, detail.endDate]
	);

	/** Unfiltered count, so searching does not change the badge. */
	const availableCount = catalogue.length - bookedForKind.length;

	const book = (machineId: string) =>
		setBookedIds((prev) => ({ ...prev, [kind]: [...prev[kind], machineId] }));

	const unbook = (machineId: string) =>
		setBookedIds((prev) => ({
			...prev,
			[kind]: prev[kind].filter((id) => id !== machineId),
		}));

	const handleSave = () => {
		const total =
			bookedIds.internal.length + bookedIds.external.length;
		if (total === 0) {
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
						<BookingKindRadio kind={kind} onChange={setKind} />

						<div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
							<MachinePickerPane
								titleKey={localizationConstants.machineBookAvailable}
								count={availableCount}
								machines={available}
								checked={false}
								onToggle={book}
								emptyKey={localizationConstants.machineBookNoAvailable}
								search={availableSearch}
								onSearchChange={setAvailableSearch}
								expanded={availableOpen}
								onToggleExpanded={() => setAvailableOpen((prev) => !prev)}
							/>

							<MachinePickerPane
								titleKey={localizationConstants.machineBookMine}
								machines={booked}
								checked
								onToggle={unbook}
								emptyKey={localizationConstants.machineBookNoMachines}
								search={bookedSearch}
								onSearchChange={setBookedSearch}
								expanded={bookedOpen}
								onToggleExpanded={() => setBookedOpen((prev) => !prev)}
							/>
						</div>
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
