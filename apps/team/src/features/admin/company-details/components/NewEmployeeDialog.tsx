"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormInput, FormSelect, type FormSelectOption } from "@/components/form";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	EMPLOYEE_STATUS_CONFIG,
	EMPLOYMENT_TYPE_LABEL,
	type OrganisationMember,
} from "../constants/organisation";
import { useNewEmployeeForm } from "../hooks/useNewEmployeeForm";

const TEXT_FIELDS = [
	{ name: "name", label: localizationConstants.nameLabel },
	{ name: "position", label: localizationConstants.adminPositionLabel },
	{ name: "idNumber", label: localizationConstants.adminIdNumberLabel },
	{ name: "location", label: localizationConstants.adminLocationLabel },
] as const;

type NewEmployeeDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	members: OrganisationMember[];
	onCreated: (member: OrganisationMember) => void;
};

/** Adds one employee to the organisation table. */
export function NewEmployeeDialog({
	open,
	onOpenChange,
	members,
	onCreated,
}: NewEmployeeDialogProps) {
	const { form, submit, reset } = useNewEmployeeForm({
		members,
		onCreated: (member) => {
			onCreated(member);
			onOpenChange(false);
		},
	});

	const statusOptions = useMemo<FormSelectOption[]>(
		() =>
			Object.entries(EMPLOYEE_STATUS_CONFIG).map(([value, config]) => ({
				value,
				label: <Translate text={config.labelKey} />,
			})),
		[],
	);
	const typeOptions = useMemo<FormSelectOption[]>(
		() =>
			Object.entries(EMPLOYMENT_TYPE_LABEL).map(([value, labelKey]) => ({
				value,
				label: <Translate text={labelKey} />,
			})),
		[],
	);

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) reset();
		onOpenChange(nextOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>
						<Translate text={localizationConstants.adminNewEmployeeLabel} />
					</DialogTitle>
					<DialogDescription>
						<Translate text={localizationConstants.adminNewEmployeeDescription} />
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={submit} className="space-y-4">
						<div className="grid gap-4 sm:grid-cols-2">
							{TEXT_FIELDS.map((field) => (
								<FormInput
									key={field.name}
									control={form.control}
									name={field.name}
									label={field.label}
								/>
							))}
							<FormSelect
								control={form.control}
								name="status"
								label={localizationConstants.statusLabel}
								options={statusOptions}
							/>
							<FormSelect
								control={form.control}
								name="type"
								label={localizationConstants.typeLabel}
								options={typeOptions}
							/>
							<FormInput
								control={form.control}
								name="startDate"
								type="date"
								label={localizationConstants.startDateLabel}
							/>
						</div>

						<DialogFooter className="gap-2 sm:gap-2">
							<Button
								type="button"
								variant="outline"
								className="h-9 cursor-pointer"
								onClick={() => handleOpenChange(false)}
							>
								<Translate text={localizationConstants.cancelLabel} />
							</Button>
							<Button
								type="submit"
								className="h-9 cursor-pointer bg-[#09090B] text-white hover:bg-[#27272A]"
							>
								<Translate text={localizationConstants.save} />
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
