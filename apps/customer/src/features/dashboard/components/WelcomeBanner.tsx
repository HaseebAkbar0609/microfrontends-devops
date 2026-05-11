import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export function WelcomeBanner() {
	return (
		<Card className="relative flex w-full flex-row items-center justify-between bg-white border p-0 overflow-hidden">
			{/* Left: Bold text */}
			<div className="z-10 flex-shrink-0 px-8 py-6">
				<h2
					className="text-2xl font-bold leading-tight"
					style={{ color: "var(--ui-text-primary)" }}
				>
					<Translate text={localizationConstants.getAQuoteNow} />
				</h2>
			</div>

			{/* Center: Banner image */}
			<div className="relative h-[100px] flex-1 self-stretch">
				<Image
					src="/dashboard-banner-5be815.png"
					alt="Quote banner"
					fill
					className="object-cover object-center"
					priority
				/>
			</div>

			{/* Right: CTA Button */}
			<div className="z-10 flex-shrink-0 px-8 py-6">
				<Button
					variant="primary"
					className="gap-2 bg-gray-900 text-white shadow-md text-base hover:bg-gray-800 active:opacity-90"
					size="lg"
					asChild
				>
					<Link href="/business/offer">
						<Translate
							text={localizationConstants.createButtonName}
						/>
					</Link>
				</Button>
			</div>
		</Card>
	);
}
