"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCertificates } from "../../hooks/useCertificates";
import {
	CERTIFICATES_BASE_ROUTE,
	CREATE_CERTIFICATE_ROUTE,
} from "../../constants/certificates.constants";
import { CertificatesToolbar } from "./CertificatesToolbar";
import { CertificatesTable } from "./CertificatesTable";
import { CertificateDeleteDialog } from "./CertificateDeleteDialog";
import type { CertificateItem } from "../../types/certificates.types";

export function CertificatesOverviewPage() {
	const router = useRouter();
	const {
		items,
		totalCount,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		searchQuery,
		setSearchQuery,
		categoryFilter,
		setCategoryFilter,
		statusFilter,
		setStatusFilter,
		sortBy,
		sortOrder,
		handleSort,
		deleteCertificate,
		archiveCertificate,
		resetSeedData,
	} = useCertificates();

	const [certToDelete, setCertToDelete] = useState<CertificateItem | null>(null);

	const handleView = (item: CertificateItem) => {
		router.push(`${CERTIFICATES_BASE_ROUTE}/${item.id}`);
	};

	const handleEdit = (item: CertificateItem) => {
		router.push(`${CREATE_CERTIFICATE_ROUTE}?id=${item.id}`);
	};

	const handleCreate = () => {
		router.push(CREATE_CERTIFICATE_ROUTE);
	};

	return (
		<div className="p-6 w-full space-y-6">
			{/* Toolbar (Search, Filter, Create CTA) */}
			<CertificatesToolbar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				categoryFilter={categoryFilter}
				onCategoryFilterChange={setCategoryFilter}
				statusFilter={statusFilter}
				onStatusFilterChange={setStatusFilter}
				onCreateClick={handleCreate}
				onResetSeedData={resetSeedData}
			/>

			{/* Main Table */}
			<CertificatesTable
				items={items}
				totalCount={totalCount}
				currentPage={currentPage}
				pageSize={pageSize}
				totalPages={totalPages}
				sortBy={sortBy}
				sortOrder={sortOrder}
				onSort={handleSort}
				onPageChange={setCurrentPage}
				onPageSizeChange={setPageSize}
				onView={handleView}
				onEdit={handleEdit}
				onArchive={(item) => archiveCertificate(item.id)}
				onDelete={(item) => setCertToDelete(item)}
				onCreateClick={handleCreate}
			/>

			{/* Delete Confirmation Dialog */}
			<CertificateDeleteDialog
				item={certToDelete}
				isOpen={certToDelete !== null}
				onClose={() => setCertToDelete(null)}
				onConfirm={(id) => deleteCertificate(id)}
			/>
		</div>
	);
}

export default CertificatesOverviewPage;
