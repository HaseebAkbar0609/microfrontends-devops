import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { SpecificationDocument } from "../../types/types";
import { DetailCard } from "@/features/quote/components/shared/DetailCard";
import { FileText } from "lucide-react";


interface SpecificationTableProps {
	documents: SpecificationDocument[];
}

export function SpecificationTable({ documents }: SpecificationTableProps) {
	return (
		<DetailCard icon={FileText} title={localizationConstants.specification}>
			<Table>
				<TableHeader className="bg-slate-50/50">
					<TableRow className="hover:bg-transparent border-b border-slate-100">
						<TableHead className="text-xs font-medium text-slate-500 py-3 h-auto">
							<div className="flex items-center gap-1">
								<Translate text={localizationConstants.date} />
								<ArrowUpDown className="h-3 w-3" />
							</div>
						</TableHead>
						<TableHead className="text-xs font-medium text-slate-500 py-3 h-auto">
							<div className="flex items-center gap-1">
								<Translate text={localizationConstants.documentNameLabel} />
								<ArrowUpDown className="h-3 w-3" />
							</div>
						</TableHead>
						<TableHead className="w-32 h-auto"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{documents.map((doc) => (
						<TableRow key={doc.id} className="border-b border-slate-50 hover:bg-slate-50/30">
							<TableCell className="py-3 text-sm text-slate-900">
								{doc.date}
							</TableCell>
							<TableCell className="py-3">
								<div className="flex items-center gap-3">

									<Image
										src="/assets/pdf.svg"
										alt="PDF"
										width={40}
										height={40}
									/>
									<span className="text-sm font-medium text-slate-900">{doc.name}</span>
								</div>
							</TableCell>
							<TableCell className="py-3 text-right">
								<Button
									variant="ghost"
									size="sm"
									className="text-xs text-slate-600 font-medium hover:bg-slate-100 rounded-md"
								>
									<Translate text={localizationConstants.seeFileLabel || "See File"} />
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</DetailCard>
	);
}

