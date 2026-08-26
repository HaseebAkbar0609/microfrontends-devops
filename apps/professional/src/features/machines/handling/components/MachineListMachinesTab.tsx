"use client";

import { useState } from "react";
import {
	ArrowUpDown,
	ChevronDown,
	ChevronUp,
	Eye,
	MoreVertical,
	Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { MachineRentalStatusBadge } from "./MachineRentalStatusBadge";
import type {
	MachineBookingGroup,
	MachineListDetail,
} from "../types/machineHandling.types";

/** Internal groups are green in the design, hired-in groups blue. */
type GroupTone = "internal" | "external";

const TONE_CLASSES: Record<GroupTone, string> = {
	internal: "bg-[#16A34A] text-white",
	external: "bg-[#93C5FD] text-slate-900",
};

function ColumnHead({ labelKey }: { labelKey: TranslationKeys }) {
	return (
		<TableHead className="px-3 py-2.5 text-xs font-medium whitespace-nowrap text-slate-500">
			<div className="flex items-center gap-1">
				<Translate text={labelKey} />
				<ArrowUpDown className="h-3 w-3 opacity-60" />
			</div>
		</TableHead>
	);
}

function BookingGroup({
	group,
	tone,
}: {
	group: MachineBookingGroup;
	tone: GroupTone;
}) {
	const { t } = useTranslation();
	const [expanded, setExpanded] = useState(true);
	const isExternal = tone === "external";

	return (
		<div className="flex flex-col">
			<button
				type="button"
				onClick={() => setExpanded((prev) => !prev)}
				aria-expanded={expanded}
				className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm font-medium ${TONE_CLASSES[tone]}`}
			>
				<Translate text={group.titleKey} />
				{expanded ? (
					<ChevronUp className="h-4 w-4" />
				) : (
					<ChevronDown className="h-4 w-4" />
				)}
			</button>

			{expanded && (
				<div className="w-full overflow-x-auto bg-white">
					<Table className="w-full min-w-225 table-auto border-collapse">
						<TableHeader>
							<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
								<ColumnHead labelKey={localizationConstants.machineColumnId} />
								<ColumnHead labelKey={localizationConstants.machine} />
								{isExternal && (
									<ColumnHead
										labelKey={localizationConstants.machineListSupplier}
									/>
								)}
								<ColumnHead
									labelKey={
										isExternal
											? localizationConstants.machineListExternalRent
											: localizationConstants.machineColumnInternalRent
									}
								/>
								<ColumnHead
									labelKey={localizationConstants.machineListDeliveryDate}
								/>
								<ColumnHead
									labelKey={localizationConstants.machineListReturnDate}
								/>
								<ColumnHead labelKey={localizationConstants.machineListDays} />
								<ColumnHead
									labelKey={localizationConstants.machineListRentalCost}
								/>
								<ColumnHead labelKey={localizationConstants.statusLabel} />
								<TableHead className="w-10 px-2 py-2.5 text-center">
									<Plus className="mx-auto h-3.5 w-3.5 text-slate-500" aria-hidden />
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{group.rows.map((row) => (
								<TableRow
									key={row.id}
									className="group border-b border-slate-100 transition-colors hover:bg-slate-50/60"
								>
									<TableCell className="px-3 py-2.5 text-xs whitespace-nowrap text-slate-700">
										{row.machineNo}
									</TableCell>
									<TableCell className="px-3 py-2.5 text-xs font-medium whitespace-nowrap text-slate-900">
										{row.name}
									</TableCell>
									{isExternal && (
										<TableCell className="px-3 py-2.5 text-xs whitespace-nowrap text-slate-700">
											{row.supplier}
										</TableCell>
									)}
									<TableCell className="px-3 py-2.5 text-xs whitespace-nowrap text-slate-700">
										{row.rate}
									</TableCell>
									<TableCell className="px-3 py-2.5 text-xs whitespace-nowrap text-slate-700">
										{row.deliveryDate}
									</TableCell>
									<TableCell className="px-3 py-2.5 text-xs whitespace-nowrap text-slate-700">
										{row.returnDate}
									</TableCell>
									<TableCell className="px-3 py-2.5 text-xs whitespace-nowrap text-slate-700">
										{row.days}
									</TableCell>
									<TableCell className="px-3 py-2.5 text-xs whitespace-nowrap text-slate-900">
										{row.cost}
									</TableCell>
									<TableCell className="px-3 py-2.5 whitespace-nowrap">
										<MachineRentalStatusBadge status={row.status} />
									</TableCell>
									<TableCell className="px-2 py-2.5">
										<div className="flex items-center justify-end gap-1">
											{/* Internal rows carry a quick-view action in the design */}
											{!isExternal && (
												<Button
													variant="ghost"
													size="icon"
													aria-label={t(localizationConstants.machineActionOpen)}
													className="h-7 w-7 cursor-pointer text-slate-500 hover:text-slate-900"
												>
													<Eye className="h-3.5 w-3.5" />
												</Button>
											)}
											<Button
												variant="ghost"
												size="icon"
												aria-label={t(localizationConstants.actionsHeader)}
												className="h-7 w-7 cursor-pointer text-slate-500 hover:text-slate-900"
											>
												<MoreVertical className="h-3.5 w-3.5" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}

/**
 * "Maskin lista" tab: every machine booked onto this project, split into the
 * company's own fleet and machines hired in from suppliers, then grouped by
 * category. Each group collapses independently.
 */
export function MachineListMachinesTab({
	detail,
}: {
	detail: MachineListDetail;
}) {
	return (
		<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
			<div className="bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900">
				<Translate text={localizationConstants.machineListInternalMachines} />
			</div>
			{detail.internalGroups.map((group) => (
				<BookingGroup key={group.id} group={group} tone="internal" />
			))}

			<div className="bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900">
				<Translate text={localizationConstants.machineListExternalMachines} />
			</div>
			{detail.externalGroups.map((group) => (
				<BookingGroup key={group.id} group={group} tone="external" />
			))}
		</div>
	);
}
