"use client";

import React from "react";
import { Building2, User } from "lucide-react";
import type { CustomerEntityType } from "../../../../types/createCustomer.types";

interface CompanyOrPrivateSelectorProps {
	value: CustomerEntityType;
	onChange: (type: CustomerEntityType) => void;
}

export function CompanyOrPrivateSelector({
	value,
	onChange,
}: CompanyOrPrivateSelectorProps) {
	return (
		<div className="flex flex-col gap-2 mb-6">
			<label className="text-xs font-semibold text-slate-700">Kundtyp</label>
			<div className="inline-flex max-w-md rounded-lg border border-slate-200 bg-slate-100 p-1">
				<button
					type="button"
					onClick={() => onChange("company")}
					className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-xs font-semibold transition-all cursor-pointer ${
						value === "company"
							? "bg-white text-slate-900 shadow-2xs font-bold"
							: "text-slate-600 hover:text-slate-900"
					}`}
				>
					<Building2 className="h-4 w-4" />
					<span>Företag</span>
				</button>
				<button
					type="button"
					onClick={() => onChange("private")}
					className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-xs font-semibold transition-all cursor-pointer ${
						value === "private"
							? "bg-white text-slate-900 shadow-2xs font-bold"
							: "text-slate-600 hover:text-slate-900"
					}`}
				>
					<User className="h-4 w-4" />
					<span>Privatperson</span>
				</button>
			</div>
		</div>
	);
}
