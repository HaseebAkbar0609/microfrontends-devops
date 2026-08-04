"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NotificationBellProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	showBadge?: boolean;
	count?: number | string;
	variant?: "count" | "dot";
	iconClassName?: string;
	badgeClassName?: string;
}

export const NotificationBell = React.forwardRef<
	HTMLButtonElement,
	NotificationBellProps
>(
	(
		{
			showBadge = true,
			count = 0,
			variant = "count",
			iconClassName,
			badgeClassName,
			className,
			children,
			...props
		},
		ref,
	) => {
		// Format count: if numeric > 9, show "9+"
		const formattedCount = React.useMemo(() => {
			if (typeof count === "number") {
				return count > 9 ? "9+" : String(count);
			}
			if (typeof count === "string") {
				const num = parseInt(count, 10);
				if (!isNaN(num) && num > 9) {
					return "9+";
				}
				return count;
			}
			return "";
		}, [count]);

		// Check if badge should be visible (showBadge is true and count > 0 or variant is dot)
		const isVisible =
			showBadge &&
			(variant === "dot" ||
				(typeof count === "number" ? count > 0 : Boolean(count)));

		return (
			<button
				ref={ref}
				type="button"
				className={cn(
					"relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1",
					className,
				)}
				{...props}
			>
				{children ?? (
					<Bell className={cn("h-5 w-5 text-slate-700", iconClassName)} />
				)}

				{isVisible && (
					<>
						{variant === "dot" ? (
							<span
								className={cn(
									"absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white",
									badgeClassName,
								)}
							/>
						) : (
							<span
								className={cn(
									"absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white shadow-2xs",
									badgeClassName,
								)}
							>
								{formattedCount}
							</span>
						)}
					</>
				)}
			</button>
		);
	},
);

NotificationBell.displayName = "NotificationBell";
