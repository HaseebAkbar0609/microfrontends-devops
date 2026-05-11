import {
	Star,
	ArrowUpDown,
	MoreVertical,
	Pencil,
	Check,
	X,
	Lock,
} from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuoteItem } from "../../types/types";
import { getStatusVariant } from "../../constants";
import { useParams } from "next/navigation";
import Link from "next/link";
import localizationConstants, {
	Translation,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useModal from "@/features/auth/hooks/useModal";
import { MODAL_CONSTANTS, ModalType } from "@/constants/constant";

const statusKeyMap: Record<string, keyof Translation> = {
	Approved: localizationConstants.statusApproved,
	"Received Quote": localizationConstants.statusReceivedQuote,
	Invited: localizationConstants.statusInvited,
	Estimated: localizationConstants.statusEstimated,
	"Waiting for Quote": localizationConstants.statusWaitingForQuote,
};

interface QuoteListTableProps {
	quotes: readonly QuoteItem[];
}

export function QuoteListTable({ quotes }: QuoteListTableProps) {
	const params = useParams();
	const id = params.id as string;
	const { isOpen, openModal, closeModal } = useModal<ModalType>();

	// const handleConfirm = () => {
	// 	if (!type || !modalId) return;
	// 	// Logic for approval or rejection goes here
	// 	closeModal();
	// };

	return (
		<div className="bg-white rounded-lg border border-slate-200 overflow-hidden mt-2">
			<Table>
				<TableHeader>
					<TableRow className="hover:bg-transparent border-b border-slate-100">
						<TableHead className="w-16 text-center text-xs font-semibold text-muted-foreground py-3 h-auto">
							<Translate
								text={localizationConstants.statusInvited}
							/>
						</TableHead>
						<TableHead className="text-xs font-semibold text-muted-foreground py-3 h-auto">
							<Translate
								text={localizationConstants.companyNameLabel}
							/>
						</TableHead>
						<TableHead className="text-xs font-semibold text-muted-foreground py-3 h-auto">
							<Translate
								text={
									localizationConstants.contactPersonNameLabel
								}
							/>
						</TableHead>
						<TableHead className="text-xs font-semibold text-muted-foreground py-3 h-auto">
							<Translate
								text={localizationConstants.orgNoLabel}
							/>
						</TableHead>
						<TableHead className="text-xs font-semibold text-muted-foreground py-3 h-auto cursor-pointer">
							<div className="flex items-center gap-1.5">
								<Translate
									text={localizationConstants.quotePriceLabel}
								/>{" "}
								<ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
							</div>
						</TableHead>
						<TableHead className="text-xs font-semibold text-muted-foreground py-3 h-auto cursor-pointer">
							<div className="flex items-center gap-1.5">
								<Translate
									text={localizationConstants.status}
								/>{" "}
								<ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
							</div>
						</TableHead>
						<TableHead className="w-12 h-auto"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{quotes.map((item) => (
						<TableRow
							key={item.id}
							className="border-b border-slate-100 hover:bg-slate-50/50"
						>
							<TableCell className="text-center py-4">
								{item.isStarred && (
									<Star className="h-4 w-4 mx-auto text-slate-900 fill-slate-900" />
								)}
							</TableCell>
							<TableCell className="py-4 text-sm font-medium text-slate-900">
								{item.company}
							</TableCell>
							<TableCell className="py-4 text-sm text-slate-600">
								{item.contact}
							</TableCell>
							<TableCell className="py-4 text-sm text-slate-600">
								{item.orgNo}
							</TableCell>
							<TableCell className="py-4 text-sm text-slate-600">
								{item.price}
							</TableCell>
							<TableCell className="py-4">
								<Badge
									variant={getStatusVariant(item.status)}
									className="rounded-full px-2.5 py-0.5 whitespace-nowrap text-[11px]"
								>
									<Translate
										text={
											statusKeyMap[item.status] ||
											item.status
										}
									/>
								</Badge>
							</TableCell>
							<TableCell className="py-4 text-right">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 hover:text-slate-900"
										>
											<MoreVertical className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-[140px] shadow-md border-slate-200"
									>
										<DropdownMenuItem
											asChild
											className="gap-2 cursor-pointer py-2"
										>
											<Link
												href={`/business/offer/${id}/${item.id}`}
												className="flex items-center w-full"
											>
												<Pencil className="h-4 w-4 text-slate-700" />
												<span className="text-slate-700 font-medium text-sm">
													<Translate
														text={
															localizationConstants.viewLabel
														}
													/>
												</span>
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem
											className="gap-2 cursor-pointer py-2 text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
											onClick={() =>
												openModal(
													MODAL_CONSTANTS.APPROVE,
													item.id,
												)
											}
										>
											<Check className="h-4 w-4" />
											<span className="font-medium text-sm">
												<Translate
													text={
														localizationConstants.approveLabel
													}
												/>
											</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											className="gap-2 cursor-pointer py-2 text-red-500 focus:text-red-600 focus:bg-red-50"
											onClick={() =>
												openModal(
													MODAL_CONSTANTS.REJECT,
													item.id,
												)
											}
										>
											<X className="h-4 w-4" />
											<span className="font-medium text-sm">
												<Translate
													text={
														localizationConstants.rejectLabel
													}
												/>
											</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<AlertDialog
				open={isOpen}
				onOpenChange={(open) => !open && closeModal()}
			>
				<AlertDialogContent className="max-w-sm text-center">
					<AlertDialogHeader className="items-center">
						<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
							<Lock />
						</div>
						<AlertDialogTitle className="text-center text-lg font-semibold text-slate-800">
							<Translate
								text={localizationConstants.comingSoon}
							/>
						</AlertDialogTitle>
						<AlertDialogDescription className="text-center text-sm text-slate-500">
							This feature is not available yet. Stay tuned!
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="justify-center sm:justify-center">
						<AlertDialogCancel
							onClick={closeModal}
							className="min-w-24"
						>
							<Translate text={localizationConstants.cancel} />
						</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
