import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export function ConsultantCard() {
	return (
		<Card className="relative flex min-h-[258px] w-full overflow-hidden bg-white border p-0">
			{/* Text & Action side */}
			<div className="flex flex-col p-6 pr-[210px]">
				<div className="flex flex-col gap-3">
					<h2
						className="text-xl font-semibold"
						style={{ color: "var(--ui-text-primary)" }}
					>
						<Translate
							text={localizationConstants.consultantTitle}
						/>
					</h2>

					<p
						className="text-sm leading-normal break-words"
						style={{ color: "var(--ui-text-secondary)" }}
					>
						<Translate
							text={localizationConstants.consultantDescription}
						/>
					</p>
				</div>

				<div className="mt-[60px] w-fit">
					<Tooltip
						position="bottom"
						content={
							<Translate
								text={localizationConstants.comingSoon}
							/>
						}
					>
						<Button
							variant="primary"
							className="w-fit gap-2 bg-gray-900 text-base text-white shadow-md hover:bg-gray-800 active:opacity-90 cursor-default"
							size="lg"
						>
							<Plus className="h-5 w-5" />
							<Translate
								text={localizationConstants.consultantButton}
							/>
						</Button>
					</Tooltip>
				</div>
			</div>

			{/* Person image */}
			<div className="absolute bottom-0 right-0 top-0 overflow-hidden">
				<Image
					src="/consultant-person-726e80.png"
					alt="Consultant"
					width={193}
					height={302}
					className="object-cover object-top"
				/>
			</div>
		</Card>
	);
}
