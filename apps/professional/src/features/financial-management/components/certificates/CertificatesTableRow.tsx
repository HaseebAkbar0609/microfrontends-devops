"use client";

import React from "react";
import { MoreVertical, Edit2, Archive, Trash2 } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CertificateItem } from "../../types/certificates.types";

interface CertificatesTableRowProps {
	item: CertificateItem;
	onView: (item: CertificateItem) => void;
	onEdit: (item: CertificateItem) => void;
	onArchive: (item: CertificateItem) => void;
	onDelete: (item: CertificateItem) => void;
}

export function CertificatesTableRow({
	item,
	onView,
	onEdit,
	onArchive,
	onDelete,
}: CertificatesTableRowProps) {
	return (
		<tr
			onClick={() => onView(item)}
			className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors cursor-pointer group text-sm"
		>
			{/* ID */}
			<td className="px-6 py-4 font-normal text-slate-800 whitespace-nowrap">
				{item.id}
			</td>

			{/* Objekt */}
			<td className="px-6 py-4 font-normal text-slate-800 whitespace-nowrap">
				{item.objectId || item.objectType}
			</td>

			{/* Benämning */}
			<td className="px-6 py-4 font-normal text-slate-800">
				{item.name}
			</td>

			{/* Attest ansvarig */}
			<td className="px-6 py-4">
				<div className="flex flex-col">
					<span className="font-semibold text-slate-900">
						{item.responsiblePerson === "Ej tildelad" ? (
							<Translate text={localizationConstants.fieldCertUnassigned} />
						) : (
							item.responsiblePerson
						)}
					</span>
					{item.responsibleRole && (
						<span className="text-xs text-blue-600/80 font-normal">
							{item.responsibleRole}
						</span>
					)}
				</div>
			</td>

			{/* Masterattest */}
			<td className="px-6 py-4">
				{item.masterApprover ? (
					<div className="flex flex-col">
						<span className="font-semibold text-slate-900">
							{item.masterApprover}
						</span>
						{item.masterRole && (
							<span className="text-xs text-blue-600/80 font-normal">
								{item.masterRole}
							</span>
						)}
					</div>
				) : (
					<span className="text-slate-400 text-xs">—</span>
				)}
			</td>

			{/* Action Menu (...) */}
			<td
				className="px-6 py-4 text-right"
				onClick={(e) => e.stopPropagation()}
			>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"
						>
							<MoreVertical className="w-4 h-4" />
							<span className="sr-only">
								<Translate text={localizationConstants.actionsAriaLabel} />
							</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-36 bg-white shadow-lg border border-slate-200">
						<DropdownMenuItem
							onClick={() => onEdit(item)}
							className="cursor-pointer text-slate-700 hover:text-slate-900 gap-2 py-2"
						>
							<Edit2 className="w-3.5 h-3.5 text-slate-500" />
							<Translate text={localizationConstants.btnEditCertificate} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onArchive(item)}
							className="cursor-pointer text-slate-700 hover:text-slate-900 gap-2 py-2"
						>
							<Archive className="w-3.5 h-3.5 text-slate-500" />
							<Translate text={localizationConstants.btnArchiveCertificate} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onDelete(item)}
							className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 gap-2 py-2"
						>
							<Trash2 className="w-3.5 h-3.5 text-red-500" />
							<Translate text={localizationConstants.btnDeleteCertificate} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</td>
		</tr>
	);
}
