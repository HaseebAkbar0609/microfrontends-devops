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
import { Form, FormInput, FormSelect } from "@/components/form";
import type { FormSelectOption } from "@/components/form";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { SALES_STATUSES } from "../constants/salesStatuses";
import {
	SALES_CATEGORIES,
	SALES_REGIONS,
} from "../constants/salesTaxonomy";
import { useCreateCompanyForm } from "../hooks/useCreateCompanyForm";
import { SALES_PRIMARY_BUTTON_CLASS } from "../constants/salesTheme";

type CreateCompanyDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

const TEXT_FIELDS = [
	{ name: "name", label: localizationConstants.salesFieldCompanyName },
	{
		name: "organisationNumber",
		label: localizationConstants.salesFieldOrgNumber,
	},
	{ name: "trade", label: localizationConstants.salesFieldTrade },
	{ name: "city", label: localizationConstants.salesFieldCity },
	{
		name: "contactPerson",
		label: localizationConstants.salesFieldContactPerson,
	},
	{ name: "mobile", label: localizationConstants.salesFieldMobile },
	{ name: "email", label: localizationConstants.salesFieldEmail },
] as const;

export function CreateCompanyDialog({
	open,
	onOpenChange,
}: CreateCompanyDialogProps) {
	const { form, submit, reset } = useCreateCompanyForm({
		onCreated: () => onOpenChange(false),
	});

	const categoryOptions = useMemo<FormSelectOption[]>(
		() =>
			SALES_CATEGORIES.map((option) => ({
				value: option.id,
				label: <Translate text={option.labelKey} />,
			})),
		[],
	);

	const regionOptions = useMemo<FormSelectOption[]>(
		() =>
			SALES_REGIONS.map((option) => ({
				value: option.id,
				label: <Translate text={option.labelKey} />,
			})),
		[],
	);

	const statusOptions = useMemo<FormSelectOption[]>(
		() =>
			SALES_STATUSES.map((status) => ({
				value: status.id,
				label: <Translate text={status.labelKey} />,
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
						<Translate text={localizationConstants.salesCreateCompanyTitle} />
					</DialogTitle>
					<DialogDescription>
						<Translate
							text={localizationConstants.salesCreateCompanyDescription}
						/>
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
								name="category"
								label={localizationConstants.salesFieldCategory}
								placeholder={localizationConstants.salesSelectCategoryPlaceholder}
								options={categoryOptions}
							/>
							<FormSelect
								control={form.control}
								name="region"
								label={localizationConstants.salesFieldRegion}
								placeholder={localizationConstants.salesSelectRegionPlaceholder}
								options={regionOptions}
							/>
							<FormSelect
								control={form.control}
								name="status"
								label={localizationConstants.salesFieldStatus}
								options={statusOptions}
							/>
						</div>

						<DialogFooter className="gap-2 sm:gap-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="cursor-pointer"
								onClick={() => handleOpenChange(false)}
							>
								<Translate text={localizationConstants.salesCancelButton} />
							</Button>
							<Button
								type="submit"
								size="sm"
								className={`cursor-pointer ${SALES_PRIMARY_BUTTON_CLASS}`}
							>
								<Translate text={localizationConstants.salesSaveCompanyButton} />
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
