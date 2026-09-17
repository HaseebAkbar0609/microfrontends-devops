"use client";

import { useState } from "react";
import { CircleUserRound, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SignaturesInfo, SignerInfo } from "../types/constructionLog.types";

interface SignatureCardProps {
	signer: SignerInfo;
	isOpen: boolean;
	onToggle: () => void;
}

function SignatureCard({ signer, isOpen, onToggle }: SignatureCardProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden flex flex-col">
			<Button
				type="button"
				variant="ghost"
				onClick={onToggle}
				className="w-full px-6 sm:px-8 py-4 flex items-center justify-between bg-white hover:bg-slate-50/70 transition-colors cursor-pointer border-b border-slate-200 h-14 min-h-14 rounded-none"
			>
				<div className="flex items-center gap-2.5">
					<CircleUserRound className="size-6 text-slate-700 shrink-0" />
					<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900">
						{signer.name}
					</span>
				</div>
				{isOpen ? (
					<ChevronUp className="w-4 h-4 text-slate-500" />
				) : (
					<ChevronDown className="w-4 h-4 text-slate-500" />
				)}
			</Button>

			{isOpen && (
				<div className="flex-1 flex flex-col justify-between p-5 gap-6">
					<div className="flex items-center gap-3">
						<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900 whitespace-nowrap">
							<Translate text={localizationConstants.orderDagbokSignature} />
						</span>
						<div className="flex-1 border-b border-slate-300 h-8 flex items-end pb-1">
							{signer.signed && (
								<span className="font-serif italic text-sm text-slate-700 select-none">
									{signer.name}
								</span>
							)}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderDagbokRole} />
							</span>
							<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500">
								{signer.role}
							</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderDagbokClarification} />
							</span>
							<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500">
								{signer.name}
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

interface ConstructionLogSignaturesProps {
	signatures: SignaturesInfo;
}

export function ConstructionLogSignatures({ signatures }: ConstructionLogSignaturesProps) {
	const [isOpen1, setIsOpen1] = useState(true);
	const [isOpen2, setIsOpen2] = useState(true);

	return (
		<div className="flex flex-col gap-3 pt-6 border-t border-slate-200">
			<h2 className="text-base sm:text-lg font-semibold text-slate-900">
				<Translate text={localizationConstants.orderDagbokSectionSignatures} />
			</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
				<SignatureCard signer={signatures.siteManager} isOpen={isOpen1} onToggle={() => setIsOpen1(!isOpen1)} />
				<SignatureCard signer={signatures.client} isOpen={isOpen2} onToggle={() => setIsOpen2(!isOpen2)} />
			</div>
		</div>
	);
}

export default ConstructionLogSignatures;
