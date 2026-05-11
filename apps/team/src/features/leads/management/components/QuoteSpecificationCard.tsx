"use client";

import { Trash2 } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortLabel } from "@/features/leads/management/components/LeadDetailShared";
import FilePreviewIcon from "@/features/leads/management/components/FilePreviewIcon";
import type { QuoteDocument } from "@/features/leads/types";

type QuoteSpecificationCardProps = {
	documents: QuoteDocument[];
};

export default function QuoteSpecificationCard({ documents }: QuoteSpecificationCardProps) {
	const t = useTranslate();

	return (
		<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
			<div className="border-b border-slate-200 px-5 py-4">
				<div className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.specificationLabel} />
				</div>
			</div>
			<div className="px-5 py-5">
				<div className="overflow-hidden rounded-lg border border-slate-200">
					<Table className="text-sm">
						<TableHeader>
							<TableRow className="bg-slate-50">
								<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
									<SortLabel label={t(localizationConstants.dateLabel)} />
								</TableHead>
								<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
									<SortLabel label={t(localizationConstants.documentNameLabel)} />
								</TableHead>
								<TableHead className="border-l px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
									<span className="sr-only">Actions</span>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{documents.map((document) => (
								<TableRow key={document.id}>
									<TableCell className="px-4 py-4 text-slate-700">
										{document.date}
									</TableCell>
									<TableCell className="px-4 py-4">
										<div className="flex items-center gap-3 text-slate-700">
											<FilePreviewIcon fileType={document.fileType} />
											<span className="font-medium text-slate-700">{document.name}</span>
										</div>
									</TableCell>
									<TableCell className="px-4 py-4 border-l">
										<div className="flex items-center justify-end gap-2">
											<Button
												type="button"
												variant="outline"
												size="sm"
												className="rounded-md border-slate-300 bg-white px-4 text-slate-900 hover:bg-slate-50"
											>
												<Translate text={localizationConstants.seeFileLabel} />
											</Button>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="h-9 w-9 rounded-md text-slate-500 hover:bg-slate-100"
											>
												<Trash2 className="size-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
