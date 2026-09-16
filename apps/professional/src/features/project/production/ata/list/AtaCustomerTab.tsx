"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ProjectRowsToolbar } from "../../../components/ProjectRowsToolbar";
import { ataUrls } from "../ataNav";
import type { ProjectAta } from "../types";
import { AtaSummaryBox } from "./AtaSummaryBox";
import { AtaTableCard } from "./AtaTableCard";
import type { ProjectAtaListState } from "./useProjectAtaList";

/* Radix leaves `pointer-events: none` on <body> when a dialog opens in the tick
   a menu item closes; defer by a macrotask. A timeout, not rAF, which never
   fires in an occluded page. */
const defer = (fn: () => void) => setTimeout(fn, 0);

export interface AtaCustomerTabProps {
	projectId: string;
	list: ProjectAtaListState;
}

/**
 * ÄTA - kund: Sök, Filter, Skriv ut and Skapa ÄTA over the summary box and the
 * table, with send and delete behind confirms.
 */
export function AtaCustomerTab({ projectId, list }: AtaCustomerTabProps) {
	const router = useRouter();
	const [sending, setSending] = useState<ProjectAta | null>(null);
	const [deleting, setDeleting] = useState<ProjectAta | null>(null);

	return (
		<div className="flex flex-col gap-4">
			<ProjectRowsToolbar
				search={list.search}
				onSearchChange={list.setSearch}
				filter={list.filter}
				onFilterChange={list.setFilter}
				filterOptions={list.filterOptions}
				action={
					<Button
						asChild
						className="h-10 cursor-pointer gap-2 rounded-md bg-[#111721] px-4 text-sm font-medium text-white hover:bg-slate-800"
					>
						<Link href={ataUrls.create(projectId)}>
							<Plus className="h-4 w-4 shrink-0" aria-hidden />
							<Translate text={localizationConstants.ataCreateButton} />
						</Link>
					</Button>
				}
			/>

			<AtaSummaryBox total={list.summary.total} count={list.summary.count} />

			<AtaTableCard
				list={list}
				onEdit={(ata) => router.push(ataUrls.edit(projectId, ata.id))}
				onDelete={(ata) => defer(() => setDeleting(ata))}
				onSend={(ata) => defer(() => setSending(ata))}
			/>

			<ConfirmActionDialog
				open={Boolean(sending)}
				onOpenChange={(open) => !open && setSending(null)}
				title={localizationConstants.projectAtaSendTitle}
				description={localizationConstants.projectAtaSendBody}
				confirmLabel={localizationConstants.ataActionSend}
				subject={sending ? list.labels.number(sending.number) : undefined}
				onConfirm={() => {
					if (sending) list.send(sending);
					setSending(null);
				}}
			/>

			<ConfirmActionDialog
				open={Boolean(deleting)}
				onOpenChange={(open) => !open && setDeleting(null)}
				title={localizationConstants.ataDeleteConfirmTitle}
				description={localizationConstants.ataDeleteConfirmDesc}
				confirmLabel={localizationConstants.ataActionDelete}
				subject={deleting ? list.labels.number(deleting.number) : undefined}
				destructive
				onConfirm={() => {
					if (deleting) list.remove(deleting);
					setDeleting(null);
				}}
			/>
		</div>
	);
}

export default AtaCustomerTab;
