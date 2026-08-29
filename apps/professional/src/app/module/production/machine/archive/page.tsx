"use client";

import { useEffect, useState } from "react";
import { ModulePageHeader } from "@/components/layout/navigation";
import {
	MACHINE_MODULE_TITLE,
	machineBreadcrumbs,
} from "@/features/machines/data/machineNav.config";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	getArchivedPurchases,
	subscribePurchases,
	restorePurchaseItem,
	deletePurchaseItem,
} from "@/features/machines/purchase/data/purchase.mock";
import type { PurchaseItem } from "@/features/machines/purchase/types/purchase.types";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { Archive, RotateCcw, Trash2 } from "lucide-react";
import { showToast } from "@/lib/toast";

export default function MachineArchivePage() {
	const t = useTranslate();
	const [archivedItems, setArchivedItems] = useState<PurchaseItem[]>(() =>
		getArchivedPurchases()
	);

	useEffect(() => {
		const unsubscribe = subscribePurchases(() => {
			setArchivedItems(getArchivedPurchases());
		});
		return unsubscribe;
	}, []);

	const handleRestore = (id: string) => {
		restorePurchaseItem(id);
		showToast(
			"success",
			t(localizationConstants.machinePurchaseRestoreSuccess)
		);
	};

	const handleDelete = (id: string) => {
		deletePurchaseItem(id);
		showToast(
			"success",
			t(localizationConstants.machinePurchaseDeleteSuccess)
		);
	};

	return (
		<div className="flex min-h-screen flex-col bg-white">
			<ModulePageHeader
				title={MACHINE_MODULE_TITLE}
				breadcrumbs={machineBreadcrumbs(
					localizationConstants.machineSidebarArchive
				)}
			/>

			<div className="px-8 py-6 space-y-6 max-w-[1600px] w-full">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-xl font-bold text-slate-900 tracking-tight">
							<Translate text={localizationConstants.machineSidebarArchive} />
						</h2>
						<p className="text-xs text-slate-500 mt-0.5">
							{archivedItems.length} arkiverade maskiner / produkter
						</p>
					</div>
				</div>

				{archivedItems.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center p-16 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
						<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
							<Archive className="h-8 w-8" />
						</div>
						<h3 className="text-base font-semibold text-slate-800 mb-1">
							<Translate text={localizationConstants.machineSidebarArchive} />
						</h3>
						<p className="text-sm text-slate-500 max-w-sm">
							<Translate text={localizationConstants.machinePurchaseArchiveEmpty} />
						</p>
					</div>
				) : (
					<div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
						<Table className="w-full">
							<TableHeader>
								<TableRow className="border-b border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
									<TableHead className="py-3.5 px-4 text-[13px] font-semibold text-slate-600">
										<Translate text={localizationConstants.machinePurchaseColNumber} />
									</TableHead>
									<TableHead className="py-3.5 px-4 text-[13px] font-semibold text-slate-600">
										<Translate text={localizationConstants.machinePurchaseColType} />
									</TableHead>
									<TableHead className="py-3.5 px-4 text-[13px] font-semibold text-slate-600">
										<Translate text={localizationConstants.machinePurchaseColBrand} />
									</TableHead>
									<TableHead className="py-3.5 px-4 text-[13px] font-semibold text-slate-600">
										<Translate text={localizationConstants.machinePurchaseColDesignation} />
									</TableHead>
									<TableHead className="py-3.5 px-4 text-[13px] font-semibold text-slate-600">
										<Translate text={localizationConstants.machinePurchaseColPrice} />
									</TableHead>
									<TableHead className="py-3.5 px-4 text-[13px] font-semibold text-slate-600">
										<Translate text={localizationConstants.machinePurchaseColSupplier} />
									</TableHead>
									<TableHead className="py-3.5 px-4 text-[13px] font-semibold text-slate-600">
										<Translate text={localizationConstants.machinePurchaseColCity} />
									</TableHead>
									<TableHead className="py-3.5 px-4 text-[13px] font-semibold text-slate-600">
										<Translate text={localizationConstants.machinePurchaseColFile} />
									</TableHead>
									<TableHead className="py-3.5 px-4 text-right text-[13px] font-semibold text-slate-600">
										Åtgärder
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{archivedItems.map((item) => (
									<TableRow
										key={item.id}
										className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors h-[54px]"
									>
										<TableCell className="px-4 py-3.5 text-[13px] font-medium text-slate-900">
											{item.number}
										</TableCell>
										<TableCell className="px-4 py-3.5 text-[13px] font-medium text-slate-900">
											{item.type}
										</TableCell>
										<TableCell className="px-4 py-3.5 text-[13px] font-medium text-slate-900">
											{item.brand}
										</TableCell>
										<TableCell className="px-4 py-3.5 text-[13px] font-bold text-slate-900">
											{item.designation}
										</TableCell>
										<TableCell className="px-4 py-3.5 text-[13px] font-bold text-slate-900">
											{item.price ? `${item.price.toLocaleString("sv-SE")} kr` : "-"}
										</TableCell>
										<TableCell className="px-4 py-3.5 text-[13px] font-medium text-slate-700">
											{item.supplier}
										</TableCell>
										<TableCell className="px-4 py-3.5 text-[13px] font-medium text-slate-700">
											{item.city}
										</TableCell>
										<TableCell className="px-4 py-3.5">
											<div className="flex items-center gap-2">
												<PdfFileIcon className="h-6 w-5" />
												<span className="text-xs text-slate-600">{item.file}</span>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3.5 text-right">
											<div className="flex items-center justify-end gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleRestore(item.id)}
													className="h-8 px-3 gap-1.5 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer shadow-2xs"
												>
													<RotateCcw className="h-3.5 w-3.5 text-slate-600" />
													<span>
														<Translate text={localizationConstants.machinePurchaseActionRestore} />
													</span>
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleDelete(item.id)}
													className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</div>
		</div>
	);
}
