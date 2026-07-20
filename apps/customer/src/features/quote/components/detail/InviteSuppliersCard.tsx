import { MailPlus } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { DetailCard } from "../shared";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import type { QuoteSupplier } from "../../types/form";

interface InviteSuppliersCardProps {
	suppliers?: QuoteSupplier[];
}

export function InviteSuppliersCard({ suppliers = [] }: InviteSuppliersCardProps) {
	return (
		<DetailCard
			icon={MailPlus}
			title={localizationConstants.inviteSuppliersTitle}
			className="p-0"
		>
			<div className="border border-slate-200 rounded-lg overflow-hidden">
				<Table>
					<TableHeader className="bg-slate-50/50">
						<TableRow className="hover:bg-transparent border-slate-200">
							<TableHead className="text-xs font-semibold py-3 h-auto">
								<Translate text={localizationConstants.companyNameLabel} />
							</TableHead>
							<TableHead className="text-xs font-semibold py-3 h-auto">
								<Translate text={localizationConstants.orgNoLabel} />
							</TableHead>
							<TableHead className="text-xs font-semibold py-3 h-auto">
								<Translate text={localizationConstants.contactPersonNameLabel} />
							</TableHead>
							<TableHead className="text-xs font-semibold py-3 h-auto">
								<Translate text={localizationConstants.emailLabel} />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{suppliers.length > 0 ? (
							suppliers.map((supplier, idx) => {
								const contactName = `${supplier.contactFirstName || ""} ${supplier.contactLastName || ""}`.trim() || "-";
								return (
									<TableRow
										key={supplier.id || idx}
										className="border-slate-100 hover:bg-slate-50/30"
									>
										<TableCell className="text-sm py-4">{supplier.companyName || "-"}</TableCell>
										<TableCell className="text-sm py-4">{supplier.orgNumber || "-"}</TableCell>
										<TableCell className="text-sm py-4">{contactName}</TableCell>
										<TableCell className="text-sm py-4">{supplier.emailAddress || "-"}</TableCell>
									</TableRow>
								);
							})
						) : (
							<TableRow>
								<TableCell colSpan={4} className="text-center py-6 text-slate-400 text-sm">
									No suppliers invited
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</DetailCard>
	);
}
