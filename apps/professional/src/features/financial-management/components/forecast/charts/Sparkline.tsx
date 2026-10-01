import { cn } from "@/lib/utils";

const VIEW_W = 100;
const VIEW_H = 32;
/** Half the stroke, so the first and last point are not clipped. */
const PAD = 2;

export interface SparklineProps {
	/** The series, oldest first; drawn as given, never re-sorted. */
	values: number[];
	/** Resolved by the caller, so the line knows nothing of any domain's palette. */
	color: string;
	className?: string;
}

/**
 * A figure's shape over the period, drawn small.
 *
 * Plain SVG rather than a chart: six of these sit in six small cards, and
 * every Recharts figure in Prognos has to come through `next/dynamic` with
 * `ssr: false` because `ResponsiveContainer` measures the DOM. Six of those
 * would mean six placeholders blinking and six observers, for a line with no
 * axes, no grid and no tooltip. The risk gauge draws its needle by hand for
 * the same reason.
 *
 * It carries no accessible name on purpose: the card states the figure and its
 * change in words directly above, so the curve is decoration.
 */
export function Sparkline({ values, color, className }: SparklineProps) {
	if (values.length < 2) return null;

	const min = Math.min(...values);
	const max = Math.max(...values);
	const span = max - min;
	/* A flat series runs down the middle rather than pinning to the top. */
	const y = (value: number) =>
		span === 0 ? VIEW_H / 2 : PAD + (VIEW_H - 2 * PAD) * (1 - (value - min) / span);

	const step = VIEW_W / (values.length - 1);
	const points = values
		.map((value, index) => `${(index * step).toFixed(2)},${y(value).toFixed(2)}`)
		.join(" ");

	return (
		<svg
			className={cn("h-8 w-full", className)}
			viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
			preserveAspectRatio="none"
			aria-hidden
			focusable="false"
		>
			<polyline
				points={points}
				fill="none"
				stroke={color}
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
				/* The viewBox is stretched to the card's width; without this the
				   stroke would stretch with it. */
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	);
}

export default Sparkline;
