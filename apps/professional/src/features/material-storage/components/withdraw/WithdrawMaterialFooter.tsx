"use client";

import { ArrowUpRight } from "lucide-react";
import { useWatch, type Control } from "react-hook-form";
import localizationConstants from "@/utils/translation/constants";
import type { MaterialArticle } from "../../types/materialStorage.types";
import { MaterialDialogFooter } from "../common/MaterialDialogFooter";
import type { WithdrawMaterialFormValues } from "./withdrawMaterial.schema";

interface WithdrawMaterialFooterProps {
	control: Control<WithdrawMaterialFormValues>;
	articles: MaterialArticle[];
	isPending: boolean;
	onCancel: () => void;
	onSaveDraft: () => void;
}

/** Avbryt, Spara som utkast and "Ta ut 40 st". */
export function WithdrawMaterialFooter({ control, articles, ...actions }: WithdrawMaterialFooterProps) {
	const [articleId, quantityText] = useWatch({ control, name: ["articleId", "quantity"] });

	return (
		<MaterialDialogFooter
			submitKey={localizationConstants.materialWithdrawSubmit}
			fallbackKey={localizationConstants.materialWithdrawMaterial}
			submitIcon={ArrowUpRight}
			unit={articles.find((article) => article.id === articleId)?.unit}
			quantityText={quantityText}
			{...actions}
		/>
	);
}
