"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Trash2, Loader2, CircleUserRound, PencilLine, ArrowDownUp } from "lucide-react";

import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveTable, ResponsiveTableColumn } from "@/components/table/ResponsiveTable";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	getRotRutDetailsAPIAction,
	deleteRotRutAPIAction,
	type RotDetails,
	type RotOwner,
} from "@/api-actions/rotRut";
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

export default function RotRutOpenedPage() {
	const params = useParams();
	const router = useRouter();
	const searchParams = useSearchParams();
	const propertyId = params?.id as string;

	const tabParam = searchParams?.get("tab") || "rot";
	const [activeTab, setActiveTab] = useState(tabParam);

	const [details, setDetails] = useState<RotDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [ownerToDelete, setOwnerToDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		if (!propertyId) return;
		let cancelled = false;

		setLoading(true);
		void getRotRutDetailsAPIAction({ id: propertyId }).then((result) => {
			if (cancelled) return;
			if (result.success && result.data) {
				setDetails(result.data);
			} else {
				setError(result.error ?? "Failed to load details");
			}
			setLoading(false);
		});

		return () => {
			cancelled = true;
		};
	}, [propertyId]);

	const handleDeleteOwner = async () => {
		if (!ownerToDelete) return;

		setIsDeleting(true);
		const result = await deleteRotRutAPIAction({ id: ownerToDelete });
		setIsDeleting(false);

		if (result.success) {
			setIsDeleteDialogOpen(false);
			setDetails((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					owners: prev.owners.filter((o) => o.id !== ownerToDelete),
				};
			});
		} else {
			alert(result.error || "Failed to delete owner");
		}
	};

	const openDeleteModal = (id: string) => {
		setOwnerToDelete(id);
		setIsDeleteDialogOpen(true);
	};

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
				<Button onClick={() => router.push("/rotRut")} className="mt-4 w-fit">Back to List</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col bg-slate-50 min-h-screen font-inter">
			<Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col">
				<PageHeader
					title={localizationConstants.rotRutTitle}
					breadcrumbs={[
						{ label: localizationConstants.home, href: "/home" },
						{ label: localizationConstants.tools, href: "#" },
						{ label: localizationConstants.rotRutTitle, href: "/rotRut" },
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
									onClick={() => router.push(`/rotRut/${propertyId}/edit-form`)}
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
									onClick={() => router.push(`/rotRut/${propertyId}/edit-form`)}
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
									onClick={() => router.push(`/rotRut/${propertyId}/edit-form`)}
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
									onClick={() => router.push(`/rotRut/${propertyId}/edit-form`)}
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

				<AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete the owner entry.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={(e) => {
									e.preventDefault();
									handleDeleteOwner();
								}}
								disabled={isDeleting}
								className="bg-red-600 text-white hover:bg-red-700"
							>
								{isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</Tabs>
		</div>
	);
}
