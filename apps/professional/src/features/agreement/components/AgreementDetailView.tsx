"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	ArrowUpDown,
	CircleUser,
	File,
	FileText,
	MoreHorizontal,
	PenLine,
	Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { AGREEMENT_ROUTES } from "../constants/agreementDashboard";
import { AgreementDetail, AgreementDetailContact, AgreementDetailDocument } from "../types/agreementDetail";
import { 
	addAgreementContactAction, 
	deleteAgreementContactAction, 
	deleteAgreementDocumentAction,
	updateAgreementContactAction
} from "@/api-actions/agreements/agreements";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function InfoRow({ labelKey, value }: { labelKey: string; value?: string }) {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
				<Translate text={labelKey} />
			</span>
			<span className="font-sans text-sm font-normal leading-5 tracking-normal text-slate-500">
				{value || "—"}
			</span>
		</div>
	);
}

function SectionCard({
	icon,
	title,
	onEdit,
	editLabelKey,
	children,
}: {
	icon?: React.ReactNode;
	title: React.ReactNode;
	onEdit?: () => void;
	editLabelKey?: string;
	children: React.ReactNode;
}) {
	return (
		<Card className="rounded-lg">
			<CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 px-4 py-3 [.border-b]:pb-3 h-auto sm:px-6">
				<div className="flex items-center gap-2">
					{icon}
					<CardTitle className="font-sans text-sm font-medium leading-6 sm:text-base">
						{title}
					</CardTitle>
				</div>
				{onEdit && editLabelKey && (
					<button
						type="button"
						onClick={onEdit}
						className="pointer-events-auto flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-[#F4F4F5] px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-slate-200 sm:h-9 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm transition-colors ml-auto"
					>
						<PenLine className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
						<Translate text={editLabelKey} />
					</button>
				)}
			</CardHeader>
			<CardContent className="px-4 sm:px-6">{children}</CardContent>
		</Card>
	);
}

interface Props {
	data: AgreementDetail;
}

