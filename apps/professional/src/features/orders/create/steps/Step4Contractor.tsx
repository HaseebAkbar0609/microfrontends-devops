"use client";

import { useState } from "react";
import {
	ShoppingBag,
	Building2,
	Phone,
	CircleFadingPlus,
	X,
	MoreVertical,
	PencilLine,
	Trash2,
	ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "../components/PhoneInput";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	ContractorOrganizationData,
	ContractorContactItem,
	OrderOrganizationSummaryRow,
} from "../types";

interface Step4ContractorProps {
	contractor: ContractorOrganizationData;
	onContractorChange: (data: Partial<ContractorOrganizationData>) => void;
	organizationsList: OrderOrganizationSummaryRow[];
	onOrganizationsListChange: (list: OrderOrganizationSummaryRow[]) => void;
}

const CONTRACTOR_TYPES = [
	{ value: "Elektriker", label: "Elektriker" },
	{ value: "Rörmokare", label: "Rörmokare" },
	{ value: "Snickare", label: "Snickare" },
	{ value: "Målare", label: "Målare" },
	{ value: "Plattsättare", label: "Plattsättare" },
	{ value: "Ventilation", label: "Ventilation" },
	{ value: "Mark & Anläggning", label: "Mark & Anläggning" },
];

const ORG_OPTIONS = [
	{ value: "Elbolaget AB", label: "Elbolaget AB" },
	{ value: "Rörbolaget AB", label: "Rörbolaget AB" },
	{ value: "ByggTeam Stockholm AB", label: "ByggTeam Stockholm AB" },
	{ value: "Målerifirman Svensson AB", label: "Målerifirman Svensson AB" },
	{ value: "Nordic VVS & El AB", label: "Nordic VVS & El AB" },
];

const AVAILABLE_CONTACT_TAGS = [
	"Rachel Meyers",
	"Bruno Hurst",
	"Anders Svensson",
	"Alex Miller",
	"Emma Watson",
];

const ROLE_OPTIONS = [
	{ value: "Beställare", label: "Beställare" },
	{ value: "Arbetsledare", label: "Arbetsledare" },
	{ value: "Montör", label: "Montör" },
	{ value: "Projektledare", label: "Projektledare" },
	{ value: "Platschef", label: "Platschef" },
];

