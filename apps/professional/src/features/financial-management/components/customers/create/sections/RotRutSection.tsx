"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AssociatedPerson } from "../../../../types/createCustomer.types";

interface RotRutSectionProps {
	isEnabled: boolean;
	onToggle: (enabled: boolean) => void;
	propertyDesignation: string;
	onPropertyDesignationChange: (val: string) => void;
	apartmentNumber: string;
	onApartmentNumberChange: (val: string) => void;
	associatedPersons: AssociatedPerson[];
	onAddPerson: () => void;
	onRemovePerson: (id: string) => void;
	onUpdatePerson: (id: string, updates: Partial<AssociatedPerson>) => void;
}

export function RotRutSection({
	isEnabled,
	onToggle,
	propertyDesignation,
	onPropertyDesignationChange,
	apartmentNumber,
	onApartmentNumberChange,
	associatedPersons,
	onAddPerson,
	onRemovePerson,
	onUpdatePerson,
}: RotRutSectionProps) {
	const { t } = useTranslation();

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
			<div className="flex items-center justify-between border-b border-slate-100 pb-4">
				<div>
					<h3 className="text-sm font-bold text-slate-900 tracking-tight">
						<Translate text={localizationConstants.customerCardRotRut} />
					</h3>
				</div>
				<label className="flex items-center gap-2 cursor-pointer">
					<input
						type="checkbox"
						checked={isEnabled}
						onChange={(e) => onToggle(e.target.checked)}
						className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
					/>
					<span className="text-xs font-semibold text-slate-800">
						<Translate text={localizationConstants.customerRotRutToggleLabel} />
					</span>
				</label>
			</div>

			{isEnabled && (
				<div className="space-y-6 pt-2">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="space-y-1.5">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.customerPropertyDesignationLabel} />
							</label>
							<Input
								value={propertyDesignation}
								onChange={(e) => onPropertyDesignationChange(e.target.value)}
								placeholder="Stockholm 1:4"
								className="h-10 text-xs bg-white"
							/>
						</div>
						<div className="space-y-1.5">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.customerApartmentNumberLabel} />
							</label>
							<Input
								value={apartmentNumber}
								onChange={(e) => onApartmentNumberChange(e.target.value)}
								placeholder="1201"
								className="h-10 text-xs bg-white"
							/>
						</div>
					</div>

					{/* Associated Persons List */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<h4 className="text-xs font-bold text-slate-800 tracking-tight">
								<Translate text={localizationConstants.customerAssociatedPersonsTitle} />
							</h4>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={onAddPerson}
								className="h-8 text-xs font-semibold gap-1.5 border-slate-200 hover:bg-slate-50 cursor-pointer"
							>
								<Plus className="h-3.5 w-3.5" />
								<Translate text={localizationConstants.customerAddAssociatedPersonButton} />
							</Button>
						</div>

						{associatedPersons.length === 0 ? (
							<p className="text-xs text-slate-400 italic">
								<Translate text={localizationConstants.noDataFound} />
							</p>
						) : (
							<div className="space-y-3">
								{associatedPersons.map((person) => (
									<div
										key={person.id}
										className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center rounded-lg border border-slate-100 bg-slate-50/50 p-3"
									>
										<div className="sm:col-span-4">
											<Input
												value={person.name}
												onChange={(e) => onUpdatePerson(person.id, { name: e.target.value })}
												placeholder={t(localizationConstants.customerPersonNameLabel)}
												className="h-9 text-xs bg-white"
											/>
										</div>
										<div className="sm:col-span-4">
											<Input
												value={person.personalId}
												onChange={(e) =>
													onUpdatePerson(person.id, { personalId: e.target.value })
												}
												placeholder={t(localizationConstants.customerPersonSocialSecurityLabel)}
												className="h-9 text-xs bg-white"
											/>
										</div>
										<div className="sm:col-span-3">
											<Input
												type="number"
												value={person.ownershipShare || ""}
												onChange={(e) =>
													onUpdatePerson(person.id, {
														ownershipShare: Number(e.target.value),
													})
												}
												placeholder="%"
												className="h-9 text-xs bg-white"
											/>
										</div>
										<div className="sm:col-span-1 text-right">
											<button
												type="button"
												onClick={() => onRemovePerson(person.id)}
												className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
												aria-label="Remove person"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
