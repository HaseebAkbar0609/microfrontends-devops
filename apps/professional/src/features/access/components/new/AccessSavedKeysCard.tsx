"use client";

import { useMemo } from "react";
import { Eye, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ACCESS_TYPE_LABELS } from "../../constants/access.constants";
import { ACCESS_NUMBER_LOCALE } from "../../constants/accessNew.constants";
import { ACCESS_KEY_MOCK_SUBTOTAL, ACCESS_KEY_MOCK_UNIT_PRICE } from "../../constants/accessNewLimits.constants";
import type { AccessNewKey } from "../../types/accessNew.types";

interface AccessSavedKeysCardProps {
	keys: AccessNewKey[];
	/** Shown under the table when the user tried to finish with no key saved. */
	showEmptyError: boolean;
	onView: (key: AccessNewKey) => void;
	onRemove: (key: AccessNewKey) => void;
}

/**
 * "Saved Keys" section: every key saved so far, with the pricing columns of the Figma
 * table. No pricing source exists, so unit price and subtotal are the frame's placeholder numbers.
 */
export function AccessSavedKeysCard({ keys, showEmptyError, onView, onRemove }: AccessSavedKeysCardProps) {
	const t = useTranslate();

	const columns = useMemo<DataTableColumn<AccessNewKey>[]>(
		() => [
			{ key: "keyId", label: localizationConstants.accessItemFieldKeyId, cellClassName: "text-slate-900" },
			{ key: "type", label: localizationConstants.accessColType, render: (row) => t(ACCESS_TYPE_LABELS[row.type]) },
			{ key: "regNo", label: localizationConstants.accessItemColRegNo },
			{ key: "startDate", label: localizationConstants.accessItemColStartDate },
			{ key: "returnDate", label: localizationConstants.accessItemFieldReturnDate },
			{
				key: "accessTo",
				label: localizationConstants.accessItemColAccessTo,
				render: (row) => (
					<span className="inline-flex items-center gap-1">
						<span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-900">{row.accessTo[0]}</span>
						{row.accessTo.length > 1 && <span className="text-xs text-slate-500">+{row.accessTo.length - 1}</span>}
					</span>
				),
			},
			{ key: "company", label: localizationConstants.accessAssignedCompany },
			{ key: "person", label: localizationConstants.accessAssignedPerson },
			{
				key: "unitPrice",
				label: localizationConstants.accessNewColUnitPrice,
				render: () => ACCESS_KEY_MOCK_UNIT_PRICE.toLocaleString(ACCESS_NUMBER_LOCALE),
			},
			{
				key: "subtotal",
				label: localizationConstants.accessNewColSubtotal,
				render: () => ACCESS_KEY_MOCK_SUBTOTAL.toLocaleString(ACCESS_NUMBER_LOCALE),
			},
		],
		[t],
	);

	return (
		<section className="flex flex-col gap-3">
			<h2 className="rounded-md bg-slate-200/70 px-4 py-3 text-xl font-semibold text-slate-900">
				<Translate text={localizationConstants.accessNewSavedKeys} />
			</h2>
			<div className="rounded-xl border border-slate-200 bg-white">
				<h3 className="border-b border-slate-200 px-4 py-3 text-base font-semibold text-slate-900">
					<Translate text={localizationConstants.accessNewKeyDetails} />
				</h3>
				<div className="p-4">
					<DataTable
						data={keys}
						columns={columns}
						rowKey={(row) => row.id}
						emptyMessageKey={localizationConstants.accessNewKeysEmpty}
						primaryAction={(row) => (
							<div className="flex items-center justify-end gap-1">
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="cursor-pointer"
									aria-label={t(localizationConstants.accessViewLabel, { name: row.keyId })}
									onClick={() => onView(row)}
								>
									<Eye className="h-4 w-4" aria-hidden />
								</Button>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="cursor-pointer"
									aria-label={t(localizationConstants.accessNewRemoveLabel, { name: row.keyId })}
									onClick={() => onRemove(row)}
								>
									<Trash2 className="h-4 w-4" aria-hidden />
								</Button>
							</div>
						)}
					/>
					{showEmptyError && keys.length === 0 && (
						<p role="alert" className="mt-3 text-sm text-red-600">
							<Translate text={localizationConstants.accessErrorNoKeys} />
						</p>
					)}
				</div>
			</div>
		</section>
	);
}
