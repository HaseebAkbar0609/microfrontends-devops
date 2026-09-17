"use client";

import { TablePagination } from "@/components/table/TablePagination";
import { ProjectRowsToolbar, type ProjectRowsFilterOption } from "../../../../components/ProjectRowsToolbar";
import type { SupplierAtaStatus } from "../../types";
import type { AtaSupplier } from "../types";
import { SupplierSelectBar } from "./SupplierSelectBar";

export interface SupplierAtaShellProps {
	controls: {
		search: string;
		setSearch: (value: string) => void;
		filter: SupplierAtaStatus | null;
		setFilter: (value: string | null) => void;
		pageSize: number;
		setPage: (page: number) => void;
		setPageSize: (size: number) => void;
	};
	filterOptions: ProjectRowsFilterOption[];
	suppliers: AtaSupplier[];
	selectedId: string | null;
	onSelect: (supplierId: string | null) => void;
	summary: { total: number; count: number };
	page: { currentPage: number; totalPages: number };
	children: React.ReactNode;
}

/**
 * What both UE views share: Sök, Filter and Skriv ut (suppliers send ÄTAs, so
 * there is no create), the supplier select and summary, the table, and paging.
 */
export function SupplierAtaShell({ controls, filterOptions, suppliers, selectedId, onSelect, summary, page, children }: SupplierAtaShellProps) {
	return (
		<div className="flex flex-col gap-4">
			<ProjectRowsToolbar
				search={controls.search}
				onSearchChange={controls.setSearch}
				filter={controls.filter}
				onFilterChange={controls.setFilter}
				filterOptions={filterOptions}
			/>
			<SupplierSelectBar suppliers={suppliers} selectedId={selectedId} onSelect={onSelect} summary={summary} />
			{children}
			<TablePagination
				currentPage={page.currentPage}
				totalPages={page.totalPages}
				pageSize={controls.pageSize}
				onPageChange={controls.setPage}
				onPageSizeChange={controls.setPageSize}
				className="justify-center sm:justify-center"
			/>
		</div>
	);
}

export default SupplierAtaShell;
