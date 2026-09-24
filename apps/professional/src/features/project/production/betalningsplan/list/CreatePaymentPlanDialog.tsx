"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Form, FormFileUpload, FormInput } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	CONTRACT_FILE_TYPES,
	PAYMENT_PLAN_FILE_MAX_BYTES,
	PAYMENT_PLAN_NAME_MAX_LENGTH,
} from "../paymentPlan.config";
import {
	createPaymentPlanSchema,
	EMPTY_CREATE_PAYMENT_PLAN,
	type CreatePaymentPlanValues,
} from "./createPaymentPlanSchema";

export interface CreatePaymentPlanDialogProps {
	open: boolean;
	onClose: () => void;
	onCreate: (values: CreatePaymentPlanValues) => void;
}

/**
 * "Skapa betalningsplan" — a name and, optionally, the contract.
 *
 * No frame draws it; it exists so "Skapa" does something. The caller mounts it
 * only while open, so each opening starts from an empty form.
 */
export function CreatePaymentPlanDialog({
	open,
	onClose,
	onCreate,
}: CreatePaymentPlanDialogProps) {
	const t = useTranslate();
	const translateError = (message: string) => t(message as TranslationKeys);

	const form = useForm<CreatePaymentPlanValues>({
		resolver: zodResolver(createPaymentPlanSchema) as Resolver<CreatePaymentPlanValues>,
		defaultValues: EMPTY_CREATE_PAYMENT_PLAN,
		mode: "onTouched",
	});

	return (
		<Dialog open={open} onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.projectPaymentPlanCreateTitle} />
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onCreate)}
						noValidate
						className="flex flex-col gap-4"
					>
						<FormInput
							control={form.control}
							name="name"
							label={localizationConstants.projectPaymentPlanNameLabel}
							required
							inputProps={{ maxLength: PAYMENT_PLAN_NAME_MAX_LENGTH, autoFocus: true }}
							translateError={translateError}
						/>

						<FormFileUpload
							control={form.control}
							name="contract"
							label={localizationConstants.projectPaymentPlanContractFileLabel}
							accept=".pdf"
							allowedTypes={CONTRACT_FILE_TYPES}
							maxSizeBytes={PAYMENT_PLAN_FILE_MAX_BYTES}
							buttonLabel={localizationConstants.btnLaddaUpp}
							placeholder={localizationConstants.noFileChosen}
							invalidTypeMessage={localizationConstants.projectPaymentPlanPdfOnly}
							tooLargeMessage={localizationConstants.projectPaymentPlanFileTooLarge}
							showPreview={false}
							buttonClassName="hidden"
							translateError={translateError}
						/>

						<DialogFooter className="gap-2 sm:gap-3">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="cursor-pointer border-slate-200"
							>
								<Translate text={localizationConstants.btnAvbryt} />
							</Button>
							<Button
								type="submit"
								className="cursor-pointer bg-[#111721] text-white hover:bg-slate-800"
							>
								<Translate text={localizationConstants.projectPaymentPlanCreate} />
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default CreatePaymentPlanDialog;
