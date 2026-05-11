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
import { ArrowUpDown, Images } from "lucide-react";
import Image from "next/image";
import { ReferenceProject } from "../../types/types";
import { DetailCard } from "@/features/quote/components/shared/DetailCard";

interface ReferenceImagesTableProps {
	projects: ReferenceProject[];
}

export function ReferenceImagesTable({ projects }: ReferenceImagesTableProps) {
	return (
		<DetailCard icon={Images} title={localizationConstants.referenceImagesTitle}>
			<div className="bg-white rounded-lg border border-slate-100 overflow-hidden shadow-sm">
				<Table>
					<TableHeader className="bg-slate-50/30">
						<TableRow className="hover:bg-transparent border-b border-slate-100">
							<TableHead className="text-[11px] font-semibold text-slate-500 py-3 uppercase tracking-wider">
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.projectName} />
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
									<Translate text={localizationConstants.yearLabel} />
									<ArrowUpDown className="h-3 w-3" />
								</div>
							</TableHead>
							<TableHead className="text-[11px] font-semibold text-slate-500 py-3 uppercase tracking-wider">
								<Translate text={localizationConstants.imagesLabel} />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{projects.map((project) => (
							<TableRow key={project.id} className="border-b border-slate-50 hover:bg-slate-50/50">
								<TableCell className="py-6 text-sm font-bold text-slate-900">
									{project.name}
								</TableCell>
								<TableCell className="py-6 text-sm text-slate-600 font-medium">
									{project.municipality}
								</TableCell>
								<TableCell className="py-6 text-sm text-slate-600">
									{project.year}
								</TableCell>
								<TableCell className="py-4">
									<div className="flex gap-4">
										{project.images.map((img, idx) => (
											<div key={idx} className="relative w-36 h-20 rounded-md overflow-hidden border border-slate-200">
												<Image
													src={img}
													alt={`${project.name} ${idx + 1}`}
													fill
													className="object-cover"
												/>
											</div>
										))}
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

