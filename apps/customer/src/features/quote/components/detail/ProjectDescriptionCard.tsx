import { HardHat } from "lucide-react";
import Image from "next/image";
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
import { Button } from "@/components/ui/button";

export function ProjectDescriptionCard() {
	return (
		<DetailCard
			icon={HardHat}
			title={localizationConstants.projectInformationSection}
			className="p-0"
		>
			<div className="space-y-8">
				<div className="space-y-2">
					<p className="text-sm font-bold text-slate-900">
						<Translate text={localizationConstants.descriptionLabel} />
					</p>
					<p className="text-sm text-slate-500 leading-relaxed font-normal">
						<Translate text={localizationConstants.dummyProjectDescription} />
					</p>
				</div>

				<div className="space-y-4 pt-4 border-t border-slate-100">
					<p className="text-sm font-bold text-slate-900">
						<Translate text={localizationConstants.projectDocumentsSection} />
					</p>
					<div className="border border-slate-200 rounded-lg overflow-hidden">
						<Table>
							<TableHeader className="bg-slate-50/50">
								<TableRow className="hover:bg-transparent border-slate-200">
									<TableHead className="text-xs font-semibold py-3 h-auto">
										<Translate text={localizationConstants.dateLabel} />
									</TableHead>
									<TableHead className="text-xs font-semibold py-3 h-auto">
										<Translate text={localizationConstants.documentNameLabel} />
									</TableHead>
									<TableHead className="text-xs font-semibold py-3 h-auto">
										<Translate text={localizationConstants.fileLabel} />
									</TableHead>
									<TableHead className="text-xs font-semibold py-3 h-auto"></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{[
									{
										date: "2024-05-10",
										name: "Work Description",
										type: "PDF",
									},
									{
										date: "2024-05-10",
										name: "Policy",
										type: "PDF",
									},
									{
										date: "2024-05-10",
										name: "Policy",
										type: "PDF",
									},
								].map((doc, idx) => (
									<TableRow
										key={idx}
										className="border-slate-100 hover:bg-slate-50/30"
									>
										<TableCell className="text-sm py-4">{doc.date}</TableCell>
										<TableCell className="text-sm font-medium py-4">
											<div className="flex items-center gap-3">
												<div className=" text-red-600 p-1.5 rounded-md">
													<Image
														src="/assets/pdf.svg"
														alt="PDF"
														width={40}
														height={40}
													/>
												</div>
												{doc.name}
											</div>
										</TableCell>
										<TableCell className="text-sm text-slate-500 py-4">
											{doc.type}
										</TableCell>
										<TableCell className="py-4 text-right pr-4">
											<Button
												variant="outline"
												size="sm"
												className="h-9 px-4 bg-transparent rounded-lg font-medium border-slate-200 text-slate-700"
											>
												<Translate text={localizationConstants.viewFileButton} />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</DetailCard>
	);
}
