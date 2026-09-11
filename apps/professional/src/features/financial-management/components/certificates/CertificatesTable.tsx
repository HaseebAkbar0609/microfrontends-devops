"use client";

import React from "react";
import { ArrowUpDown, Plus } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CertificateItem } from "../../types/certificates.types";
import { CertificatesTableRow } from "./CertificatesTableRow";
import { CertificatesTablePagination } from "./CertificatesTablePagination";

interface CertificatesTableProps {
	items: CertificateItem[];
	totalCount: number;
	currentPage: number;
	pageSize: number;
	totalPages: number;
	sortBy: keyof CertificateItem;
	sortOrder: "asc" | "desc";
	onSort: (col: keyof CertificateItem) => void;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	onView: (item: CertificateItem) => void;
	onEdit: (item: CertificateItem) => void;
	onArchive: (item: CertificateItem) => void;
	onDelete: (item: CertificateItem) => void;
	onCreateClick: () => void;
}

export function CertificatesTable({
	items,
	totalCount,
	currentPage,
	pageSize,
	totalPages,
	sortBy: _sortBy,
	sortOrder: _sortOrder,
	onSort,
	onPageChange,
	onPageSizeChange,
	onView,
	onEdit,
	onArchive,
	onDelete,
	onCreateClick,
}: CertificatesTableProps) {
	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
			{/* Table Wrapper with horizontal scroll */}
			<div className="overflow-x-auto min-h-[300px]">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="border-b border-slate-200 bg-white text-xs font-semibold text-slate-500 uppercase tracking-wider">
							{/* ID */}
							<th
								onClick={() => onSort("id")}
								className="px-6 py-3.5 cursor-pointer select-none hover:text-slate-800 transition-colors"
							>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.colCertId} />
									<ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
								</div>
							</th>

							{/* Objekt */}
							<th
								onClick={() => onSort("objectId")}
								className="px-6 py-3.5 cursor-pointer select-none hover:text-slate-800 transition-colors"
							>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.colCertObject} />
									<ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
								</div>
							</th>

							{/* Benämning */}
							<th
								onClick={() => onSort("name")}
								className="px-6 py-3.5 cursor-pointer select-none hover:text-slate-800 transition-colors"
							>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.colCertName} />
									<ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
								</div>
							</th>

							{/* Attest ansvarig */}
							<th
								onClick={() => onSort("responsiblePerson")}
								className="px-6 py-3.5 cursor-pointer select-none hover:text-slate-800 transition-colors"
							>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.colCertResponsible} />
									<ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
								</div>
							</th>

							{/* Masterattest */}
							<th
								onClick={() => onSort("masterApprover")}
								className="px-6 py-3.5 cursor-pointer select-none hover:text-slate-800 transition-colors"
							>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.colCertMaster} />
									<ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
								</div>
							</th>

							{/* Header Action / Add (+) Icon */}
							<th className="px-6 py-3.5 text-right w-14">
								<button
									type="button"
									onClick={onCreateClick}
									className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 cursor-pointer"
									title="Create attest"
								>
									<Plus className="w-4 h-4 ml-auto" />
								</button>
							</th>
						</tr>
					</thead>
					<tbody>
						{items.length === 0 ? (
							<tr>
								<td colSpan={6} className="px-6 py-16 text-center text-slate-500">
									<div className="flex flex-col items-center justify-center">
										<p className="text-base font-medium text-slate-700 mb-1">
											<Translate text={localizationConstants.emptyCertificatesTitle} />
										</p>
										<p className="text-xs text-slate-400">
											<Translate text={localizationConstants.emptyCertificatesDesc} />
										</p>
									</div>
								</td>
							</tr>
						) : (
							items.map((item) => (
								<CertificatesTableRow
									key={item.id}
									item={item}
									onView={onView}
									onEdit={onEdit}
									onArchive={onArchive}
									onDelete={onDelete}
								/>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination Controls */}
			<CertificatesTablePagination
				currentPage={currentPage}
				pageSize={pageSize}
				totalCount={totalCount}
				totalPages={totalPages}
				onPageChange={onPageChange}
				onPageSizeChange={onPageSizeChange}
			/>
		</div>
	);
}
