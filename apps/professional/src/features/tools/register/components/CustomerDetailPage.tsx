"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
	ArrowLeft,
	PenLine,
	Eye,
	UserPlus,
	CircleUserRound,
	File,
	ArrowUpDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/common/StarRating";
import { DataTable, type DataTableColumn } from "@/components/table/DataTable";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import type { CustomerDetail, CustomerContact } from "../types";
import { getCustomerDetailAPIAction } from "../api/customerRegister";

type TabKey = "basic" | "contact" | "assessment" | "invoice";

const TABS: { key: TabKey; labelKey: string }[] = [
	{ key: "basic", labelKey: localizationConstants.basicInfoTab },
	{ key: "contact", labelKey: localizationConstants.contactTab },
	{ key: "assessment", labelKey: localizationConstants.assessmentTab },
	{ key: "invoice", labelKey: localizationConstants.invoiceTab },
];

export function CustomerDetailPage() {
	const t = useTranslate();
	const router = useRouter();
	const params = useParams();
	const id = params.id as string;

	const [customer, setCustomer] = useState<CustomerDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<TabKey>("basic");

	const fetchCustomer = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await getCustomerDetailAPIAction(id);
			setCustomer(data);
		} catch {
			showToast("error", t(localizationConstants.genericError));
			router.push("/tools/register?tab=kund");
		} finally {
			setIsLoading(false);
		}
	}, [id, router, t]);

	useEffect(() => {
		fetchCustomer();
	}, [fetchCustomer]);

	if (isLoading || !customer) {
		return (
			<div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
				<div className="flex items-center gap-2">
					<div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
					<div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
				</div>
				<div className="h-4 w-20 animate-pulse rounded bg-slate-200 opacity-60 my-2" />
				<div className="flex gap-6 border-b border-slate-200 mb-6">
					{TABS.map((tab) => (
						<div key={tab.key} className="h-10 w-24 animate-pulse rounded bg-slate-200" />
					))}
				</div>
				<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="h-48 animate-pulse rounded-lg border border-slate-200 bg-white" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col overflow-y-auto px-3 py-6">
			{/* Back arrow + Title */}
			<div className="mb-1 flex items-center gap-2 ml-0">
				<button
					type="button"
					aria-label={t(localizationConstants.goBackToRegisterLabel)}
					onClick={() => router.push("/tools/register?tab=kund")}
					className="rounded-md p-1 hover:bg-slate-100"
				>
					<ArrowLeft className="h-5 w-5 text-slate-700" />
				</button>
				<h1 className="text-xl font-semibold text-slate-900">
					<Translate text={localizationConstants.detailTitle} />
				</h1>
			</div>

			{/* Customer number */}
			<p className="mb-4 text-sm text-slate-500 sm:ml-9">{customer.customerNo}</p>

			{/* Tabs */}
			<div className="mb-4 flex gap-4 border-b border-slate-200 sm:ml-9 sm:gap-6">
				{TABS.map((tab) => (
					<button
						key={tab.key}
						type="button"
						onClick={() => setActiveTab(tab.key)}
						className={cn(
							"whitespace-nowrap pb-1.5 font-sans text-sm font-semibold leading-none tracking-normal text-center transition-colors border-b-2 cursor-pointer",
							activeTab === tab.key
								? "border-slate-900 text-slate-900"
								: "border-transparent text-slate-500 hover:text-slate-700",
						)}
					>
						<Translate text={tab.labelKey} />
					</button>
				))}
			</div>

			{/* Tab Content */}
			{activeTab === "basic" && <BasicInfoTab customer={customer} />}
			{activeTab === "contact" && <ContactTab customer={customer} />}
			{activeTab === "assessment" && <AssessmentTab customer={customer} />}
			{activeTab === "invoice" && <InvoiceTab customer={customer} />}
		</div>
	);
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-(family-name:--font-inter) text-sm font-medium leading-5 tracking-normal text-slate-900">
				<Translate text={label} />
			</span>
			<span className="font-(family-name:--font-inter) text-sm font-normal leading-5 tracking-normal text-slate-500">
				<Translate text={value || ""} />
			</span>
		</div>
	);
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({
	icon,
	title,
	onEdit,
	children,
	className,
}: {
	icon?: React.ReactNode;
	title: string;
	onEdit?: () => void;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<Card className={cn("rounded-lg ", className)}>
			<CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 px-4 py-0 [.border-b]:pb-0 h-14 sm:px-6">
				<CardTitle className="flex items-center gap-2 font-(family-name:--font-inter) text-sm font-medium leading-6 sm:text-base [&_svg]:text-(--color-text,#09090B)" style={{ color: "var(--color-text, #09090B)" }}>
					{icon && <span className="inline-flex">{icon}</span>}
					<Translate text={title} />
				</CardTitle>
				{onEdit && (
					<button
						type="button"
						onClick={onEdit}
						className="pointer-events-auto flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-(--color-bg-secondary,#F4F4F5) px-3 py-1.5 text-xs font-medium text-(--color-text,#09090B) hover:opacity-80 sm:h-9 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
					>
						<PenLine className="h-3.5 w-3.5 pointer-events-auto sm:h-4 sm:w-4" />
						<Translate text={localizationConstants.editLabel} />
					</button>
				)}
			</CardHeader>
			<CardContent className="px-4 sm:px-6">{children}</CardContent>
		</Card>
	);
}

