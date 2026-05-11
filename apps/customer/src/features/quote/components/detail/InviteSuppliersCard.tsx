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

export function InviteSuppliersCard() {
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
						{[
							{
								name: "Pelle Construction",
								org: "982 234 2341",
								contact: "Peter Svensson",
								email: "peter@pellebygg.se",
							},
							{
								name: "Nisse Construction",
								org: "982 234 2341",
								contact: "Nisse Olsson",
								email: "nisse@nissebygg.se",
							},
							{
								name: "CL Construction",
								org: "982 234 2341",
								contact: "Conny Larson",
								email: "conny@larson.se",
							},
						].map((supplier, idx) => (
							<TableRow
								key={idx}
								className="border-slate-100 hover:bg-slate-50/30"
							>
								<TableCell className="text-sm py-4">{supplier.name}</TableCell>
								<TableCell className="text-sm py-4">{supplier.org}</TableCell>
								<TableCell className="text-sm py-4">{supplier.contact}</TableCell>
								<TableCell className="text-sm py-4">{supplier.email}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</DetailCard>
	);
}
