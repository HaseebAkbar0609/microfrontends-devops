"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { EmploymentContract } from "../constants/mockData";
import "./contract-print.css";

const ContractViewer = ({ contract }: { contract: EmploymentContract }) => {
	const router = useRouter();
	const t = useTranslate();

	return (
		<div className="flex min-h-full flex-col bg-slate-600">
			<div className="flex items-center justify-between bg-slate-800 px-4 py-2.5 text-white">
				<div className="flex items-center gap-3">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-white hover:bg-slate-700 hover:text-white"
						onClick={() =>
							router.push("/tools/my-pages/employment")
						}
						aria-label={t(localizationConstants.myPagesEmpBack)}
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<span className="text-sm font-medium">
						{`Anstallningsavtal-${contract.employmentNumber}.pdf`}
					</span>
				</div>
				<div className="flex items-center gap-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-white hover:bg-slate-700 hover:text-white"
						onClick={() => window.print()}
						aria-label={t(localizationConstants.myPagesEmpDownload)}
					>
						<Download className="h-4 w-4" />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-white hover:bg-slate-700 hover:text-white"
						onClick={() => window.print()}
						aria-label={t(
							localizationConstants.invoicePreviewPrint,
						)}
					>
						<Printer className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="flex flex-1 justify-center overflow-y-auto px-4 py-8">
				<div className="contract-print-area flex h-fit w-full max-w-[41rem] flex-col gap-6">
					{contract.documentPages.map((pageText, index) => (
						<div
							key={`page-${index + 1}`}
							className="contract-print-page whitespace-pre-line bg-white px-14 py-12 text-justify text-[13px] leading-relaxed text-slate-800 shadow-xl"
						>
							{pageText}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ContractViewer;
