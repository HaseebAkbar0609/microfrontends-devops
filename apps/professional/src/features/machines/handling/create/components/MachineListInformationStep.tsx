"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { LINKABLE_OBJECTS, RESPONSIBLE_PEOPLE } from "../data/newMachineList.mock";
import type {
	LinkableObject,
	LinkableObjectType,
} from "../types/newMachineList.types";

interface MachineListInformationStepProps {
	objectType: LinkableObjectType;
	onObjectTypeChange: (type: LinkableObjectType) => void;
	selectedObjectId: string;
	onSelectedObjectChange: (id: string) => void;
	linkedObject: LinkableObject | null;
	onLink: () => void;
	responsible: string;
	onResponsibleChange: (value: string) => void;
	email: string;
	phone: string;
}

const OBJECT_TYPES: { value: LinkableObjectType; labelKey: TranslationKeys }[] = [
	{ value: "order", labelKey: localizationConstants.machineListTypeOrder },
	{ value: "project", labelKey: localizationConstants.machineListTypeProject },
	{
		value: "service_vehicle",
		labelKey: localizationConstants.machineListTypeServiceVehicle,
	},
];

/** Read-only field, populated once an object is linked. */
function ReadOnlyField({
	labelKey,
	value,
}: {
	labelKey: TranslationKeys;
	value: string;
}) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-1.5">
			<Label className="text-sm font-medium text-slate-900">
				<Translate text={labelKey} />
			</Label>
			<Input
				readOnly
				value={value}
				placeholder={t(labelKey)}
				className="h-10 cursor-default border-slate-200 bg-slate-50 text-sm text-slate-600"
			/>
		</div>
	);
}

/**
 * Step 1: pick what the machine list belongs to, link the object, and confirm
 * the details it brings with it. Everything under "Objekt Information" is
 * read-only because it is owned by the linked order/project/vehicle.
 */
export function MachineListInformationStep({
	objectType,
	onObjectTypeChange,
	selectedObjectId,
	onSelectedObjectChange,
	linkedObject,
	onLink,
	responsible,
	onResponsibleChange,
	email,
	phone,
}: MachineListInformationStepProps) {
	const { t } = useTranslation();
	const options = LINKABLE_OBJECTS.filter((obj) => obj.type === objectType);

	return (
		<div className="flex flex-col gap-6">
			<div className="rounded-lg border border-slate-200 bg-white p-4">
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					{OBJECT_TYPES.map((type) => (
						<button
							key={type.value}
							type="button"
							onClick={() => onObjectTypeChange(type.value)}
							aria-pressed={objectType === type.value}
							className={`flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2.5 text-sm transition-colors ${
								objectType === type.value
									? "border-slate-900 text-slate-900"
									: "border-slate-200 text-slate-600 hover:border-slate-300"
							}`}
						>
							<span
								className={`flex h-4 w-4 items-center justify-center rounded-full border ${
									objectType === type.value
										? "border-slate-900"
										: "border-slate-300"
								}`}
							>
								{objectType === type.value && (
									<span className="h-2 w-2 rounded-full bg-slate-900" />
								)}
							</span>
							<Translate text={type.labelKey} />
						</button>
					))}
				</div>

				<div className="mt-4 flex flex-col gap-1.5">
					<Label className="text-sm font-medium text-slate-900">
						<Translate text={localizationConstants.machineListLinkObject} />
					</Label>
					<Select value={selectedObjectId} onValueChange={onSelectedObjectChange}>
						<SelectTrigger className="h-10 w-full cursor-pointer border-slate-200 bg-white text-sm text-slate-700">
							<SelectValue
								placeholder={t(localizationConstants.machineListSelect)}
							/>
						</SelectTrigger>
						<SelectContent className="bg-white">
							{options.map((obj) => (
								<SelectItem key={obj.id} value={obj.id}>
									{obj.objectNo} — {obj.objectName}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="mt-4 flex justify-end">
					<Button
						type="button"
						onClick={onLink}
						className="h-10 cursor-pointer bg-[#111721] px-6 text-sm font-medium text-white hover:bg-slate-800"
					>
						<Translate text={localizationConstants.machineListLinkButton} />
					</Button>
				</div>
			</div>

			<Card>
				<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<Info className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.machineListObjectInfo} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<ReadOnlyField
							labelKey={localizationConstants.machineListObjectNo}
							value={linkedObject?.objectNo ?? ""}
						/>
						<ReadOnlyField
							labelKey={localizationConstants.machineListObjectName}
							value={linkedObject?.objectName ?? ""}
						/>
						<ReadOnlyField
							labelKey={localizationConstants.machineListProjectAddress}
							value={linkedObject?.address ?? ""}
						/>
						<ReadOnlyField
							labelKey={localizationConstants.machineListPostalCode}
							value={linkedObject?.postalCode ?? ""}
						/>
						<ReadOnlyField
							labelKey={localizationConstants.machineListCity}
							value={linkedObject?.city ?? ""}
						/>
						<ReadOnlyField
							labelKey={localizationConstants.machineHandlingStart}
							value={linkedObject?.startDate ?? ""}
						/>
						<ReadOnlyField
							labelKey={localizationConstants.machineHandlingEnd}
							value={linkedObject?.endDate ?? ""}
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<Info className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.machineListResponsible} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium text-slate-900">
								<Translate
									text={localizationConstants.machineListResponsiblePerson}
								/>
							</Label>
							<Select value={responsible} onValueChange={onResponsibleChange}>
								<SelectTrigger className="h-10 w-full cursor-pointer border-slate-200 bg-white text-sm text-slate-700">
									<SelectValue
										placeholder={t(
											localizationConstants.machineListResponsiblePerson
										)}
									/>
								</SelectTrigger>
								<SelectContent className="bg-white">
									{RESPONSIBLE_PEOPLE.map((person) => (
										<SelectItem key={person.value} value={person.value}>
											{person.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Contact details follow from the chosen person. */}
						<ReadOnlyField
							labelKey={localizationConstants.machineListEmail}
							value={email}
						/>
						<ReadOnlyField
							labelKey={localizationConstants.machineListPhone}
							value={phone}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
