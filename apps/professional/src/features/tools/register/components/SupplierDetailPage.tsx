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
import type { SupplierDetail, SupplierContact } from "../types";
import { getSupplierDetailAPIAction } from "../api/supplierRegister";

type TabKey = "basic" | "contact" | "assessment";

const TABS: { key: TabKey; labelKey: string }[] = [
	{ key: "basic", labelKey: localizationConstants.createSupplierBasicInfoTab },
	{ key: "contact", labelKey: localizationConstants.createSupplierContactTab },
	{ key: "assessment", labelKey: localizationConstants.createSupplierAssessmentTab },
];

export function SupplierDetailPage() {
	const t = useTranslate();
	const router = useRouter();
	const params = useParams();
	const id = params.id as string;

	const [supplier, setSupplier] = useState<SupplierDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<TabKey>("basic");

	const fetchSupplier = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await getSupplierDetailAPIAction(id);
			setSupplier(data);
		} catch {
			showToast("error", t(localizationConstants.genericError));
			router.push("/tools/register?tab=supplier");
		} finally {
			setIsLoading(false);
		}
	}, [id, router, t]);

	useEffect(() => {
		fetchSupplier();
	}, [fetchSupplier]);

	if (isLoading || !supplier) {
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
					aria-label="Go back to register"
					onClick={() => router.push("/tools/register?tab=supplier")}
					className="rounded-md p-1 hover:bg-slate-100"
				>
					<ArrowLeft className="h-5 w-5 text-slate-700" />
				</button>
				<h1 className="text-xl font-semibold text-slate-900">
					<Translate text={localizationConstants.detailTitle} />
				</h1>
			</div>

			{/* Supplier number */}
			<p className="mb-4 text-sm text-slate-500 sm:ml-9">{supplier.supplierNo}</p>

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
			{activeTab === "basic" && <BasicInfoTab supplier={supplier} />}
			{activeTab === "contact" && <ContactTab supplier={supplier} />}
			{activeTab === "assessment" && <AssessmentTab supplier={supplier} />}
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
function BasicInfoTab({ supplier }: { supplier: SupplierDetail }) {
	const handleEdit = () => {};

	return (
		<div className="flex flex-col gap-6 ml-0 sm:ml-9">
			<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
				{/* Kund / Leverantör */}
				<SectionCard
					icon={<UserPlus className="h-6 w-6" />}
					title={localizationConstants.customerSection}
					onEdit={handleEdit}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoRow label={localizationConstants.supplierNoLabel} value={supplier.supplierNo} />
						<InfoRow label={localizationConstants.statusLabel} value={supplier.status === "active" ? localizationConstants.activeStatus : localizationConstants.inactiveStatus} />
						<InfoRow label={localizationConstants.companyNameLabel} value={supplier.companyName} />
						<InfoRow label={localizationConstants.mainCategoryLabel} value={supplier.mainCategory} />
						<InfoRow label={localizationConstants.departmentLabel} value={supplier.department} />
						<InfoRow label={localizationConstants.regionLabel} value={supplier.region} />
						<InfoRow label={localizationConstants.orgNoLabel} value={supplier.orgNo} />
						<InfoRow label={localizationConstants.vatRegNoLabel} value={supplier.vatRegNo} />
					</div>
				</SectionCard>

				{/* Bank Information */}
				<SectionCard
					icon={<CircleUserRound className="h-6 w-6" />}
					title={localizationConstants.bankInfoSection}
					onEdit={handleEdit}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoRow label={localizationConstants.bankNameLabel} value={supplier.bankName} />
						<InfoRow label={localizationConstants.bankAccountLabel} value={supplier.bankAccount} />
						<InfoRow label={localizationConstants.bankgiroLabel} value={supplier.bankgiro} />
						<InfoRow label={localizationConstants.plusgiroLabel} value={supplier.plusgiro} />
						<InfoRow label={localizationConstants.ibanLabel} value={supplier.iban} />
						<InfoRow label={localizationConstants.bicLabel} value={supplier.bic} />
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
						<InfoRow label={localizationConstants.addressLabel} value={supplier.visitingAddress} />
						<div className="hidden sm:block" />
						<InfoRow label={localizationConstants.postalCodeLabel} value={supplier.visitingPostalCode} />
						<InfoRow label={localizationConstants.cityLabel} value={supplier.visitingCity} />
					</div>
				</SectionCard>

				{/* Fakturaadress */}
				<SectionCard
					icon={<UserPlus className="h-6 w-6" />}
					title={localizationConstants.invoiceAddressLabel}
					onEdit={handleEdit}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoRow label={localizationConstants.addressLabel} value={supplier.invoiceAddress} />
						<div className="hidden sm:block" />
						<InfoRow label={localizationConstants.postalCodeLabel} value={supplier.invoicePostalCode} />
						<InfoRow label={localizationConstants.cityLabel} value={supplier.invoiceCity} />
					</div>
				</SectionCard>
			</div>

			<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
				{/* Betalningsvillkor */}
				<SectionCard
					icon={<UserPlus className="h-6 w-6" />}
					title={localizationConstants.betalningsvillkorTitle}
					onEdit={handleEdit}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InfoRow label={localizationConstants.betalningsdagarLabel} value={supplier.betalningsdagar} />
						<InfoRow label={localizationConstants.rantaLabel} value={supplier.ranta} />
						<InfoRow label={localizationConstants.fakturaavgiftLabel} value={supplier.fakturaavgift} />
						<InfoRow label={localizationConstants.inkassoLabel} value={supplier.inkasso} />
					</div>
				</SectionCard>
			</div>
		</div>
	);
}

// ─── Contact Tab ──────────────────────────────────────────────────────────────
function ContactTab({ supplier }: { supplier: SupplierDetail }) {
	const handleEdit = () => {};

	const columns: DataTableColumn<SupplierContact>[] = [
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
			{/* Supplier Contact Info */}
			<SectionCard
				icon={<UserPlus className="h-6 w-6" />}
				title={localizationConstants.customerSection}
				onEdit={handleEdit}
			>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<InfoRow label={localizationConstants.phoneLabel} value={supplier.phone} />
					<InfoRow label={localizationConstants.emailLabel} value={supplier.email} />
					<InfoRow label={localizationConstants.websiteLabel} value={supplier.website} />
					<InfoRow label={localizationConstants.notesLabel} value={supplier.contactNotes} />
				</div>
			</SectionCard>

			{/* Contact Persons Table */}
			<SectionCard
				icon={<UserPlus className="h-6 w-6" />}
				title={localizationConstants.customerSection}
				onEdit={handleEdit}
			>
				<DataTable
					data={supplier.contacts}
					columns={columns}
					rowKey={(row) => row.id}
					loading={false}
				/>
			</SectionCard>
		</div>
	);
}

// ─── Assessment Tab ───────────────────────────────────────────────────────────
function AssessmentTab({ supplier }: { supplier: SupplierDetail }) {
	const handleEdit = () => {};

	const handleViewDocument = (doc: { name: string; url: string }) => {
		if (doc.url) {
			window.open(doc.url, "_blank");
		} else {
			showToast("info", localizationConstants.documentNotAvailable);
		}
	};

	const ratingRows = [
		{ label: localizationConstants.economyLabel, value: supplier.ratings.economy },
		{ label: localizationConstants.environmentLabel, value: supplier.ratings.environment },
		{ label: localizationConstants.qualityLabel, value: supplier.ratings.quality },
		{ label: localizationConstants.collaborationLabel, value: supplier.ratings.collaboration },
		{ label: localizationConstants.punctualityLabel, value: supplier.ratings.punctuality },
		{ label: localizationConstants.serviceLabel, value: supplier.ratings.service },
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
				{supplier.documents.length > 0 ? (
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
								{supplier.documents.map((doc) => (
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
						{supplier.notes || "—"}
					</p>
				</div>
			</SectionCard>
		</div>
	);
}
