"use client";

import React, { useState } from "react";
import { Users, Trash2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerDetailData } from "@/features/financial-management/types/customerDetail.types";
import type { CustomerContactPerson } from "@/features/financial-management/types/createCustomer.types";
import { CustomerDetailCard, EditableField } from "../../cards/CustomerDetailCard";

interface ContactPersonsCardProps {
	customer: CustomerDetailData;
	onUpdate: (updates: Partial<CustomerDetailData>) => void;
	onDeleteContactPerson?: (personId: string) => void;
}

export const ContactPersonsCard: React.FC<ContactPersonsCardProps> = ({
	customer,
	onUpdate,
	onDeleteContactPerson,
}) => {
	const [isAdding, setIsAdding] = useState(false);
	const [newPerson, setNewPerson] = useState({
		firstName: "",
		lastName: "",
		mobilePhone: "",
		email: "",
		role: "",
		personalNo: "",
	});

	const handleAddPerson = () => {
		if (!newPerson.firstName.trim() && !newPerson.lastName.trim()) return;
		const person: CustomerContactPerson = {
			id: `cp-${Date.now()}`,
			firstName: newPerson.firstName.trim(),
			lastName: newPerson.lastName.trim(),
			mobilePhone: newPerson.mobilePhone.trim(),
			email: newPerson.email.trim(),
			role: newPerson.role.trim() || "Kontaktperson",
			personalNo: newPerson.personalNo.trim(),
		};
		const updatedPersons = [...(customer.contactPersons || []), person];
		onUpdate({ contactPersons: updatedPersons });
		setNewPerson({
			firstName: "",
			lastName: "",
			mobilePhone: "",
			email: "",
			role: "",
			personalNo: "",
		});
		setIsAdding(false);
	};

	return (
		<CustomerDetailCard
			title={<Translate text={localizationConstants.customerDetailCardContactPersons} />}
			icon={<Users className="h-5 w-5 text-slate-500" />}
			isEditing={isAdding}
			onEdit={() => setIsAdding(true)}
			onSave={handleAddPerson}
			onCancel={() => setIsAdding(false)}
		>
			<div className="space-y-4">
				{/* Inline Add New Form when isAdding is true */}
				{isAdding && (
					<div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
						<div className="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
							<Translate text={localizationConstants.customerAddContactPersonButton} />
						</div>
						<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
							<EditableField
								label={<Translate text={localizationConstants.customerDetailColFirstName} />}
								value={newPerson.firstName}
								onChange={(val) => setNewPerson((prev) => ({ ...prev, firstName: val }))}
							/>
							<EditableField
								label={<Translate text={localizationConstants.customerDetailColLastName} />}
								value={newPerson.lastName}
								onChange={(val) => setNewPerson((prev) => ({ ...prev, lastName: val }))}
							/>
							<EditableField
								label={<Translate text={localizationConstants.customerDetailColMobile} />}
								value={newPerson.mobilePhone}
								onChange={(val) => setNewPerson((prev) => ({ ...prev, mobilePhone: val }))}
							/>
							<EditableField
								label={<Translate text={localizationConstants.customerDetailColEmail} />}
								value={newPerson.email}
								onChange={(val) => setNewPerson((prev) => ({ ...prev, email: val }))}
							/>
							<EditableField
								label={<Translate text={localizationConstants.customerDetailColRole} />}
								value={newPerson.role}
								onChange={(val) => setNewPerson((prev) => ({ ...prev, role: val }))}
							/>
							<EditableField
								label={<Translate text={localizationConstants.customerDetailColPersonalId} />}
								value={newPerson.personalNo}
								onChange={(val) => setNewPerson((prev) => ({ ...prev, personalNo: val }))}
							/>
						</div>
					</div>
				)}

				{/* Contact Persons Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-left text-xs">
						<thead>
							<tr className="border-b border-slate-200 text-slate-400 dark:border-slate-800 dark:text-slate-500">
								<th className="pb-3 font-medium">
									<Translate text={localizationConstants.customerDetailColFirstName} />
								</th>
								<th className="pb-3 font-medium">
									<Translate text={localizationConstants.customerDetailColLastName} />
								</th>
								<th className="pb-3 font-medium">
									<Translate text={localizationConstants.customerDetailColMobile} />
								</th>
								<th className="pb-3 font-medium">
									<Translate text={localizationConstants.customerDetailColEmail} />
								</th>
								<th className="pb-3 font-medium">
									<Translate text={localizationConstants.customerDetailColRole} />
								</th>
								<th className="pb-3 font-medium">
									<Translate text={localizationConstants.customerDetailColPersonalId} />
								</th>
								<th className="pb-3 text-right font-medium">
									<Translate text={localizationConstants.customerDetailColActions} />
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
							{customer.contactPersons && customer.contactPersons.length > 0 ? (
								customer.contactPersons.map((person: CustomerContactPerson) => (
									<tr
										key={person.id}
										className="text-slate-700 transition-colors hover:bg-slate-50/50 dark:text-slate-300 dark:hover:bg-slate-800/40"
									>
										<td className="py-3.5 font-medium">{person.firstName}</td>
										<td className="py-3.5 font-medium">{person.lastName}</td>
										<td className="py-3.5">{person.mobilePhone || "-"}</td>
										<td className="py-3.5 text-blue-600 dark:text-blue-400">{person.email || "-"}</td>
										<td className="py-3.5">
											<span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
												{person.role || "-"}
											</span>
										</td>
										<td className="py-3.5 text-slate-500 dark:text-slate-400">
											{person.personalNo || "-"}
										</td>
										<td className="py-3.5 text-right">
											{onDeleteContactPerson && (
												<button
													type="button"
													onClick={() => onDeleteContactPerson(person.id)}
													className="rounded p-1 text-slate-400 transition-colors hover:text-red-500 dark:hover:text-red-400"
													title="Delete"
												>
													<Trash2 className="h-4 w-4" />
												</button>
											)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={7}
										className="py-8 text-center text-slate-400 dark:text-slate-500"
									>
										<Translate text={localizationConstants.customerDetailNone} />
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</CustomerDetailCard>
	);
};
