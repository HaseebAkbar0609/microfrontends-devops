"use client";

import { useMemo, useState } from "react";
import { ContactRound, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/lib/toast";
import { useTranslate, Translate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { bookableMachines, SUPPLIERS } from "../data/bookMachine.mock";
import type { ExternalBookingRow } from "../types/bookMachine.types";
import { ExternalBookedTable } from "./ExternalBookedTable";

type SortKey = keyof ExternalBookingRow;

/** Card header with the contact icon the design uses on both external cards. */
function SectionCard({
	titleKey,
	children,
}: {
	titleKey: TranslationKeys;
	children: React.ReactNode;
}) {
	return (
		<Card>
			<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
				<CardTitle className="flex items-center gap-2 text-base font-medium">
					<ContactRound className="h-5 w-5 text-slate-700" />
					<Translate text={titleKey} />
				</CardTitle>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}

function Field({
	labelKey,
	children,
}: {
	labelKey: TranslationKeys;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<Label className="text-sm font-medium text-slate-900">
				<Translate text={labelKey} />
			</Label>
			{children}
		</div>
	);
}

/**
 * The "Extern" branch of Boka maskin (TFS-809): pick a machine from the hire
 * catalogue, fill in the rental terms, and add it to the booked list. Nothing
 * is persisted until Spara — there is no bookings endpoint.
 */
export function ExternalBookingSection({
	rows,
	onRowsChange,
}: {
	rows: ExternalBookingRow[];
	onRowsChange: (update: (prev: ExternalBookingRow[]) => ExternalBookingRow[]) => void;
}) {
	const t = useTranslate();
	const catalogue = bookableMachines("external");

	const [catalogueMachineId, setCatalogueMachineId] = useState("");
	const [supplier, setSupplier] = useState("");
	const [machineName, setMachineName] = useState("");
	const [deliveryDate, setDeliveryDate] = useState("");
	const [returnDate, setReturnDate] = useState("");
	const [rate, setRate] = useState("");
	const [expanded, setExpanded] = useState(true);
	const [sortKey, setSortKey] = useState<SortKey | null>(null);
	const [sortAsc, setSortAsc] = useState(true);

	const sortedRows = useMemo(() => {
		if (!sortKey) return rows;
		return [...rows].sort((a, b) => {
			const compared = String(a[sortKey]).localeCompare(
				String(b[sortKey]),
				"sv"
			);
			return sortAsc ? compared : -compared;
		});
	}, [rows, sortKey, sortAsc]);

	const handleSort = (key: SortKey) => {
		if (key === sortKey) {
			setSortAsc((prev) => !prev);
			return;
		}
		setSortKey(key);
		setSortAsc(true);
	};

	/** The green action carries the picked machine down into the form below. */
	const handleBookAtSupplier = () => {
		const machine = catalogue.find((item) => item.id === catalogueMachineId);
		if (!machine) {
			showToast("error", t(localizationConstants.machineBookPickMachine));
			return;
		}
		setSupplier(machine.supplier ?? "");
		setMachineName(machine.name);
		setRate(machine.rate ?? "");
	};

	const handleAdd = () => {
		if (!supplier || !machineName.trim() || !deliveryDate) {
			showToast("error", t(localizationConstants.machineBookFieldsRequired));
			return;
		}
		// The ticket asks for this explicitly and the design cannot express it.
		if (returnDate && returnDate <= deliveryDate) {
			showToast("error", t(localizationConstants.machineBookDateOrder));
			return;
		}

		const picked = catalogue.find((item) => item.id === catalogueMachineId);

		onRowsChange((prev) => [
			...prev,
			{
				id: `ext-booking-${prev.length + 1}-${deliveryDate}-${machineName}`,
				machineNo: picked?.machineNo ?? "",
				name: machineName.trim(),
				supplier,
				rate: rate.trim(),
				deliveryDate,
				returnDate,
				status: "booked",
			},
		]);

		showToast("success", t(localizationConstants.machineBookAdded));
		setMachineName("");
		setDeliveryDate("");
		setReturnDate("");
		setRate("");
		setCatalogueMachineId("");
		setSupplier("");
	};

	return (
		<div className="flex flex-col gap-6">
			<SectionCard titleKey={localizationConstants.machineListSupplier}>
				<Field labelKey={localizationConstants.machine}>
					<Select
						value={catalogueMachineId}
						onValueChange={setCatalogueMachineId}
					>
						<SelectTrigger className="h-10 w-full cursor-pointer border-slate-200 bg-white text-sm text-slate-700">
							<SelectValue
								placeholder={t(localizationConstants.machineListSelect)}
							/>
						</SelectTrigger>
						<SelectContent className="bg-white">
							{catalogue.map((machine) => (
								<SelectItem key={machine.id} value={machine.id}>
									{machine.machineNo} — {machine.name} ({machine.supplier})
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>

				<div className="mt-4 flex justify-end">
					<Button
						type="button"
						onClick={handleBookAtSupplier}
						className="h-10 cursor-pointer bg-[#22C55E] px-5 text-sm font-semibold text-white hover:bg-[#16A34A]"
					>
						<Translate text={localizationConstants.machineBookAtSupplier} />
					</Button>
				</div>
			</SectionCard>

			<SectionCard titleKey={localizationConstants.machineListBookMachine}>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<Field labelKey={localizationConstants.machineListSupplier}>
						<Select value={supplier} onValueChange={setSupplier}>
							<SelectTrigger className="h-10 w-full cursor-pointer border-slate-200 bg-white text-sm text-slate-700">
								<SelectValue
									placeholder={t(localizationConstants.machineListSelect)}
								/>
							</SelectTrigger>
							<SelectContent className="bg-white">
								{SUPPLIERS.map((name) => (
									<SelectItem key={name} value={name}>
										{name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>

					<Field labelKey={localizationConstants.machine}>
						<Input
							value={machineName}
							onChange={(event) => setMachineName(event.target.value)}
							placeholder={t(localizationConstants.machine)}
							className="h-10 border-slate-200 text-sm"
						/>
					</Field>

					<Field labelKey={localizationConstants.machineListDeliveryDate}>
						<Input
							type="date"
							value={deliveryDate}
							onChange={(event) => setDeliveryDate(event.target.value)}
							className="h-10 border-slate-200 text-sm"
						/>
					</Field>

					<Field labelKey={localizationConstants.machineListReturnDate}>
						<Input
							type="date"
							value={returnDate}
							onChange={(event) => setReturnDate(event.target.value)}
							className="h-10 border-slate-200 text-sm"
						/>
					</Field>

					<Field labelKey={localizationConstants.machineBookRentCost}>
						<Input
							value={rate}
							onChange={(event) => setRate(event.target.value)}
							placeholder={t(localizationConstants.machineBookRentCostHint)}
							className="h-10 border-slate-200 text-sm"
						/>
					</Field>
				</div>

				<div className="mt-4 flex justify-end">
					<Button
						type="button"
						onClick={handleAdd}
						className="h-10 cursor-pointer gap-2 bg-[#111721] px-6 text-sm font-medium text-white hover:bg-slate-800"
					>
						<Translate text={localizationConstants.machineBookAdd} />
						<Save className="h-4 w-4" />
					</Button>
				</div>
			</SectionCard>

			<ExternalBookedTable
				rows={sortedRows}
				expanded={expanded}
				onToggle={() => setExpanded((prev) => !prev)}
				sortKey={sortKey}
				sortAsc={sortAsc}
				onSort={handleSort}
				onRemove={(id) =>
					onRowsChange((prev) => prev.filter((row) => row.id !== id))
				}
			/>
		</div>
	);
}