// ─── Basic Info Tab ───────────────────────────────────────────────────────────
function BasicInfoTab({ customer }: { customer: CustomerDetail }) {
	const handleEdit = () => {};

	return (
		<div className="flex flex-col gap-6 ml-0 sm:ml-9">
			<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
				{/* Kund */}
				<SectionCard
					icon={<UserPlus className="h-6 w-6" />}
					title={localizationConstants.customerSection}
					onEdit={handleEdit}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoRow label={localizationConstants.customerNoLabel} value={customer.customerNo} />
						<InfoRow label={localizationConstants.statusLabel} value={customer.status === "active" ? localizationConstants.activeStatus : localizationConstants.inactiveStatus} />
						<InfoRow label={localizationConstants.companyNameLabel} value={customer.companyName} />
						<InfoRow label={localizationConstants.mainCategoryLabel} value={customer.mainCategory} />
						<InfoRow label={localizationConstants.departmentLabel} value={customer.department} />
						<InfoRow label={localizationConstants.regionLabel} value={customer.region} />
						<InfoRow label={localizationConstants.orgNoLabel} value={customer.orgNo} />
						<InfoRow label={localizationConstants.vatRegNoLabel} value={customer.vatRegNo} />
					</div>
				</SectionCard>

				{/* Bank Information */}
				<SectionCard
					icon={<CircleUserRound className="h-6 w-6" />}
					title={localizationConstants.bankInfoSection}
					onEdit={handleEdit}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoRow label={localizationConstants.bankNameLabel} value={customer.bankName} />
						<InfoRow label={localizationConstants.bankAccountLabel} value={customer.bankAccount} />
						<InfoRow label={localizationConstants.bankgiroLabel} value={customer.bankgiro} />
						<InfoRow label={localizationConstants.plusgiroLabel} value={customer.plusgiro} />
						<InfoRow label={localizationConstants.ibanLabel} value={customer.iban} />
						<InfoRow label={localizationConstants.bicLabel} value={customer.bic} />
					</div>
				</SectionCard>
			</div>

			<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
				{/* Besökadress */}
				<SectionCard
					icon={<UserPlus className="h-6 w-6" />}
					title={localizationConstants.visitingAddressLabel}
					onEdit={handleEdit}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoRow label={localizationConstants.addressLabel} value={customer.visitingAddress} />
						<div className="hidden sm:block" />
						<InfoRow label={localizationConstants.postalCodeLabel} value={customer.visitingPostalCode} />
						<InfoRow label={localizationConstants.cityLabel} value={customer.visitingCity} />
					</div>
				</SectionCard>

				{/* Fakturaadress */}
				<SectionCard
					icon={<UserPlus className="h-6 w-6" />}
					title={localizationConstants.invoiceAddressLabel}
					onEdit={handleEdit}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoRow label={localizationConstants.addressLabel} value={customer.invoiceAddress} />
						<div className="hidden sm:block" />
						<InfoRow label={localizationConstants.postalCodeLabel} value={customer.invoicePostalCode} />
						<InfoRow label={localizationConstants.cityLabel} value={customer.invoiceCity} />
					</div>
				</SectionCard>
			</div>
		</div>
	);
}

