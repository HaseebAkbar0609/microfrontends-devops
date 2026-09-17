"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { CASES_BASE_ROUTE } from "../../../constants/cases.constants";

interface CreateCaseHeaderProps {
	title?: string;
	onBack?: () => void;
}

export function CreateCaseHeader({
	title = "Skapa Ärende",
	onBack,
}: CreateCaseHeaderProps) {
	const router = useRouter();

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			router.push(CASES_BASE_ROUTE);
		}
	};

	return (
		<div className="flex items-center gap-3">
			<button
				type="button"
				onClick={handleBack}
				className="p-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
				aria-label="Back"
			>
				<ArrowLeft className="w-5 h-5" />
			</button>
			<h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
		</div>
	);
}

export default CreateCaseHeader;
