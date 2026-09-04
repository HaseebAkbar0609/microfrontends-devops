"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Trash2, Loader2, CircleUserRound, PencilLine, ArrowDownUp } from "lucide-react";

import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveTable, ResponsiveTableColumn } from "@/components/table/ResponsiveTable";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import {
	getRotRutDetailsAPIAction,
	deleteRotRutAPIAction,
	updateRotRutOwnerAPIAction,
	type RotDetails,
	type RotOwner,
} from "@/api-actions/rotRut";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const rotRutTabTriggerClass =
	"relative flex-none rounded-none border-0 bg-transparent px-4 py-2.5 text-sm shadow-none " +
	"font-normal text-slate-500 transition-colors hover:text-slate-700 " +
	"focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 " +
	"border-b-[3px] border-transparent -mb-[3px] after:hidden " +
	"data-[state=active]:z-[1] data-[state=active]:bg-transparent data-[state=active]:font-semibold " +
	"data-[state=active]:text-slate-900 data-[state=active]:shadow-none " +
	"data-[state=active]:!border-b-[3px] data-[state=active]:!border-slate-900";

function RotRutOpenedContent() {
	const { t } = useTranslation();
	const params = useParams();
	const router = useRouter();
	const searchParams = useSearchParams();
	const deductionId = params?.id as string;
	const queryProjectId = searchParams?.get("projectId") ?? "";
	const [projectId, setProjectId] = useState<string>(queryProjectId);

	const tabParam = searchParams?.get("tab") || "rot";
	const [activeTab, setActiveTab] = useState(tabParam);

	const [details, setDetails] = useState<RotDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [ownerToDelete, setOwnerToDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		let cancelled = false;

		const fetchDetails = async () => {
			setError(null);
			const pid = queryProjectId;
			if (!pid) {
				setError("Project ID is required");
				setLoading(false);
				return;
			}
			setProjectId(pid);

			if (!deductionId) {
				setLoading(false);
				return;
			}

			setLoading(true);
			const result = await getRotRutDetailsAPIAction({ projectId: pid, id: deductionId });
			if (cancelled) return;
			if (result.success && result.data) {
				setDetails(result.data);
				if (result.data.deductionType) {
					setActiveTab(result.data.deductionType);
				}
			} else {
				setError(result.error ?? "Failed to load details");
			}
			setLoading(false);
		};

		void fetchDetails();

		return () => {
			cancelled = true;
		};
	}, [deductionId, queryProjectId]);

	const handleTabChange = (val: string) => {
		setActiveTab(val);
		router.replace(`/rotRut/${deductionId}/edit?projectId=${encodeURIComponent(projectId)}&tab=${encodeURIComponent(val)}`);
	};

	const handleRemoveCoOwner = async () => {
		const result = await updateRotRutOwnerAPIAction({
			projectId,
			id: deductionId,
			isCoOwner: false,
			coOwnerPersonalId: null,
		});
		if (result.success) {
			setIsDeleteDialogOpen(false);
			setOwnerToDelete(null);
			toast.success(t(localizationConstants.coOwnerRemovedSuccess));
			const updatedDetails = await getRotRutDetailsAPIAction({ projectId, id: deductionId });
			if (updatedDetails.success && updatedDetails.data) {
				setDetails(updatedDetails.data);
			}
		} else {
			toast.error(result.error || t(localizationConstants.coOwnerRemovedError));
		}
	};

	const handleDeleteDeduction = async () => {
		const deductionType = details?.deductionType || activeTab;
		const result = await deleteRotRutAPIAction({ projectId, id: deductionId });
		if (result.success) {
			setIsDeleteDialogOpen(false);
			setOwnerToDelete(null);
			toast.success(
				deductionType === "rut"
					? t(localizationConstants.rutDeletedSuccess)
					: t(localizationConstants.rotDeletedSuccess)
			);
			router.push(`/rotRut?projectId=${encodeURIComponent(projectId)}&tab=${deductionType}`);
		} else {
			toast.error(
				result.error ||
					(deductionType === "rut"
						? t(localizationConstants.rutDeletedError)
						: t(localizationConstants.rotDeletedError))
			);
		}
	};

	const getDeletionErrorMessage = (isCoOwner: boolean, deductionType: string, err?: unknown): string => {
		if (err instanceof Error && err.message) {
			return err.message;
		}
		if (isCoOwner) {
			return t(localizationConstants.coOwnerRemovedError);
		}
		return deductionType === "rut"
			? t(localizationConstants.rutDeletedError)
			: t(localizationConstants.rotDeletedError);
	};

	const executeOwnerDeletion = async (targetOwner: { isCoOwner: boolean }) => {
		if (targetOwner.isCoOwner) {
			await handleRemoveCoOwner();
		} else {
			await handleDeleteDeduction();
		}
	};

	const handleDeleteOwner = async () => {
		if (!ownerToDelete || !projectId || !details) return;

		const targetOwner = details.owners.find((o) => o.id === ownerToDelete);
		if (!targetOwner) {
			toast.error(t(localizationConstants.coOwnerRemovedError));
			setOwnerToDelete(null);
			return;
		}

		setIsDeleting(true);
		try {
			await executeOwnerDeletion(targetOwner);
		} catch (err: unknown) {
			const deductionType = details.deductionType || activeTab;
			toast.error(getDeletionErrorMessage(targetOwner.isCoOwner, deductionType, err));
		} finally {
			setIsDeleting(false);
		}
	};

	const openDeleteModal = (id: string) => {
		setOwnerToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	const targetOwnerToDelete = details?.owners.find((o) => o.id === ownerToDelete);

	const columns: ResponsiveTableColumn<RotOwner>[] = [
		{
			id: "name",
			header: (
				<div className="flex items-center gap-1">
					<Translate text={localizationConstants.name} />
					<ArrowDownUp className="h-3 w-3 text-slate-400" />
				</div>
			),
			cell: (row) => <span className="text-slate-900 text-sm">{row.name}</span>,
			headerClassName: "text-slate-500 font-medium h-12 w-[30%] align-middle px-4 text-sm",
			cellClassName: "px-4 py-4 align-middle",
		},
		{
			id: "personalNumber",
			header: (
				<div className="flex items-center gap-1">
					<Translate text={localizationConstants.personalIdLabel} />
					<ArrowDownUp className="h-3 w-3 text-slate-400" />
				</div>
			),
			cell: (row) => <span className="text-slate-900 font-medium text-sm">{row.personalNumber}</span>,
			headerClassName: "text-slate-500 font-medium h-12 w-[40%] align-middle px-4 text-sm",
			cellClassName: "px-4 py-4 align-middle",
		},
		{
			id: "sharePercentage",
			header: (
				<div className="flex items-center gap-1">
					<Translate text={localizationConstants.sharePercentageLabel} />
					<ArrowDownUp className="h-3 w-3 text-slate-400" />
				</div>
			),
			cell: (row) => <span className="text-slate-900 text-sm">{row.sharePercentage}%</span>,
			headerClassName: "text-slate-500 font-medium h-12 w-[20%] align-middle px-4 text-sm",
			cellClassName: "px-4 py-4 align-middle",
		},
		{
			id: "actions",
			header: "",
			cell: (row) => (
				<Button
					variant="ghost"
					size="icon"
					onClick={() => openDeleteModal(row.id)}
					className="h-8 w-8 hover:bg-zinc-100 text-slate-600 rounded"
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			),
			headerClassName: "w-[10%] align-middle border-l border-slate-200",
			cellClassName: "text-center px-4 py-4 align-middle border-l border-slate-200",
		},
	];

	if (loading) {
		return (
			<div className="flex flex-1 items-center justify-center min-h-screen bg-white">
				<Loader2 className="h-8 w-8 animate-spin text-slate-500" />
			</div>
		);
	}

	if (error || !details) {
		return (
			<div className="flex flex-1 flex-col bg-white min-h-screen font-inter p-6">
				<p className="text-red-600">{error || "Data not found"}</p>
				<Button onClick={() => router.push(projectId ? `/rotRut?projectId=${encodeURIComponent(projectId)}` : "/rotRut")} className="mt-4 w-fit">Back to List</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col bg-slate-50 min-h-screen font-inter">
			<Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-1 flex-col">
				<PageHeader
					title={localizationConstants.rotRutTitle}
					breadcrumbs={[
						{ label: localizationConstants.home, href: "/home" },
						{ label: localizationConstants.tools, href: "#" },
						{ label: localizationConstants.rotRutTitle, href: projectId ? `/rotRut?projectId=${encodeURIComponent(projectId)}` : "/rotRut" },
					]}
					className="border-none pb-0"
				>
					<TabsList className="mt-2 flex h-auto w-full justify-start gap-x-4 rounded-none bg-transparent p-0 border-b border-slate-200 px-5">
						<TabsTrigger value="rot" className={rotRutTabTriggerClass}>
							<Translate text={localizationConstants.rotTab} />
						</TabsTrigger>
						<TabsTrigger value="rut" className={rotRutTabTriggerClass}>
							<Translate text={localizationConstants.rutTab} />
						</TabsTrigger>
					</TabsList>
				</PageHeader>

				<div className="px-5 py-6 flex-1 max-w-[727px] w-full">
					<TabsContent value="rot" className="mt-0 flex flex-col gap-6">
						{/* Property Details Card */}
						<div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
								<div className="flex items-center gap-2 text-slate-900 font-medium">
									<CircleUserRound className="h-5 w-5 text-slate-700" />
									<Translate text={localizationConstants.rotDetails} />
								</div>
								<Button
									variant="secondary"
									size="sm"
									onClick={() => router.push(`/rotRut/${deductionId}/edit?projectId=${encodeURIComponent(projectId)}`)}
									className="bg-zinc-100 hover:bg-zinc-100 text-zinc-950 h-9 px-4 rounded-md border border-zinc-200 font-normal w-full sm:w-auto justify-center"
								>
									<PencilLine className="h-4 w-4 mr-2" />
									<Translate text={localizationConstants.rotEdit} />
								</Button>
							</div>
							<div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
								<div>
									<p className="text-sm font-medium text-slate-900 mb-1">
										<Translate text={localizationConstants.propertyIdLabel} />
									</p>
									<p className="text-sm text-[#71717A]">{details.designation}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-slate-900 mb-1">
										<Translate text={localizationConstants.addressLabel} />
									</p>
									<p className="text-sm text-[#71717A]">{details.address}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-slate-900 mb-1">
										<Translate text={localizationConstants.createdLabel} />
									</p>
									<p className="text-sm text-[#71717A]">{details.created}</p>
								</div>
							</div>
						</div>

						{/* Owner List Card */}
						<div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
								<div className="flex items-center gap-2 text-slate-900 font-medium">
									<CircleUserRound className="h-5 w-5 text-slate-700" />
									<Translate text={localizationConstants.ownerList} />
								</div>
								<Button
									variant="secondary"
									size="sm"
									onClick={() => router.push(`/rotRut/${deductionId}/edit?projectId=${encodeURIComponent(projectId)}`)}
									className="bg-zinc-100 hover:bg-zinc-100 text-zinc-950 h-9 px-4 rounded-md border border-zinc-200 font-normal w-full sm:w-auto justify-center"
								>
									<PencilLine className="h-4 w-4 mr-2" />
									<Translate text={localizationConstants.rotEdit} />
								</Button>
							</div>
							<div className="p-6">
								<ResponsiveTable
									data={details.owners}
									columns={columns}
									getRowKey={(row) => row.id}
									emptyContent="No owners found"
									containerClassName="border-0 border-b border-slate-200 rounded-none"
									headerClassName="border-slate-200 bg-white"
									rowClassName="border-slate-200 hover:bg-slate-50/50"
								/>
							</div>
						</div>
					</TabsContent>
					<TabsContent value="rut" className="mt-0 flex flex-col gap-6">
						{/* Property Details Card */}
						<div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
								<div className="flex items-center gap-2 text-slate-900 font-medium">
									<CircleUserRound className="h-5 w-5 text-slate-700" />
									<Translate text={localizationConstants.propertyDetails} />
								</div>
								<Button
									variant="secondary"
									size="sm"
									onClick={() => router.push(`/rotRut/${deductionId}/edit?projectId=${encodeURIComponent(projectId)}`)}
									className="bg-zinc-100 hover:bg-zinc-100 text-zinc-950 h-9 px-4 rounded-md border border-zinc-200 font-normal w-full sm:w-auto justify-center"
								>
									<PencilLine className="h-4 w-4 mr-2" />
									<Translate text={localizationConstants.rotEdit} />
								</Button>
							</div>
							<div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
								<div>
									<p className="text-sm font-medium text-slate-900 mb-1">
										<Translate text={localizationConstants.propertyIdLabel} />
									</p>
									<p className="text-sm text-[#71717A]">{details.designation}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-slate-900 mb-1">
										<Translate text={localizationConstants.addressLabel} />
									</p>
									<p className="text-sm text-[#71717A]">{details.address}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-slate-900 mb-1">
										<Translate text={localizationConstants.createdLabel} />
									</p>
									<p className="text-sm text-[#71717A]">{details.created}</p>
								</div>
							</div>
						</div>

						{/* Owner List Card */}
						<div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
								<div className="flex items-center gap-2 text-slate-900 font-medium">
									<CircleUserRound className="h-5 w-5 text-slate-700" />
									<Translate text={localizationConstants.ownerList} />
								</div>
								<Button
									variant="secondary"
									size="sm"
									onClick={() => router.push(`/rotRut/${deductionId}/edit?projectId=${encodeURIComponent(projectId)}`)}
									className="bg-zinc-100 hover:bg-zinc-100 text-zinc-950 h-9 px-4 rounded-md border border-zinc-200 font-normal w-full sm:w-auto justify-center"
								>
									<PencilLine className="h-4 w-4 mr-2" />
									<Translate text={localizationConstants.rotEdit} />
								</Button>
							</div>
							<div className="p-6">
								<ResponsiveTable
									data={details.owners}
									columns={columns}
									getRowKey={(row) => row.id}
									emptyContent="No owners found"
									containerClassName="border-0 border-b border-slate-200 rounded-none"
									headerClassName="border-slate-200 bg-white"
									rowClassName="border-slate-200 hover:bg-slate-50/50"
								/>
							</div>
						</div>
					</TabsContent>
				</div>

				<AlertDialog
					open={isDeleteDialogOpen}
					onOpenChange={(open) => {
						setIsDeleteDialogOpen(open);
						if (!open) setOwnerToDelete(null);
					}}
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								<Translate text={localizationConstants.deleteConfirmTitle} />
							</AlertDialogTitle>
							<AlertDialogDescription>
								{targetOwnerToDelete?.isCoOwner ? (
									<Translate text={localizationConstants.removeCoOwnerConfirmDescription} />
								) : activeTab === "rut" ? (
									<Translate text={localizationConstants.deleteRutConfirmDescription} />
								) : (
									<Translate text={localizationConstants.deleteRotConfirmDescription} />
								)}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel
								disabled={isDeleting}
								onClick={() => setOwnerToDelete(null)}
							>
								<Translate text={localizationConstants.cancelLabel} />
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={(e) => {
									e.preventDefault();
									handleDeleteOwner();
								}}
								disabled={isDeleting}
								className="bg-red-600 text-white hover:bg-red-700"
							>
								{isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
								<Translate text={localizationConstants.deleteLabel} />
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</Tabs>
		</div>
	);
}

export default function RotRutOpenedPage() {
	return (
		<Suspense
			fallback={
				<div className="flex flex-1 items-center justify-center min-h-screen bg-white">
					<Loader2 className="h-8 w-8 animate-spin text-slate-500" />
				</div>
			}
		>
			<RotRutOpenedContent />
		</Suspense>
	);
}
