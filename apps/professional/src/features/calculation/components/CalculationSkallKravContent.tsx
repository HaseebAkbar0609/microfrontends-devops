"use client";

import {
	ChevronDown,
	Eye,
	MoreVertical,
	Trash2,
	Upload,
	Check,
	Loader2,
} from "lucide-react";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { useSkallKrav } from "../hooks/useSkallKrav";

const TH_SORTABLE =
	"cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900";

export function CalculationSkallKravContent() {
	const t = useTranslate();
	const {
		docs,
		isLoading,
		isUploading,
		search,
		setSearch,
		filterTyp,
		setFilterTyp,
		allTypes,
		selectedFile,
		fileInputRef,
		deleteTarget,
		setDeleteTarget,
		sortField,
		sortDir,
		toggleSort,
		handleFileChange,
		handleUpload,
		handleDelete,
		handleViewFile,
	} = useSkallKrav();

	return (
		<div className="flex flex-1 flex-col bg-white">
			{/* Toolbar */}
			<div className="flex flex-wrap items-center gap-3 px-5 py-3.5">
				{/* Search Input */}
				<Search
					value={search}
					onChange={setSearch}
					placeholder={localizationConstants.search}
					className="h-9 w-full"
					wrapperClassName="w-64 sm:w-72"
				/>

				{/* Filter Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="h-9 cursor-pointer gap-2 border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 shadow-none"
						>
							{filterTyp ? (
								filterTyp
							) : (
								<Translate text={localizationConstants.filter} />
							)}
							<ChevronDown size={14} className="text-slate-500" aria-hidden />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-52 bg-white">
						<DropdownMenuItem
							className="cursor-pointer text-sm flex items-center justify-between"
							onClick={() => setFilterTyp(null)}
						>
							<Translate text={localizationConstants.adminUsersFilterAll} />
							{!filterTyp && <Check size={14} className="text-slate-900" />}
						</DropdownMenuItem>
						{allTypes.map((typ) => (
							<DropdownMenuItem
								key={typ}
								className="cursor-pointer text-sm flex items-center justify-between"
								onClick={() => setFilterTyp(typ)}
							>
								{typ}
								{filterTyp === typ && <Check size={14} className="text-slate-900" />}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Document Table */}
			<div className="flex flex-1 flex-col px-5 py-2">
				<Table className="min-w-max w-full text-sm">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-transparent">
							<TableHead
								scope="col"
								className={TH_SORTABLE}
								onClick={() => toggleSort("datum")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.date} />
									{renderSortIcon("datum", sortField, sortDir)}
								</span>
							</TableHead>
							<TableHead
								scope="col"
								className={TH_SORTABLE}
								onClick={() => toggleSort("typ")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.calcProType} />
									{renderSortIcon("typ", sortField, sortDir)}
								</span>
							</TableHead>
							<TableHead
								scope="col"
								className={TH_SORTABLE}
								onClick={() => toggleSort("filename")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.colPdf} />
									{renderSortIcon("filename", sortField, sortDir)}
								</span>
							</TableHead>
							<TableHead scope="col" className="whitespace-nowrap px-3 py-3.5 text-right text-xs font-semibold text-slate-600 w-36" />
						</TableRow>
					</TableHeader>
					<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-slate-200">
						{isLoading ? (
							<TableRow className="hover:bg-transparent">
								<TableCell colSpan={4} className="px-4 py-12 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.genericLoading} />
								</TableCell>
							</TableRow>
						) : docs.length === 0 ? (
							<TableRow className="hover:bg-transparent">
								<TableCell
									colSpan={4}
									className="px-4 py-12 text-center text-sm text-slate-400"
								>
									<Translate text={localizationConstants.calcSkallKravEmpty} />
								</TableCell>
							</TableRow>
						) : (
							docs.map((doc) => (
								<TableRow
									key={doc.id}
									className="group border-b border-slate-200 hover:bg-slate-50/75 transition-colors"
								>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-900 font-normal tabular-nums">
										{doc.datum}
									</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-900 font-normal">
										{doc.typ}
									</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3">
										<div className="flex items-center gap-3">
											<PdfFileIcon className="h-10 w-8 shrink-0" />
											<span className="text-sm font-normal text-slate-900 truncate max-w-xs">{doc.filename}</span>
										</div>
									</TableCell>
									<TableCell
										className="whitespace-nowrap px-3 py-3.5 text-right"
										onClick={(e) => e.stopPropagation()}
									>
										<div className="flex items-center justify-end gap-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() => handleViewFile(doc)}
												className="h-8 cursor-pointer border-slate-200 bg-white px-3 text-xs font-normal text-slate-900 hover:bg-slate-50 shadow-none"
											>
												<Translate text={localizationConstants.calcSkallKravViewFile} />
											</Button>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 cursor-pointer rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900"
														aria-label={t(localizationConstants.actionsAriaLabel)}
													>
														<MoreVertical size={16} aria-hidden />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-36 bg-white">
													<DropdownMenuItem
														className="cursor-pointer gap-2 text-sm text-slate-900 focus:text-slate-900 focus:bg-slate-100"
														onClick={() => handleViewFile(doc)}
													>
														<Eye size={14} className="text-slate-900" aria-hidden />
														<Translate text={localizationConstants.calcAPrisOpen} />
													</DropdownMenuItem>
													<DropdownMenuItem
														className="cursor-pointer gap-2 text-sm text-slate-900 focus:text-slate-900 focus:bg-slate-100"
														onClick={() => setDeleteTarget(doc)}
													>
														<Trash2 size={14} className="text-slate-900" aria-hidden />
														<Translate text={localizationConstants.deleteLabel} />
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Upload Section Card */}
			<Card className="mx-5 mb-4 mt-2">
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-5 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-900">
						<div className="flex h-6 w-6 shrink-0 items-center justify-center">
							<Upload size={18} strokeWidth={2} className="text-slate-700" aria-hidden />
						</div>
						<Translate text={localizationConstants.calcSkallKravUploadTitle} />
					</CardTitle>
				</CardHeader>

				<CardContent className="px-5 py-2">
					<p className="mb-1.5 text-sm font-medium text-slate-900">
						<Translate text={localizationConstants.calcSkallKravUploadLabel} />
					</p>

					<div className="flex w-full items-center gap-3">
						<div className="flex flex-1 min-w-0 items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 bg-white">
							<Button
								type="button"
								variant="secondary"
								size="sm"
								onClick={() => fileInputRef.current?.click()}
								className="h-7 cursor-pointer rounded bg-slate-100 px-3 text-sm font-normal text-slate-900 hover:bg-slate-200 shadow-none shrink-0"
							>
								<Translate text={localizationConstants.uploadButton} />
							</Button>
							<span className="text-sm text-slate-500 truncate flex-1">
								{selectedFile ? selectedFile.name : t(localizationConstants.noFileChosen)}
							</span>
							<Input
								ref={fileInputRef}
								type="file"
								accept=".png,.jpg,.jpeg,.pdf"
								className="hidden"
								onChange={handleFileChange}
							/>
						</div>

						<Button
							size="sm"
							onClick={() => void handleUpload()}
							disabled={!selectedFile || isUploading}
							className="h-9 cursor-pointer gap-2 bg-neutral-950 px-5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 shadow-none shrink-0"
						>
							{isUploading ? (
								<Loader2 size={14} className="animate-spin text-white" aria-hidden />
							) : null}
							<Translate text={localizationConstants.add} />
						</Button>
					</div>

					<p className="mt-1.5 text-xs text-slate-400">
						<Translate text={localizationConstants.calcSkallKravFileTypes} />
					</p>
				</CardContent>
			</Card>

			{/* Delete Confirmation Alert Dialog */}
			<AlertDialog
				open={!!deleteTarget}
				onOpenChange={(open) => {
					if (!open) setDeleteTarget(null);
				}}
			>
				<AlertDialogContent className="bg-white">
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t(localizationConstants.deleteConfirmationTitle)}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t(localizationConstants.deleteConfirmationDescription)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="cursor-pointer">
							{t(localizationConstants.cancel)}
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (deleteTarget) {
									void handleDelete(deleteTarget.id);
								}
							}}
							className="cursor-pointer bg-neutral-950 text-white hover:bg-neutral-800"
						>
							{t(localizationConstants.deleteLabel)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
