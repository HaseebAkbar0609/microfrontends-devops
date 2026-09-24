"use client";

import { useState } from "react";
import {
	FileText,
	MoreVertical,
	Pencil,
	Plus,
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { CompanyReference } from "../types";
import { CompanyReferenceValues } from "../schemas/companyReference.schema";
import {
	useCreateReference,
	useDeleteReference,
	useReferences,
	useUpdateReference,
} from "../hooks/useCompanyInformation";
import ReferenceFormDialog from "./ReferenceFormDialog";

const COLUMN_KEYS = [
	localizationConstants.companyRefColProject,
	localizationConstants.companyRefColCustomer,
	localizationConstants.companyRefColMunicipality,
	localizationConstants.companyRefColContact,
	localizationConstants.companyRefColPhone,
	localizationConstants.companyRefColPdf,
] as const;

export function CompanyReferencesTab() {
	const t = useTranslate();
	const referencesQuery = useReferences();
	const createReference = useCreateReference();
	const updateReference = useUpdateReference();
	const deleteReference = useDeleteReference();

	const references: CompanyReference[] = referencesQuery.data ?? [];
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingReference, setEditingReference] =
		useState<CompanyReference | null>(null);
	const [deletingReference, setDeletingReference] =
		useState<CompanyReference | null>(null);

	const openCreate = () => {
		setEditingReference(null);
		setDialogOpen(true);
	};

	const openEdit = (reference: CompanyReference) => {
		setEditingReference(reference);
		setDialogOpen(true);
	};

	const handleSaveReference = async (
		values: CompanyReferenceValues & { fileMediaId: string | null },
	) => {
		try {
			if (editingReference) {
				await updateReference.mutateAsync({
					id: editingReference.id,
					data: values,
				});
				showToast("success", t(localizationConstants.companyRefSavedToast));
			} else {
				await createReference.mutateAsync(values);
				showToast(
					"success",
					t(localizationConstants.companyRefCreatedToast),
				);
			}
			setDialogOpen(false);
		} catch (_error) {
			showToast("error", t(localizationConstants.profileUpdateFailed));
		}
	};

	const handleDelete = async () => {
		if (!deletingReference) return;
		try {
			await deleteReference.mutateAsync(deletingReference.id);
			showToast(
				"success",
				t(localizationConstants.companyRefDeletedToast),
			);
		} catch (_error) {
			showToast("error", t(localizationConstants.profileUpdateFailed));
		} finally {
			setDeletingReference(null);
		}
	};

	return (
		<div className="flex min-h-[calc(100vh-320px)] flex-col gap-6">
			<section className="rounded-md border border-slate-200 bg-white">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
					<div className="flex items-center gap-2 text-base font-semibold text-slate-900">
						<FileText size={22} className="text-slate-700" />
						<Translate
							text={localizationConstants.companyReferencesTitle}
						/>
					</div>
					<Button
						type="button"
						onClick={openCreate}
						className="h-11 gap-2 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
					>
						<Plus className="h-4 w-4" />
						<Translate
							text={localizationConstants.companyReferencesAddNew}
						/>
					</Button>
				</div>
				<div className="w-full overflow-x-auto">
					<Table className="w-full min-w-[56rem]">
						<TableHeader>
							<TableRow className="border-b border-slate-200 hover:bg-transparent">
								{COLUMN_KEYS.map((key) => (
									<TableHead
										key={key}
										className="px-4 py-3 text-sm font-medium text-slate-500"
									>
										<Translate text={key} />
									</TableHead>
								))}
								<TableHead className="px-4 py-3" />
							</TableRow>
						</TableHeader>
						<TableBody>
							{references.map((reference) => (
								<TableRow
									key={reference.id}
									className="border-b border-slate-100 hover:bg-slate-50/60"
								>
									<TableCell className="px-4 py-3.5 text-sm text-slate-700">
										{reference.project}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm text-slate-700">
										{reference.customer}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm text-slate-700">
										{reference.municipality}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm text-slate-700">
										{reference.contact}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm text-slate-700">
										{reference.phone}
									</TableCell>
									<TableCell className="px-4 py-3.5">
										{reference.file ? (
											<a
												href={reference.file.url ?? undefined}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-2 text-sm text-slate-700 hover:underline"
											>
												<span className="flex h-8 w-7 items-center justify-center rounded-sm border border-slate-200 bg-white">
													<span className="rounded-sm bg-red-600 px-0.5 text-[8px] font-bold text-white">
														{(reference.file.fileName ?? "")
															.split(".")
															.pop()
															?.toUpperCase() || "FILE"}
													</span>
												</span>
												{reference.file.fileName}
											</a>
										) : (
											<span className="text-sm text-slate-400">
												<Translate
													text={
														localizationConstants.noFileChosen
													}
												/>
											</span>
										)}
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
														openEdit(reference)
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
														setDeletingReference(
															reference,
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
							))}
						</TableBody>
					</Table>
				</div>
			</section>

			<ReferenceFormDialog
				open={dialogOpen}
				editingReference={editingReference}
				onClose={() => setDialogOpen(false)}
				onSave={handleSaveReference}
				isSaving={createReference.isPending || updateReference.isPending}
			/>

			<AlertDialog
				open={deletingReference !== null}
				onOpenChange={(value) => !value && setDeletingReference(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							<Translate
								text={
									localizationConstants.companyRefDeleteConfirmTitle
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
}
