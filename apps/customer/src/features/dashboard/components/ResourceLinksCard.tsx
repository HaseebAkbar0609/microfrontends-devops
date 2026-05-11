import { Card } from "@/components/ui/card";
import { DASHBOARD_RESOURCE_LINKS } from "@/features/dashboard/constants/dashboard";

import { ResourceLinkItem } from "./ResourceLinkItem";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export function ResourceLinksCard() {

	return (
		<Card className="flex w-full flex-col overflow-hidden bg-white border p-6">
			<div className="flex flex-col gap-3">
				<h2
					className="text-xl font-semibold"
					style={{ color: "var(--ui-text-primary)" }}
				>
					<Translate text={localizationConstants.resourceLinksTitle} />
				</h2>
				<div className="flex flex-col gap-1">
					{DASHBOARD_RESOURCE_LINKS.map((link) => (
						<ResourceLinkItem
							key={link.id}
							label={link.label}
							icon={link.icon}
							href={link.href}
						/>
					))}
				</div>
			</div>
		</Card>
	);
}
