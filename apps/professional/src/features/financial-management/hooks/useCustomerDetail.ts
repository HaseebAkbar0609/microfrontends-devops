import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import type {
	CustomerDetailData,
	CustomerDetailTab,
} from "../types/customerDetail.types";
import {
	CUSTOMER_OVERVIEW_BASE_ROUTE,
} from "../constants/customerOverview.constants";
import { customerDetailRepository } from "../utils/customerDetailRepository";
import { customerOverviewRepository } from "../utils/customerOverviewRepository";

export function useCustomerDetail(id: string) {
	const router = useRouter();
	const { t } = useTranslation();
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



	const updateCustomer = useCallback(
		(updates: Partial<CustomerDetailData>) => {
			if (!customer) return;
			const updatedCustomer: CustomerDetailData = { ...customer, ...updates };
			setCustomer(updatedCustomer);
			customerDetailRepository.save(updatedCustomer);

			// Also sync overview repository if primary fields changed
			customerOverviewRepository.update(customer.id, {
				name: updatedCustomer.name,
				orgNo: updatedCustomer.orgNo,
				address: updatedCustomer.visitingAddress,
				postNr: updatedCustomer.visitingPostalCode,
				city: updatedCustomer.visitingCity,
				phone: updatedCustomer.phone,
				email: updatedCustomer.email,
			});

			showToast("success", t(localizationConstants.customerDetailCardSaved));
		},
		[customer, t],
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
		updateCustomer,
		handleDeleteContactPerson,
		handleDeleteDocument,
	};
}
