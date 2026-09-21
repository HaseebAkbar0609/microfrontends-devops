"use client";

import { Plus } from "lucide-react";

import { TablePagination } from "@/components/table/TablePagination";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ProjectSectionCard } from "../../components/ProjectSectionCard";
import { SortableHead } from "../../components/SortableHead";
import type { MeetingPoint } from "../types";
import { MeetingPointRow } from "./MeetingPointRow";
import type { PointsPage } from "./usePointsPage";

const M = localizationConstants;
const HEAD = "px-3 lg:px-4";

export interface MeetingPointsCardProps {
	page: PointsPage;
	onAdd: () => void;
	onEdit: (point: MeetingPoint) => void;
	onDelete: (point: MeetingPoint) => void;
}

/**
 * The agenda, under the frame's tinted bar with "Skapa ny punkt": Nr, Ämne,
 * Beslut and Ansvarig, paged inside the card. The frame's bar reads "Title",
 * placeholder copy, so it says Mötespunkter; the "+" it draws in the last
 * header does nothing the button doesn't, and is left out. The table scrolls
 * inside the card on a phone.
 */
export function MeetingPointsCard({ page, onAdd, onEdit, onDelete }: MeetingPointsCardProps) {
	return (
		<ProjectSectionCard
			titleKey={M.projectProtocolPointsTitle}
			icon={null}
			headerClassName="rounded-t-lg bg-slate-100"
			contentClassName="p-0 sm:p-0"
			action={
				<Button
					type="button"
					onClick={onAdd}
					className="h-9 cursor-pointer gap-2 bg-[#111721] px-3 text-sm font-medium text-white hover:bg-slate-800"
				>
					<Translate text={M.protocolCreatePoint} />
					<Plus className="h-4 w-4" aria-hidden />
				</Button>
			}
		>
			<div className="w-full overflow-x-auto">
				<Table className="min-w-[40rem]">
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<SortableHead labelKey={M.protocolPointColNr} className={HEAD} />
							<SortableHead labelKey={M.protocolPointSubject} className={HEAD} />
							<SortableHead labelKey={M.protocolPointColDecision} className={HEAD} />
							<SortableHead labelKey={M.protocolFieldResponsible} className={HEAD} />
							<TableHead className="w-12" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{page.rows.length === 0 ? (
							<TableRow className="hover:bg-transparent">
								<TableCell colSpan={5} className="py-10 text-center text-sm text-slate-500">
									<Translate text={M.protocolEmptyPoints} />
								</TableCell>
							</TableRow>
						) : (
							page.rows.map((point) => (
								<MeetingPointRow key={point.id} point={point} onEdit={() => onEdit(point)} onDelete={() => onDelete(point)} />
							))
						)}
					</TableBody>
				</Table>
			</div>
			<div className="border-t border-slate-200 px-4 py-3 sm:px-6">
				<TablePagination
					currentPage={page.currentPage}
					totalPages={page.totalPages}
					pageSize={page.pageSize}
					onPageChange={page.setPage}
					onPageSizeChange={page.setPageSize}
					className="justify-center sm:justify-center"
				/>
			</div>
		</ProjectSectionCard>
	);
}

export default MeetingPointsCard;
