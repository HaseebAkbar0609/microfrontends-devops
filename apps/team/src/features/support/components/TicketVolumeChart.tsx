"use client";

import { useState } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SUPPORT_CHANNELS } from "../constants/supportStatuses";
import { SUPPORT_VOLUME_BY_RANGE } from "../constants/supportVolume.mock";
import type { VolumeRange } from "../types";

const RANGES: { id: VolumeRange; labelKey: string }[] = [
	{ id: "day", labelKey: localizationConstants.supportRangeDay },
	{ id: "week", labelKey: localizationConstants.supportRangeWeek },
	{ id: "month", labelKey: localizationConstants.supportRangeMonth },
];

const AXIS_TICK = { fill: "#64748b", fontSize: 12 };

/**
 * Incoming tickets per channel.
 *
 * Rendered through `next/dynamic` with `ssr: false` by the overview page —
 * recharts measures the DOM to size itself and warns on hydration otherwise.
 */
export default function TicketVolumeChart() {
	const [range, setRange] = useState<VolumeRange>("day");
	const t = useTranslate();
	const data = SUPPORT_VOLUME_BY_RANGE[range];

	return (
		<section className="@container rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h2 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.supportVolumeTitle} />
					</h2>
					<p className="text-sm text-slate-500">
						<Translate text={localizationConstants.supportVolumeSubtitle} />
					</p>
				</div>
				<Tabs
					value={range}
					onValueChange={(value) => setRange(value as VolumeRange)}
				>
					<TabsList variant="line" className="h-9">
						{RANGES.map((entry) => (
							<TabsTrigger
								key={entry.id}
								value={entry.id}
								className="cursor-pointer px-3 text-sm"
							>
								<Translate text={entry.labelKey} />
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>

			<ul className="mt-4 flex flex-wrap items-center gap-4">
				{SUPPORT_CHANNELS.map((channel) => (
					<li
						key={channel.id}
						className="inline-flex items-center gap-2 text-xs text-slate-600"
					>
						<span
							aria-hidden
							className="h-2.5 w-2.5 rounded-full"
							style={{ backgroundColor: channel.chartColor }}
						/>
						<Translate text={channel.labelKey} />
					</li>
				))}
			</ul>

			<div className="mt-4 h-72 w-full">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={data}
						margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
					>
						<defs>
							{SUPPORT_CHANNELS.map((channel) => (
								<linearGradient
									key={channel.id}
									id={`support-volume-${channel.id}`}
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor={channel.chartColor}
										stopOpacity={0.35}
									/>
									<stop
										offset="95%"
										stopColor={channel.chartColor}
										stopOpacity={0.02}
									/>
								</linearGradient>
							))}
						</defs>
						<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
						<XAxis
							dataKey="label"
							tickLine={false}
							axisLine={false}
							tick={AXIS_TICK}
						/>
						<YAxis tickLine={false} axisLine={false} tick={AXIS_TICK} />
						<Tooltip
							contentStyle={{
								backgroundColor: "#ffffff",
								border: "1px solid #e2e8f0",
								borderRadius: 12,
								fontSize: 12,
							}}
						/>
						{SUPPORT_CHANNELS.map((channel) => (
							<Area
								key={channel.id}
								type="monotone"
								dataKey={channel.id}
								name={t(channel.labelKey)}
								stroke={channel.chartColor}
								strokeWidth={2}
								fill={`url(#support-volume-${channel.id})`}
							/>
						))}
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</section>
	);
}
