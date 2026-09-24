"use client";

import { useState, useMemo } from "react";
import {
	Users,
	BriefcaseBusiness,
	WashingMachine,
	RulerDimensionLine,
	ArrowUpDown,
	ChevronDown,
	ChevronUp,
	CircleFadingPlus,
} from "lucide-react";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CONSTRUCTION_LOG_CONSTANTS } from "../constants/constructionLog.constants";
import type {
	WorkforceItem,
	ActivityItem,
	MachineItem,
	DeviationItem,
} from "../types/constructionLog.types";

type AddRowType = "workforce" | "activity" | "machine" | "deviation";

interface ConstructionLogDetailsViewProps {
	workforce: WorkforceItem[];
	activities: ActivityItem[];
	machines: MachineItem[];
	deviations: DeviationItem[];
	generalNotes: string;
	onGeneralNotesChange: (value: string) => void;
	selfInspectionNote: string;
	onSelfInspectionNoteChange: (value: string) => void;
	onAddRow: (type: AddRowType) => void;
}

const AddRowButton = ({
	type,
	onAddRow,
}: {
	type: AddRowType;
	onAddRow: (type: AddRowType) => void;
}) => (
	<div className="p-4 mt-auto">
		<Button
			type="button"
			onClick={() => onAddRow(type)}
			className="h-8 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-sans text-sm font-medium leading-5 tracking-normal cursor-pointer shadow-none flex items-center gap-1.5"
		>
			<CircleFadingPlus className="w-3.5 h-3.5" />
			<span>
				<Translate text={localizationConstants.orderDagbokBtnMoreRows} />
			</span>
		</Button>
	</div>
);

