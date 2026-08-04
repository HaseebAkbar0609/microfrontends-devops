"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Archive,
	ArrowUpDown,
	ChevronDown,
	FileText,
	MoreVertical,
	Pencil,
	Search,
	Trash2,
} from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/table/TablePagination";
import { cn } from "@/lib/utils";
import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { Protocol, ProtocolType } from "../constants/mockData";
import {
	PROTOCOL_STATUS_CLASS,
	PROTOCOL_STATUS_ICON,
	PROTOCOL_STATUS_KEY,
	PROTOCOL_TYPE_KEY,
} from "../constants/statusStyles";
import {
	ProtocolFilter,
	ProtocolSortField,
	useProtocolFilters,
} from "../hooks/useProtocolFilters";
import { MeetingValues } from "../schemas/protocol.schema";
import {
	createProtocol,
	listProtocols,
	removeProtocol,
} from "../services/protocolService";
import NewMeetingDialog from "./NewMeetingDialog";

const COLUMNS = [
	{ field: "date", labelKey: localizationConstants.protocolColDate },
	{ field: "title", labelKey: localizationConstants.protocolColTitle },
	{
		field: "status",
		labelKey: localizationConstants.myPagesEmpLeaveColStatus,
	},
	{
		field: "department",
		labelKey: localizationConstants.protocolColDepartment,
	},
	{ field: "type", labelKey: localizationConstants.protocolColType },
] as const;

const FILTER_OPTIONS: { value: ProtocolFilter; labelKey: string }[] = [
	{ value: "all", labelKey: localizationConstants.protocolFilterAll },
	{
		value: "notSent",
		labelKey: localizationConstants.protocolStatusNotSent,
	},
	{ value: "sent", labelKey: localizationConstants.protocolStatusSent },
	{
		value: "received",
		labelKey: localizationConstants.protocolStatusReceived,
	},
	{
		value: "standard",
		labelKey: localizationConstants.protocolTypeStandard,
	},
	{ value: "action", labelKey: localizationConstants.protocolTypeAction },
];

