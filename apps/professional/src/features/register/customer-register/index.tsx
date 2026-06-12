"use client";

import { Download, Eye, MoreVertical, Plus, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { BreadcrumbItem } from "@/types/common";

type CustomerRow = {
	id: string;
	customerNo: string;
	customer: string;
	regNo: string;
	address: string;
	postcode: string;
	city: string;
	country: string;
	phone: string;
	email: string;
	status: string;
};

const BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/dashboard" },
	{ label: localizationConstants.moduleItem, href: "/module/financial-management" },
	{ label: localizationConstants.invoice, href: "/module/financial-management/invoice" },
	{ label: localizationConstants.register },
];

const CUSTOMERS: CustomerRow[] = [];

const CUSTOMER_REGISTER_COLUMNS = [
	{ key: "customerNo", label: localizationConstants.customerRegisterCustomerNo },
	{ key: "customer", label: localizationConstants.customerRegisterCustomer },
	{ key: "regNo", label: localizationConstants.customerRegisterRegNo },
	{ key: "address", label: localizationConstants.customerRegisterAddress },
	{ key: "postcode", label: localizationConstants.customerRegisterPostcode },
	{ key: "city", label: localizationConstants.customerRegisterCity },
	{ key: "country", label: localizationConstants.customerRegisterCountry },
	{ key: "phone", label: localizationConstants.customerRegisterPhone },
	{ key: "email", label: localizationConstants.customerRegisterEmail },
] as const;

export default function CustomerRegisterFeature() {
	const { t } = useTranslation();

	return (
		<div className="flex flex-1 flex-col">
			<PageHeader
				title={localizationConstants.register}
				breadcrumbs={BREADCRUMBS}
			/>

			<div className="border-b border-slate-200 px-5 py-3">
				<label
					htmlFor="register-type"
					className="mb-2 block text-sm font-medium text-slate-900"
				>
					<Translate text={localizationConstants.register} />
				</label>
				<select
					id="register-type"
					className="h-9 w-full max-w-xs rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-500 shadow-xs outline-none focus:border-slate-400"
					defaultValue="customer"
				>
					<option value="customer">
						{t(localizationConstants.customerRegisterCustomer)}
					</option>
				</select>
				<div className="mt-4 text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.customerRegisterList} />
				</div>
			</div>

			<div className="p-5">
				<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
					<div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
						<div className="relative w-full max-w-xs">
							<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<Input
								className="h-9 pl-9"
								placeholder={t(localizationConstants.customerRegisterSearch)}
							/>
						</div>
						<Button variant="outline" size="sm" type="button">
							<Translate text={localizationConstants.customerRegisterFilter} />
						</Button>
					</div>
					<div className="flex flex-wrap items-center gap-3">
						<Button variant="outline" size="sm" type="button">
							<Download className="h-4 w-4" />
							<Translate text={localizationConstants.customerRegisterImportCustomer} />
						</Button>
						<Button variant="primary" size="sm" type="button">
							<Plus className="h-4 w-4" />
							<Translate text={localizationConstants.customerRegisterRegisterNew} />
						</Button>
					</div>
				</div>

				<div className="overflow-hidden rounded-md border border-slate-200">
					<div className="max-h-[440px] overflow-auto">
						<Table>
							<TableHeader>
								<TableRow>
									{CUSTOMER_REGISTER_COLUMNS.map((column) => (
										<TableHead
											key={column.key}
											className="h-10 px-4 text-xs font-medium text-slate-500"
										>
											<span className="inline-flex items-center gap-1">
												<Translate text={column.label} />
												<span className="text-slate-400">↓↑</span>
											</span>
										</TableHead>
									))}
									<TableHead className="h-10 px-4 text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.customerRegisterStatus} />
									</TableHead>
									<TableHead className="w-10" />
									<TableHead className="w-10" />
								</TableRow>
							</TableHeader>
							<TableBody>
								{CUSTOMERS.map((customer) => (
									<TableRow key={customer.id}>
										{CUSTOMER_REGISTER_COLUMNS.map((column) => (
											<TableCell
												key={column.key}
												className="px-4 py-3 text-sm text-slate-900"
											>
												{customer[column.key]}
											</TableCell>
										))}
										<TableCell className="px-4 py-3">
											<Badge
												variant="success"
												className="rounded px-2 py-0 text-xs"
											>
												{customer.status}
											</Badge>
										</TableCell>
										<TableCell className="px-3 py-3">
											<button
												type="button"
												className="grid h-8 w-8 place-items-center rounded-md text-slate-700 hover:bg-slate-100"
												aria-label="View customer"
											>
												<Eye className="h-4 w-4" />
											</button>
										</TableCell>
										<TableCell className="px-3 py-3">
											<button
												type="button"
												className="grid h-8 w-8 place-items-center rounded-md text-slate-700 hover:bg-slate-100"
												aria-label="Customer actions"
											>
												<MoreVertical className="h-4 w-4" />
											</button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}
