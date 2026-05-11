import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Users } from "lucide-react";
import Image from "next/image";
import { DetailCard } from "@/features/quote/components/shared/DetailCard";

interface Person {
	id: string;
	name: string;
	position: string;
	certifications: string;
}

interface PersonnelTableProps {
	personnel: Person[];
}

export function PersonnelTable({ personnel }: PersonnelTableProps) {
	return (
		<DetailCard icon={Users} title={localizationConstants.personnelTitle}>
			<div className="bg-white rounded-lg border border-slate-100 overflow-hidden shadow-sm">
				<Table>
					<TableHeader className="bg-slate-50/30">
						<TableRow className="hover:bg-transparent border-b border-slate-100">
							<TableHead className="text-[11px] font-semibold text-slate-500 py-3 uppercase tracking-wider">
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.firstNameLabel} />
									<ArrowUpDown className="h-3 w-3" />
								</div>
							</TableHead>
							<TableHead className="text-[11px] font-semibold text-slate-500 py-3 uppercase tracking-wider">
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.positionLabel} />
									<ArrowUpDown className="h-3 w-3" />
								</div>
							</TableHead>
							<TableHead className="text-[11px] font-semibold text-slate-500 py-3 uppercase tracking-wider">
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.certificationsLabel} />
									<ArrowUpDown className="h-3 w-3" />
								</div>
							</TableHead>
							<TableHead className="text-[11px] font-semibold text-slate-500 py-3 uppercase tracking-wider text-right pr-6">
								<Translate text={localizationConstants.fileLabel} />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{personnel.map((person) => (
							<TableRow key={person.id} className="border-b border-slate-50 hover:bg-slate-50/50">
								<TableCell className="py-4 text-sm font-bold text-slate-900">{person.name}</TableCell>
								<TableCell className="py-4 text-sm text-slate-600">{person.position}</TableCell>
								<TableCell className="py-4 text-sm text-slate-600">{person.certifications}</TableCell>
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

