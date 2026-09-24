"use client";

import React, { useState } from "react";
import { Users, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SupplierContactPerson } from "../../../../../types/createSupplier.types";
import { SUPPLIER_CONTACT_ROLE_OPTIONS } from "../../../../../constants/createSupplier.constants";
import { SupplierDetailCard } from "../../cards/SupplierDetailCard";

interface SupplierContactPersonsCardProps {
	contactPersons: SupplierContactPerson[];
	onAddPerson: (person: SupplierContactPerson) => void;
	onDeletePerson: (id: string) => void;
}

export function SupplierContactPersonsCard({
	contactPersons,
	onAddPerson,
	onDeletePerson,
}: SupplierContactPersonsCardProps) {
	const [showAddForm, setShowAddForm] = useState(false);
	const [newPerson, setNewPerson] = useState<SupplierContactPerson>({
		id: "",
		firstName: "",
		lastName: "",
		mobilePhone: "",
		email: "",
		role: "Säljare",
		personalNo: "",
	});

	const handleAdd = () => {
		if (!newPerson.firstName && !newPerson.lastName && !newPerson.email) return;
		onAddPerson({
			...newPerson,
			id: `cp-${Date.now()}`,
		});
		setNewPerson({
			id: "",
			firstName: "",
			lastName: "",
			mobilePhone: "",
			email: "",
			role: "Säljare",
			personalNo: "",
		});
		setShowAddForm(false);
	};

	return (
		<SupplierDetailCard
			title={<Translate text={localizationConstants.supplierDetailCardContactPersons} />}
			icon={<Users className="h-5 w-5" />}
			headerExtra={
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => setShowAddForm((prev) => !prev)}
					className="h-8 px-3 text-xs font-semibold gap-1.5 border-slate-200 hover:bg-slate-50 cursor-pointer"
				>
					<Plus className="h-3.5 w-3.5" />
					<Translate text={localizationConstants.supplierAddContactPersonButton} />
				</Button>
			}
		>
			<div className="space-y-4">
				{showAddForm && (
					<div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
						<h5 className="text-xs font-bold text-slate-800">
							<Translate text={localizationConstants.supplierAddContactPersonButton} />
						</h5>
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
							<Input
								placeholder="Förnamn"
								value={newPerson.firstName}
								onChange={(e) => setNewPerson((prev) => ({ ...prev, firstName: e.target.value }))}
								className="h-9 text-xs bg-white"
							/>
							<Input
								placeholder="Efternamn"
								value={newPerson.lastName}
								onChange={(e) => setNewPerson((prev) => ({ ...prev, lastName: e.target.value }))}
								className="h-9 text-xs bg-white"
							/>
							<Input
								placeholder="Mobil"
								value={newPerson.mobilePhone}
								onChange={(e) => setNewPerson((prev) => ({ ...prev, mobilePhone: e.target.value }))}
								className="h-9 text-xs bg-white"
							/>
							<Input
								type="email"
								placeholder="E-post"
								value={newPerson.email}
								onChange={(e) => setNewPerson((prev) => ({ ...prev, email: e.target.value }))}
								className="h-9 text-xs bg-white"
							/>
							<Select
								value={newPerson.role}
								onValueChange={(val) => setNewPerson((prev) => ({ ...prev, role: val }))}
							>
								<SelectTrigger className="h-9 text-xs bg-white">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-white">
									{SUPPLIER_CONTACT_ROLE_OPTIONS.map((opt) => (
										<SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Input
								placeholder="Personnr"
								value={newPerson.personalNo}
								onChange={(e) => setNewPerson((prev) => ({ ...prev, personalNo: e.target.value }))}
								className="h-9 text-xs bg-white"
							/>
						</div>
						<div className="flex justify-end gap-2 pt-2">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => setShowAddForm(false)}
								className="h-8 px-3 text-xs"
							>
								<Translate text={localizationConstants.cancel} />
							</Button>
							<Button
								type="button"
								size="sm"
								onClick={handleAdd}
								className="h-8 px-3 text-xs bg-slate-900 text-white hover:bg-slate-800"
							>
								<Translate text={localizationConstants.save} />
							</Button>
						</div>
					</div>
				)}

				{contactPersons.length === 0 ? (
					<div className="py-6 text-center text-xs text-slate-400">
						Inga kontaktpersoner registrerade
					</div>
				) : (
					<div className="overflow-hidden rounded-lg border border-slate-200">
						<table className="w-full text-left text-xs">
							<thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
								<tr>
									<th className="py-2.5 px-3">
										<Translate text={localizationConstants.supplierContactPersonFirstName} />
									</th>
									<th className="py-2.5 px-3">
										<Translate text={localizationConstants.supplierContactPersonLastName} />
									</th>
									<th className="py-2.5 px-3">
										<Translate text={localizationConstants.supplierContactPersonRole} />
									</th>
									<th className="py-2.5 px-3">
										<Translate text={localizationConstants.supplierContactPersonMobile} />
									</th>
									<th className="py-2.5 px-3">
										<Translate text={localizationConstants.supplierContactPersonEmail} />
									</th>
									<th className="py-2.5 px-3 text-right">
										<Translate text={localizationConstants.supplierColActions} />
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 bg-white">
								{contactPersons.map((person) => (
									<tr key={person.id} className="hover:bg-slate-50">
										<td className="py-2.5 px-3 font-medium text-slate-900">{person.firstName}</td>
										<td className="py-2.5 px-3 text-slate-700">{person.lastName}</td>
										<td className="py-2.5 px-3 text-slate-600">{person.role}</td>
										<td className="py-2.5 px-3 text-slate-600">{person.mobilePhone || "-"}</td>
										<td className="py-2.5 px-3 text-slate-600">{person.email || "-"}</td>
										<td className="py-2.5 px-3 text-right">
											<button
												type="button"
												onClick={() => onDeletePerson(person.id)}
												className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</SupplierDetailCard>
	);
}
