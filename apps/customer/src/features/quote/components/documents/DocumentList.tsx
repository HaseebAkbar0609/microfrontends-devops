import { ArrowUpDown, Trash2 } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ProjectDocument } from "../../types/types";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import Image from "next/image";
import { getDocumentIconMeta } from "../../utils/documentIcon";

interface DocumentListProps {
	documents: readonly ProjectDocument[];
	onDelete: (id: string) => void;
}

export function DocumentList({ documents, onDelete }: DocumentListProps) {
	return (
		<div className="space-y-4">
			<h3 className="text-sm font-semibold text-slate-900">
				<Translate text={localizationConstants.specificationLabel} />
			</h3>

			<div className="border border-slate-200 rounded-lg overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent border-b border-slate-200 bg-slate-50/50">
							<TableHead className="text-xs font-semibold text-slate-500 py-3 h-auto cursor-pointer">
								<div className="flex items-center gap-1.5">
									<Translate
										text={localizationConstants.dateLabel}
									/>
									<ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
								</div>
							</TableHead>
							<TableHead className="text-xs font-semibold text-slate-500 py-3 h-auto cursor-pointer">
								<div className="flex items-center gap-1.5">
									<Translate
										text={
											localizationConstants.documentNameLabel
										}
									/>
									<ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
								</div>
							</TableHead>
							<TableHead className="text-xs font-semibold text-slate-500 py-3 h-auto cursor-pointer">
								<div className="flex items-center gap-1.5">
									<Translate
										text={localizationConstants.comments}
									/>
									<ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
								</div>
							</TableHead>
							<TableHead className="text-xs font-semibold text-slate-500 py-3 h-auto cursor-pointer">
								<div className="flex items-center gap-1.5">
									<Translate
										text={localizationConstants.fileLabel}
									/>
									<ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
								</div>
							</TableHead>
							<TableHead className="w-32 h-auto"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{documents.map((doc) => {
							const icon = getDocumentIconMeta(doc.fileType);
							return (
								<TableRow
									key={doc.id}
									className="border-b border-slate-100 hover:bg-slate-50/50"
								>
									<TableCell className="py-4 text-sm text-slate-900">
										{doc.date}
									</TableCell>
									<TableCell className="py-4 text-sm font-medium text-slate-900">
										<div className="flex items-center gap-3">
											<div className="flex items-center justify-center shrink-0">
												<Image
													src={icon.src}
													alt={icon.alt}
													width={40}
													height={40}
													className="cursor-pointer hover:opacity-80 transition-opacity"
												/>
											</div>
											{doc.name}
										</div>
									</TableCell>
									<TableCell className="py-4 text-sm text-slate-600">
										{doc.comments}
									</TableCell>
									<TableCell className="py-4 text-sm text-slate-600">
										{doc.fileType}
									</TableCell>
									<TableCell className="py-4 text-right pr-4">
										<div className="flex items-center justify-end gap-3">
											{doc.url ? (
												<a
													href={doc.url}
													target="_blank"
													rel="noopener noreferrer"
												>
													<Button
														variant="outline"
														size="sm"
														className="h-9 px-4 border-slate-200 text-slate-700 font-medium bg-transparent"
													>
														<Translate
															text={
																localizationConstants.viewFileButton
															}
														/>
													</Button>
												</a>
											) : (
												<Button
													variant="outline"
													size="sm"
													disabled
													className="h-9 px-4 border-slate-200 text-slate-400 font-medium bg-transparent cursor-not-allowed"
												>
													<Translate
														text={
															localizationConstants.viewFileButton
														}
													/>
												</Button>
											)}
											<button
												className="text-gray-900 hover:text-gray-900 transition-colors"
												onClick={() => onDelete(doc.id)}
											>
												<Trash2 className="h-5 w-5" />
											</button>
										</div>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
