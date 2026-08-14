"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export interface CreateOrderOrProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (option: "project" | "order") => void;
}

export function CreateOrderOrProjectModal({
	isOpen,
	onClose,
	onConfirm,
}: CreateOrderOrProjectModalProps) {
	const [selectedOption, setSelectedOption] = useState<"project" | "order">("project");

	if (!isOpen) return null;

	const handleConfirm = () => {
		onConfirm(selectedOption);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
			<div className="relative w-full max-w-md rounded-xl bg-white shadow-xl flex flex-col overflow-hidden border border-slate-200">
				{/* Modal Header */}
				<div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
					<h3 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.createOrderOrProjectTitle} />
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				{/* Modal Options */}
				<div className="p-6 flex flex-col gap-4">
					<label className="flex items-center gap-3 cursor-pointer select-none">
						<input
							type="radio"
							name="orderOrProject"
							checked={selectedOption === "project"}
							onChange={() => setSelectedOption("project")}
							className="h-4 w-4 text-slate-900 border-slate-300 focus:ring-slate-900 cursor-pointer"
						/>
						<span className="text-sm font-medium text-slate-800">
							<Translate text={localizationConstants.createProjectOption} />
						</span>
					</label>

					<label className="flex items-center gap-3 cursor-pointer select-none">
						<input
							type="radio"
							name="orderOrProject"
							checked={selectedOption === "order"}
							onChange={() => setSelectedOption("order")}
							className="h-4 w-4 text-slate-900 border-slate-300 focus:ring-slate-900 cursor-pointer"
						/>
						<span className="text-sm font-medium text-slate-800">
							<Translate text={localizationConstants.createOrderOption} />
						</span>
					</label>
				</div>

				{/* Modal Actions */}
				<div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50/50">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						className="h-9 px-4 text-xs font-medium border-slate-200 cursor-pointer"
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						type="button"
						onClick={handleConfirm}
						className="h-9 px-5 gap-1.5 text-xs font-medium bg-[#111721] text-white hover:bg-slate-800 cursor-pointer"
					>
						<Check className="h-3.5 w-3.5" />
						<span><Translate text={localizationConstants.confirmButton} /></span>
					</Button>
				</div>
			</div>
		</div>
	);
}
