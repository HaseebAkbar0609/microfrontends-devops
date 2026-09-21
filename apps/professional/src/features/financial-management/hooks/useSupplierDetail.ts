"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	SupplierDetailData,
	SupplierDetailTab,
} from "../types/supplierDetail.types";
import type {
	SupplierContactPerson,
	SupplierAttachedDocument,
} from "../types/createSupplier.types";
import { SUPPLIER_OVERVIEW_BASE_ROUTE } from "../constants/supplierOverview.constants";
import { supplierDetailRepository } from "../utils/supplierDetailRepository";
import { supplierOverviewRepository } from "../utils/supplierOverviewRepository";

export function useSupplierDetail(id: string) {
	const router = useRouter();
	const t = useTranslate();
	const [activeTab, setActiveTab] = useState<SupplierDetailTab>("basic");
	const [supplier, setSupplier] = useState<SupplierDetailData | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (!id) return;
		setIsLoading(true);
		const data = supplierDetailRepository.getById(id);
		setSupplier(data ?? null);
		setIsLoading(false);
	}, [id]);

	const handleBack = useCallback(() => {
		router.push(SUPPLIER_OVERVIEW_BASE_ROUTE);
	}, [router]);

	const updateSupplier = useCallback(
		(updates: Partial<SupplierDetailData>) => {
			if (!supplier) return;
			const updatedSupplier: SupplierDetailData = { ...supplier, ...updates };
			setSupplier(updatedSupplier);
			supplierDetailRepository.save(updatedSupplier);

			// Also sync overview repository if primary fields changed
			supplierOverviewRepository.update(supplier.id, {
				name: updatedSupplier.name,
				orgNo: updatedSupplier.orgNo,
				address: updatedSupplier.visitingAddress,
				postNr: updatedSupplier.visitingPostalCode,
				city: updatedSupplier.visitingCity,
				phone: updatedSupplier.phone,
				email: updatedSupplier.email,
				status: (updatedSupplier.status as "active" | "inactive" | "prospect") || "active",
			});

			showToast("success", t(localizationConstants.supplierDetailCardSaved));
		},
		[supplier, t],
	);

	const handleDeleteContactPerson = useCallback(
		(personId: string) => {
			if (!supplier) return;
			const updatedPersons = supplier.contactPersons.filter((p) => p.id !== personId);
			const updatedSupplier = { ...supplier, contactPersons: updatedPersons };
			setSupplier(updatedSupplier);
			supplierDetailRepository.save(updatedSupplier);
		},
		[supplier],
	);

	const handleAddContactPerson = useCallback(
		(person: SupplierContactPerson) => {
			if (!supplier) return;
			const updatedPersons = [...supplier.contactPersons, person];
			const updatedSupplier = { ...supplier, contactPersons: updatedPersons };
			setSupplier(updatedSupplier);
			supplierDetailRepository.save(updatedSupplier);
		},
		[supplier],
	);

	const handleDeleteDocument = useCallback(
		(docId: string) => {
			if (!supplier) return;
			const updatedDocs = supplier.documents.filter((d) => d.id !== docId);
			const updatedSupplier = { ...supplier, documents: updatedDocs };
			setSupplier(updatedSupplier);
			supplierDetailRepository.save(updatedSupplier);
		},
		[supplier],
	);

	const handleAddDocument = useCallback(
		(doc: SupplierAttachedDocument) => {
			if (!supplier) return;
			const updatedDocs = [...supplier.documents, doc];
			const updatedSupplier = { ...supplier, documents: updatedDocs };
			setSupplier(updatedSupplier);
			supplierDetailRepository.save(updatedSupplier);
		},
		[supplier],
	);

	return {
		supplier,
		isLoading,
		activeTab,
		setActiveTab,
		handleBack,
		updateSupplier,
		handleDeleteContactPerson,
		handleAddContactPerson,
		handleDeleteDocument,
		handleAddDocument,
	};
}
