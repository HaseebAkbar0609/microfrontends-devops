"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const STAR_SLOTS = [1, 2, 3, 4, 5];

const ReviewStars = ({ rating }: { rating: number }) => (
	<span className="flex items-center gap-1">
		{STAR_SLOTS.map((slot) => (
			<Star
				key={slot}
				className={cn(
					"h-5 w-5",
					slot <= rating
						? "fill-orange-400 text-orange-400"
						: "text-slate-300",
				)}
			/>
		))}
	</span>
);

export default ReviewStars;
