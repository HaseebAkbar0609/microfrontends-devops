"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface SystemPasswordFormFieldProps {
	value: string;
	onChange: (password: string) => void;
	error?: string;
}

export const SystemPasswordFormField: React.FC<SystemPasswordFormFieldProps> = ({
	value,
	onChange,
	error,
}) => {
	const t = useTranslate();
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div>
			<label className="block text-xs font-semibold text-slate-700">
				{t(localizationConstants.dataItSystemFieldPassword)}
			</label>
			<div className="relative mt-1">
				<input
					type={showPassword ? "text" : "password"}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-10 text-sm text-slate-900 focus:border-slate-400 focus:outline-hidden"
				/>
				<button
					type="button"
					onClick={() => setShowPassword((prev) => !prev)}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
					aria-label={
						showPassword
							? t(localizationConstants.dataItSystemHidePassword)
							: t(localizationConstants.dataItSystemShowPassword)
					}
				>
					{showPassword ? (
						<EyeOff className="h-4 w-4" />
					) : (
						<Eye className="h-4 w-4" />
					)}
				</button>
			</div>
			{error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
		</div>
	);
};

export default SystemPasswordFormField;
