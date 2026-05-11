"use client";
import { Card } from "@/components/ui/card";
import { useAuthStatus } from "@/context/AuthContext";

import { ConsultantCard } from "./ConsultantCard";
import { NewsCard } from "./NewsCard";
import { QuickStatsCard } from "./QuickStatsCard";
import { ResourceLinksCard } from "./ResourceLinksCard";
import { WelcomeBanner } from "./WelcomeBanner";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export default function DashboardFeature() {
	const { user } = useAuthStatus();

	return (
		<div className="flex flex-1 flex-col">
			{/* Welcome Greeting */}
			<div className="flex flex-col gap-2 pt-6 px-6">
				<h2 className="text-xl font-semibold tracking-wide text-slate-950 capitalize">
					<Translate text={localizationConstants.hi} />, {""}
					{user?.first_name ? (
						`${user.first_name} ${user.last_name || ""}`.trim()
					) : (
						<Translate text={localizationConstants.userNameAnna} />
					)}{" "}
					👋
				</h2>
				<p className="text-sm text-slate-600">
					<Translate text={localizationConstants.welcomeText} />
				</p>
			</div>

			{/* Dashboard Content */}
			<div className="flex-1 bg-blue-gray-50">
				<div className="flex flex-col gap-6 p-6">
					{/* Hero Banner */}
					<WelcomeBanner />

					{/* Main Content — Two Column Grid */}
					<div className="flex w-full flex-col gap-6 lg:flex-row">
						{/* Left Column */}
						<div className="flex flex-col gap-5 lg:flex-1">
							<Card className="flex flex-col gap-0 bg-white border p-6">
								<QuickStatsCard />
							</Card>
							<NewsCard />
						</div>

						{/* Right Column */}
						<div className="flex flex-col gap-6 lg:flex-1">
							<ResourceLinksCard />
							<ConsultantCard />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
