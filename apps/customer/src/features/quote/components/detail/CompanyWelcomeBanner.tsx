import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import Image from "next/image";

interface CompanyWelcomeBannerProps {
	companyName: string;
	imageUrl: string;
	description: string;
}

export function CompanyWelcomeBanner({
	companyName,
	imageUrl,
	description,
}: CompanyWelcomeBannerProps) {
	return (
		<div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col md:flex-row gap-8 items-center shadow-sm">
			<div className="w-full md:w-1/3 h-full min-h-[235px] relative rounded-lg overflow-hidden border border-slate-100 shadow-inner">
				<Image
					src={imageUrl}
					alt={companyName}
					fill
					className="object-cover"
				/>
			</div>
			<div className="flex-1 space-y-4">
				<h2 className="text-xl font-bold text-slate-900">
					<Translate text={localizationConstants.welcomeTitle1} />{" "}
					{companyName},{" "}
					<Translate text={localizationConstants.welcomeTitle2} />
				</h2>
				<p className="text-slate-600 text-sm leading-relaxed">
					{description}
				</p>
			</div>
		</div>
	);
}
