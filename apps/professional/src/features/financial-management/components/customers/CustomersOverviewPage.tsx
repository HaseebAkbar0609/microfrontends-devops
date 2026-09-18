"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { customerOverviewRepository } from "../../utils/customerOverviewRepository";
import { CUSTOMER_CREATE_ROUTE } from "../../constants/customerOverview.constants";
import type { CustomerStatus, CustomerOverviewItem } from "../../types/customers.types";
import { CustomersToolbar } from "./CustomersToolbar";
import { CustomersTable } from "./CustomersTable";

export function CustomersOverviewPage() {
	const router = useRouter();

	const [customers, setCustomers] = useState<CustomerOverviewItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<CustomerStatus | "all">("all");

	useEffect(() => {
		const data = customerOverviewRepository.getAll();
		setCustomers(data);
		setIsLoading(false);
	}, []);

	const filteredCustomers = useMemo(() => {
		return customers.filter((item) => {
			if (searchQuery.trim()) {
				const query = searchQuery.toLowerCase();
				const matchName = item.name.toLowerCase().includes(query);
				const matchNo = item.customerNo.toLowerCase().includes(query);
				const matchOrg = item.orgNo.toLowerCase().includes(query);
				const matchCity = item.city.toLowerCase().includes(query);
				const matchEmail = item.email.toLowerCase().includes(query);
				const matchAddress = item.address.toLowerCase().includes(query);
				if (!matchName && !matchNo && !matchOrg && !matchCity && !matchEmail && !matchAddress) {
					return false;
				}
			}
			if (statusFilter !== "all" && item.status !== statusFilter) {
				return false;
			}
			return true;
		});
	}, [customers, searchQuery, statusFilter]);

	return (
		<div className="p-6 w-full space-y-6">
			{/* Top Tab matching Figma Image 2: Kundlista */}
			<div className="border-b border-slate-200">
				<div className="inline-flex items-center gap-2 border-b-2 border-slate-900 pb-3 px-1 text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.customerListTab} />
				</div>
			</div>

			{/* Toolbar with Search, Filter, and Action buttons */}
			<CustomersToolbar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				statusFilter={statusFilter}
				onStatusFilterChange={setStatusFilter}
				onRegisterNew={() => router.push(CUSTOMER_CREATE_ROUTE)}
			/>

			{/* Main Table matching Figma Image 2 */}
			<div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
				<CustomersTable
					items={filteredCustomers}
					isLoading={isLoading}
					onView={(id) => router.push(`${CUSTOMER_CREATE_ROUTE}?id=${id}`)}
				/>
			</div>
		</div>
	);
}

export default CustomersOverviewPage;