export function ConstructionLogDetailsView({
	workforce,
	activities,
	machines,
	deviations,
	generalNotes,
	onGeneralNotesChange,
	selfInspectionNote,
	onSelfInspectionNoteChange,
	onAddRow,
}: ConstructionLogDetailsViewProps) {
	const t = useTranslate();

	const [wfSortAsc, setWfSortAsc] = useState(true);
	const [wfSortCol, setWfSortCol] = useState<"role" | "own">("role");
	const [actSortAsc, setActSortAsc] = useState(true);
	const [actSortField, setActSortField] = useState<"title" | "status">("title");
	const [machSortAsc, setMachSortAsc] = useState(true);
	const [devSortAsc, setDevSortAsc] = useState(true);
	const [devSortCol, setDevSortCol] = useState<"number" | "type" | "status">("number");

	const [wfOpen, setWfOpen] = useState(true);
	const [actOpen, setActOpen] = useState(true);
	const [machOpen, setMachOpen] = useState(true);
	const [devOpen, setDevOpen] = useState(true);

	const sortedWorkforce = useMemo(() => {
		return [...workforce].sort((a, b) => {
			const res = wfSortCol === "role"
				? a.role.localeCompare(b.role)
				: (a.ownCount ?? 0) - (b.ownCount ?? 0);
			return wfSortAsc ? res : -res;
		});
	}, [workforce, wfSortAsc, wfSortCol]);

	const sortedActivities = useMemo(() => {
		return [...activities].sort((a, b) => {
			const res =
				actSortField === "title"
					? a.title.localeCompare(b.title)
					: a.status.localeCompare(b.status);
			return actSortAsc ? res : -res;
		});
	}, [activities, actSortAsc, actSortField]);

	const sortedMachines = useMemo(() => {
		return [...machines].sort((a, b) => {
			const res = a.name.localeCompare(b.name);
			return machSortAsc ? res : -res;
		});
	}, [machines, machSortAsc]);

	const sortedDeviations = useMemo(() => {
		return [...deviations].sort((a, b) => {
			let res = 0;
			if (devSortCol === "number") res = a.number - b.number;
			else if (devSortCol === "type") res = a.type.localeCompare(b.type);
			else if (devSortCol === "status") res = a.status.localeCompare(b.status);
			return devSortAsc ? res : -res;
		});
	}, [deviations, devSortAsc, devSortCol]);

	return (
		<div className="flex flex-col gap-4">
			<h2 className="font-sans text-base sm:text-lg font-semibold leading-6 tracking-normal text-slate-900">
				<Translate text={localizationConstants.orderDagbokSectionDetailed} />
			</h2>

			{/* 2x2 Grid of Tables */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start">
				{/* 1. Närvarande arbetsstyrka */}
				<div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden flex flex-col">
					<Button
						type="button"
						variant="ghost"
						onClick={() => setWfOpen(!wfOpen)}
						className="w-full px-6 sm:px-8 py-4 flex items-center justify-between bg-white hover:bg-slate-50/70 transition-colors cursor-pointer border-b border-slate-200 h-14 min-h-14 rounded-none"
					>
						<div className="flex items-center gap-2.5">
							<Users className="size-6 text-slate-700 shrink-0" />
							<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderDagbokCardWorkforce} />
							</span>
						</div>
						{wfOpen ? (
							<ChevronUp className="w-4 h-4 text-slate-500" />
						) : (
							<ChevronDown className="w-4 h-4 text-slate-500" />
						)}
					</Button>

					{wfOpen && (
						<div className="flex-1 flex flex-col justify-between p-4">
							<div className="overflow-x-auto w-full">
								<Table className="w-full table-auto border-collapse">
									<TableHeader>
										<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
											<TableHead className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 whitespace-nowrap">
												<Button type="button" variant="ghost" size="sm" onClick={() => { setWfSortCol("role"); setWfSortAsc(wfSortCol === "role" ? !wfSortAsc : true); }} className="p-0 h-auto font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 hover:text-slate-900 transition-colors cursor-pointer hover:bg-transparent">
													<span>{t(localizationConstants.orderDagbokColRole)}</span>
													<ArrowUpDown className="w-3.5 h-3.5" />
												</Button>
											</TableHead>
										<TableHead className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 text-center whitespace-nowrap">
											<Button type="button" variant="ghost" size="sm" onClick={() => { setWfSortCol("own"); setWfSortAsc(wfSortCol === "own" ? !wfSortAsc : true); }} className="p-0 h-auto font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 hover:text-slate-900 transition-colors cursor-pointer hover:bg-transparent">
												<span>{t(localizationConstants.orderDagbokColOwn)}</span>
												<ArrowUpDown className="w-3.5 h-3.5" />
											</Button>
										</TableHead>
											<TableHead className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 text-center whitespace-nowrap">
												<span>{t(localizationConstants.orderDagbokColSubcontractor)}</span>
											</TableHead>
											<TableHead className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 text-center whitespace-nowrap">
												<span>{t(localizationConstants.orderDagbokColHours)}</span>
											</TableHead>
											<TableHead className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 whitespace-nowrap">
												<span>{t(localizationConstants.orderDagbokColNote)}</span>
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody className="bg-white">
										{sortedWorkforce.map((item) => (
											<TableRow key={item.id} className="border-b border-slate-200 transition-colors hover:bg-slate-50/60">
												<TableCell className="px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900">
													{item.role}
												</TableCell>
												<TableCell className="px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900 text-center">
													{item.ownCount !== null ? item.ownCount : CONSTRUCTION_LOG_CONSTANTS.FALLBACK_DASH}
												</TableCell>
												<TableCell className="px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900 text-center">
													{item.subcontractorCount !== null ? item.subcontractorCount : CONSTRUCTION_LOG_CONSTANTS.FALLBACK_DASH}
												</TableCell>
												<TableCell className="px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900 text-center">
													{item.hours}
												</TableCell>
												<TableCell className="px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900">
													{item.note || CONSTRUCTION_LOG_CONSTANTS.FALLBACK_DASH}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
							<AddRowButton type="workforce" onAddRow={onAddRow} />
						</div>
					)}
				</div>

				{/* 2. Arbeten */}
				<div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden flex flex-col">
					<Button
						type="button"
						variant="ghost"
						onClick={() => setActOpen(!actOpen)}
						className="w-full px-6 sm:px-8 py-4 flex items-center justify-between bg-white hover:bg-slate-50/70 transition-colors cursor-pointer border-b border-slate-200 h-14 min-h-14 rounded-none"
					>
						<div className="flex items-center gap-2.5">
							<BriefcaseBusiness className="size-6 text-slate-700 shrink-0" />
							<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderDagbokCardWorks} />
							</span>
						</div>
						{actOpen ? (
							<ChevronUp className="w-4 h-4 text-slate-500" />
						) : (
							<ChevronDown className="w-4 h-4 text-slate-500" />
						)}
					</Button>

					{actOpen && (
						<div className="flex-1 flex flex-col justify-between p-4">
							<div className="overflow-x-auto w-full">
								<Table className="w-full table-auto border-collapse">
									<TableHeader>
										<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
											<TableHead className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 whitespace-nowrap min-w-[140px]">
												<Button type="button" variant="ghost" size="sm" onClick={() => { setActSortField("title"); setActSortAsc(actSortField === "title" ? !actSortAsc : true); }} className="p-0 h-auto font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 hover:text-slate-900 transition-colors cursor-pointer hover:bg-transparent">
													<span>{t(localizationConstants.orderDagbokColRole)}</span>
													<ArrowUpDown className="w-3.5 h-3.5" />
												</Button>
											</TableHead>
											<TableHead className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 text-center whitespace-nowrap min-w-[100px]">
												<Button type="button" variant="ghost" size="sm" onClick={() => { setActSortField("status"); setActSortAsc(actSortField === "status" ? !actSortAsc : true); }} className="p-0 h-auto font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 hover:text-slate-900 transition-colors cursor-pointer hover:bg-transparent">
													<span>{t(localizationConstants.orderDagbokColStatus)}</span>
													<ArrowUpDown className="w-3.5 h-3.5" />
												</Button>
											</TableHead>
											<TableHead className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 whitespace-nowrap min-w-[160px]">
												<span>{t(localizationConstants.orderDagbokColNotes)}</span>
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody className="bg-white">
										{sortedActivities.map((item) => (
											<TableRow key={item.id} className="border-b border-slate-200 transition-colors hover:bg-slate-50/60">
												<TableCell className="px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900">
													{item.title}
												</TableCell>
												<TableCell className="px-4 py-3.5 text-center">
													<Badge className="bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-medium px-2.5 py-0.5 rounded-full shadow-none border-none">
														{item.status === CONSTRUCTION_LOG_CONSTANTS.ACTIVITY_STATUS.IN_PROGRESS ? (
															<Translate text={localizationConstants.orderDagbokStatusInProgress} />
														) : (
															<Translate text={localizationConstants.orderDagbokStatusDone} />
														)}
													</Badge>
												</TableCell>
												<TableCell className="px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900">
													{item.note || CONSTRUCTION_LOG_CONSTANTS.FALLBACK_DASH}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
							<AddRowButton type="activity" onAddRow={onAddRow} />
						</div>
					)}
				</div>

				{/* 3. Maskiner */}
				<div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden flex flex-col">
					<Button
						type="button"
						variant="ghost"
						onClick={() => setMachOpen(!machOpen)}
						className="w-full px-6 sm:px-8 py-4 flex items-center justify-between bg-white hover:bg-slate-50/70 transition-colors cursor-pointer border-b border-slate-200 h-14 min-h-14 rounded-none"
					>
						<div className="flex items-center gap-2.5">
							<WashingMachine className="size-6 text-slate-700 shrink-0" />
							<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderDagbokCardMachines} />
							</span>
						</div>
						{machOpen ? (
							<ChevronUp className="w-4 h-4 text-slate-500" />
						) : (
							<ChevronDown className="w-4 h-4 text-slate-500" />
						)}
					</Button>

					{machOpen && (
						<div className="flex-1 flex flex-col justify-between p-4">
							<div className="overflow-x-auto w-full">
								<Table className="w-full table-auto border-collapse">
									<TableHeader>
										<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
											<TableHead className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 whitespace-nowrap">
												<Button type="button" variant="ghost" size="sm" onClick={() => setMachSortAsc(!machSortAsc)} className="p-0 h-auto font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 hover:text-slate-900 transition-colors cursor-pointer hover:bg-transparent">
													<span>{t(localizationConstants.orderDagbokColRole)}</span>
													<ArrowUpDown className="w-3.5 h-3.5" />
												</Button>
											</TableHead>
											<TableHead className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 whitespace-nowrap">
												<span>{t(localizationConstants.orderDagbokColQuantity)}</span>
											</TableHead>
											<TableHead className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 whitespace-nowrap">
												<span>{t(localizationConstants.orderDagbokColHoursShort)}</span>
											</TableHead>
											<TableHead className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 whitespace-nowrap">
												<span>{t(localizationConstants.orderDagbokColNote)}</span>
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody className="bg-white">
										{sortedMachines.map((item) => (
											<TableRow key={item.id} className="border-b border-slate-200 transition-colors hover:bg-slate-50/60">
												<TableCell className="px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900">
													{item.name}
												</TableCell>
												<TableCell className="px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900 whitespace-nowrap">
													{item.quantity}
												</TableCell>
												<TableCell className="px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900">
													{item.hours}
												</TableCell>
												<TableCell className="px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900">
													{item.note || CONSTRUCTION_LOG_CONSTANTS.FALLBACK_DASH}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
							<AddRowButton type="machine" onAddRow={onAddRow} />
						</div>
					)}
				</div>

				{/* 4. Avvikelser */}
				<div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden flex flex-col">
					<Button
						type="button"
						variant="ghost"
						onClick={() => setDevOpen(!devOpen)}
						className="w-full px-6 sm:px-8 py-4 flex items-center justify-between bg-white hover:bg-slate-50/70 transition-colors cursor-pointer border-b border-slate-200 h-14 min-h-14 rounded-none"
					>
						<div className="flex items-center gap-2.5">
							<RulerDimensionLine className="size-6 text-slate-700 shrink-0" />
							<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderDagbokCardDeviations} />
							</span>
						</div>
						{devOpen ? (
							<ChevronUp className="w-4 h-4 text-slate-500" />
						) : (
							<ChevronDown className="w-4 h-4 text-slate-500" />
						)}
					</Button>

					{devOpen && (
						<div className="flex-1 flex flex-col justify-between p-4">
							<div className="overflow-x-auto w-full">
								<Table className="w-full table-auto border-collapse">
									<TableHeader>
										<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
											<TableHead className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 text-center whitespace-nowrap w-16">
												<Button type="button" variant="ghost" size="sm" onClick={() => { setDevSortCol("number"); setDevSortAsc(devSortCol === "number" ? !devSortAsc : true); }} className="p-0 h-auto font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 hover:text-slate-900 transition-colors cursor-pointer hover:bg-transparent">
													<span>{t(localizationConstants.orderDagbokColNumber)}</span>
													<ArrowUpDown className="w-3.5 h-3.5" />
												</Button>
											</TableHead>
											<TableHead className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 text-center whitespace-nowrap min-w-[90px]">
												<Button type="button" variant="ghost" size="sm" onClick={() => { setDevSortCol("type"); setDevSortAsc(devSortCol === "type" ? !devSortAsc : true); }} className="p-0 h-auto font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 hover:text-slate-900 transition-colors cursor-pointer hover:bg-transparent">
													<span>{t(localizationConstants.orderDagbokColType)}</span>
													<ArrowUpDown className="w-3.5 h-3.5" />
												</Button>
											</TableHead>
											<TableHead className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 text-center whitespace-nowrap min-w-[100px]">
												<Button type="button" variant="ghost" size="sm" onClick={() => { setDevSortCol("status"); setDevSortAsc(devSortCol === "status" ? !devSortAsc : true); }} className="p-0 h-auto font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 hover:text-slate-900 transition-colors cursor-pointer hover:bg-transparent">
													<span>{t(localizationConstants.orderDagbokColStatus)}</span>
													<ArrowUpDown className="w-3.5 h-3.5" />
												</Button>
											</TableHead>
											<TableHead className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 whitespace-nowrap min-w-[160px]">
												<span>{t(localizationConstants.orderDagbokColNote)}</span>
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody className="bg-white">
										{sortedDeviations.map((item) => (
											<TableRow key={item.id} className="border-b border-slate-200 transition-colors hover:bg-slate-50/60">
												<TableCell className="px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900 text-center">
													{item.number}
												</TableCell>
												<TableCell className="px-4 py-3.5 text-center">
													{item.type === CONSTRUCTION_LOG_CONSTANTS.DEVIATION_TYPES.ATA ? (
														<Badge className="bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-medium px-2.5 py-0.5 rounded-full shadow-none border-none">
															<Translate text={localizationConstants.orderDagbokTypeAta} />
														</Badge>
													) : item.type === CONSTRUCTION_LOG_CONSTANTS.DEVIATION_TYPES.ERROR ? (
														<Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200 font-sans text-xs font-medium px-2.5 py-0.5 rounded-full">
															<Translate text={localizationConstants.orderDagbokTypeError} />
														</Badge>
													) : (
														<Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-sans text-xs font-medium px-2.5 py-0.5 rounded-full">
															<Translate text={localizationConstants.orderDagbokTypeObstacle} />
														</Badge>
													)}
												</TableCell>
												<TableCell className="px-4 py-3.5 text-center">
													{item.status === CONSTRUCTION_LOG_CONSTANTS.DEVIATION_STATUS.IN_PROGRESS ? (
														<Badge variant="outline" className="border-slate-300 text-slate-800 font-sans text-xs font-normal px-2.5 py-0.5 rounded-full">
															<Translate text={localizationConstants.orderDagbokStatusInProgress} />
														</Badge>
													) : item.status === CONSTRUCTION_LOG_CONSTANTS.DEVIATION_STATUS.PENDING ? (
														<Badge variant="outline" className="border-slate-300 text-slate-800 font-sans text-xs font-normal px-2.5 py-0.5 rounded-full">
															<Translate text={localizationConstants.orderDagbokStatusPending} />
														</Badge>
													) : (
														<Badge variant="outline" className="border-emerald-300 text-emerald-700 font-sans text-xs font-normal px-2.5 py-0.5 rounded-full">
															<Translate text={localizationConstants.orderDagbokStatusDone} />
														</Badge>
													)}
												</TableCell>
												<TableCell className="px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900">
													{item.note || CONSTRUCTION_LOG_CONSTANTS.FALLBACK_DASH}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
							<AddRowButton type="deviation" onAddRow={onAddRow} />
						</div>
					)}
				</div>
			</div>

			{/* Notes side by side */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="flex flex-col gap-2">
					<Label htmlFor="general-notes" className="text-slate-900 tracking-normal">
						<Translate text={localizationConstants.orderDagbokNotesGeneral} />
					</Label>
					<Textarea
						id="general-notes"
						rows={4}
						value={generalNotes}
						onChange={(e) => onGeneralNotesChange(e.target.value)}
						placeholder={t(localizationConstants.orderDagbokPlaceholderDescription)}
						className="resize-y border-slate-200 font-sans text-sm leading-5 tracking-normal bg-white text-slate-900"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="self-inspection-note" className="text-slate-900 tracking-normal">
						<Translate text={localizationConstants.orderDagbokNotesSelfInspection} />
					</Label>
					<Textarea
						id="self-inspection-note"
						rows={4}
						value={selfInspectionNote}
						onChange={(e) => onSelfInspectionNoteChange(e.target.value)}
						placeholder={t(localizationConstants.orderDagbokPlaceholderDescription)}
						className="resize-y border-slate-200 font-sans text-sm leading-5 tracking-normal bg-white text-slate-900"
					/>
				</div>
			</div>
		</div>
	);
}

export default ConstructionLogDetailsView;
