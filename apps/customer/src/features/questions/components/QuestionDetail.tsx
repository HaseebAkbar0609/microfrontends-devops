"use client";

import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addQuestionReplyAPIAction } from "@/api-actions";
import type { TicketItem } from "@/api-actions";
import { useTranslate } from "@/utils/translation/translate";
import { toast } from "sonner";

interface QuestionDetailProps {
	ticket: TicketItem;
	onBack: () => void;
	onUpdated: () => void;
}

export function QuestionDetail({ ticket, onBack, onUpdated }: QuestionDetailProps) {
	const t = useTranslate();
	const { i18n } = useTranslation();
	const [reply, setReply] = useState("");
	const [sending, setSending] = useState(false);
	const [messages, setMessages] = useState(ticket.messages ?? []);

	const handleSend = async () => {
		if (!reply.trim()) return;
		setSending(true);
		try {
			const result = await addQuestionReplyAPIAction(ticket.id, reply.trim());
			if (result.success && result.data) {
				setMessages(result.data.messages ?? []);
				setReply("");
				onUpdated();
			} else {
				toast.error(result.error || t("questionsFailedToSendReply"));
			}
		} catch (error: unknown) {
			toast.error(
				error instanceof Error
					? error.message
					: t("questionsFailedToSendReply"),
			);
		} finally {
			setSending(false);
		}
	};

	const statusBadge = (status: string) => {
		const colors: Record<string, string> = {
			open: "bg-blue-100 text-blue-700",
			in_progress: "bg-yellow-100 text-yellow-700",
			pending_response: "bg-orange-100 text-orange-700",
			resolved: "bg-green-100 text-green-700",
		};
		const statusLabels: Record<string, string> = {
			open: t("questionsStatusOpen"),
			in_progress: t("questionsStatusInProgress"),
			pending_response: t("questionsStatusPendingResponse"),
			resolved: t("questionsStatusResolved"),
		};
		const label = statusLabels[status] || status.replace(/_/g, " ");

		return (
			<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}>
				{label}
			</span>
		);
	};

	const formatDate = (rawDate?: number | string | null) => {
		if (!rawDate) return "";
		const num = typeof rawDate === "string" ? Number(rawDate) : rawDate;
		if (isNaN(num)) return new Date(rawDate).toLocaleDateString(i18n.language);
		const d = new Date(num > 1e11 ? num : num * 1000);
		return d.toLocaleDateString(i18n.language);
	};

	const formatDateTime = (rawDate?: number | string | null) => {
		if (!rawDate) return "";
		const num = typeof rawDate === "string" ? Number(rawDate) : rawDate;
		if (isNaN(num)) return new Date(rawDate).toLocaleString(i18n.language);
		const d = new Date(num > 1e11 ? num : num * 1000);
		return d.toLocaleString(i18n.language);
	};

	return (
		<div className="flex flex-1 flex-col bg-white min-h-screen">
			{/* Header */}
			<div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200">
				<button
					type="button"
					onClick={onBack}
					aria-label={t("questionsBack")}
					className="text-slate-500 hover:text-slate-700"
				>
					<ArrowLeft className="h-5 w-5" />
				</button>
				<div className="flex-1 min-w-0">
					<h2 className="text-base font-semibold text-slate-900 truncate">{ticket.subject}</h2>
					<div className="flex items-center gap-2 mt-0.5">
						{statusBadge(ticket.status)}
						<span className="text-xs text-slate-500">
							{formatDate(ticket.created_at)}
						</span>
					</div>
				</div>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
				{messages.length === 0 && (
					<p className="text-sm text-slate-500 text-center py-8">{t("questionsNoMessagesYet")}</p>
				)}
				{messages.map((msg) => (
					<div
						key={msg.id}
						className={`flex ${msg.sender_type === "customer" ? "justify-end" : "justify-start"}`}
					>
						<div
							className={`max-w-lg rounded-lg px-4 py-2.5 text-sm ${
								msg.sender_type === "customer"
									? "bg-[#F1F5F9] text-slate-900"
									: "bg-white border border-slate-200 text-slate-900"
							}`}
						>
							<p className="whitespace-pre-wrap">{msg.message}</p>
							<p className="text-xs text-blue-500 mt-1">
								{formatDateTime(msg.created_at)}
							</p>
						</div>
					</div>
				))}
			</div>

			{/* Reply input */}
			<div className="border-t border-slate-200 px-5 py-3">
				<Textarea
					value={reply}
					onChange={(e) => setReply(e.target.value)}
					placeholder={t("questionsReplyPlaceholder")}
					className="min-h-20 rounded-lg border-slate-200 resize-none text-sm mb-2"
				/>
				<div className="flex justify-end">
					<Button
						onClick={handleSend}
						disabled={!reply.trim() || sending}
						className="h-9 px-4 text-sm bg-[#18181B] hover:bg-[#18181B]/90 text-white gap-1.5"
					>
						<Send className="h-4 w-4" />
						{sending ? t("questionsSending") : t("questionsSendReply")}
					</Button>
				</div>
			</div>
		</div>
	);
}
