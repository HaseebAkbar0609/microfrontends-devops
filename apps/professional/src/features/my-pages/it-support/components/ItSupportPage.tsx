"use client";

import { useState } from "react";
import {
	ArrowUpDown,
	ChevronDown,
	MoreVertical,
	Pencil,
	Plus,
	Search,
	Send,
	Trash2,
} from "lucide-react";
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
import { today, saveRecord, deleteRecord, recordPage, useMyPagesQuery } from "@/features/my-pages/shared/api";
import { MyPagesQueryState, useMyPagesAction } from "@/features/my-pages/shared/feedback";
import { ConfirmRecordDelete } from "../../shared/ConfirmRecordDelete";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { IT_TICKET_STATUS_KEY, ItTicket } from "../constants/data";
import { ItTicketValues } from "../schemas/itTicket";
import ItTicketForm from "./ItTicketForm";

const STATUS_CLASS: Record<ItTicket["status"], string> = {
	notSent: "border border-red-300 text-red-600",
	done: "bg-slate-900 text-white",
	ongoing: "bg-slate-100 text-slate-700",
};

const ItSupportPage = () => {
	const t = useTranslate();
	const action = useMyPagesAction();
	const [deletingTicket, setDeletingTicket] = useState<ItTicket | null>(null);
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState<"date" | "name" | "status" | null>(
		null,
	);
	const [sortAsc, setSortAsc] = useState(true);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [formOpen, setFormOpen] = useState(false);
	const [editingTicket, setEditingTicket] = useState<ItTicket | null>(null);

	const [status, setStatus] = useState<ItTicket["status"] | "all">("all");
 const params = { page, page_size: pageSize, search: search.trim(), sort: sortBy === "name" ? "title" : sortBy ?? "date",
   direction: sortAsc ? "asc" : "desc", status: status === "all" ? undefined : status };
 const queryResult = useMyPagesQuery(["tickets", params], () => recordPage<ItTicket>("ticket", params));
 const tickets = queryResult.data?.items ?? [];

	const toggleSort = (field: "date" | "name" | "status") => {
		if (sortBy === field) setSortAsc((value) => !value);
		else {
			setSortBy(field);
			setSortAsc(true);
		}
	};

	const paged = tickets;
 const totalPages = Math.max(1, Math.ceil((queryResult.data?.total ?? 0) / pageSize));

	const openCreate = () => {
		setEditingTicket(null);
		setFormOpen(true);
	};

	const openEdit = (ticket: ItTicket) => {
		setEditingTicket(ticket);
		setFormOpen(true);
	};

	const upsertTicket = (
		values: ItTicketValues,
		files: string[],
		status: ItTicket["status"],
	) => action.run(() => saveRecord("ticket", {
		date: editingTicket?.date ?? today(), name: values.subject, description: values.description, files,
		status: editingTicket?.status === "ongoing" ? "ongoing" : status,
	}, editingTicket ?? undefined), status === "ongoing" ? localizationConstants.itSupportSentToast : localizationConstants.itSupportSavedToast);

	const sendTicket = (id: string) => {
		const ticket = tickets.find((item) => item.id === id);
		if (ticket) void action.run(() => saveRecord("ticket", { ...ticket, status: "ongoing" }, ticket), localizationConstants.itSupportSentToast);
	};

	const deleteTicket = (id: string) =>
		setDeletingTicket(tickets.find((ticket) => ticket.id === id) ?? null);

	if (formOpen)
		return (
			<ItTicketForm
				editingTicket={editingTicket}
				onBack={() => setFormOpen(false)}
				onSave={(values, files) => upsertTicket(values, files, "notSent")}
				onSend={(values, files) => upsertTicket(values, files, "ongoing")}
			/>
		);

	return (
		<div className="flex flex-col gap-5">
			<MyPagesQueryState query={queryResult} />
			<ConfirmRecordDelete open={!!deletingTicket} pending={action.pending} onClose={() => setDeletingTicket(null)} onConfirm={async () => {
				if (deletingTicket && await action.run(() => deleteRecord(deletingTicket))) setDeletingTicket(null);
			}} />
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-4">
					<div className="relative w-full max-w-xs">
						<Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							value={search}
							onChange={(event) => {
								setSearch(event.target.value);
								setPage(1);
							}}
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
							className="w-40 rounded-md border border-slate-200 bg-white p-1 shadow-md"
						>
							<DropdownMenuItem onClick={() => { setStatus("all"); setPage(1); }} className="cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700">
								<Translate
									text={
										localizationConstants.itSupportFilterAll
									}
								/>
							</DropdownMenuItem>
							{(["notSent", "ongoing", "done"] as const).map(value => <DropdownMenuItem key={value} onClick={() => { setStatus(value); setPage(1); }}><Translate text={IT_TICKET_STATUS_KEY[value]} /></DropdownMenuItem>)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<Button
					type="button"
					onClick={openCreate}
					className="h-11 gap-2 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
				>
					<Plus className="h-4 w-4" />
					<Translate
						text={localizationConstants.itSupportNewTicket}
					/>
				</Button>
			</div>

			<div className="w-full overflow-x-auto rounded-md border border-slate-200 bg-white">
				<Table className="w-full min-w-[44rem]">
					<TableHeader>
						<TableRow className="border-b border-slate-200 hover:bg-transparent">
							{(
							[
								{
									field: "date",
									labelKey:
										localizationConstants.companyMsgColDate,
								},
								{
									field: "name",
									labelKey:
										localizationConstants.itSupportColName,
								},
								{
									field: "status",
									labelKey:
										localizationConstants.myPagesEmpLeaveColStatus,
								},
							] as const
						).map((column) => (
							<TableHead
								key={column.field}
								className="px-4 py-3 text-sm font-medium text-slate-500"
							>
								<button
									type="button"
									onClick={() => toggleSort(column.field)}
									className="flex cursor-pointer items-center gap-1"
								>
									<Translate text={column.labelKey} />
									<ArrowUpDown
										className={
											sortBy === column.field
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
						{paged.map((ticket) => (
							<TableRow
								key={ticket.id}
								className="border-b border-slate-100 hover:bg-slate-50/60"
							>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{ticket.date}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{ticket.name}
								</TableCell>
								<TableCell className="px-4 py-3.5">
									<span
										className={cn(
											"inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
											STATUS_CLASS[ticket.status],
										)}
									>
										<Translate
											text={
												IT_TICKET_STATUS_KEY[
													ticket.status
												]
											}
										/>
									</span>
								</TableCell>
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
												onClick={() =>
													sendTicket(ticket.id)
												}
												className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
											>
												<Send className="h-4 w-4 text-slate-600" />
												<Translate
													text={
														localizationConstants.offerFormSubmit
													}
												/>
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => openEdit(ticket)}
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
													deleteTicket(ticket.id)
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
						))}
					</TableBody>
				</Table>
			</div>

			<TablePagination
				currentPage={page}
				totalPages={totalPages}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={(size) => {
					setPageSize(size);
					setPage(1);
				}}
			/>
		</div>
	);
};

export default ItSupportPage;
