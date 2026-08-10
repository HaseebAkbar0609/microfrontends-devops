"use client";

import { useRef, useState, useMemo } from "react";
import { ChevronDown, Eye, MoreVertical, Search, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { renderSortIcon } from "@/utils/renderSortIcon";

type SkallKravDoc = {
	id: string;
	datum: string;
	typ: string;
	filename: string;
};

type SortField = keyof Pick<SkallKravDoc, "datum" | "typ" | "filename">;

const DUMMY_DOCS: SkallKravDoc[] = [
	{ id: "skk-1", datum: "2025-09-01", typ: "Referenslista", filename: "filename.pdf" },
	{ id: "skk-2", datum: "2025-09-01", typ: "SKV 4820", filename: "filename.pdf" },
	{ id: "skk-3", datum: "2025-09-01", typ: "Försäkringsbrev", filename: "filename.pdf" },
];

const ALL_TYPES = [...new Set(DUMMY_DOCS.map((d) => d.typ))];

const TH_SORTABLE =
	"cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800";

function PdfBadge({ filename }: { filename: string }) {
	return (
		<div className="flex items-center gap-2">
			<span className="inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-bold leading-none bg-red-600 text-white">
				PDF
			</span>
			<span className="text-sm text-slate-700">{filename}</span>
		</div>
	);
}

export function CalculationSkallKravContent() {
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [search, setSearch] = useState("");
	const [filterTyp, setFilterTyp] = useState<string | null>(null);
	const [docs, setDocs] = useState<SkallKravDoc[]>(DUMMY_DOCS);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const { sortField, sortDir, toggleSort } = useTableSort<SortField>();

	const filtered = useMemo(() => {
		let result = docs;
		if (filterTyp) result = result.filter((d) => d.typ === filterTyp);
		const q = search.toLowerCase();
		if (!q) return result;
		return result.filter(
			(d) =>
				d.typ.toLowerCase().includes(q) ||
				d.filename.toLowerCase().includes(q) ||
				d.datum.includes(q),
		);
	}, [docs, search, filterTyp]);

	const sorted = useMemo(
		() =>
			sortItems(
				filtered,
				sortField,
				sortDir,
				(item, field) => item[field as keyof SkallKravDoc],
			),
		[filtered, sortField, sortDir],
	);

	function handleDelete(id: string) {
		setDocs((prev) => prev.filter((d) => d.id !== id));
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		setSelectedFile(e.target.files?.[0] ?? null);
	}

	function handleAdd() {
		if (!selectedFile) return;
		const newDoc: SkallKravDoc = {
			id: `skk-${Date.now()}`,
			datum: new Date().toISOString().slice(0, 10),
			typ: "Uppladdad fil",
			filename: selectedFile.name,
		};
		setDocs((prev) => [...prev, newDoc]);
		setSelectedFile(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	const activeFilterLabel =
		filterTyp ?? t(localizationConstants.filter);

	return (
		<div className="flex flex-1 flex-col bg-white">
			{/* Toolbar */}
			<div className="flex items-center gap-2 px-5 py-3">
				<div className="relative w-72">
					<Search
						size={16}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
						aria-hidden
					/>
					<Input
						placeholder={t(localizationConstants.search)}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="h-10 rounded-none border-0 border-b border-slate-200 pl-8 text-sm shadow-none focus-visible:ring-0"
					/>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="h-9 cursor-pointer gap-1.5 border-slate-200 text-sm font-medium text-slate-700"
						>
							{activeFilterLabel}
							<ChevronDown size={14} aria-hidden />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-48">
						<DropdownMenuItem
							className="cursor-pointer text-sm"
							onClick={() => setFilterTyp(null)}
						>
							{t(localizationConstants.adminUsersFilterAll)}
						</DropdownMenuItem>
						{ALL_TYPES.map((typ) => (
							<DropdownMenuItem
								key={typ}
								className="cursor-pointer text-sm"
								onClick={() => setFilterTyp(typ)}
							>
								{typ}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Document table */}
			<div className="px-5 pb-2">
				<div className="b2b-table-scroll overflow-x-auto">
					<table className="min-w-max w-full text-sm">
						<thead>
							<tr className="border-b border-slate-200 bg-white">
								<th
									scope="col"
									className={TH_SORTABLE}
									onClick={() => toggleSort("datum")}
								>
									<span className="flex items-center gap-1">
										{t(localizationConstants.date)}
										{renderSortIcon("datum", sortField, sortDir)}
									</span>
								</th>
								<th
									scope="col"
									className={TH_SORTABLE}
									onClick={() => toggleSort("typ")}
								>
									<span className="flex items-center gap-1">
										{t(localizationConstants.calcProType)}
										{renderSortIcon("typ", sortField, sortDir)}
									</span>
								</th>
								<th
									scope="col"
									className={TH_SORTABLE}
									onClick={() => toggleSort("filename")}
								>
									<span className="flex items-center gap-1">
										PDF
										{renderSortIcon("filename", sortField, sortDir)}
									</span>
								</th>
								<th scope="col" className="px-4 py-3" />
							</tr>
						</thead>
						<tbody>
							{sorted.length === 0 ? (
								<tr>
									<td
										colSpan={4}
										className="px-4 py-10 text-center text-sm text-slate-400"
									>
										{t(localizationConstants.calcSkallKravEmpty)}
									</td>
								</tr>
							) : (
								sorted.map((doc) => (
									<tr
										key={doc.id}
										className="group border-b border-slate-200 last:border-0 hover:bg-slate-50"
									>
										<td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-600">
											{doc.datum}
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-slate-800">
											{doc.typ}
										</td>
										<td className="whitespace-nowrap px-4 py-3">
											<PdfBadge filename={doc.filename} />
										</td>
										<td
											className="whitespace-nowrap px-4 py-3"
											onClick={(e) => e.stopPropagation()}
										>
											<div className="flex items-center gap-2">
												<Button
													size="sm"
													variant="outline"
													className="h-8 cursor-pointer gap-1.5 border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100"
												>
													<Eye size={12} aria-hidden />
													{t(localizationConstants.calcSkallKravViewFile)}
												</Button>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<button
															type="button"
															className="cursor-pointer rounded p-1 text-slate-400 opacity-0 hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100"
															aria-label="Row actions"
														>
															<MoreVertical size={16} aria-hidden />
														</button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end" className="w-36">
														<DropdownMenuItem className="cursor-pointer gap-2 text-sm">
															<Eye size={14} aria-hidden />
															{t(localizationConstants.calcAPrisOpen)}
														</DropdownMenuItem>
														<DropdownMenuItem
															className="cursor-pointer gap-2 text-sm text-red-600 focus:text-red-600"
															onClick={() => handleDelete(doc.id)}
														>
															<Trash2 size={14} aria-hidden />
															{t(localizationConstants.confirmRemove)}
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Upload section */}
			<div className="mx-5 mb-6 mt-4 overflow-hidden rounded-md border border-slate-200">
				{/* Header */}
				<div className="flex items-center gap-2.5 border-b border-slate-200 bg-white px-5 py-4">
					<Upload size={16} className="text-slate-500" aria-hidden />
					<span className="text-sm font-semibold text-slate-800">
						<Translate text={localizationConstants.calcSkallKravUploadTitle} />
					</span>
				</div>

				{/* Content */}
				<div className="bg-white px-5 py-5">
					<p className="mb-3 text-sm font-medium text-slate-700">
						<Translate text={localizationConstants.calcSkallKravUploadLabel} />
					</p>

					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5">
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="cursor-pointer rounded bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200"
							>
								<Translate text={localizationConstants.uploadButton} />
							</button>
							<span className="text-sm text-slate-400">
								{selectedFile ? selectedFile.name : "No file chosen"}
							</span>
							<input
								ref={fileInputRef}
								type="file"
								accept=".png,.jpg,.jpeg,.pdf"
								className="hidden"
								onChange={handleFileChange}
							/>
						</div>

						<Button
							size="sm"
							onClick={handleAdd}
							disabled={!selectedFile}
							className="h-8 cursor-pointer bg-neutral-950 px-4 text-sm text-white hover:bg-neutral-800 disabled:opacity-50"
						>
							<Translate text={localizationConstants.licensesAddAction} />
						</Button>
					</div>

					<p className="mt-3 text-xs text-slate-400">
						<Translate text={localizationConstants.calcSkallKravFileTypes} />
					</p>
				</div>
			</div>
		</div>
	);
}
