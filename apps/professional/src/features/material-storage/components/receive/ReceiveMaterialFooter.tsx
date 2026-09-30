"use client";

import { Download } from "lucide-react";
import { useWatch, type Control } from "react-hook-form";
import localizationConstants from "@/utils/translation/constants";
import type { MaterialArticle } from "../../types/materialStorage.types";
import { MaterialDialogFooter } from "../common/MaterialDialogFooter";
import type { ReceiveMaterialFormValues } from "./receiveMaterial.schema";

interface ReceiveMaterialFooterProps {
	control: Control<ReceiveMaterialFormValues>;
	articles: MaterialArticle[];
	isPending: boolean;
	onCancel: () => void;
	onSaveDraft: () => void;
}

/** Avbryt, Spara som utkast and "Ta in 120 st". */
export function ReceiveMaterialFooter({ control, articles, ...actions }: ReceiveMaterialFooterProps) {
	const [articleId, quantityText] = useWatch({ control, name: ["articleId", "quantity"] });

	return (
		<MaterialDialogFooter
			submitKey={localizationConstants.materialReceiveSubmit}
			fallbackKey={localizationConstants.materialReceiveMaterial}
			submitIcon={Download}
			unit={articles.find((article) => article.id === articleId)?.unit}
			quantityText={quantityText}
			{...actions}
		/>
	);
}