// ─── Contact Tab ──────────────────────────────────────────────────────────────
function ContactTab({ customer }: { customer: CustomerDetail }) {
	const handleEdit = () => {};

	const columns: DataTableColumn<CustomerContact>[] = [
		{
			key: "firstName",
			label: localizationConstants.firstNameLabel,
			sortable: true,
			headerClassName:
				"font-sans text-sm font-medium leading-6 tracking-normal",
		},
		{
			key: "lastName",
			label: localizationConstants.lastNameLabel,
			sortable: true,
			headerClassName:
				"font-sans text-sm font-medium leading-6 tracking-normal",
		},
		{
			key: "mobile",
			label: localizationConstants.mobilePhoneLabel,
			sortable: true,
			headerClassName:
				"font-sans text-sm font-medium leading-6 tracking-normal",
		},
		{
			key: "email",
			label: localizationConstants.emailLabel,
			sortable: true,
			headerClassName:
				"font-sans text-sm font-medium leading-6 tracking-normal",
		},
		{
			key: "role",
			label: localizationConstants.roleLabel,
			sortable: true,
			headerClassName:
				"font-sans text-sm font-medium leading-6 tracking-normal",
			render: (row) => <Translate text={row.role} />,
		},
		{
			key: "personalNo",
			label: localizationConstants.personalNoLabel,
			sortable: true,
			headerClassName:
				"font-sans text-sm font-medium leading-6 tracking-normal",
		},
	];

	return (
		<div className="flex flex-col gap-6 ml-0 sm:ml-9">
			{/* Customer Contact Info */}
			<SectionCard
				icon={<UserPlus className="h-6 w-6" />}
				title={localizationConstants.customerSection}
				onEdit={handleEdit}
			>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<InfoRow label={localizationConstants.phoneLabel} value={customer.phone} />
					<InfoRow label={localizationConstants.emailLabel} value={customer.email} />
					<InfoRow label={localizationConstants.websiteLabel} value={customer.website} />
					<InfoRow label={localizationConstants.notesLabel} value={customer.contactNotes} />
				</div>
			</SectionCard>

			{/* Contact Persons Table */}
			<SectionCard
				icon={<UserPlus className="h-6 w-6" />}
				title={localizationConstants.contactPersonsSection}
				onEdit={handleEdit}
			>
				<DataTable
					data={customer.contacts}
					columns={columns}
					rowKey={(row) => row.id}
					loading={false}
				/>
			</SectionCard>
		</div>
	);
}

