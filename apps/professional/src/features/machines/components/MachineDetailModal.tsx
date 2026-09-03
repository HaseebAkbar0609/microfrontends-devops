"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MachineStatusBadge } from "./MachineBadges";
import { QrCode, Wrench, Calendar, MapPin, Tag, Building2, Coins } from "lucide-react";
import type { MachineRow } from "../types/machine.types";

interface MachineDetailModalProps {
	machine: MachineRow | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function MachineDetailModal({
	machine,
	open,
	onOpenChange,
}: MachineDetailModalProps) {
	if (!machine) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-xl bg-white p-6">
				<DialogHeader className="border-b border-slate-100 pb-4">
					<div className="flex items-center justify-between">
						<div>
							<span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
								{machine.machineNo}
							</span>
							<DialogTitle className="text-xl font-bold text-slate-900">
								{machine.name}
							</DialogTitle>
						</div>
						<MachineStatusBadge status={machine.status} />
					</div>
				</DialogHeader>

				<div className="grid grid-cols-2 gap-4 py-4">
					<div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3">
						<Wrench className="mt-0.5 h-4 w-4 text-slate-500" />
						<div>
							<p className="text-xs text-slate-500">
								<Translate text={localizationConstants.machineColumnFactory} />
							</p>
							<p className="text-sm font-semibold text-slate-900">
								{machine.factory || "-"}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3">
						<Tag className="mt-0.5 h-4 w-4 text-slate-500" />
						<div>
							<p className="text-xs text-slate-500">
								<Translate text={localizationConstants.machineColumnDesignation} />
							</p>
							<p className="text-sm font-semibold text-slate-900">
								{machine.designation || "-"}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3">
						<Coins className="mt-0.5 h-4 w-4 text-slate-500" />
						<div>
							<p className="text-xs text-slate-500">
								<Translate text={localizationConstants.machineColumnInternalRent} />
							</p>
							<p className="text-sm font-semibold text-slate-900">
								{machine.internalRent} / {machine.unit}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3">
						<Calendar className="mt-0.5 h-4 w-4 text-slate-500" />
						<div>
							<p className="text-xs text-slate-500">
								<Translate text={localizationConstants.machineColumnPurchase} />
							</p>
							<p className="text-sm font-semibold text-slate-900">
								{machine.purchaseDate || "-"}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3">
						<MapPin className="mt-0.5 h-4 w-4 text-slate-500" />
						<div>
							<p className="text-xs text-slate-500">
								<Translate text={localizationConstants.machineColumnLocation} />
							</p>
							<p className="text-sm font-semibold text-slate-900">
								{machine.location || "-"}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3">
						<Building2 className="mt-0.5 h-4 w-4 text-slate-500" />
						<div>
							<p className="text-xs text-slate-500">
								<Translate text={localizationConstants.machineColumnCategory} />
							</p>
							<p className="text-sm font-semibold text-slate-900">
								{machine.category || "-"}
							</p>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
					<div>
						<p className="text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.machineCreateQrCode} />
						</p>
						<p className="text-xs text-slate-400">
							{machine.machineNo} - {machine.name}
						</p>
					</div>
					<div className="flex h-12 w-12 items-center justify-center rounded-md bg-white border border-slate-200 shadow-2xs">
						<QrCode className="h-8 w-8 text-slate-900" />
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
