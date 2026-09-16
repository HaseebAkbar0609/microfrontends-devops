"use client";

import Link from "next/link";
import { PencilLine, Send, Trash2 } from "lucide-react";

import type { DataTableAction, DataTableColumn } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { paymentPlanUrls } from "../paymentPlanNav";
import type { ProjectPaymentPlan } from "../types";

/**
 * The columns carrying the frame's sort arrows that sort something meaningful.
 * The frame also draws one on Handling, a column of identical buttons.
 */
export const PAYMENT_PLAN_SORT_FIELDS = [
	"planNumber",
	"name",
	"contractFileName",
] as const satisfies readonly (keyof ProjectPaymentPlan)[];

export type PaymentPlanSortField = (typeof PAYMENT_PLAN_SORT_FIELDS)[number];

function ContractFile({ fileName }: { fileName?: string }) {
	if (!fileName) {
		return (
			<>
				<span aria-hidden>—</span>
				<span className="sr-only">
					<Translate text={localizationConstants.noFileChosen} />
				</span>
			</>
		);
	}

	return (
		<span className="flex min-w-0 items-center gap-3">
			<PdfFileIcon className="h-10 w-8" />
			<span className="truncate text-sm text-slate-900">{fileName}</span>
		</span>
	);
}

/**
 * A module constant, so the table is not handed a new column array on every
 * render. "Se Plan" is a link styled as the frame's button — navigation
 * needs no handler, and middle-click opens the plan in a new tab.
 */
export const PAYMENT_PLAN_LIST_COLUMNS: DataTableColumn<ProjectPaymentPlan>[] = [
	{
		key: "planNumber",
		label: localizationConstants.colPlan,
		sortable: true,
		headerClassName: "w-24",
		cellClassName: "text-sm text-slate-900",
	},
	{
		key: "name",
		label: localizationConstants.colBetalningsplan,
		sortable: true,
		cellClassName: "text-sm text-slate-900",
	},
	{
		key: "contractFileName",
		label: localizationConstants.colFil,
		sortable: true,
		render: (plan) => <ContractFile fileName={plan.contractFileName} />,
	},
	{
		key: "handling",
		label: localizationConstants.projectPaymentPlanColHandling,
		headerClassName: "w-36",
		render: (plan) => (
			<Button
				asChild
				variant="outline"
				className="h-9 cursor-pointer border-slate-200 px-3 text-sm font-medium text-slate-900"
			>
				<Link href={paymentPlanUrls.view(plan.projectId, plan.id)}>
					<Translate text={localizationConstants.btnSePlan} />
				</Link>
			</Button>
		),
	},
];

const ICON = "h-4 w-4 shrink-0";

/** The row's ⋮ menu as the frame draws it: Öppna, Skicka, Radera. */
export function paymentPlanRowActions(handlers: {
	onOpen: (plan: ProjectPaymentPlan) => void;
	onSend: (plan: ProjectPaymentPlan) => void;
	onDelete: (plan: ProjectPaymentPlan) => void;
}): DataTableAction<ProjectPaymentPlan>[] {
	return [
		{
			label: localizationConstants.projectPaymentPlanOpen,
			icon: <PencilLine className={ICON} aria-hidden />,
			onClick: handlers.onOpen,
		},
		{
			label: localizationConstants.btnSkicka,
			icon: <Send className={ICON} aria-hidden />,
			onClick: handlers.onSend,
		},
		{
			label: localizationConstants.btnRadera,
			icon: <Trash2 className={ICON} aria-hidden />,
			onClick: handlers.onDelete,
		},
	];
}