// ─── Assessment Tab ───────────────────────────────────────────────────────────
function AssessmentTab({ customer }: { customer: CustomerDetail }) {
	const handleEdit = () => {};

	const handleViewDocument = (doc: { name: string; url: string }) => {
		if (doc.url) {
			window.open(doc.url, "_blank");
		} else {
			showToast("info", localizationConstants.documentNotAvailable);
		}
	};

	const ratingRows = [
		{ label: localizationConstants.economyLabel, value: customer.ratings.economy },
		{ label: localizationConstants.environmentLabel, value: customer.ratings.environment },
		{ label: localizationConstants.qualityLabel, value: customer.ratings.quality },
		{ label: localizationConstants.collaborationLabel, value: customer.ratings.collaboration },
		{ label: localizationConstants.punctualityLabel, value: customer.ratings.punctuality },
		{ label: localizationConstants.serviceLabel, value: customer.ratings.service },
	];

	return (
		<div className="flex flex-col gap-6 ml-0 sm:ml-9">
			{/* Bedömning */}
			<SectionCard
				title={localizationConstants.assessmentSection}
				onEdit={handleEdit}
			>
				<div className="flex flex-col gap-3">
					{ratingRows.map((row) => (
						<div key={row.label} className="flex items-center">
							<span className="w-1/2 shrink-0 font-(family-name:--font-inter) text-sm font-medium leading-5 text-slate-700">
								<Translate text={row.label} />
							</span>
							<StarRating value={row.value} onChange={() => {}} size={28} className="ml-auto xl:ml-0" />
						</div>
					))}
				</div>
			</SectionCard>

			{/* Dokument */}
			<SectionCard
				title={localizationConstants.documentSection}
				onEdit={handleEdit}
			>
				{customer.documents.length > 0 ? (
					<div className="overflow-x-auto rounded border border-slate-200">
						<table className="w-full min-w-125 table-fixed border-collapse">
							<colgroup>
								<col className="w-[25%]" />
								<col className="w-[50%]" />
								<col className="w-[15%]" />
								<col className="w-[10%]" />
							</colgroup>
							<thead>
								<tr className="h-11 border-b border-slate-200">
									<th className="font-sans px-4 text-left text-sm font-medium leading-6 tracking-normal text-slate-500">
										<div className="flex items-center gap-1">
											<Translate text={localizationConstants.columnDate} />
											<ArrowUpDown className="h-3 w-3 text-slate-400" />
										</div>
									</th>
									<th className="font-sans px-4 text-left text-sm font-medium leading-6 tracking-normal text-slate-500">
										<div className="flex items-center gap-1">
											<Translate text={localizationConstants.columnDocumentName} />
											<ArrowUpDown className="h-3 w-3 text-slate-400" />
										</div>
									</th>
									<th className="font-sans px-4 text-left text-sm font-medium leading-6 tracking-normal text-slate-500">
										<div className="flex items-center gap-1">
											<Translate text={localizationConstants.columnFile} />
											<ArrowUpDown className="h-3 w-3 text-slate-400" />
										</div>
									</th>
									<th />
								</tr>
							</thead>
							<tbody>
								{customer.documents.map((doc) => (
									<tr key={doc.id} className="h-12 border-b border-slate-100 last:border-b-0">
										<td className="px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-slate-600">
											{doc.date}
										</td>
										<td className="px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-slate-700">
											<div className="flex items-center gap-2">
												<div className="relative flex h-16 w-12 shrink-0 items-center justify-center">
													<File className="h-16 w-12 text-slate-300" strokeWidth={1.5} />
													<span className={`absolute -left-0.5 top-[60%] -translate-y-1/2 rounded-[2px] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white uppercase ${doc.type === "PDF" ? "bg-red-600" : "bg-blue-600"}`}>
														{doc.type || "FILE"}
													</span>
												</div>
												<span className="truncate">{doc.name}</span>
											</div>
										</td>
										<td className="px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-slate-600">
											{doc.type}
										</td>
										<td className="px-4 py-2">
											<button
												type="button"
												onClick={() => handleViewDocument(doc)}
												className="cursor-pointer sm:mr-2"
											>
												<Eye className="h-4 w-4 text-slate-400 hover:text-slate-600" />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<p className="py-4 text-center text-sm text-slate-500">
						<Translate text={localizationConstants.noDataFound} />
					</p>
				)}
			</SectionCard>

			{/* Tilläggsinformation */}
			<SectionCard
				title={localizationConstants.additionalInfoSection}
				onEdit={handleEdit}
			>
				<div>
					<p className="mb-1 font-(family-name:--font-inter) text-sm font-medium leading-5 text-slate-900">
						<Translate text={localizationConstants.notesLabel} />
					</p>
					<p className="font-(family-name:--font-inter) text-sm font-normal leading-relaxed text-slate-600">
						{customer.notes || "—"}
					</p>
				</div>
			</SectionCard>
		</div>
	);
}

// ─── Invoice Tab ──────────────────────────────────────────────────────────────
function InvoiceTab({ customer }: { customer: CustomerDetail }) {
	const handleEdit = () => {};

	return (
		<div className="flex flex-col gap-6 ml-0 sm:ml-9">
			<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
				{/* Betal- och leveransvilkor */}
				<SectionCard
					icon={<UserPlus className="h-6 w-6" />}
					title={localizationConstants.paymentDeliverySection}
					onEdit={handleEdit}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoRow label={localizationConstants.paymentTermsLabel} value={customer.paymentTerms} />
						<InfoRow label={localizationConstants.deliveryTermsLabel} value={customer.deliveryTerms} />
						<InfoRow label={localizationConstants.deliveryMethodLabel} value={customer.deliveryMethod} />
						<InfoRow label={localizationConstants.interestInvoicingLabel} value={customer.interestInvoicing} />
					</div>
				</SectionCard>

				{/* Fakturering */}
				<SectionCard
					icon={<CircleUserRound className="h-6 w-6" />}
					title={localizationConstants.invoicingSection}
					onEdit={handleEdit}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoRow label={localizationConstants.priceListLabel} value={customer.priceList} />
						<InfoRow label={localizationConstants.currencyLabel} value={customer.currency} />
						<InfoRow label={localizationConstants.invoiceDiscountLabel} value={customer.invoiceDiscount} />
						<InfoRow label={localizationConstants.invoiceFeeLabel} value={customer.invoiceFee} />
						<InfoRow label={localizationConstants.shippingFeeLabel} value={customer.shippingFee} />
						<InfoRow label={localizationConstants.pricesInclVatLabel} value={customer.pricesInclVat} />
					</div>
				</SectionCard>
			</div>

			<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
				{/* Referenser */}
				<SectionCard
					icon={<UserPlus className="h-6 w-6" />}
					title={localizationConstants.referencesSection}
					onEdit={handleEdit}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoRow label={localizationConstants.ourReferenceLabel} value={customer.ourReference} />
						<InfoRow label={localizationConstants.customerResponsibleLabel} value={customer.customerResponsible} />
						<InfoRow label={localizationConstants.externalReferenceLabel} value={customer.externalReference} />
						<InfoRow label={localizationConstants.yourReferenceLabel} value={customer.yourReference} />
					</div>
				</SectionCard>

				{/* Bokföring */}
				<SectionCard
					icon={<UserPlus className="h-6 w-6" />}
					title={localizationConstants.accountingSection}
					onEdit={handleEdit}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoRow label={localizationConstants.vatNumberLabel} value={customer.vatNumber} />
						<InfoRow label={localizationConstants.vatTypeLabel} value={customer.vatType} />
						<InfoRow label={localizationConstants.salesAccountLabel} value={customer.salesAccount} />
						<InfoRow label={localizationConstants.costCenterLabel} value={customer.costCenter} />
						<InfoRow label={localizationConstants.projectLabel} value={customer.project} />
					</div>
				</SectionCard>
			</div>
		</div>
	);
}
