"use client";

import { useState } from "react";
import type { Control } from "react-hook-form";
import type { CreateAgreementFormData, AgreementContact } from "../../types/agreementCreate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Contact, MoreHorizontal, Save } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface ContactInformationStepProps {
	readonly control?: Control<CreateAgreementFormData>;
	contacts: AgreementContact[];
	onAddContact: (contact: AgreementContact) => void;
	onRemoveContact: (id: string) => void;
}

const ROLE_OPTIONS = [
	{ value: "Beställare", label: "Beställare" },
	{ value: "Kontaktperson", label: "Kontaktperson" },
	{ value: "Beslutare", label: "Beslutare" },
];

export function ContactInformationStep({
	contacts,
	onAddContact,
	onRemoveContact,
}: ContactInformationStepProps) {
	const [fornamn, setFornamn] = useState("");
	const [efternamn, setEfternamn] = useState("");
	const [mail, setMail] = useState("");
	const [mobil, setMobil] = useState("");
	const [roll, setRoll] = useState("");

	const displayContacts = contacts;

	const handleSave = () => {
		if (!fornamn.trim() || !efternamn.trim() || !mail.trim() || !roll) return;

		onAddContact({
			id: Date.now().toString(),
			fornamn: fornamn.trim(),
			efternamn: efternamn.trim(),
			mail: mail.trim(),
			mobil: mobil.trim() ? `+46 ${mobil.trim()}` : "",
			roll,
		});

		setFornamn("");
		setEfternamn("");
		setMail("");
		setMobil("");
		setRoll("");
	};

	return (
		<div className="flex flex-col gap-6">
			<Card className="overflow-hidden max-w-full">
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<Contact className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.agreementContactPerson} />
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						<div className="grid gap-1.5">
							<label className="text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.agreementDetailFornamn} />{" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								value={fornamn}
								onChange={(e) => setFornamn(e.target.value)}
								placeholder="Förnamn"
								className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus-visible:border-slate-400 focus-visible:outline-none"
							/>
						</div>

						<div className="grid gap-1.5">
							<label className="text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.agreementDetailEfternamn} />{" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								value={efternamn}
								onChange={(e) => setEfternamn(e.target.value)}
								placeholder="Efternamn"
								className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus-visible:border-slate-400 focus-visible:outline-none"
							/>
						</div>

						<div className="grid gap-1.5">
							<label className="text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.agreementDetailMail} />{" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								type="email"
								value={mail}
								onChange={(e) => setMail(e.target.value)}
								placeholder="E-post"
								className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus-visible:border-slate-400 focus-visible:outline-none"
							/>
						</div>

						<div className="grid gap-1.5">
							<label className="text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.agreementDetailMobil} />
							</label>
							<div className="flex items-center">
								<span className="flex h-10 items-center rounded-l-md border border-r-0 border-slate-200 bg-white px-3 text-sm text-slate-600">
									+46
								</span>
								<input
									type="text"
									placeholder="Mobil"
									className="h-10 w-full rounded-r-md border border-slate-200 bg-white px-3 text-sm focus-visible:border-slate-400 focus-visible:outline-none"
									value={mobil}
									onChange={(e) => setMobil(e.target.value)}
								/>
							</div>
						</div>

						<div className="grid gap-1.5">
							<label className="text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.agreementDetailRoll} />{" "}
								<span className="text-red-500">*</span>
							</label>
							<Select value={roll} onValueChange={setRoll}>
								<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm focus:ring-0">
									<SelectValue placeholder="Välj roll" />
								</SelectTrigger>
								<SelectContent>
									{ROLE_OPTIONS.map((opt) => (
										<SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="mt-4 flex justify-end">
						<Button
							type="button"
							variant="default"
							size="default"
							onClick={handleSave}
							className="h-9 min-w-[120px] gap-2 bg-[#111721] text-white hover:bg-slate-800 cursor-pointer"
						>
							<Save className="h-4 w-4" />
							<Translate text={localizationConstants.saveButton} />
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card className="overflow-hidden max-w-full">
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<Contact className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.agreementCreateKontaktLista} />
					</CardTitle>
				</CardHeader>
				<CardContent className="px-6 pb-6 pt-4">
					<div className="overflow-x-auto rounded border border-slate-200">
						<table className="w-full min-w-[600px] border-collapse">
							<colgroup>
								<col className="w-[20%]" />
								<col className="w-[20%]" />
								<col className="w-[20%]" />
								<col className="w-[20%]" />
								<col className="w-[15%]" />
								<col className="w-[5%]" />
							</colgroup>
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
								{displayContacts.map((contact) => (
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
												<DropdownMenuContent align="end" className="w-40">
													<DropdownMenuItem
														className="cursor-pointer text-red-600 focus:text-red-600"
														onClick={() => onRemoveContact(contact.id)}
													>
														<Translate text={localizationConstants.agreementOverviewActionDelete} />
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</td>
									</tr>
								))}
								{displayContacts.length === 0 && (
									<tr>
										<td colSpan={6} className="h-24 text-center text-sm text-slate-500">
											<Translate text={localizationConstants.agreementNoContacts} />
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
