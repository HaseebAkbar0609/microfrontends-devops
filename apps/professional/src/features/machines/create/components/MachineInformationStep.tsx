"use client";

import type { Control } from "react-hook-form";
import { Info } from "lucide-react";
import { FormInput, FormSelect, FormDatePicker } from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	CATEGORY_OPTIONS,
	LOCATION_OPTIONS,
	UNIT_OPTIONS,
} from "../data/newMachine.config";
import type { NewMachineFormData } from "../types/newMachine.types";

interface MachineInformationStepProps {
	readonly control: Control<NewMachineFormData>;
}

/** Marks a field as required, matching how the other create forms label them. */
function RequiredLabel({ text }: { text: string }) {
	return (
		<>
			<Translate text={text} /> <span className="text-red-500">*</span>
		</>
	);
}

/**
 * Step 1 of the "Lagg till ny verktygsmaskin" wizard: the MaskinInformation
 * card in a two-column grid, followed by the free-text Instruktion card.
 */
export function MachineInformationStep({
	control,
}: MachineInformationStepProps) {
	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<Info className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.machineCreateInfoCard} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
						{/* Assigned by the backend, so read-only here. */}
						<FormInput
							control={control}
							name="machineNo"
							label={<Translate text={localizationConstants.machineColumnId} />}
							disabled
						/>
						<FormInput
							control={control}
							name="name"
							label={<RequiredLabel text={localizationConstants.machine} />}
							placeholder={localizationConstants.machine}
						/>
						<FormInput
							control={control}
							name="factory"
							label={
								<RequiredLabel
									text={localizationConstants.machineColumnFactory}
								/>
							}
							placeholder={localizationConstants.machineColumnFactory}
						/>
						<FormInput
							control={control}
							name="designation"
							label={
								<RequiredLabel
									text={localizationConstants.machineColumnDesignation}
								/>
							}
							placeholder={localizationConstants.machineColumnDesignation}
						/>
						<FormSelect
							control={control}
							name="category"
							label={
								<RequiredLabel
									text={localizationConstants.machineColumnCategory}
								/>
							}
							placeholder={localizationConstants.machineColumnCategory}
							options={CATEGORY_OPTIONS}
						/>
						<FormDatePicker
							control={control}
							name="purchaseDate"
							label={
								<RequiredLabel
									text={localizationConstants.machineColumnPurchase}
								/>
							}
							placeholder={localizationConstants.machineColumnPurchase}
						/>
						<FormInput
							control={control}
							name="internalRent"
							label={
								<RequiredLabel
									text={localizationConstants.machineColumnInternalRent}
								/>
							}
							placeholder={localizationConstants.machineColumnInternalRent}
						/>
						<FormSelect
							control={control}
							name="unit"
							label={
								<RequiredLabel text={localizationConstants.machineColumnUnit} />
							}
							placeholder={localizationConstants.machineColumnUnit}
							options={UNIT_OPTIONS}
						/>
						<FormSelect
							control={control}
							name="location"
							label={
								<RequiredLabel
									text={localizationConstants.machineColumnLocation}
								/>
							}
							placeholder={localizationConstants.machineColumnLocation}
							options={LOCATION_OPTIONS}
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<Info className="h-5 w-5 text-slate-700" />
						<Translate
							text={localizationConstants.machineCreateInstructionCard}
						/>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<FormInput
						control={control}
						name="instruction"
						type="textarea"
						rows={3}
						label={
							<Translate
								text={localizationConstants.machineCreateInstructionText}
							/>
						}
						placeholder={localizationConstants.machineCreateInstructionText}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
