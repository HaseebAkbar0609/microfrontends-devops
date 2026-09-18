import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type {
	CustomerDetailData,
	CustomerDetailTab,
} from "../types/customerDetail.types";
import {
	CUSTOMER_OVERVIEW_BASE_ROUTE,
	CUSTOMER_CREATE_ROUTE,
} from "../constants/customerOverview.constants";
import { customerDetailRepository } from "../utils/customerDetailRepository";

export function useCustomerDetail(id: string) {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<CustomerDetailTab>("basic");
	const [customer, setCustomer] = useState<CustomerDetailData | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (!id) return;
		setIsLoading(true);
		const data = customerDetailRepository.getById(id);
		setCustomer(data ?? null);
		setIsLoading(false);
	}, [id]);

	const handleBack = useCallback(() => {
		router.push(CUSTOMER_OVERVIEW_BASE_ROUTE);
	}, [router]);

	const handleEditSection = useCallback(
		(step: number) => {
			if (!id) return;
			router.push(`${CUSTOMER_CREATE_ROUTE}?id=${encodeURIComponent(id)}&step=${step}`);
		},
		[id, router],
	);

	const handleDeleteContactPerson = useCallback(
		(personId: string) => {
			if (!customer) return;
			const updatedPersons = customer.contactPersons.filter((p) => p.id !== personId);
			const updatedCustomer = { ...customer, contactPersons: updatedPersons };
			setCustomer(updatedCustomer);
			customerDetailRepository.save(updatedCustomer);
		},
		[customer],
	);

	const handleDeleteDocument = useCallback(
		(docId: string) => {
			if (!customer) return;
			const updatedDocs = customer.documents.filter((d) => d.id !== docId);
			const updatedCustomer = { ...customer, documents: updatedDocs };
			setCustomer(updatedCustomer);
			customerDetailRepository.save(updatedCustomer);
		},
		[customer],
	);

	return {
		customer,
		isLoading,
		activeTab,
		setActiveTab,
		handleBack,
		handleEditSection,
		handleDeleteContactPerson,
		handleDeleteDocument,
	};
}
