import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AdviceCard as AdviceCardType } from "../types";

interface AdviceCardProps {
	card: AdviceCardType;
}

export function AdviceCard({ card }: AdviceCardProps) {
	return (
		<div className="flex w-full flex-col overflow-hidden rounded-md border border-gray-200 bg-white p-2">
			<div className="relative mb-1 aspect-video w-full overflow-hidden rounded-md">
				<Image
					src={card.imageUrl || "/assets/images/placeholder.jpg"}
					alt={card.title}
					fill
					className="object-cover"
					sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 33vw"
				/>
			</div>
			<div className="flex flex-1 flex-col gap-0.5 px-1">
				<h3 className="text-base font-bold text-gray-900 leading-snug">
					<Translate text={card.title} />
				</h3>
				<p className="flex-1 text-xs text-gray-500 leading-relaxed">
					<Translate text={card.excerpt} />
				</p>
				<div className="pt-1">
					<Button
						variant="outline"
						size="sm"
						className="h-8 rounded-lg border-gray-300 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
					>
						<Translate text={localizationConstants.inspirationReadMore} />
					</Button>
				</div>
			</div>
		</div>
	);
}
