"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Mail, MoreVertical, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuthStatus } from "@/context/AuthContext";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { CompanyMessageValues } from "../schemas/company";
import { createCompanyContent, deleteCompanyContent, listCompanyContent, uploadCompanyAttachment } from "../services/companyService";
import type { CompanyContentItem, CompanyMessage } from "../types";
import CreateMessageDialog from "./CreateMessageDialog";
import ViewMessageDialog from "./ViewMessageDialog";

const toMessage = (item: CompanyContentItem): CompanyMessage => {
	const date = new Date(item.created_at);
	const recipient = item.recipient || "—";
	return {
		id: item.id,
		date: date.toLocaleDateString(),
		from: recipient,
		subject: item.title || item.body.slice(0, 60),
		fileKind: item.attachments.length ? "doc" : "text",
		status: "read",
		body: item.body,
		recipientName: recipient,
		recipientHandle: recipient,
		files: item.attachments.map((attachment) => attachment.file_name),
		sentTime: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
		sentDate: date.toLocaleDateString(),
	};
};

const MessagesTab = () => {
	const t = useTranslate();
	const { company } = useAuthStatus();
	const [messages, setMessages] = useState<CompanyMessage[]>([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [createOpen, setCreateOpen] = useState(false);
	const [viewing, setViewing] = useState<CompanyMessage | null>(null);

	useEffect(() => {
		let cancelled = false;
		if (!company?.id) {
			setLoading(false);
			return;
		}
		setLoading(true);
		setError(false);
		const timer = window.setTimeout(() => {
			listCompanyContent(company.id, "message", search.trim())
				.then((items) => !cancelled && setMessages(items.map(toMessage)))
				.catch(() => !cancelled && setError(true))
				.finally(() => !cancelled && setLoading(false));
		}, 250);
		return () => {
			cancelled = true;
			window.clearTimeout(timer);
		};
	}, [company?.id, search]);

	const sortedMessages = useMemo(() => messages, [messages]);

	const handleSend = async (values: CompanyMessageValues, files: File[]) => {
		if (!company?.id) throw new Error("No company selected");
		const attachments = await Promise.all(files.map(uploadCompanyAttachment));
		const item = await createCompanyContent(company.id, {
			kind: "message",
			title: values.message.trim().split(/\r?\n/, 1)[0].slice(0, 80),
			body: values.message,
			recipient: values.recipient,
			attachments,
		});
		setMessages((current) => [toMessage(item), ...current]);
		showToast("success", "Message sent");
	};

	const handleDelete = async (id: string) => {
		if (!company?.id || !window.confirm("Delete this message?")) return;
		try {
			await deleteCompanyContent(company.id, id);
			setMessages((current) => current.filter((message) => message.id !== id));
			showToast("success", "Message deleted");
		} catch {
			showToast("error", "Message could not be deleted");
		}
	};

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="relative w-full max-w-md"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t(localizationConstants.search)} className="h-10 rounded-lg border-slate-200 pl-9" /></div>
				<Button type="button" onClick={() => setCreateOpen(true)} className="h-10 gap-2 rounded-lg bg-slate-900 px-5 text-white hover:bg-slate-800"><Plus className="h-4 w-4" /><Translate text={localizationConstants.companyMsgCreate} /></Button>
			</div>
			<div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
				<Table className="min-w-[48rem]">
					<TableHeader><TableRow><TableHead><Translate text={localizationConstants.companyMsgColDate} /></TableHead><TableHead><Translate text={localizationConstants.companyMsgColFrom} /></TableHead><TableHead><Translate text={localizationConstants.companyMsgColSubject} /></TableHead><TableHead><Translate text={localizationConstants.myPagesEmpLeaveColStatus} /></TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
					<TableBody>
						{loading && Array.from({ length: 3 }).map((_, index) => <TableRow key={index}>{Array.from({ length: 5 }).map((__, cell) => <TableCell key={cell}><div className="h-4 animate-pulse rounded bg-slate-100" /></TableCell>)}</TableRow>)}
						{!loading && sortedMessages.map((message) => (
							<TableRow key={message.id}><TableCell>{message.date}</TableCell><TableCell>{message.from}</TableCell><TableCell className="font-medium text-slate-900">{message.subject}</TableCell><TableCell><span className="inline-flex items-center gap-1 rounded-full border border-green-300 px-2.5 py-1 text-xs text-green-700"><Check className="h-3 w-3" /><Translate text={localizationConstants.companyMsgStatusRead} /></span></TableCell><TableCell><div className="flex justify-end gap-2"><Button type="button" variant="outline" size="sm" onClick={() => setViewing(message)}><Mail className="mr-1 h-4 w-4" /><Translate text={localizationConstants.companyMsgViewAction} /></Button><DropdownMenu><DropdownMenuTrigger asChild><Button type="button" variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => handleDelete(message.id)} className="gap-2 text-red-600"><Trash2 className="h-4 w-4" /><Translate text={localizationConstants.subscriptionPaymentDelete} /></DropdownMenuItem></DropdownMenuContent></DropdownMenu></div></TableCell></TableRow>
						))}
					</TableBody>
				</Table>
				{!loading && !error && messages.length === 0 && <div className="px-6 py-14 text-center text-slate-500">No messages found.</div>}
				{!loading && error && <div className="bg-red-50 px-6 py-10 text-center text-red-700">Messages could not be loaded.</div>}
			</div>
			<CreateMessageDialog open={createOpen} onClose={() => setCreateOpen(false)} onSend={handleSend} />
			<ViewMessageDialog message={viewing} onClose={() => setViewing(null)} />
		</div>
	);
};

export default MessagesTab;
