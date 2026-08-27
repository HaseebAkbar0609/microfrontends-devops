"use client";

import { CircleUserRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTranslate, Translate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { bookableMachines } from "../data/bookMachine.mock";
import type { BookingKind } from "../types/bookMachine.types";

interface BookMachineSelectStepProps {
	kind: BookingKind;
	onKindChange: (kind: BookingKind) => void;
	selectedMachineId: string;
	onSelectMachine: (id: string) => void;
}

const BOOKING_KINDS: { value: BookingKind; labelKey: TranslationKeys }[] = [
	{ value: "internal", labelKey: localizationConstants.machineBookInternal },
	{ value: "external", labelKey: localizationConstants.machineBookExternal },
];

/**
 * Step 1: choose whether the machine is taken from the own fleet or hired in,
 * then pick it from the register. Picking a machine books it straight onto the
 * list below — the design has no separate "add" action.
 */
export function BookMachineSelectStep({
	kind,
	onKindChange,
	selectedMachineId,
	onSelectMachine,
}: BookMachineSelectStepProps) {
	const t = useTranslate();
	const options = bookableMachines(kind);

	return (
		<div className="flex flex-col gap-6">
			<div className="rounded-lg border border-slate-200 bg-white p-4">
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					{BOOKING_KINDS.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => onKindChange(option.value)}
							aria-pressed={kind === option.value}
							className={`flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2.5 text-sm transition-colors ${
								kind === option.value
									? "border-slate-900 text-slate-900"
									: "border-slate-200 text-slate-600 hover:border-slate-300"
							}`}
						>
							<span
								className={`flex h-4 w-4 items-center justify-center rounded-full border ${
									kind === option.value
										? "border-slate-900"
										: "border-slate-300"
								}`}
							>
								{kind === option.value && (
									<span className="h-2 w-2 rounded-full bg-slate-900" />
								)}
							</span>
							<Translate text={option.labelKey} />
						</button>
					))}
				</div>
			</div>

			<Card>
				<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<CircleUserRound className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.machineBookMachineList} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-1.5">
						<Label className="text-sm font-medium text-slate-900">
							<Translate text={localizationConstants.machine} />
						</Label>
						<Select value={selectedMachineId} onValueChange={onSelectMachine}>
							<SelectTrigger className="h-10 w-full cursor-pointer border-slate-200 bg-white text-sm text-slate-700">
								<SelectValue
									placeholder={t(localizationConstants.machineListSelect)}
								/>
							</SelectTrigger>
							<SelectContent className="bg-white">
								{options.map((machine) => (
									<SelectItem key={machine.id} value={machine.id}>
										{machine.machineNo} — {machine.name}
										{machine.supplier ? ` (${machine.supplier})` : ""}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
