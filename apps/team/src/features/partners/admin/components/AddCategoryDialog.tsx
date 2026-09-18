"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { PARTNER_CATEGORY_TYPES, type PartnerCategoryRow } from "../constants/partners";
import {
	EMPTY_NEW_CATEGORY,
	newCategorySchema,
	type NewCategoryValues,
} from "../schemas/newCategory.schema";

// Business model codes read the same in Swedish and English.
const TYPE_OPTIONS = PARTNER_CATEGORY_TYPES.map((type) => ({ value: type, label: type }));

/** Today as YYYY-MM-DD in the user's time zone, not UTC. */
function todayLocalDateKey() {
	const now = new Date();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${now.getFullYear()}-${month}-${day}`;
}

type AddCategoryDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	existingNames: string[];
	onCreated: (category: PartnerCategoryRow) => void;
};

/** Adds a category that partners can be placed in. */
export function AddCategoryDialog({
	open,
	onOpenChange,
	existingNames,
	onCreated,
}: AddCategoryDialogProps) {
	const t = useTranslate();
	const form = useForm<NewCategoryValues>({
		resolver: zodResolver(newCategorySchema),
		defaultValues: EMPTY_NEW_CATEGORY,
		mode: "onSubmit",
	});

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) form.reset(EMPTY_NEW_CATEGORY);
		onOpenChange(nextOpen);
	};

	// The schema has already trimmed `category` by the time this runs.
	const submit = form.handleSubmit(({ category, type }) => {
		const taken = existingNames.some(
			(existing) => existing.trim().toLowerCase() === category.toLowerCase(),
		);
		if (taken) {
			form.setError("category", { message: localizationConstants.partnerCategoryNameTaken });
			return;
		}
		onCreated({
			id: crypto.randomUUID(),
			date: todayLocalDateKey(),
			category,
			type,
		});
		showToast("success", t(localizationConstants.partnerCategoryAddedToast));
		handleOpenChange(false);
	});

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>
						<Translate text={localizationConstants.partnerAddCategoryButton} />
					</DialogTitle>
					<DialogDescription>
						<Translate text={localizationConstants.partnerAddCategoryDescription} />
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={submit} className="space-y-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<FormInput
								control={form.control}
								name="category"
								label={localizationConstants.categoryLabel}
							/>
							<FormSelect
								control={form.control}
								name="type"
								label={localizationConstants.typeLabel}
								options={TYPE_OPTIONS}
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
								className="h-9 cursor-pointer bg-[#18181B] text-white hover:bg-[#18181B]/90"
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
