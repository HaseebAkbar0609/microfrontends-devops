"use client";

import { FormInput } from "@/components/form";
import { Form } from "@/components/ui/form";
import localizationConstants from "@/utils/translation/constants";
import { MATERIAL_TEXT_LIMITS } from "../../constants/materialStorage.constants";
import { useReceiveMaterialForm } from "../../hooks/useReceiveMaterialForm";
import { useReceiveMaterialOptions } from "../../hooks/useReceiveMaterialOptions";
import type { MaterialDialogPreset } from "../../types/materialTransaction.types";
import { MaterialFormDialog } from "../common/MaterialFormDialog";
import { ReceiveBalanceSummary } from "./ReceiveBalanceSummary";
import { ReceiveMaterialFields } from "./ReceiveMaterialFields";
import { ReceiveMaterialFooter } from "./ReceiveMaterialFooter";

interface ReceiveMaterialDialogProps {
	open: boolean;
	preset: MaterialDialogPreset;
	onClose: () => void;
}

/**
 * "Ta in material" (TFS-1073). Mount it with a new key for every opening, so
 * the form starts clean from the preset.
 */
export function ReceiveMaterialDialog({ open, preset, onClose }: ReceiveMaterialDialogProps) {
	const { depots, articles, suppliers } = useReceiveMaterialOptions();
	const { form, selectArticle, receive, saveDraft, isPending } = useReceiveMaterialForm({
		preset,
		articles,
		depots,
		onDone: onClose,
	});

	return (
		<MaterialFormDialog
			open={open}
			title={localizationConstants.materialReceiveMaterial}
			description={localizationConstants.materialReceiveSubtitle}
			// Read during render: react-hook-form only tracks formState fields that render reads.
			isDirty={form.formState.isDirty}
			isPending={isPending}
			onClose={onClose}
			className="p-8 sm:max-w-[690px]"
		>
			{(requestClose) => (
				<Form {...form}>
					<form onSubmit={receive} noValidate className="grid gap-6">
						<ReceiveMaterialFields
							form={form}
							depots={depots}
							articles={articles}
							suppliers={suppliers}
							onSelectArticle={selectArticle}
						/>
						<ReceiveBalanceSummary control={form.control} articles={articles} />
						<FormInput
							control={form.control}
							name="comment"
							type="textarea"
							rows={3}
							label={localizationConstants.materialFieldComment}
							placeholder={localizationConstants.materialReceiveCommentPlaceholder}
							inputProps={{ maxLength: MATERIAL_TEXT_LIMITS.comment }}
						/>
						<ReceiveMaterialFooter
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
