import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Award } from "lucide-react";
import { Search } from "@/components/search/Search";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DetailCard } from "@/features/quote/components/shared/DetailCard";

interface Certificate {
	id: string;
	date: string;
	name: string;
	text: string;
}

interface CertificatesTableProps {
	certificates: Certificate[];
}

export function CertificatesTable({ certificates }: CertificatesTableProps) {
	return (
		<>
			<div className="flex flex-col md:flex-row md:items-center justify-start gap-4 mb-4 pt-2">
				<div className="flex items-center gap-2">
					<Search
						placeholder={localizationConstants.searchPlaceholder}
						wrapperClassName="w-full md:w-64"
						// className="bg-white border-slate-200 h-9 text-sm rounded-md border"
					/>
					<Button
						variant="outline"
						size="sm"
						className="h-9 gap-2 border-slate-200 font-medium"
					>
						<Translate text={localizationConstants.filterLabel} />
						<svg
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
						</svg>
					</Button>
				</div>
			</div>
			<DetailCard
				icon={Award}
				title={localizationConstants.companyCertificatesTitle}
			>
				{/* Search & Filter toolbar */}

				<div className="bg-white rounded-lg border border-slate-100 overflow-hidden shadow-sm">
					<Table>
						<TableHeader className="bg-slate-50/30">
							<TableRow className="hover:bg-transparent border-b border-slate-100">
								<TableHead className="text-[11px] font-semibold text-slate-500 py-3 uppercase tracking-wider">
									<div className="flex items-center gap-1">
										<Translate
											text={localizationConstants.date}
										/>
										<ArrowUpDown className="h-3 w-3" />
									</div>
								</TableHead>
								<TableHead className="text-[11px] font-semibold text-slate-500 py-3 uppercase tracking-wider">
									<div className="flex items-center gap-1">
										<Translate
											text={
												localizationConstants.certificateLabel
											}
										/>
										<ArrowUpDown className="h-3 w-3" />
									</div>
								</TableHead>
								<TableHead className="text-[11px] font-semibold text-slate-500 py-3 uppercase tracking-wider">
									<div className="flex items-center gap-1">
										<Translate
											text={
												localizationConstants.textLabel
											}
										/>
										<ArrowUpDown className="h-3 w-3" />
									</div>
								</TableHead>
								<TableHead className="text-[11px] font-semibold text-slate-500 py-3 uppercase tracking-wider text-right pr-6">
									<Translate
										text={localizationConstants.fileLabel}
									/>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{certificates.map((cert) => (
								<TableRow
									key={cert.id}
									className="border-b border-slate-50 hover:bg-slate-50/50"
								>
									<TableCell className="py-4 text-sm text-slate-600">
										{cert.date}
									</TableCell>
									<TableCell className="py-4 text-sm font-bold text-slate-900">
										{cert.name}
									</TableCell>
									<TableCell className="py-4 text-sm text-slate-600">
										{cert.text}
									</TableCell>
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
		</>
	);
}
