"use client";

import { FormInput } from "@/components/form";
import { Form } from "@/components/ui/form";
import localizationConstants from "@/utils/translation/constants";
import { MATERIAL_TEXT_LIMITS } from "../../constants/materialStorage.constants";
import { useMaterialCatalog } from "../../hooks/useMaterialCatalog";
import { useWithdrawMaterialForm } from "../../hooks/useWithdrawMaterialForm";
import type { MaterialDialogPreset } from "../../types/materialTransaction.types";
import { MaterialFormDialog } from "../common/MaterialFormDialog";
import { WithdrawChargeRow } from "./WithdrawChargeRow";
import { WithdrawLinkFields } from "./WithdrawLinkFields";
import { WithdrawMaterialFooter } from "./WithdrawMaterialFooter";
import { WithdrawStockFields } from "./WithdrawStockFields";
import { WithdrawSummary } from "./WithdrawSummary";

interface WithdrawMaterialDialogProps {
	open: boolean;
	preset: MaterialDialogPreset;
	onClose: () => void;
}

/**
 * "Ta ut material" (TFS-1074). Mount it with a new key for every opening, so
 * the form starts clean from the preset.
 */
export function WithdrawMaterialDialog({ open, preset, onClose }: WithdrawMaterialDialogProps) {
	const { depots, articles } = useMaterialCatalog();
	const { form, selectArticle, clearArticle, withdraw, saveDraft, isPending } = useWithdrawMaterialForm({
		preset,
		articles,
		depots,
		onDone: onClose,
	});

	return (
		<MaterialFormDialog
			open={open}
			title={localizationConstants.materialWithdrawMaterial}
			description={localizationConstants.materialWithdrawSubtitle}
			// Read during render: react-hook-form only tracks formState fields that render reads.
			isDirty={form.formState.isDirty}
			isPending={isPending}
			onClose={onClose}
			className="p-4 sm:max-w-[740px] sm:p-9"
		>
			{(requestClose) => (
				<Form {...form}>
					<form onSubmit={withdraw} noValidate className="grid gap-6">
						{/* Two columns split by a line, the right one a little wider, as in Figma. */}
						<div className="grid grid-cols-1 gap-5 sm:grid-cols-[minmax(0,4fr)_1px_minmax(0,5fr)]">
							<WithdrawStockFields
								form={form}
								depots={depots}
								articles={articles}
								onSelectArticle={selectArticle}
								onClearArticle={clearArticle}
							/>
							<span className="hidden bg-slate-200 sm:block" aria-hidden />
							<WithdrawLinkFields form={form} />
						</div>
						<WithdrawSummary control={form.control} articles={articles} />
						<WithdrawChargeRow control={form.control} articles={articles} />
						<FormInput
							control={form.control}
							name="comment"
							type="textarea"
							rows={3}
							label={localizationConstants.materialFieldComment}
							placeholder={localizationConstants.materialWithdrawCommentPlaceholder}
							inputProps={{ maxLength: MATERIAL_TEXT_LIMITS.comment }}
						/>
						<WithdrawMaterialFooter
							control={form.control}
							articles={articles}
							isPending={isPending}
							onCancel={requestClose}
							onSaveDraft={() => void saveDraft()}
						/>
					</form>
				</Form>
			)}
		</MaterialFormDialog>
	);
}
