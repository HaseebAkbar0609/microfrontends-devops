import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ContentItem } from "@/api-actions";

interface AdviceCardProps {
	card: ContentItem;
}

export function AdviceCard({ card }: AdviceCardProps) {
	const destination =
		card.target_url || `/inspiration/${card.detail_id || card.id}`;

	return (
		<div className="flex w-full flex-col overflow-hidden rounded-md border border-gray-200 bg-white p-2">
			<div className="relative mb-1 aspect-video w-full overflow-hidden rounded-md">
				<Image
					src={card.thumbnail_url || "/assets/images/placeholder.jpg"}
					alt={card.title}
					fill
					className="object-cover"
					sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 33vw"
				/>
			</div>
			<div className="flex flex-1 flex-col gap-0.5 px-1">
				<h3 className="text-base font-bold text-gray-900 leading-snug">
					{card.title}
				</h3>
				<p className="flex-1 text-xs text-gray-500 leading-relaxed">
					{card.summary}
				</p>
				<div className="pt-1">
					<Button
						asChild
						variant="outline"
						size="sm"
						className="h-8 rounded-lg border-gray-300 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
					>
						<Link href={destination}>
							<Translate text={localizationConstants.inspirationReadMore} />
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
