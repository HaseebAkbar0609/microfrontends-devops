"use client";

import { useState, Suspense } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CustomerRegisterTable } from "./CustomerRegisterTable";

export function RegisterPage() {
	const [selectedRegister, setSelectedRegister] = useState("kund");

	return (
		<div className="flex h-full flex-col gap-6 px-8 pt-6 pb-8 overflow-y-auto">
			{/* Header & Breadcrumb Trail matching Figma */}
			<div className="flex flex-col gap-1.5">
				<h1 className="text-2xl font-bold tracking-tight text-slate-900">
					<Translate text={localizationConstants.registerDropdownLabel} />
				</h1>

				<nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
					<Link href="/" className="hover:text-slate-900 transition-colors">
						<Translate text={localizationConstants.home} />
					</Link>
					<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
					<span>
						<Translate text={localizationConstants.moduleItem} />
					</span>
					<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
					<span>
						<Translate text={localizationConstants.invoice} />
					</span>
					<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
					<span className="text-slate-900">
						<Translate text={localizationConstants.registerDropdownLabel} />
					</span>
				</nav>
			</div>

			{/* Register Section Dropdown Selector */}
			<div className="flex flex-col gap-2 w-full lg:w-1/3 xl:w-1/4">
				<label className="text-xs font-medium text-slate-700">
					<Translate text={localizationConstants.registerDropdownLabel} />
				</label>
				<Select value={selectedRegister} onValueChange={setSelectedRegister}>
					<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-2xs">
						<SelectValue placeholder="Välj register" />
					</SelectTrigger>
					<SelectContent className="bg-white border-slate-200 shadow-md">
						<SelectItem
							value="kund"
							className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer"
						>
							<Translate text={localizationConstants.customerOption} />
						</SelectItem>
						<SelectItem
							value="supplier"
							className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer"
						>
							<Translate text={localizationConstants.supplierOption} />
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Sub Tabs Bar matching Figma */}
			<div className="border-b border-slate-200">
				<div className="flex gap-8">
					<button
						type="button"
						className="border-b-2 border-slate-900 pb-3 text-sm font-semibold text-slate-900"
					>
						<Translate text={localizationConstants.customerListTab} />
					</button>
				</div>
			</div>

			{/* Table Content */}
			{selectedRegister === "kund" && (
				<Suspense fallback={<div className="py-8 text-center text-sm text-slate-500">Laddar...</div>}>
					<CustomerRegisterTable />
				</Suspense>
			)}
		</div>
	);
}
