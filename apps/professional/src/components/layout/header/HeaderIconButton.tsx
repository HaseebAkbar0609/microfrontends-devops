import React from "react";
import { cn } from "@/lib/utils";

interface HeaderIconButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

const HeaderIconButton = React.forwardRef<HTMLButtonElement, HeaderIconButtonProps>(
	({ children, className, ...props }, ref) => {
		return (
			<button
				ref={ref}
				type="button"
				className={cn(
					"flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700",
					className
				)}
				{...props}
			>
				{children}
			</button>
		);
	}
);

HeaderIconButton.displayName = "HeaderIconButton";

export default HeaderIconButton;
