"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { customerOverviewRepository } from "../../utils/customerOverviewRepository";
import { CUSTOMER_CREATE_ROUTE } from "../../constants/customerOverview.constants";
import type { CustomerStatus, CustomerOverviewItem } from "../../types/customers.types";
import { CustomersToolbar } from "./CustomersToolbar";
import { CustomersTable } from "./CustomersTable";

export function CustomersOverviewPage() {
	const router = useRouter();
	const t = useTranslate();

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
				if (!matchName && !matchNo && !matchOrg && !matchCity && !matchEmail) {
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
			{/* Top Bar / Subheader matching Economy modules */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
				<CustomersToolbar
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					statusFilter={statusFilter}
					onStatusFilterChange={setStatusFilter}
				/>

				{/* + Registrera nytt / Skapa kund button */}
				<Button
					type="button"
					onClick={() => router.push(CUSTOMER_CREATE_ROUTE)}
					className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold gap-1.5 rounded-lg cursor-pointer transition-colors shrink-0 shadow-2xs"
				>
					<Plus className="h-4 w-4" />
					<span>{t(localizationConstants.customerRegisterRegisterNew)}</span>
				</Button>
			</div>

			{/* Main Table Card */}
			<div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
				<CustomersTable items={filteredCustomers} isLoading={isLoading} />
			</div>
		</div>
	);
}

export default CustomersOverviewPage;
