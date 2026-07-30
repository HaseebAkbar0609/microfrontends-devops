"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Loader2,
	Save,
	ArrowUpDown,
	Import,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface ImportRow {
	accountNumber: string;
	accountName: string;
	action: string;
	targetAccountNumber: string;
	vatCode: string;
	targetAccountName: string;
}

const MOCK_IMPORT_ROWS: ImportRow[] = [
	{
		accountNumber: "1010",
		accountName: "Lorem Ipsum is simply dummy",
		action: "koppla",
		targetAccountNumber: "1010",
		vatCode: "none",
		targetAccountName: "Lorem Ipsum is simply dummy",
	},
	{
		accountNumber: "1011",
		accountName: "Lorem Ipsum is simply dummy",
		action: "skapaNytt",
		targetAccountNumber: "1011",
		vatCode: "none",
		targetAccountName: "Lorem Ipsum is simply dummy",
	},
	{
		accountNumber: "1012",
		accountName: "Lorem Ipsum is simply dummy",
		action: "skapaNytt",
		targetAccountNumber: "1012",
		vatCode: "none",
		targetAccountName: "Lorem Ipsum is simply dummy",
	},
];

export function ImportAccountPlanPage() {
	const t = useTranslate();
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isImporting, setIsImporting] = useState(false);
	const [importRows, setImportRows] = useState<ImportRow[]>([]);
	const [importSettings, setImportSettings] = useState({
		importOnlyUsed: "alla",
		useNameFrom: "sieFile",
		useSruFrom: "sieFile",
	});

	const handleFileSelect = useCallback(async (file: File) => {
		setSelectedFile(file);
		setImportRows(MOCK_IMPORT_ROWS);
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
			const file = e.dataTransfer.files[0];
			if (file) handleFileSelect(file);
		},
		[handleFileSelect],
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) handleFileSelect(file);
		},
		[handleFileSelect],
	);

	const handleImport = useCallback(async () => {
		setIsImporting(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			showToast("success", t(localizationConstants.accountPlanImportSuccess));
			setTimeout(() => router.push("/tools/register?tab=accountPlan&subtab=kontoplan"), 1000);
		} catch {
			showToast("error", t(localizationConstants.accountPlanImportError));
		} finally {
			setIsImporting(false);
		}
	}, [t, router]);

	const handleImportRowChange = useCallback((index: number, field: keyof ImportRow, value: string) => {
		setImportRows((prev) => {
			const next = [...prev];
			next[index] = { ...next[index], [field]: value };
			return next;
		});
	}, []);

	return (
		<div className="flex flex-col h-full min-h-0 bg-slate-50">
			{/* Header with back button - Fixed at top */}
			<div className="sticky top-0 z-10 flex items-center gap-2 px-6 py-4 bg-slate-50 shrink-0">
				<button
					type="button"
					aria-label={t(localizationConstants.goBackToAccountPlanLabel)}
					onClick={() => router.push("/tools/register?tab=accountPlan&subtab=kontoplan")}
					className="rounded-md p-1 hover:bg-slate-100 cursor-pointer shrink-0"
				>
					<ArrowLeft className="h-5 w-5 text-slate-700" />
				</button>
				<h1 className="text-xl font-bold text-slate-900">
					<Translate text={localizationConstants.importFileTitle} />
				</h1>
			</div>

			{/* Main Content */}
			<div className="flex-1 overflow-auto px-6 pb-6 min-h-0 ml-8">
				{!selectedFile ? (
					/* File Upload Zone */
					<div className="flex items-center justify-center min-h-87.5">
						<div
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							onClick={() => fileInputRef.current?.click()}
							className={cn(
								"flex flex-col items-center justify-center gap-4 rounded-lg border border-slate-200 bg-white p-10 cursor-pointer transition-all max-w-sm w-full",
								isDragging
									? "border-slate-400 bg-slate-50"
									: "hover:border-slate-300 hover:bg-slate-50",
							)}
						>
							<div className="flex items-center justify-center w-12 h-12">
								<Import className="h-10 w-10 text-slate-400" />
							</div>
							<div className="text-center space-y-1">
								<p className="text-base font-semibold text-slate-900">
									<Translate text={localizationConstants.importFileTitle} />
								</p>
								<p className="text-sm text-slate-500">
									<Translate text={localizationConstants.dropzoneText} />
								</p>
							</div>
							<Button
								onClick={(e) => {
									e.stopPropagation();
									fileInputRef.current?.click();
								}}
								className="h-9 px-6 bg-[#111721] text-white text-sm font-medium hover:bg-slate-800 gap-2 cursor-pointer"
							>
								<Translate text={localizationConstants.importButtonLabel} />
								<Save className="h-4 w-4" />
							</Button>
						</div>

						<input
							ref={fileInputRef}
							type="file"
							accept=".csv,.xlsx,.xls,.sie"
							className="sr-only"
							onChange={handleInputChange}
						/>
					</div>
				) : (
					/* Import Settings and Mapping */
					<div className="flex flex-col gap-4">
						{/* Import Settings Card */}
						<div className="rounded-lg border border-slate-200 bg-white">
							<div className="h-12 flex flex-row items-center border-b border-slate-200 px-4">
								<h2 className="text-base font-semibold text-slate-900">
									<Translate text={localizationConstants.importButtonLabel} />
								</h2>
							</div>
							<div className="px-4 py-4">
								<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 w-full">
									{/* Import Only Used */}
									<div className="flex flex-col gap-2 min-w-0">
										<p className="text-sm font-medium text-slate-900 whitespace-nowrap">
											<Translate text={localizationConstants.importOnlyUsedLabel} />
										</p>
										<RadioGroup
											value={importSettings.importOnlyUsed}
											onValueChange={(val) =>
												setImportSettings((prev) => ({ ...prev, importOnlyUsed: val }))
											}
											className="flex items-center gap-4 [--primary:var(--color-primary-black)]"
										>
											<label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer whitespace-nowrap">
												<RadioGroupItem value="alla" id="import-alla" className="border-black" />
												<Translate text={localizationConstants.allLabel} />
											</label>
											<label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer whitespace-nowrap">
												<RadioGroupItem value="endast" id="import-endast" className="border-black" />
												<Translate text={localizationConstants.onlyUsedLabel} />
											</label>
										</RadioGroup>
									</div>

									{/* Use Name From */}
									<div className="flex flex-col gap-2 min-w-0">
										<p className="text-sm font-medium text-slate-900 whitespace-nowrap">
											<Translate text={localizationConstants.useNameFromLabel} />
										</p>
										<RadioGroup
											value={importSettings.useNameFrom}
											onValueChange={(val) =>
												setImportSettings((prev) => ({ ...prev, useNameFrom: val }))
											}
											className="flex items-center gap-4 [--primary:var(--color-primary-black)]"
										>
											<label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer whitespace-nowrap">
												<RadioGroupItem value="sieFile" id="name-sie" className="border-black" />
												<Translate text={localizationConstants.sieFileLabel} />
											</label>
											<label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer whitespace-nowrap">
												<RadioGroupItem value="existing" id="name-existing" className="border-black" />
												<Translate text={localizationConstants.existingAccountPlanLabel} />
											</label>
										</RadioGroup>
									</div>

									{/* Use SRU From */}
									<div className="flex flex-col gap-2 min-w-0">
										<p className="text-sm font-medium text-slate-900 whitespace-nowrap">
											<Translate text={localizationConstants.useSruFromLabel} />
										</p>
										<RadioGroup
											value={importSettings.useSruFrom}
											onValueChange={(val) =>
												setImportSettings((prev) => ({ ...prev, useSruFrom: val }))
											}
											className="flex items-center gap-4 [--primary:var(--color-primary-black)]"
										>
											<label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer whitespace-nowrap">
												<RadioGroupItem value="sieFile" id="sru-sie" className="border-black" />
												<Translate text={localizationConstants.sieFileLabel} />
											</label>
											<label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer whitespace-nowrap">
												<RadioGroupItem value="existing" id="sru-existing" className="border-black" />
												<Translate text={localizationConstants.existingAccountPlanLabel} />
											</label>
										</RadioGroup>
									</div>
								</div>
							</div>
						</div>

						{/* Map Information Card */}
						<div className="rounded-lg border border-slate-200 bg-white">
							<div className="h-12 flex flex-row items-center border-b border-slate-200 px-4">
								<h2 className="text-base font-semibold text-slate-900">
									<Translate text={localizationConstants.mapInformationLabel} />
								</h2>
							</div>
							<div className="px-4 py-3 overflow-x-auto">
								<Table className="w-full">
									<TableHeader>
										<TableRow className="border-b border-slate-200 hover:bg-transparent">
											<TableHead className="text-xs font-semibold text-slate-600 py-3 px-4 whitespace-nowrap min-w-17.5">
												<div className="flex items-center gap-1">
													<Translate text={localizationConstants.accountLabel} />
													<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
												</div>
											</TableHead>
											<TableHead className="text-xs font-semibold text-slate-600 py-3 px-4 whitespace-nowrap min-w-40">
												<div className="flex items-center gap-1">
													<Translate text={localizationConstants.designationLabel} />
													<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
												</div>
											</TableHead>
											<TableHead className="text-xs font-semibold text-slate-600 py-3 px-4 whitespace-nowrap min-w-27.5">
												<Translate text={localizationConstants.actionLabel} />
											</TableHead>
											<TableHead className="text-xs font-semibold text-slate-600 py-3 px-4 whitespace-nowrap min-w-17.5">
												<Translate text={localizationConstants.accountLabel} />
											</TableHead>
											<TableHead className="text-xs font-semibold text-slate-600 py-3 px-4 whitespace-nowrap min-w-17.5">
												<Translate text={localizationConstants.vatCodePercentLabel} />
											</TableHead>
											<TableHead className="text-xs font-semibold text-slate-600 py-3 px-4 whitespace-nowrap min-w-40">
												<Translate text={localizationConstants.designationLabel} />
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{importRows.map((row, index) => (
											<TableRow key={index} className="border-b border-slate-100">
												<TableCell className="py-3 px-4 text-sm text-slate-700 whitespace-nowrap min-w-17.5">
													{row.accountNumber}
												</TableCell>
												<TableCell className="py-3 px-4 text-sm text-slate-700 whitespace-nowrap min-w-40">
													{row.accountName}
												</TableCell>
												<TableCell className="py-3 px-4 whitespace-nowrap min-w-27.5">
													<Select
														value={row.action}
														onValueChange={(val) => handleImportRowChange(index, "action", val)}
													>
														<SelectTrigger className="h-9 w-full border-0 bg-transparent text-sm text-slate-700 shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 hover:bg-transparent [&_svg]:text-slate-400 [&_svg]:opacity-100">
															<SelectValue />
														</SelectTrigger>
														<SelectContent className="bg-white border border-slate-200 shadow-none">
															<SelectItem value="koppla" className="cursor-pointer text-sm">
																<Translate text={localizationConstants.linkActionLabel} />
															</SelectItem>
															<SelectItem value="skapaNytt" className="cursor-pointer text-sm">
																<Translate text={localizationConstants.createNewActionLabel} />
															</SelectItem>
														</SelectContent>
													</Select>
												</TableCell>
												<TableCell className="py-3 px-4 text-sm text-slate-700 whitespace-nowrap min-w-17.5">
													{row.targetAccountNumber}
												</TableCell>
												<TableCell className="py-3 px-4 whitespace-nowrap min-w-17.5">
													<Select
														value={row.vatCode}
														onValueChange={(val) => handleImportRowChange(index, "vatCode", val)}
													>
														<SelectTrigger className="h-9 w-full border-0 bg-transparent text-sm text-slate-700 shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 hover:bg-transparent [&_svg]:text-slate-400 [&_svg]:opacity-100">
															<SelectValue placeholder="-" />
														</SelectTrigger>
														<SelectContent className="bg-white border border-slate-200 shadow-none">
															<SelectItem value="none" className="cursor-pointer text-sm">-</SelectItem>
															<SelectItem value="25" className="cursor-pointer text-sm">25%</SelectItem>
															<SelectItem value="12" className="cursor-pointer text-sm">12%</SelectItem>
															<SelectItem value="6" className="cursor-pointer text-sm">6%</SelectItem>
															<SelectItem value="0" className="cursor-pointer text-sm">0%</SelectItem>
														</SelectContent>
													</Select>
												</TableCell>
												<TableCell className="py-3 px-4 text-sm text-slate-700 whitespace-nowrap min-w-40">
													{row.targetAccountName}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Footer */}
			{selectedFile && (
				<div className="shrink-0 flex flex-col sm:flex-row items-center justify-end gap-3 px-4 py-3 border-t border-slate-200 bg-white">
					<Button
						variant="outline"
						onClick={() => router.push("/tools/register?tab=accountPlan&subtab=kontoplan")}
						className="h-9 w-full sm:w-auto min-w-30 px-8 border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
					>
						<Translate text={localizationConstants.cancelButtonLabel} />
					</Button>
					<Button
						onClick={handleImport}
						disabled={isImporting}
						className="h-9 w-full sm:w-auto min-w-30 px-6 bg-[#111721] text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50 gap-2 cursor-pointer"
					>
						{isImporting ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<>
								<Translate text={localizationConstants.importButtonLabel} />
								<Save className="h-4 w-4" />
							</>
						)}
					</Button>
				</div>
			)}
		</div>
	);
}