export default function AgreementDetailView({ data }: Props) {
	const router = useRouter();
	const [contacts, setContacts] = useState<AgreementDetailContact[]>(data.contacts || []);
	const [documents, setDocuments] = useState<AgreementDetailDocument[]>(data.documents || []);
	
	const [sortConfig, setSortConfig] = useState<{ key: keyof AgreementDetailDocument; direction: "asc" | "desc" } | null>(null);
	
	const [isContactModalOpen, setIsContactModalOpen] = useState(false);
	const [editingContactId, setEditingContactId] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [newContact, setNewContact] = useState({
		fornamn: "",
		efternamn: "",
		mail: "",
		mobil: "",
		roll: "",
	});

	const handleAddContact = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newContact.fornamn || !newContact.efternamn || isSubmitting) return;

		setIsSubmitting(true);
		try {
			if (editingContactId) {
				const res = await updateAgreementContactAction(data.id, editingContactId, {
					first_name: newContact.fornamn,
					last_name: newContact.efternamn,
					email: newContact.mail || null,
					mobile: newContact.mobil || null,
					role: newContact.roll || null,
				});

				if (res.success && res.data) {
					const updatedContact = res.data as AgreementDetailContact;
					setContacts((prev) => prev.map((c) => (c.id === editingContactId ? updatedContact : c)));
					handleCloseContactModal();
				}
			} else {
				const res = await addAgreementContactAction(data.id, {
					first_name: newContact.fornamn,
					last_name: newContact.efternamn,
					email: newContact.mail || null,
					mobile: newContact.mobil || null,
					role: newContact.roll || null,
				});

				if (res.success && res.data) {
					const newContact = res.data as AgreementDetailContact;
					setContacts((prev) => [...prev, newContact]);
					handleCloseContactModal();
				}
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEditContact = (contact: AgreementDetailContact) => {
		setEditingContactId(contact.id);
		setNewContact({
			fornamn: contact.fornamn,
			efternamn: contact.efternamn,
			mail: contact.mail || "",
			mobil: contact.mobil || "",
			roll: contact.roll || "",
		});
		setIsContactModalOpen(true);
	};

	const handleCloseContactModal = () => {
		setIsContactModalOpen(false);
		setEditingContactId(null);
		setNewContact({ fornamn: "", efternamn: "", mail: "", mobil: "", roll: "" });
	};

	const handleEditAgreement = () => {
		router.push(`/module/business-support/agreement/${data.id}/edit`);
	};



	const handleDeleteContact = async (contactId: string) => {
		const res = await deleteAgreementContactAction(data.id, contactId);
		if (res.success) {
			setContacts((prev) => prev.filter((c) => c.id !== contactId));
		}
	};

	const handleDeleteDocument = async (documentId: string) => {
		const res = await deleteAgreementDocumentAction(data.id, documentId);
		if (res.success) {
			setDocuments((prev) => prev.filter((d) => d.id !== documentId));
		}
	};

	const handleSortDocuments = (key: keyof AgreementDetailDocument) => {
		let direction: "asc" | "desc" = "asc";
		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	const sortedDocuments = useMemo(() => {
		const sortableDocs = [...documents];
		if (sortConfig !== null) {
			sortableDocs.sort((a, b) => {
				const aVal = String(a[sortConfig.key] || "").toLowerCase();
				const bVal = String(b[sortConfig.key] || "").toLowerCase();
				if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
				if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
				return 0;
			});
		}
		return sortableDocs;
	}, [documents, sortConfig]);

	return (
		<div className="flex flex-1 flex-col overflow-y-auto px-3 py-6 sm:px-5">
			<div className="mb-4 flex items-center gap-2 ml-0">
				<button
					type="button"
					onClick={() => router.push(AGREEMENT_ROUTES.overview)}
					className="rounded-md p-1 hover:bg-slate-100 cursor-pointer"
				>
					<ArrowLeft className="h-5 w-5 text-slate-700" />
				</button>
				<h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
					<Translate text={localizationConstants.agreementDetailTitle} />
				</h1>
			</div>

			<div className="flex flex-col gap-2 sm:ml-9 sm:gap-3">
				<SectionCard
					title={<Translate text={localizationConstants.agreementDetailAvtalDetails} />}
					icon={<FileText size={22} className="text-slate-700" />}
					onEdit={handleEditAgreement}
					editLabelKey={localizationConstants.agreementDetailEditBtn}
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-y-5">
						<InfoRow labelKey={localizationConstants.agreementDetailAvdelning} value={data.avdelning} />
						<InfoRow labelKey={localizationConstants.agreementDetailAvtalsTyp} value={data.avtalsTyp} />
						<InfoRow labelKey={localizationConstants.agreementDetailAnsvarig} value={data.ansvarig} />
						<InfoRow labelKey={localizationConstants.agreementDetailMotpart} value={data.motpart} />
						<InfoRow labelKey={localizationConstants.agreementDetailStartdatum} value={data.startdatum} />
						<InfoRow labelKey={localizationConstants.agreementDetailSlutdatum} value={data.slutdatum} />
						<InfoRow labelKey={localizationConstants.agreementDetailAktionDatum} value={data.aktionDatum} />
						<InfoRow labelKey={localizationConstants.agreementDetailPaminnelseDatum} value={data.paminnelseDatum} />
						<InfoRow labelKey={localizationConstants.agreementDetailAvtalsprioritet} value={data.avtalsPrioritet} />
						<div className="sm:col-span-2">
							<InfoRow labelKey={localizationConstants.agreementDetailMeddelande} value={data.meddelande} />
						</div>
					</div>
				</SectionCard>

				<SectionCard
					title={<Translate text={localizationConstants.agreementDetailPaminnelseKontakter} />}
					icon={<CircleUser size={22} className="text-slate-700" />}
				>
					<div className="overflow-x-auto rounded border border-slate-200">
						<table className="w-full min-w-150 border-collapse">
							<thead>
								<tr className="h-11 border-b border-slate-200">
									<th className="font-sans px-4 text-left text-sm font-medium leading-6 tracking-normal text-slate-500">
										<Translate text={localizationConstants.agreementDetailFornamn} />
									</th>
									<th className="font-sans px-4 text-left text-sm font-medium leading-6 tracking-normal text-slate-500">
										<Translate text={localizationConstants.agreementDetailEfternamn} />
									</th>
									<th className="font-sans px-4 text-left text-sm font-medium leading-6 tracking-normal text-slate-500">
										<Translate text={localizationConstants.agreementDetailMail} />
									</th>
									<th className="font-sans px-4 text-left text-sm font-medium leading-6 tracking-normal text-slate-500">
										<Translate text={localizationConstants.agreementDetailMobil} />
									</th>
									<th className="font-sans px-4 text-left text-sm font-medium leading-6 tracking-normal text-slate-500">
										<Translate text={localizationConstants.agreementDetailRoll} />
									</th>
									<th />
								</tr>
							</thead>
							<tbody>
								{contacts.map((contact) => (
									<tr key={contact.id} className="h-12 border-b border-slate-100 last:border-b-0">
										<td className="px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-slate-600">
											{contact.fornamn}
										</td>
										<td className="px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-slate-600">
											{contact.efternamn}
										</td>
										<td className="px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-slate-600">
											{contact.mail}
										</td>
										<td className="px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-slate-600">
											{contact.mobil}
										</td>
										<td className="px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-slate-600">
											{contact.roll}
										</td>
										<td className="px-2 py-2">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<button
														type="button"
														className="h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-500 cursor-pointer"
													>
														<MoreHorizontal className="h-4 w-4 rotate-90" />
													</button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-40 z-[9999] bg-white">
													<DropdownMenuItem
														onClick={() => handleEditContact(contact)}
														className="cursor-pointer text-slate-700 focus:text-slate-900"
													>
														<Translate text={localizationConstants.agreementDetailEditBtn || "Edit"} />
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleDeleteContact(contact.id)}
														className="cursor-pointer text-red-600 focus:text-red-600"
													>
														<Translate text={localizationConstants.agreementOverviewActionDelete} />
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<button
						type="button"
						onClick={() => {
							setEditingContactId(null);
							setNewContact({ fornamn: "", efternamn: "", mail: "", mobil: "", roll: "" });
							setIsContactModalOpen(true);
						}}
						className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer sm:mt-4 transition-colors"
					>
						<Plus size={16} />
						<Translate text={localizationConstants.agreementDetailNyKontakt} />
					</button>
				</SectionCard>

				<SectionCard
					title={<Translate text={localizationConstants.agreementDetailDocuments} />}
					icon={<File size={22} className="text-slate-700" />}
				>
					<div className="overflow-x-auto rounded border border-slate-200">
						<table className="w-full min-w-162.5 border-collapse">
							<thead>
								<tr className="h-11 border-b border-slate-200">
									<th 
										className="font-sans px-4 text-left text-sm font-medium leading-6 tracking-normal text-slate-500 cursor-pointer select-none hover:bg-slate-50"
										onClick={() => handleSortDocuments("datum")}
									>
										<div className="flex items-center gap-1">
											<Translate text={localizationConstants.agreementDetailDatum} />
											<ArrowUpDown className={`h-4 w-4 ${sortConfig?.key === "datum" ? "text-slate-900" : "text-slate-400"}`} />
										</div>
									</th>
									<th 
										className="font-sans px-4 text-left text-sm font-medium leading-6 tracking-normal text-slate-500 cursor-pointer select-none hover:bg-slate-50"
										onClick={() => handleSortDocuments("namn")}
									>
										<div className="flex items-center gap-1">
											<Translate text={localizationConstants.agreementDetailDokumentetsNamn} />
											<ArrowUpDown className={`h-4 w-4 ${sortConfig?.key === "namn" ? "text-slate-900" : "text-slate-400"}`} />
										</div>
									</th>
									<th 
										className="font-sans px-4 text-left text-sm font-medium leading-6 tracking-normal text-slate-500 cursor-pointer select-none hover:bg-slate-50"
										onClick={() => handleSortDocuments("fil")}
									>
										<div className="flex items-center gap-1">
											<Translate text={localizationConstants.agreementDetailFil} />
											<ArrowUpDown className={`h-4 w-4 ${sortConfig?.key === "fil" ? "text-slate-900" : "text-slate-400"}`} />
										</div>
									</th>
									<th />
								</tr>
							</thead>
							<tbody>
								{sortedDocuments.map((doc) => (
									<tr key={doc.id} className="border-b border-slate-100 last:border-b-0">
										<td className="px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-slate-600">
											{doc.datum}
										</td>
										<td className="px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-slate-700">
											<span className="inline-block rounded border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700">
												{doc.namn}
											</span>
										</td>
										<td className="px-4 py-2 font-sans text-sm font-normal leading-5 tracking-normal text-slate-600">
											<div className="flex items-center gap-2">
												<div className="relative flex h-16 w-12 shrink-0 items-center justify-center">
													<File className="h-16 w-12 text-slate-300" strokeWidth={1.5} />
													<span className={`absolute -left-0.5 top-[60%] -translate-y-1/2 rounded-[2px] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white ${doc.type === "pdf" ? "bg-red-600" : "bg-blue-600"}`}>
														{doc.type === "pdf" ? "PDF" : "DOC"}
													</span>
												</div>
												<span className="truncate text-sm">{doc.fil}</span>
											</div>
										</td>
										<td className="px-2 py-2">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<button
														type="button"
														className="h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-500 cursor-pointer"
													>
														<MoreHorizontal className="h-4 w-4 rotate-90" />
													</button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-40">
													<DropdownMenuItem 
														onClick={() => handleDeleteDocument(doc.id)}
														className="cursor-pointer text-red-600 focus:text-red-600"
													>
														<Translate text={localizationConstants.agreementOverviewActionDelete} />
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</SectionCard>
			</div>

			<Dialog open={isContactModalOpen} onOpenChange={(open) => !open && handleCloseContactModal()}>
				<DialogContent className="sm:max-w-106.25" aria-describedby={undefined}>
					<DialogHeader>
						<DialogTitle>
							<Translate text={editingContactId ? localizationConstants.agreementDetailEditBtn : localizationConstants.agreementDetailNyKontakt} />
						</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleAddContact} className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="fornamn" className="text-right">
								<Translate text={localizationConstants.agreementDetailFornamn} />
							</Label>
							<Input
								id="fornamn"
								value={newContact.fornamn}
								onChange={(e) => setNewContact((prev) => ({ ...prev, fornamn: e.target.value }))}
								className="col-span-3"
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="efternamn" className="text-right">
								<Translate text={localizationConstants.agreementDetailEfternamn} />
							</Label>
							<Input
								id="efternamn"
								value={newContact.efternamn}
								onChange={(e) => setNewContact((prev) => ({ ...prev, efternamn: e.target.value }))}
								className="col-span-3"
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="mail" className="text-right">
								<Translate text={localizationConstants.agreementDetailMail} />
							</Label>
							<Input
								id="mail"
								type="email"
								value={newContact.mail}
								onChange={(e) => setNewContact((prev) => ({ ...prev, mail: e.target.value }))}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="mobil" className="text-right">
								<Translate text={localizationConstants.agreementDetailMobil} />
							</Label>
							<Input
								id="mobil"
								value={newContact.mobil}
								onChange={(e) => setNewContact((prev) => ({ ...prev, mobil: e.target.value }))}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="roll" className="text-right">
								<Translate text={localizationConstants.agreementDetailRoll} />
							</Label>
							<Input
								id="roll"
								value={newContact.roll}
								onChange={(e) => setNewContact((prev) => ({ ...prev, roll: e.target.value }))}
								className="col-span-3"
							/>
						</div>
						<DialogFooter className="mt-4">
							<Button
								type="button"
								variant="outline"
								onClick={handleCloseContactModal}
								className="cursor-pointer"
							>
								Cancel
							</Button>
							<Button 
								type="submit" 
								className="bg-[#18181B] text-white hover:bg-[#18181B]/90 cursor-pointer"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Saving..." : "Save"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
