"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type {
	ProjectContactPerson,
	ProjectOrganisationData,
} from "../types";

const HEADERS: TranslationKeys[] = [
	localizationConstants.projectCreateContractorTypeLabel,
	localizationConstants.orderOrganisationTab,
	localizationConstants.agreementAddress,
	localizationConstants.orderPostNrLabel,
];

const CELL_CLASS = "px-4 py-3 text-sm whitespace-nowrap text-slate-900";

export interface SummaryOrganisationCardProps {
	organisation: ProjectOrganisationData;
	isOpen: boolean;
	action: React.ReactNode;
	onShowInfo: (contact: ProjectContactPerson | null) => void;
}

/**
 * The Organisation block on the Sammanställning step.
 *
 * The frame draws one row per contact under an "Allmän information" heading,
 * each with a "Se information" link that opens the read-only dialog. With no
 * contacts, the organisation itself is still one row, so the entreprenör the
 * user chose does not vanish from the summary.
 */
export function SummaryOrganisationCard({
	organisation,
	isOpen,
	action,
	onShowInfo,
}: SummaryOrganisationCardProps) {
	const t = useTranslate();
	const contacts = organisation.contacts ?? [];
	const rows: (ProjectContactPerson | null)[] =
		contacts.length > 0 ? contacts : [null];

	return (
		<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
			<CardHeader className="flex h-14 flex-row items-center justify-between border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
				<CardTitle className="text-base font-medium text-slate-900">
					<Translate text={localizationConstants.orderOrganisationTab} />
				</CardTitle>
				{action}
			</CardHeader>

			{isOpen && (
				<CardContent className="p-6">
					<div className="overflow-hidden rounded-lg border border-slate-200">
						<div className="bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900">
							<Translate
								text={localizationConstants.orderGeneralInformation}
							/>
						</div>

						<div className="w-full overflow-x-auto bg-white">
							<Table className="w-full min-w-[640px]">
								<TableHeader>
									<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
										{HEADERS.map((label) => (
											<TableHead
												key={label}
												className="px-4 py-3 text-sm font-medium whitespace-nowrap text-slate-500"
											>
												<Translate text={label} />
											</TableHead>
										))}
										<TableHead className="px-4 py-3" />
									</TableRow>
								</TableHeader>

								<TableBody>
									{rows.map((contact, index) => (
										<TableRow
											key={contact?.id ?? "organisation-only"}
											className="border-b border-slate-100 last:border-b-0"
										>
											<TableCell className={CELL_CLASS}>
												{organisation.contractorType}
											</TableCell>
											<TableCell className={CELL_CLASS}>
												{organisation.organizationName}
											</TableCell>
											<TableCell className={CELL_CLASS}>
												{organisation.address}
											</TableCell>
											<TableCell className={CELL_CLASS}>
												{organisation.postalCode}
											</TableCell>
											<TableCell className="px-4 py-3 text-right">
												<Button
													type="button"
													variant="link"
													onClick={() => onShowInfo(contact)}
													aria-label={`${t(localizationConstants.orderViewDetailsButton)} ${index + 1}`}
													className="h-auto cursor-pointer p-0 text-sm font-medium text-slate-900 underline"
												>
													<Translate
														text={
															localizationConstants.orderViewDetailsButton
														}
													/>
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>
				</CardContent>
			)}
		</Card>
	);
}

export default SummaryOrganisationCard;
