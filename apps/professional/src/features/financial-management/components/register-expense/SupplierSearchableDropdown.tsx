"use client";

import React, { useState, useMemo, useRef } from "react";
import { Search, ChevronDown, Check, Plus, X, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SupplierSearchableDropdownProps {
	value: string;
	onChange: (val: string) => void;
	suppliers: string[];
	onAddSupplier: (name: string) => void;
	onOpenAddSupplierModal: () => void;
	hasError?: boolean;
}

export function SupplierSearchableDropdown({
	value,
	onChange,
	suppliers,
	onAddSupplier,
	onOpenAddSupplierModal,
	hasError = false,
}: SupplierSearchableDropdownProps) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const searchInputRef = useRef<HTMLInputElement>(null);

	// Clean search query when closed
	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) {
			setSearchQuery("");
		}
	};

	// Filter suppliers list based on search query
	const filteredSuppliers = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return suppliers;
		return suppliers.filter((sup) => sup.toLowerCase().includes(query));
	}, [suppliers, searchQuery]);

	// Check if the typed query already exists in the list
	const isExactMatch = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return true;
		return suppliers.some((sup) => sup.toLowerCase() === query);
	}, [suppliers, searchQuery]);

	const handleSelect = (sup: string) => {
		onChange(sup);
		setOpen(false);
		setSearchQuery("");
	};

	const handleQuickAdd = () => {
		const trimmed = searchQuery.trim();
		if (!trimmed) return;
		onAddSupplier(trimmed);
		onChange(trimmed);
		setOpen(false);
		setSearchQuery("");
	};

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		onChange("");
	};

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>
				<button
					type="button"
					role="combobox"
					aria-expanded={open}
					aria-controls="supplier-popover-content"
					className={`h-9 w-full flex items-center justify-between px-3 text-xs bg-white border rounded-md transition-colors cursor-pointer text-left ${
						hasError
							? "border-rose-500 ring-1 ring-rose-500"
							: "border-slate-200 hover:border-slate-300"
					}`}
				>
					<span className={`truncate flex-1 ${value ? "text-slate-900 font-medium" : "text-slate-400"}`}>
						{value || t(localizationConstants.registerExpenseSupplierPlaceholder)}
					</span>
					<div className="flex items-center gap-1 ml-2 shrink-0">
						{value && (
							<span
								role="button"
								tabIndex={0}
								onClick={handleClear}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										onChange("");
									}
								}}
								className="p-0.5 text-slate-400 hover:text-slate-600 rounded-sm cursor-pointer"
								aria-label={t(localizationConstants.expenseDetailClearSupplierAria)}
							>
								<X className="h-3.5 w-3.5" />
							</span>
						)}
						<ChevronDown className="h-4 w-4 text-slate-400" />
					</div>
				</button>
			</PopoverTrigger>

			<PopoverContent
				id="supplier-popover-content"
				align="start"
				onOpenAutoFocus={(e) => {
					e.preventDefault();
					searchInputRef.current?.focus();
				}}
				className="w-(--radix-popover-trigger-width) min-w-[300px] p-2 bg-white rounded-lg border border-slate-200 shadow-xl z-50"
			>
				{/* Search Input */}
				<div className="relative mb-2">
					<Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
					<Input
						ref={searchInputRef}
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder={t(localizationConstants.registerExpenseSupplierSearchPlaceholder)}
						className="h-8 pl-8 text-xs border-slate-200 bg-slate-50 focus-visible:ring-1 focus-visible:ring-slate-400 rounded-md"
					/>
				</div>

				{/* Quick Add Option if query doesn't match */}
				{searchQuery.trim() && !isExactMatch && (
					<button
						type="button"
						onClick={handleQuickAdd}
						className="w-full flex items-center gap-2 px-2.5 py-2 mb-1 text-xs font-medium text-blue-700 bg-blue-50/80 hover:bg-blue-100 rounded-md cursor-pointer transition-colors text-left"
					>
						<Plus className="h-3.5 w-3.5 shrink-0 text-blue-600" />
						<span className="truncate">
							<Translate text={localizationConstants.registerExpenseSupplierAddCustom} /> &quot;
							<strong className="font-semibold">{searchQuery.trim()}</strong>&quot;
						</span>
					</button>
				)}

				{/* Suppliers List */}
				<div className="max-h-52 overflow-y-auto space-y-0.5">
					{filteredSuppliers.length === 0 && isExactMatch ? (
						<div className="py-6 text-center text-xs text-slate-400">
							<Translate text={localizationConstants.registerExpenseSupplierNotFound} />
						</div>
					) : (
						filteredSuppliers.map((sup) => {
							const isSelected = sup === value;
							return (
								<button
									key={sup}
									type="button"
									onClick={() => handleSelect(sup)}
									className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-left transition-colors cursor-pointer ${
										isSelected
											? "bg-slate-100 text-slate-900 font-semibold"
											: "text-slate-700 hover:bg-slate-50"
									}`}
								>
									<span className="truncate">{sup}</span>
									{isSelected && <Check className="h-3.5 w-3.5 text-slate-900 shrink-0" />}
								</button>
							);
						})
					)}
				</div>

				{/* Bottom Action: Open Full Add Supplier Modal */}
				<div className="border-t border-slate-100 pt-2 mt-2">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => {
							setOpen(false);
							onOpenAddSupplierModal();
						}}
						className="w-full justify-start h-8 px-2 text-xs text-slate-700 hover:text-slate-900 font-medium cursor-pointer gap-1.5"
					>
						<Building2 className="h-3.5 w-3.5 text-slate-500" />
						<span>
							<Translate text={localizationConstants.registerExpenseModalAddSupplierTitle} />
						</span>
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}

export default SupplierSearchableDropdown;
