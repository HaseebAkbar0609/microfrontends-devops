"use client";

import { useState } from "react";
import {
	ArrowUpDown,
	MoreVertical,
	Pencil,
	Plus,
	Search,
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
import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ProtocolNote } from "../constants/mockData";
import { NoteSortField, useNoteFilters } from "../hooks/useNoteFilters";
import { NoteValues } from "../schemas/protocol.schema";
import {
	addNote,
	listNotes,
	removeNote,
	updateNote,
} from "../services/protocolService";
import AddNoteDialog from "./AddNoteDialog";

const COLUMNS: { field: NoteSortField; labelKey: string }[] = [
	{ field: "date", labelKey: localizationConstants.protocolColDate },
	{ field: "name", labelKey: localizationConstants.itSupportColName },
];

const NotesTab = () => {
	const t = useTranslate();
	const [notes, setNotes] = useState<ProtocolNote[]>(() => listNotes());
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingNote, setEditingNote] = useState<ProtocolNote | null>(null);
	const filters = useNoteFilters(notes);

	const openCreate = () => {
		setEditingNote(null);
		setDialogOpen(true);
	};

	const openEdit = (note: ProtocolNote) => {
		setEditingNote(note);
		setDialogOpen(true);
	};

	const handleSend = (values: NoteValues) => {
		if (editingNote) {
			setNotes(
				updateNote(editingNote.id, {
					description: values.description,
				}),
			);
			showToast(
				"success",
				t(localizationConstants.protocolNoteSavedToast),
			);
			return;
		}
		setNotes(
			addNote({
				id: `temp-${crypto.randomUUID()}`,
				date: mockDate(0),
				name: "Möte med IT-team",
				description: values.description,
			}),
		);
		showToast("success", t(localizationConstants.protocolNoteSavedToast));
	};

	const handleDelete = (id: string) => {
		setNotes(removeNote(id));
		showToast("success", t(localizationConstants.protocolNoteDeletedToast));
	};

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-wrap items-center justify-between gap-4">
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
				<Button
					type="button"
					onClick={openCreate}
					className="h-11 gap-2 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.protocolAddNote} />
				</Button>
			</div>

			<div className="w-full overflow-x-auto rounded-md border border-slate-200 bg-white">
				<Table className="w-full min-w-[36rem]">
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
											filters.toggleSort(column.field)
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
						{filters.paged.map((note) => (
							<TableRow
								key={note.id}
								className="border-b border-slate-100 hover:bg-slate-50/60"
							>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{note.date}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{note.name}
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
												onClick={() => openEdit(note)}
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
													handleDelete(note.id)
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
				currentPage={filters.page}
				totalPages={filters.totalPages}
				pageSize={filters.pageSize}
				onPageChange={filters.setPage}
				onPageSizeChange={filters.setPageSize}
			/>

			<AddNoteDialog
				open={dialogOpen}
				editingNote={editingNote}
				onClose={() => setDialogOpen(false)}
				onSend={handleSend}
			/>
		</div>
	);
};

export default NotesTab;
