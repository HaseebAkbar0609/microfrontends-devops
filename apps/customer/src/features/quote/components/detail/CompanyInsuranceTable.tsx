import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Shield } from "lucide-react";
import Image from "next/image";
import { DetailCard } from "@/features/quote/components/shared/DetailCard";

interface InsuranceItem {
	id: string;
	projectName: string;
	contactPerson: string;
	municipality: string;
	date: string;
	phone: string;
}

interface CompanyInsuranceTableProps {
	insurance: InsuranceItem[];
}

export function CompanyInsuranceTable({ insurance }: CompanyInsuranceTableProps) {
	return (
		<DetailCard icon={Shield} title={localizationConstants.companyInsuranceTitle}>
			<div className="bg-white rounded-lg border border-slate-100 overflow-hidden shadow-sm">
				<Table>
					<TableHeader className="bg-slate-50/30">
						<TableRow className="hover:bg-transparent border-b border-slate-100">
							<TableHead className="text-[11px] font-semibold text-slate-500 py-3 uppercase tracking-wider">
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.date} />
									<ArrowUpDown className="h-3 w-3" />
								</div>
							</TableHead>
							<TableHead className="text-[11px] font-semibold text-slate-500 py-3 uppercase tracking-wider">
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.contactPersonNameLabel} />
									<ArrowUpDown className="h-3 w-3" />
								</div>
							</TableHead>
							<TableHead className="text-[11px] font-semibold text-slate-500 py-3 uppercase tracking-wider">
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.municipalityLabel} />
									<ArrowUpDown className="h-3 w-3" />
								</div>
							</TableHead>
							<TableHead className="text-[11px] font-semibold text-slate-500 py-3 uppercase tracking-wider">
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.date} />
									<ArrowUpDown className="h-3 w-3" />
								</div>
							</TableHead>
							<TableHead className="text-[11px] font-semibold text-slate-500 py-3 uppercase tracking-wider">
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.mobileNoLabel} />
									<ArrowUpDown className="h-3 w-3" />
								</div>
							</TableHead>
							<TableHead className="text-[11px] font-semibold text-slate-500 py-3 uppercase tracking-wider text-right pr-6">
								<Translate text={localizationConstants.fileLabel} />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{insurance.map((item) => (
							<TableRow key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50">
								<TableCell className="py-4 text-sm text-slate-600">{item.projectName}</TableCell>
								<TableCell className="py-4 text-sm font-bold text-slate-900">{item.contactPerson}</TableCell>
								<TableCell className="py-4 text-sm text-slate-600 font-medium">{item.municipality}</TableCell>
								<TableCell className="py-4 text-sm text-slate-600">{item.date}</TableCell>
								<TableCell className="py-4 text-sm text-slate-600">{item.phone}</TableCell>
								<TableCell className="py-4 text-right pr-6">
									<div className="flex justify-end">
										<Image
											src="/assets/pdf.svg"
											alt="PDF"
											width={40}
											height={40}
											className="cursor-pointer hover:opacity-80 transition-opacity"
										/>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</DetailCard>
	);
}

