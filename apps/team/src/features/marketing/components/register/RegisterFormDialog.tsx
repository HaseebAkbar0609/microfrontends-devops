"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { useRegisterForm } from "../../hooks/useRegisterForm";
import type { MarketingSection } from "../../types";
import { RegisterFieldInput } from "./RegisterFieldInput";

type RegisterFormDialogProps = {
	section: MarketingSection;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	registerForm: ReturnType<typeof useRegisterForm>;
};

/**
 * Add and edit in one dialog. Validation is zod plus React Hook Form, so a
 * missing title is an inline message under the field — the prototype checked
 * the first field for truthiness and raised a toast.
 */
export function RegisterFormDialog({
	section,
	open,
	onOpenChange,
	registerForm,
}: RegisterFormDialogProps) {
	const { form, submit, editingId } = registerForm;
	const t = useTranslate();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>
						{`${t(
							editingId
								? localizationConstants.marketingEditRowTitle
								: localizationConstants.marketingAddRowTitle,
						)} – ${t(section.titleKey)}`}
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={submit} className="flex flex-col gap-4">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							{section.fields.map((field) => (
								<RegisterFieldInput
									key={field.name}
									control={form.control}
									field={field}
								/>
							))}
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								className="cursor-pointer"
								onClick={() => onOpenChange(false)}
							>
								{t(localizationConstants.marketingCancelButton)}
							</Button>
							<Button type="submit" className="cursor-pointer">
								{t(localizationConstants.marketingSaveButton)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default RegisterFormDialog;
