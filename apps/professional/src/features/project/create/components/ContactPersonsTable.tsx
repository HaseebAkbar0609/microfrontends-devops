"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { ProjectContactPerson } from "../types";

const HEADERS: TranslationKeys[] = [
	localizationConstants.orderFornamLabel,
	localizationConstants.orderEfternamnLabel,
	localizationConstants.orderMailLabel,
	localizationConstants.orderMobilLabel,
	localizationConstants.orderRollLabel,
];

const CELL_CLASS = "px-4 py-3 text-sm whitespace-nowrap text-slate-900";

export interface ContactPersonsTableProps {
	contacts: ProjectContactPerson[];
	onEdit: (contact: ProjectContactPerson) => void;
	onAdd: () => void;
	onChange: (contacts: ProjectContactPerson[]) => void;
}

/** Kontaktpersoner — the frame's contact list under the Kontakt card. */
export function ContactPersonsTable({
	contacts,
	onEdit,
	onAdd,
	onChange,
}: ContactPersonsTableProps) {
	const t = useTranslate();
	const [deletingId, setDeletingId] = useState<string | null>(null);

	return (
		<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
			<div className="flex flex-col gap-2.5 border-b border-slate-200 bg-slate-100 p-3.5 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0">
				<h2 className="text-sm font-medium text-slate-900">
					<Translate
						text={localizationConstants.projectCreateContactsHeader}
					/>
				</h2>
				<Button
					type="button"
					onClick={onAdd}
					className="h-8 w-full cursor-pointer justify-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-none hover:bg-slate-800 sm:w-auto"
				>
					<Plus className="h-3.5 w-3.5" aria-hidden />
					<Translate text={localizationConstants.add} />
				</Button>
			</div>

			<div className="w-full overflow-x-auto">
				<Table className="w-full min-w-[720px]">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
							{HEADERS.map((label) => (
								<TableHead
									key={label}
									className="px-4 py-3 text-sm font-medium whitespace-nowrap text-slate-500"
								>
									<Translate text={label} />
								</TableHead>
							))}
							<TableHead className="w-12 px-4 py-3" />
						</TableRow>
					</TableHeader>

					<TableBody>
						{contacts.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={HEADERS.length + 1}
									className="py-8 text-center text-sm text-slate-500"
								>
									<Translate
										text={localizationConstants.noRecordsFound}
									/>
								</TableCell>
							</TableRow>
						) : (
							contacts.map((contact) => (
								<TableRow
									key={contact.id}
									className="group border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
								>
									<TableCell className={CELL_CLASS}>
										{contact.firstName}
									</TableCell>
									<TableCell className={CELL_CLASS}>
										{contact.lastName}
									</TableCell>
									<TableCell className={CELL_CLASS}>
										{contact.email}
									</TableCell>
									<TableCell className={CELL_CLASS}>
										{contact.mobile}
									</TableCell>
									<TableCell className={CELL_CLASS}>
										{contact.role}
									</TableCell>
									<TableCell className="px-4 py-3 text-center">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													/* Named per row, so the menus
													   are distinguishable. */
													aria-label={`${t(localizationConstants.actions)} ${contact.firstName} ${contact.lastName}`.trim()}
													className="h-8 w-8 cursor-pointer rounded-lg text-slate-700 hover:bg-slate-100"
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-md"
											>
												<DropdownMenuItem
													onClick={() => onEdit(contact)}
													className="flex cursor-pointer items-center gap-2 text-xs text-slate-700 hover:bg-slate-50"
												>
													<Pencil className="h-4 w-4 text-slate-500" />
													<Translate
														text={
															localizationConstants.actionEdit
														}
													/>
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														setDeletingId(contact.id)
													}
													className="flex cursor-pointer items-center gap-2 text-xs text-slate-700 hover:bg-slate-50"
												>
													<Trash2 className="h-4 w-4 text-slate-500" />
													<Translate
														text={
															localizationConstants.menuDeleteDocument
														}
													/>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<ConfirmActionDialog
				open={Boolean(deletingId)}
				onOpenChange={(open) => !open && setDeletingId(null)}
				title={localizationConstants.projectCreateDeleteContactTitle}
				description={localizationConstants.projectCreateDeleteDesc}
				confirmLabel={localizationConstants.menuDeleteDocument}
				destructive
				onConfirm={() => {
					onChange(contacts.filter((row) => row.id !== deletingId));
					setDeletingId(null);
				}}
			/>
		</div>
	);
}

export default ContactPersonsTable;
