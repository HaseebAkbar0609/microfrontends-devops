"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
	readonly value?: number;
	readonly onChange?: (value: number) => void;
	readonly maxStars?: number;
	readonly disabled?: boolean;
	readonly className?: string;
	readonly size?: number;
}

export function StarRating({
	value = 0,
	onChange,
	maxStars = 5,
	disabled = false,
	className,
	size = 28,
}: StarRatingProps) {
	const [hoverValue, setHoverValue] = useState(0);

	const displayValue = hoverValue || value;

	return (
		<div className={cn("flex items-center gap-1.5", className)}>
			{Array.from({ length: maxStars }, (_, i) => {
				const starIndex = i + 1;
				const isFilled = starIndex <= displayValue;

				return (
					<button
						key={i}
						type="button"
						disabled={disabled}
						className={cn(
							"transition-all disabled:cursor-not-allowed disabled:opacity-50",
							!disabled && "cursor-pointer hover:scale-110",
						)}
						onClick={() => onChange?.(starIndex === value ? 0 : starIndex)}
						onMouseEnter={() => !disabled && setHoverValue(starIndex)}
						onMouseLeave={() => !disabled && setHoverValue(0)}
						aria-label={`${starIndex} star${starIndex > 1 ? "s" : ""}`}
					>
						<Star
							size={size}
							className={cn(
								"transition-colors",
								isFilled
									? "fill-yellow-400 text-yellow-500 stroke-yellow-500"
									: "fill-transparent text-amber-300 stroke-amber-300",
							)}
							strokeWidth={1.5}
						/>
					</button>
				);
			})}
		</div>
	);
}
