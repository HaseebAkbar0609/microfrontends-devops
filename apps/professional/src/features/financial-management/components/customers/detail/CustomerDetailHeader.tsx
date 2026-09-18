import React from "react";
import { ChevronLeft } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface CustomerDetailHeaderProps {
	customerNo: string;
	onBack: () => void;
}

export const CustomerDetailHeader: React.FC<CustomerDetailHeaderProps> = ({
	customerNo,
	onBack,
}) => {
	return (
		<div className="flex items-center gap-4 py-2">
			<button
				type="button"
				onClick={onBack}
				aria-label="Back"
				className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
			>
				<ChevronLeft className="h-5 w-5" />
			</button>
			<div className="flex items-center gap-2.5">
				<h1 className="text-xl font-bold text-slate-900 dark:text-white">
					<Translate text={localizationConstants.customerDetailHeaderTitle} />
				</h1>
				{customerNo && (
					<span className="text-xl font-semibold text-slate-500 dark:text-slate-400">
						{customerNo}
					</span>
				)}
			</div>
		</div>
	);
};