const MeetingProtocolsTab = () => {
	const t = useTranslate();
	const router = useRouter();
	const [protocols, setProtocols] = useState<Protocol[]>(() =>
		listProtocols(),
	);
	const [createType, setCreateType] = useState<ProtocolType | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const filters = useProtocolFilters(protocols);

	const handleCreate = (values: MeetingValues, type: ProtocolType) => {
		setProtocols(
			createProtocol({
				id: `temp-${crypto.randomUUID()}`,
				date: values.startDate || mockDate(0),
				title: values.title,
				status: "sent",
				department: values.category,
				type,
				meeting: {
					host: values.responsible,
					startDate: values.startDate,
					startTime: values.startTime,
					endDate: values.endDate,
					endTime: values.endTime,
					subject: "",
					protocolNumber: "",
					participantIds: values.participantIds,
					title: values.title,
					category: values.category,
					location: values.location,
					address: values.address,
					postalCode: values.postalCode,
					city: values.city,
					information: values.information,
					comment: "",
				},
				nextMeeting: {
					host: "",
					startDate: "",
					startTime: "",
					endDate: "",
					endTime: "",
					subject: "",
					protocolNumber: "",
					participantIds: [],
					title: "",
					category: "",
					location: "",
					address: "",
					postalCode: "",
					city: "",
					information: "",
					comment: "",
				},
				points: [],
			}),
		);
		showToast("success", t(localizationConstants.protocolSentToast));
	};

	const handleArchive = (id: string) => {
		setProtocols(removeProtocol(id));
		showToast("success", t(localizationConstants.protocolArchivedToast));
	};

	const handleDelete = () => {
		if (!deletingId) return;
		setProtocols(removeProtocol(deletingId));
		setDeletingId(null);
		showToast("success", t(localizationConstants.protocolDeletedToast));
	};

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-4">
					<div className="relative w-full max-w-xs">
						<Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							value={filters.search}
							onChange={(event) =>
								filters.setSearch(event.target.value)
							}
							placeholder={t(localizationConstants.search)}
							className="h-9 rounded-none border-0 border-b border-slate-200 bg-transparent pl-6 text-sm shadow-none focus-visible:border-slate-400 focus-visible:ring-0"
						/>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="outline"
								className="h-9 gap-1.5 rounded-md border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
							>
								<Translate
									text={localizationConstants.filter}
								/>
								<ChevronDown className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							className="w-44 rounded-md border border-slate-200 bg-white p-1 shadow-md"
						>
							{FILTER_OPTIONS.map((option) => (
								<DropdownMenuItem
									key={option.value}
									onClick={() =>
										filters.setFilter(option.value)
									}
									className={cn(
										"cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700",
										filters.filter === option.value &&
											"bg-slate-100 font-medium text-slate-900",
									)}
								>
									<Translate text={option.labelKey} />
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							className="h-11 gap-2 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
						>
							<Translate
								text={localizationConstants.protocolCreateNew}
							/>
							<ChevronDown className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-52 rounded-md border border-slate-200 bg-white p-1 shadow-md"
					>
						<DropdownMenuItem
							onClick={() => setCreateType("standard")}
							className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
						>
							<FileText className="h-4 w-4 text-slate-600" />
							<Translate
								text={
									localizationConstants.protocolCreateStandard
								}
							/>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setCreateType("action")}
							className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
						>
							<FileText className="h-4 w-4 text-slate-600" />
							<Translate
								text={
									localizationConstants.protocolCreateAction
								}
							/>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="w-full overflow-x-auto rounded-md border border-slate-200 bg-white">
				<Table className="w-full min-w-[56rem]">
					<TableHeader>
						<TableRow className="border-b border-slate-200 hover:bg-transparent">
							{COLUMNS.map((column) => (
								<TableHead
									key={column.field}
									className="px-4 py-3 text-sm font-medium text-slate-500"
								>
									<button
										type="button"
										onClick={() =>
											filters.toggleSort(
												column.field as ProtocolSortField,
											)
										}
										className="flex cursor-pointer items-center gap-1"
									>
										<Translate text={column.labelKey} />
										<ArrowUpDown
											className={
												filters.sortField ===
												column.field
													? "h-3.5 w-3.5 text-slate-900"
													: "h-3.5 w-3.5 opacity-50"
											}
										/>
									</button>
								</TableHead>
							))}
							<TableHead className="px-4 py-3" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{filters.paged.map((protocol) => {
							const StatusIcon =
								PROTOCOL_STATUS_ICON[protocol.status];
							return (
								<TableRow
									key={protocol.id}
									onClick={() =>
										router.push(
											`/tools/my-pages/protocol/${protocol.id}`,
										)
									}
									className="cursor-pointer border-b border-slate-100 hover:bg-slate-50/60"
								>
									<TableCell className="px-4 py-3.5 text-sm text-slate-700">
										{protocol.date}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm text-slate-700">
										{protocol.title}
									</TableCell>
									<TableCell className="px-4 py-3.5">
										<span
											className={cn(
												"inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
												PROTOCOL_STATUS_CLASS[
													protocol.status
												],
											)}
										>
											<StatusIcon className="h-3 w-3" />
											<Translate
												text={
													PROTOCOL_STATUS_KEY[
														protocol.status
													]
												}
											/>
										</span>
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm text-slate-700">
										{protocol.department}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm text-slate-700">
										<Translate
											text={
												PROTOCOL_TYPE_KEY[protocol.type]
											}
										/>
									</TableCell>
									<TableCell
										onClick={(event) =>
											event.stopPropagation()
										}
										className="px-4 py-3.5 text-right"
									>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="h-8 w-8 rounded-md text-slate-500 hover:text-slate-900"
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-40 rounded-md border border-slate-200 bg-white p-1 shadow-md"
											>
												<DropdownMenuItem
													onClick={() =>
														router.push(
															`/tools/my-pages/protocol/${protocol.id}/edit`,
														)
													}
													className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
												>
													<Pencil className="h-4 w-4 text-slate-600" />
													<Translate
														text={
															localizationConstants.subscriptionPaymentEdit
														}
													/>
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														handleArchive(
															protocol.id,
														)
													}
													className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
												>
													<Archive className="h-4 w-4 text-slate-600" />
													<Translate
														text={
															localizationConstants.protocolArchiveAction
														}
													/>
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														setDeletingId(
															protocol.id,
														)
													}
													className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
												>
													<Trash2 className="h-4 w-4 text-slate-600" />
													<Translate
														text={
															localizationConstants.subscriptionPaymentDelete
														}
													/>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>

			<TablePagination
				currentPage={filters.page}
				totalPages={filters.totalPages}
				pageSize={filters.pageSize}
				onPageChange={filters.setPage}
				onPageSizeChange={filters.setPageSize}
			/>

			{createType && (
				<NewMeetingDialog
					open
					type={createType}
					onClose={() => setCreateType(null)}
					onSend={(values) => handleCreate(values, createType)}
				/>
			)}

			<AlertDialog
				open={deletingId !== null}
				onOpenChange={(value) => !value && setDeletingId(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							<Translate
								text={
									localizationConstants.protocolDeleteConfirmTitle
								}
							/>
						</AlertDialogTitle>
						<AlertDialogDescription>
							<Translate
								text={
									localizationConstants.protocolDeleteConfirmDesc
								}
							/>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>
							<Translate text={localizationConstants.cancel} />
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>
							<Translate
								text={
									localizationConstants.subscriptionPaymentDelete
								}
							/>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default MeetingProtocolsTab;