export function Step4Contractor({
	contractor,
	onContractorChange,
	organizationsList,
	onOrganizationsListChange,
}: Step4ContractorProps) {
	const t = useTranslate();
	const [contactForm, setContactForm] = useState<Omit<ContractorContactItem, "id">>({
		firstName: "",
		lastName: "",
		email: "",
		mobile: "",
		role: "Beställare",
	});

	const handleAddTag = (tag: string) => {
		if (!contractor.selectedContactTags.includes(tag)) {
			onContractorChange({
				selectedContactTags: [...contractor.selectedContactTags, tag],
			});
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		onContractorChange({
			selectedContactTags: contractor.selectedContactTags.filter(
				(tag) => tag !== tagToRemove
			),
		});
	};

	const handleAddContact = () => {
		if (!contactForm.firstName.trim()) {
			showToast("error", t(localizationConstants.orderFornamLabel));
			return;
		}

		const newContact: ContractorContactItem = {
			id: `contact-${Date.now()}`,
			firstName: contactForm.firstName.trim(),
			lastName: contactForm.lastName.trim(),
			email: contactForm.email.trim(),
			mobile: contactForm.mobile.trim(),
			role: contactForm.role || "Beställare",
		};

		const updatedContacts = [...contractor.contacts, newContact];
		onContractorChange({
			contacts: updatedContacts,
		});

		const currentCompany = contractor.organizationName || "Elbolaget AB";
		const currentCategory = contractor.contractorType || "Elektriker";

		// Update or add in organizationsList grouping all contacts under the organization
		const existingIndex = organizationsList.findIndex(
			(org) => org.company === currentCompany
		);

		if (existingIndex >= 0) {
			const updatedList = [...organizationsList];
			const existing = updatedList[existingIndex];
			const allContacts = [...(existing.contacts || []), newContact];
			updatedList[existingIndex] = {
				...existing,
				name: `${allContacts[0]?.firstName || ""} ${allContacts[0]?.lastName || ""}`.trim(),
				email: allContacts[0]?.email || existing.email,
				mobile: allContacts[0]?.mobile || existing.mobile,
				role:
					allContacts.length > 1
						? `${allContacts[0]?.role} (+${allContacts.length - 1})`
						: allContacts[0]?.role || existing.role,
				contacts: allContacts,
			};
			onOrganizationsListChange(updatedList);
		} else {
			const newOrgSummary: OrderOrganizationSummaryRow = {
				id: `org-sum-${Date.now()}`,
				company: currentCompany,
				category: currentCategory,
				name: `${newContact.firstName} ${newContact.lastName}`.trim(),
				email: newContact.email,
				mobile: newContact.mobile,
				role: newContact.role,
				address: contractor.address,
				postalCode: contractor.postalCode,
				city: contractor.city,
				phone: contractor.phone,
				contacts: [newContact],
			};
			onOrganizationsListChange([...organizationsList, newOrgSummary]);
		}

		setContactForm({
			firstName: "",
			lastName: "",
			email: "",
			mobile: "",
			role: "Beställare",
		});
		showToast("success", t(localizationConstants.orderAddContactButton));
	};

	const handleDeleteContact = (id: string) => {
		const updatedContacts = contractor.contacts.filter((c) => c.id !== id);
		onContractorChange({
			contacts: updatedContacts,
		});

		const currentCompany = contractor.organizationName || "Elbolaget AB";
		const updatedList = organizationsList.map((org) => {
			if (org.company === currentCompany) {
				const remainingContacts = (org.contacts || []).filter((c) => c.id !== id);
				return {
					...org,
					name:
						remainingContacts.length > 0
							? `${remainingContacts[0].firstName} ${remainingContacts[0].lastName}`.trim()
							: "",
					email: remainingContacts[0]?.email || "",
					mobile: remainingContacts[0]?.mobile || "",
					role:
						remainingContacts.length > 1
							? `${remainingContacts[0]?.role} (+${remainingContacts.length - 1})`
							: remainingContacts[0]?.role || "",
					contacts: remainingContacts,
				};
			}
			return org;
		});
		onOrganizationsListChange(updatedList);
		showToast("info", t(localizationConstants.actionDelete));
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Card 1: Entreprenör */}
			<Card className="rounded-lg border border-slate-200 bg-white shadow-none pb-4">
				<CardHeader className="h-12 flex flex-row items-center border-b border-slate-200 px-4 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
						<ShoppingBag className="h-5 w-5 text-slate-700" />
						<span><Translate text={localizationConstants.orderEntreprenorSection} /></span>
					</CardTitle>
				</CardHeader>
				<CardContent className="px-4 py-0">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderContractorTypeLabel} />
								<span className="text-red-500"> *</span>
							</Label>
							<Select
								value={contractor.contractorType || "Elektriker"}
								onValueChange={(val) =>
									onContractorChange({ contractorType: val })
								}
							>
								<SelectTrigger className="h-10 w-full rounded-md border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-none focus:border-gray-300 focus:outline-none">
									<SelectValue placeholder={t(localizationConstants.placeholderSelectCategory)} />
								</SelectTrigger>
								<SelectContent className="bg-white border-slate-200">
									{CONTRACTOR_TYPES.map((ct) => (
										<SelectItem key={ct.value} value={ct.value}>
											{ct.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Card 2: Organisation */}
			<Card className="rounded-lg border border-slate-200 bg-white shadow-none pb-4">
				<CardHeader className="h-12 flex flex-row items-center border-b border-slate-200 px-4 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
						<Building2 className="h-5 w-5 text-slate-700" />
						<span><Translate text={localizationConstants.orderOrgNameLabel} /></span>
					</CardTitle>
				</CardHeader>
				<CardContent className="px-4 py-0 space-y-3.5">
					{/* Org Select + Lägg till */}
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-end">
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								{contractor.contractorType || "Elektriker"}
							</Label>
							<Select
								value={contractor.organizationName || "Elbolaget AB"}
								onValueChange={(val) => {
									const existingOrg = organizationsList.find(
										(org) => org.company === val
									);
									onContractorChange({
										organizationName: val,
										contacts: existingOrg?.contacts || [],
										address: existingOrg?.address || contractor.address,
										postalCode: existingOrg?.postalCode || contractor.postalCode,
										city: existingOrg?.city || contractor.city,
										phone: existingOrg?.phone || contractor.phone,
									});
								}}
							>
								<SelectTrigger className="h-10 w-full rounded-md border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-none focus:border-gray-300 focus:outline-none">
									<SelectValue placeholder={t(localizationConstants.orderOrgNameLabel)} />
								</SelectTrigger>
								<SelectContent className="bg-white border-slate-200">
									{ORG_OPTIONS.map((org) => (
										<SelectItem key={org.value} value={org.value}>
											{org.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center">
							<Button
								type="button"
								onClick={() =>
									showToast("info", t(localizationConstants.orderSaveOrganizationButton))
								}
								className="h-10 gap-2 rounded-lg bg-[var(--color-bg-secondary,#F4F4F5)] px-4 text-xs font-medium text-slate-800 hover:bg-slate-200 cursor-pointer shadow-none border border-transparent w-fit"
							>
								<CircleFadingPlus className="h-4 w-4 text-slate-700" />
								<span><Translate text={localizationConstants.orderAddContactButton} /></span>
							</Button>
						</div>
					</div>

					{/* Adress */}
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderAddressLabel} />
							</Label>
							<Input
								value={contractor.address}
								onChange={(e) =>
									onContractorChange({ address: e.target.value })
								}
								placeholder={t(localizationConstants.placeholderAddress)}
								className="h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none"
							/>
						</div>
					</div>

					{/* Post nr & Ort */}
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderPostNrLabel} />
							</Label>
							<Input
								value={contractor.postalCode}
								onChange={(e) =>
									onContractorChange({
										postalCode: e.target.value.replace(/[^0-9 ]/g, ""),
									})
								}
								placeholder={t(localizationConstants.placeholderPostalCode)}
								className="h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none"
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderCityLabel} />
							</Label>
							<Input
								value={contractor.city}
								onChange={(e) => onContractorChange({ city: e.target.value })}
								placeholder={t(localizationConstants.placeholderCity)}
								className="h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none"
							/>
						</div>
					</div>

					{/* Mail & Telefon */}
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderMailLabel} />
							</Label>
							<Input
								type="email"
								value={contractor.email}
								onChange={(e) =>
									onContractorChange({ email: e.target.value.trim() })
								}
								placeholder={t(localizationConstants.placeholderEmail)}
								className="h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none"
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderTelefonLabel} />
							</Label>
							<PhoneInput
								value={contractor.phone}
								onChange={(val) => onContractorChange({ phone: val })}
								placeholder={t(localizationConstants.placeholderPhone)}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Card 3: Kontakt */}
			<Card className="rounded-lg border border-slate-200 bg-white shadow-none pb-4">
				<CardHeader className="h-12 flex flex-row items-center border-b border-slate-200 px-4 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
						<Phone className="h-5 w-5 text-slate-700" />
						<span><Translate text={localizationConstants.orderContactsSection} /></span>
					</CardTitle>
				</CardHeader>
				<CardContent className="px-4 py-0 space-y-4">
					{/* Kontaktperson Tag Selector */}
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-end">
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderKontaktpersonSection} />
							</Label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<div
										role="button"
										tabIndex={0}
										className="flex min-h-10 w-full items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 shadow-none hover:border-gray-300 focus:outline-none cursor-pointer text-left select-none"
									>
										<div className="flex flex-wrap items-center gap-2 flex-1">
											{contractor.selectedContactTags.map((tag) => (
												<span
													key={tag}
													className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800"
													onClick={(e) => e.stopPropagation()}
												>
													{tag}
													<button
														type="button"
														onClick={(e) => {
															e.stopPropagation();
															handleRemoveTag(tag);
														}}
														aria-label={`Ta bort ${tag}`}
														className="text-slate-400 hover:text-slate-700 cursor-pointer inline-flex items-center"
													>
														<X className="h-3 w-3" />
													</button>
												</span>
											))}
											{contractor.selectedContactTags.length === 0 && (
												<span className="text-xs text-slate-400 font-normal">
													<Translate text={localizationConstants.orderContactsSection} />
												</span>
											)}
										</div>
										<ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
									</div>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="start"
									className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[220px] bg-white shadow-lg border border-slate-200 rounded-lg z-50 p-1"
								>
									{AVAILABLE_CONTACT_TAGS.map((tag) => (
										<DropdownMenuItem
											key={tag}
											onClick={() => handleAddTag(tag)}
											className="flex items-center text-xs text-slate-700 cursor-pointer hover:bg-slate-50 rounded-md py-2 px-2.5"
										>
											{tag}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div className="flex items-center">
							<Button
								type="button"
								onClick={handleAddContact}
								className="h-10 gap-2 rounded-lg bg-[var(--color-bg-secondary,#F4F4F5)] px-4 text-xs font-medium text-slate-800 hover:bg-slate-200 cursor-pointer shadow-none border border-transparent w-fit"
							>
								<CircleFadingPlus className="h-4 w-4 text-slate-700" />
								<span><Translate text={localizationConstants.orderAddContactButton} /></span>
							</Button>
						</div>
					</div>

					{/* Förnamn & Efternamn */}
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderFornamLabel} />
							</Label>
							<Input
								value={contactForm.firstName}
								onChange={(e) =>
									setContactForm((prev) => ({
										...prev,
										firstName: e.target.value,
									}))
								}
								placeholder={t(localizationConstants.placeholderFirstName)}
								className="h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none"
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderEfternamnLabel} />
							</Label>
							<Input
								value={contactForm.lastName}
								onChange={(e) =>
									setContactForm((prev) => ({
										...prev,
										lastName: e.target.value,
									}))
								}
								placeholder={t(localizationConstants.placeholderLastName)}
								className="h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none"
							/>
						</div>
					</div>

					{/* Mail & Mobil */}
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderMailLabel} />
							</Label>
							<Input
								type="email"
								value={contactForm.email}
								onChange={(e) =>
									setContactForm((prev) => ({
										...prev,
										email: e.target.value.trim(),
									}))
								}
								placeholder={t(localizationConstants.placeholderEmail)}
								className="h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none"
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderMobilLabel} />
							</Label>
							<PhoneInput
								value={contactForm.mobile}
								onChange={(val) =>
									setContactForm((prev) => ({ ...prev, mobile: val }))
								}
								placeholder={t(localizationConstants.placeholderPhone)}
							/>
						</div>
					</div>

					{/* Roll */}
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderRollLabel} />
							</Label>
							<Select
								value={contactForm.role}
								onValueChange={(val) =>
									setContactForm((prev) => ({ ...prev, role: val }))
								}
							>
								<SelectTrigger className="h-10 w-full rounded-md border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-none focus:border-gray-300 focus:outline-none">
									<SelectValue placeholder="Beställare" />
								</SelectTrigger>
								<SelectContent className="bg-white border-slate-200">
									{ROLE_OPTIONS.map((r) => (
										<SelectItem key={r.value} value={r.value}>
											{r.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Kontaktpersoner Table */}
					<div className="space-y-3 pt-2">
						<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
							<div className="bg-[#E2E8F0] px-4 py-2.5 border-b border-slate-200">
								<h3 className="text-xs font-semibold text-slate-800">
									<Translate text={localizationConstants.orderKontaktpersonSection} />
								</h3>
							</div>
							<Table>
								<TableHeader className="bg-white">
									<TableRow className="border-b border-slate-200 hover:bg-white">
										<TableHead className="text-xs font-medium text-slate-600 h-8">
											<Translate text={localizationConstants.orderFornamLabel} />
										</TableHead>
										<TableHead className="text-xs font-medium text-slate-600 h-8">
											<Translate text={localizationConstants.orderEfternamnLabel} />
										</TableHead>
										<TableHead className="text-xs font-medium text-slate-600 h-8">
											<Translate text={localizationConstants.orderMailLabel} />
										</TableHead>
										<TableHead className="text-xs font-medium text-slate-600 h-8">
											<Translate text={localizationConstants.orderMobilLabel} />
										</TableHead>
										<TableHead className="text-xs font-medium text-slate-600 h-8">
											<Translate text={localizationConstants.orderRollLabel} />
										</TableHead>
										<TableHead className="w-12 text-right text-xs font-medium text-slate-600 h-8">
											<span className="sr-only"><Translate text={localizationConstants.actionsHeader} /></span>
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{contractor.contacts.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={6}
												className="py-6 text-center text-xs text-slate-400"
											>
												<Translate text={localizationConstants.orderNoDocumentsYet} />
											</TableCell>
										</TableRow>
									) : (
										contractor.contacts.map((c) => (
											<TableRow
												key={c.id}
												className="border-b border-slate-100 transition-colors hover:bg-slate-50/50"
											>
												<TableCell className="py-1.5 text-xs font-medium text-slate-900">
													{c.firstName}
												</TableCell>
												<TableCell className="py-1.5 text-xs text-slate-700">
													{c.lastName}
												</TableCell>
												<TableCell className="py-1.5 text-xs text-slate-600 truncate max-w-[140px]">
													{c.email}
												</TableCell>
												<TableCell className="py-1.5 text-xs text-slate-600">
													{c.mobile}
												</TableCell>
												<TableCell className="py-1.5 text-xs text-slate-700">
													{c.role}
												</TableCell>
												<TableCell className="py-1.5 text-right">
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																aria-label={t(localizationConstants.actionsHeader)}
																className="h-8 w-8 text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
															>
																<MoreVertical className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent
															align="end"
															className="w-36 bg-white shadow-lg border border-slate-200 rounded-lg"
														>
															<DropdownMenuItem
																onClick={() =>
																	showToast(
																		"info",
																		`${t(localizationConstants.actionEdit)} ${c.firstName}`
																	)
																}
																className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:bg-slate-50"
															>
																<PencilLine className="h-3.5 w-3.5 text-slate-700" />
																<span><Translate text={localizationConstants.actionEdit} /></span>
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	handleDeleteContact(c.id)
																}
																className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:bg-slate-50"
															>
																<Trash2 className="h-3.5 w-3.5 text-slate-700" />
																<span><Translate text={localizationConstants.actionDelete} /></span>
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
