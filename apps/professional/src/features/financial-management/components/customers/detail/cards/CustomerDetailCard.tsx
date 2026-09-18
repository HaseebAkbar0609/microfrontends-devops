import React from "react";
import { Edit2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface CustomerDetailCardProps {
	title: React.ReactNode;
	icon?: React.ReactNode;
	onEdit?: () => void;
	children: React.ReactNode;
	className?: string;
	headerExtra?: React.ReactNode;
}

export const CustomerDetailCard: React.FC<CustomerDetailCardProps> = ({
	title,
	icon,
	onEdit,
	children,
	className = "",
	headerExtra,
}) => {
	return (
		<div
			className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
		>
			<div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800">
				<div className="flex items-center gap-2.5">
					{icon && <span className="text-slate-500 dark:text-slate-400">{icon}</span>}
					<h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
						{title}
					</h3>
				</div>
				<div className="flex items-center gap-2">
					{headerExtra}
					{onEdit && (
						<button
							type="button"
							onClick={onEdit}
							className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
						>
							<Edit2 className="h-3.5 w-3.5" />
							<span>
								<Translate text={localizationConstants.customerDetailActionEdit} />
							</span>
						</button>
					)}
				</div>
			</div>
			<div>{children}</div>
		</div>
	);
};

export const DetailField: React.FC<{
	label: React.ReactNode;
	value?: React.ReactNode;
	fallback?: string;
	className?: string;
}> = ({ label, value, fallback = "-", className = "" }) => {
	return (
		<div className={`flex flex-col ${className}`}>
			<span className="text-xs font-medium text-slate-400 dark:text-slate-500">
				{label}
			</span>
			<span className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
				{value || fallback}
			</span>
		</div>
	);
};
