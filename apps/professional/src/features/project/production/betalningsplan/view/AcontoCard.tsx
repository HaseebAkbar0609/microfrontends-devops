"use client";

import { Folder, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { PaymentPlanEditor } from "./usePaymentPlanEditor";
import type { PlanViewDialogs } from "./usePlanViewDialogs";
import { AcontoSummary } from "./AcontoSummary";
import { AcontoTable } from "./AcontoTable";
import { ProjectSectionCard } from "../../components/ProjectSectionCard";
import { PlanCardHeaderAction } from "./PlanCardHeaderAction";

export interface AcontoCardProps {
	editor: PaymentPlanEditor;
	dialogs: PlanViewDialogs;
}

/**
 * Innehöll medel — the plan's acontos and what has been sent.
 *
 * The frames draw two states of this card. While the plan is a draft its
 * header offers "Lägga till". Once sent it shows the Ekonomi column and a
 * pencil instead; the pencil unlocks the rows, bringing "Lägga till" back.
 */
export function AcontoCard({ editor, dialogs }: AcontoCardProps) {
	const plan = editor.plan;
	if (!plan || !editor.summary) return null;

	const sent = plan.status === "sent";

	const action = editor.acontosEditable ? (
		<Button
			type="button"
			onClick={() => dialogs.open({ kind: "addAconto" })}
			className="h-10 cursor-pointer gap-2 rounded-md bg-[#111721] px-4 text-sm font-medium text-white hover:bg-slate-800"
		>
			<Plus className="h-4 w-4" aria-hidden />
			<Translate text={localizationConstants.btnLaggTill} />
		</Button>
	) : (
		<PlanCardHeaderAction
			labelKey={localizationConstants.projectPaymentPlanEditAcontos}
			onClick={editor.unlockAcontos}
		/>
	);

	return (
		<ProjectSectionCard
			titleKey={localizationConstants.sectionInnehollMedel}
			icon={<Folder className="h-5 w-5 text-slate-700" aria-hidden />}
			action={action}
			contentClassName="flex flex-col gap-4"
		>
			<AcontoTable
				acontos={plan.acontos}
				showEconomy={sent}
				editable={editor.acontosEditable}
				dirty={editor.dirty}
				onEdit={(aconto) => dialogs.open({ kind: "editAconto", aconto })}
				onDelete={(aconto) => dialogs.open({ kind: "deleteAconto", aconto })}
				onCreateInvoice={(aconto) => dialogs.open({ kind: "createInvoice", aconto })}
				onViewInvoice={(aconto) => dialogs.open({ kind: "viewInvoice", aconto })}
			/>
			<AcontoSummary summary={editor.summary} />
		</ProjectSectionCard>
	);
}

export default AcontoCard;
