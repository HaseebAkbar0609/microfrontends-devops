import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Star } from "lucide-react";
import Image from "next/image";

interface ReviewCardProps {
	name: string;
	review: string;
	rating: number;
	date: string;
	imageUrl: string;
}

export function ReviewCard({
	name,
	review,
	rating,
	date,
	imageUrl,
}: ReviewCardProps) {
	return (
		<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
			<div className="flex items-center gap-4 mb-6">
				<div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100">
					<Image
						src={imageUrl}
						alt={name}
						fill
						className="object-cover"
					/>
				</div>
				<div>
					<h4 className="font-bold text-slate-900 text-base">{name}</h4>
					<p className="text-slate-500 text-sm leading-tight">{review}</p>
				</div>
			</div>
			
			<div className="flex items-center justify-between mt-auto">
				<div className="flex gap-1">
					{[...Array(5)].map((_, i) => (
						<Star 
							key={i} 
							className={`h-4 w-4 ${i < rating ? "text-orange-400 fill-orange-400" : "text-slate-200 fill-slate-200"}`} 
						/>
					))}
				</div>
				<div className="text-right">
					<p className="text-[10px] text-slate-400 uppercase font-medium">
						<Translate text={localizationConstants.becameSinceLabel} />
					</p>
					<p className="text-xs text-slate-500 font-semibold">{date}</p>
				</div>
			</div>
		</div>
	);
}
