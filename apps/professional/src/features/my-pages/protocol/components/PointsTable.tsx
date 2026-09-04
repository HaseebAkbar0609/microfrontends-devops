"use client";

import { Check, Info, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
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
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	MeetingPoint,
	PointStatus,
	ProtocolType,
} from "../constants/mockData";
import {
	POINT_STATUS_ACTIVE_CLASS,
	POINT_STATUS_INACTIVE_CLASS,
	POINT_STATUS_KEY,
	POINT_STATUS_LEGEND_DOT_CLASS,
	POINT_STATUS_ORDER,
} from "../constants/statusStyles";
import { usePagination } from "@/hooks/usePagination";

interface PointsTableProps {
	type: ProtocolType;
	points: MeetingPoint[];
	onCreate: () => void;
	onEdit: (point: MeetingPoint) => void;
	onDelete: (point: MeetingPoint) => void;
	onStatusChange: (point: MeetingPoint, status: PointStatus) => void;
}

const nextStatus = (status: PointStatus): PointStatus => {
	const index = POINT_STATUS_ORDER.indexOf(status);
	return POINT_STATUS_ORDER[(index + 1) % POINT_STATUS_ORDER.length];
};

const PointsTable = ({
	type,
	points,
	onCreate,
	onEdit,
	onDelete,
	onStatusChange,
}: PointsTableProps) => {
	const pagination = usePagination(points);
	const isAction = type === "action";

	return (
		<div className="rounded-md border border-slate-200 bg-white">
			<div className="flex items-center justify-between rounded-t-md bg-slate-100 px-5 py-3">
				<span className="text-sm font-semibold text-slate-900">
					<Translate
						text={localizationConstants.protocolPointsTableTitle}
					/>
				</span>
				<Button
					type="button"
					onClick={onCreate}
					className="h-9 gap-1.5 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-900/90"
				>
					<Translate text={localizationConstants.protocolCreatePoint} />
					<Plus className="h-4 w-4" />
				</Button>
			</div>
			<div className="w-full overflow-x-auto">
				<Table className="w-full min-w-[48rem]">
					<TableHeader>
						<TableRow className="border-b border-slate-200 hover:bg-transparent">
							<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
								<Translate
									text={localizationConstants.protocolPointColNr}
								/>
							</TableHead>
							<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
								<Translate
									text={
										localizationConstants.itSupportSubjectLabel
									}
								/>
							</TableHead>
							<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
								<Translate
									text={
										localizationConstants.protocolPointColDecision
									}
								/>
							</TableHead>
							<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
								<Translate
									text={
										localizationConstants.protocolFieldResponsible
									}
								/>
							</TableHead>
							{isAction && (
								<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
									<span className="flex items-center gap-1">
										<Translate
											text={
												localizationConstants.protocolPointColStatus
											}
										/>
										<Popover>
											<PopoverTrigger asChild>
												<button
													type="button"
													className="cursor-pointer"
												>
													<Info className="h-3.5 w-3.5 text-slate-400" />
												</button>
											</PopoverTrigger>
											<PopoverContent
												align="start"
												className="w-40 rounded-md border border-slate-200 bg-slate-900 p-3 text-white"
											>
												<p className="mb-2 text-xs font-medium">
													<Translate
														text={
															localizationConstants.protocolPointStatusPick
														}
													/>
												</p>
												<div className="flex flex-col gap-1.5">
													{POINT_STATUS_ORDER.map(
														(status) => (
															<span
																key={status}
																className="flex items-center gap-2 text-xs"
															>
																<span
																	className={cn(
																		"h-2.5 w-2.5 rounded-sm",
																		POINT_STATUS_LEGEND_DOT_CLASS[
																			status
																		],
																	)}
																/>
																<Translate
																	text={
																		POINT_STATUS_KEY[
																			status
																		]
																	}
																/>
															</span>
														),
													)}
												</div>
											</PopoverContent>
										</Popover>
									</span>
								</TableHead>
							)}
							<TableHead className="px-4 py-3 text-right">
								<Plus className="ml-auto h-4 w-4 text-slate-400" />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{pagination.paged.map((point) => (
							<TableRow
								key={point.id}
								className="border-b border-slate-100 hover:bg-slate-50/60"
							>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{point.nr}
								</TableCell>
								<TableCell className="px-4 py-3.5">
									<p className="text-sm text-slate-700">
										{point.subject}
									</p>
									{point.description && (
										<p className="mt-0.5 text-xs text-slate-400">
											{point.description}
										</p>
									)}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{point.decision || "-"}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{point.responsible}
								</TableCell>
								{isAction && (
									<TableCell className="px-4 py-3.5">
										<div className="flex items-center gap-1.5">
											{POINT_STATUS_ORDER.map(
												(status) => (
													<button
														key={status}
														type="button"
														onClick={() =>
															onStatusChange(
																point,
																status,
															)
														}
														aria-pressed={
															point.status ===
															status
														}
														className={cn(
															"flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm border",
															point.status ===
																status
																? POINT_STATUS_ACTIVE_CLASS[
																		status
																	]
																: POINT_STATUS_INACTIVE_CLASS[
																		status
																	],
														)}
													>
														<Check className="h-3.5 w-3.5" />
													</button>
												),
											)}
										</div>
									</TableCell>
								)}
								<TableCell className="px-4 py-3.5 text-right">
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
												onClick={() => onEdit(point)}
												className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
											>
												<Pencil className="h-4 w-4 text-slate-600" />
												<Translate
													text={
														localizationConstants.subscriptionPaymentEdit
													}
												/>
											</DropdownMenuItem>
											{isAction && (
												<DropdownMenuItem
													onClick={() =>
														onStatusChange(
															point,
															nextStatus(
																point.status,
															),
														)
													}
													className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
												>
													<Check className="h-4 w-4 text-slate-600" />
													<Translate
														text={
															localizationConstants.protocolChangeStatus
														}
													/>
												</DropdownMenuItem>
											)}
											<DropdownMenuItem
												onClick={() => onDelete(point)}
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
						))}
					</TableBody>
				</Table>
			</div>
			<TablePagination
				currentPage={pagination.page}
				totalPages={pagination.totalPages}
				pageSize={pagination.pageSize}
				onPageChange={pagination.setPage}
				onPageSizeChange={pagination.setPageSize}
			/>
		</div>
	);
};

export default PointsTable;
