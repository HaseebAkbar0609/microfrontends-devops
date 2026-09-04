import Image from "next/image";

import { DASHBOARD_QUICK_STATS } from "@/features/dashboard/constants/dashboard";

import { StatItem } from "./StatItem";

export function QuickStatsCard() {
	return (
		<>
			{/* Top banner image */}
			<div
				className="relative w-full overflow-hidden rounded-xl"
				style={{ height: 235 }}
			>
				<Image
					src="/dashboard-stats-banner.png"
					alt="Project overview"
					fill
					className="object-cover object-center"
					priority
				/>
			</div>

			{/* Stats row */}
			<div className="flex gap-3 py-4">
				{DASHBOARD_QUICK_STATS.map((stat) => (
					<StatItem
						key={stat.id}
						title={stat.title}
						value={stat.value}
						href={stat.href}
					/>
				))}
			</div>
		</>
	);
}
