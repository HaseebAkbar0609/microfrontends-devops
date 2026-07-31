"use client";

import { useRouter } from "next/navigation";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { EmploymentContract } from "../constants/mockData";

const Field = ({
	labelKey,
	value,
}: {
	labelKey: string;
	value: string;
}) => (
	<div>
		<p className="text-sm font-medium text-slate-900">
			<Translate text={labelKey} />
		</p>
		<p className="mt-1 text-sm text-slate-500">{value}</p>
	</div>
);

const EmploymentContractCard = ({
	contract,
}: {
	contract: EmploymentContract;
}) => {
	const router = useRouter();
	const openViewer = () =>
		router.push("/tools/my-pages/employment/contract");

	return (
		<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
			<div className="flex flex-wrap items-center justify-between gap-3 bg-slate-200/60 px-5 py-3">
				<div className="flex items-center gap-2.5">
					<h2 className="text-base font-medium text-slate-800">
						<Translate
							text={localizationConstants.myPagesEmpTabContract}
						/>{" "}
						- <span className="font-bold">{contract.employeeName}</span>
					</h2>
					<span className="rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-medium text-white">
						<Translate
							text={localizationConstants.myPagesEmpOpenBadge}
						/>
					</span>
				</div>
				<div className="flex items-center gap-2.5">
					<Button
						type="button"
						onClick={openViewer}
						className="h-9 gap-2 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-900/90"
					>
						<FileText className="h-4 w-4" />
						<Translate
							text={localizationConstants.myPagesEmpViewContract}
						/>
					</Button>
					<Button
						type="button"
						variant="outline"
						asChild
						className="h-9 gap-2 rounded-md border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50"
					>
						<a href={contract.downloadUrl} download>
							<Download className="h-4 w-4" />
							<Translate
								text={localizationConstants.myPagesEmpDownload}
							/>
						</a>
					</Button>
				</div>
			</div>

			<div className="flex flex-col gap-5 px-5 py-4">
				<Field
					labelKey={localizationConstants.myPagesEmpRole}
					value={contract.role}
				/>
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
					<Field
						labelKey={localizationConstants.myPagesEmpNumber}
						value={contract.employmentNumber}
					/>
					<Field
						labelKey={localizationConstants.myPagesEmpName}
						value={contract.employeeName}
					/>
					<Field
						labelKey={localizationConstants.myPagesEmpPersonNo}
						value={contract.personNumber}
					/>
					<Field
						labelKey={localizationConstants.myPagesEmpStartDate}
						value={contract.startDate}
					/>
				</div>
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
					<Field
						labelKey={localizationConstants.myPagesEmpAddress}
						value={contract.address}
					/>
					<Field
						labelKey={localizationConstants.myPagesEmpPostalCode}
						value={contract.postalCode}
					/>
					<Field
						labelKey={localizationConstants.myPagesEmpCity}
						value={contract.city}
					/>
				</div>
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
					<Field
						labelKey={localizationConstants.myPagesEmpMobile}
						value={contract.mobile}
					/>
					<Field
						labelKey={localizationConstants.myPagesEmpEmail}
						value={contract.email}
					/>
				</div>
			</div>
		</div>
	);
};

export default EmploymentContractCard;
