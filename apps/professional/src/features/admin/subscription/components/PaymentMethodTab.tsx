"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { PaymentCard } from "../constants/mockData";
import { PaymentCardDraft, usePaymentCards } from "../hooks/usePaymentCards";
import NewCardDialog from "./NewCardDialog";

const PaymentMethodTab = () => {
	const {
		cards,
		selectedCardId,
		setSelectedCardId,
		addCard,
		updateCard,
		removeCard,
	} = usePaymentCards();

	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingCard, setEditingCard] = useState<PaymentCard | null>(null);

	const openAddDialog = () => {
		setEditingCard(null);
		setDialogOpen(true);
	};

	const openEditDialog = (card: PaymentCard) => {
		setEditingCard(card);
		setDialogOpen(true);
	};

	const handleSave = (draft: PaymentCardDraft) => {
		if (editingCard) updateCard(editingCard.id, draft);
		else addCard(draft);
	};

	return (
		<div className="flex flex-col gap-5">
			<h2 className="text-lg font-semibold text-slate-600">
				<Translate
					text={localizationConstants.subscriptionPaymentHeading}
				/>
			</h2>

			<div className="flex flex-wrap items-end gap-x-24 gap-y-4">
				<div className="space-y-1.5">
					<Label className="text-sm font-medium text-slate-900">
						<Translate
							text={
								localizationConstants.subscriptionPaymentSelectLabel
							}
						/>
					</Label>
					<Select value="card" disabled>
						<SelectTrigger className="h-10 w-48 border-slate-200 bg-slate-100 text-sm text-slate-500">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="card">
								<Translate
									text={
										localizationConstants.subscriptionPaymentMethodCard
									}
								/>
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Button
					type="button"
					onClick={openAddDialog}
					className="h-11 gap-2 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
				>
					<Plus className="h-4 w-4" />
					<Translate
						text={localizationConstants.subscriptionPaymentAddCard}
					/>
				</Button>
			</div>

			<div className="space-y-2">
				<p className="text-sm font-medium text-slate-900">
					<Translate
						text={
							localizationConstants.subscriptionPaymentChooseCard
						}
					/>
				</p>
				{cards.length === 0 ? (
					<p className="text-sm text-slate-500">
						<Translate
							text={
								localizationConstants.subscriptionPaymentNoCards
							}
						/>
					</p>
				) : (
					<RadioGroup
						value={selectedCardId ?? ""}
						onValueChange={setSelectedCardId}
						className="gap-4"
					>
						{cards.map((card) => (
							<div
								key={card.id}
								className="flex items-start justify-between gap-4 sm:max-w-xs"
							>
								<div>
									<Label className="flex items-center gap-2.5 text-base font-medium text-slate-900">
										<RadioGroupItem value={card.id} />
										{card.cardName}
									</Label>
									<p className="mt-1 pl-7 text-sm text-slate-500">
										{card.firstName} {card.lastName}
									</p>
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="h-8 w-8 rounded-md text-slate-500 hover:text-slate-900"
										>
											<MoreVertical className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="start"
										className="w-40 rounded-md border border-slate-200 bg-white p-1 shadow-md"
									>
										<DropdownMenuItem
											onClick={() => openEditDialog(card)}
											className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
										>
											<Pencil className="h-4 w-4 text-slate-600" />
											<Translate
												text={
													localizationConstants.subscriptionPaymentEdit
												}
											/>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => removeCard(card.id)}
											className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
										>
											<Trash2 className="h-4 w-4 text-slate-600" />
											<Translate
												text={
													localizationConstants.subscriptionPaymentDelete
												}
											/>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						))}
					</RadioGroup>
				)}
			</div>

			<NewCardDialog
				open={dialogOpen}
				editingCard={editingCard}
				onClose={() => setDialogOpen(false)}
				onSave={handleSave}
			/>
		</div>
	);
};

export default PaymentMethodTab;
