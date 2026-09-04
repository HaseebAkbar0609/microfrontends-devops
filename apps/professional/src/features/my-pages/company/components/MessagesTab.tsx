"use client";

import { useMemo, useState } from "react";
import {
	ArrowUpDown,
	Check,
	ChevronDown,
	Mail,
	MoreVertical,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/table/TablePagination";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { CompanyMessage } from "../constants/mockData";
import { listCompanyMessages } from "../services/companyService";
import { CompanyMessageValues } from "../schemas/company";
import CreateMessageDialog from "./CreateMessageDialog";
import MessageFileIcon from "./MessageFileIcon";
import ViewMessageDialog from "./ViewMessageDialog";

const MessagesTab = () => {
	const t = useTranslate();
	const [messages, setMessages] = useState<CompanyMessage[]>(() =>
		listCompanyMessages(),
	);
	const [search, setSearch] = useState("");
	const [sortAsc, setSortAsc] = useState<boolean | null>(null);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [createOpen, setCreateOpen] = useState(false);
	const [viewing, setViewing] = useState<CompanyMessage | null>(null);

	const filtered = useMemo(() => {
		const term = search.trim().toLowerCase();
		let rows = messages;
		if (term)
			rows = rows.filter(
				(message) =>
					message.from.toLowerCase().includes(term) ||
					message.subject.toLowerCase().includes(term),
			);
		if (sortAsc !== null)
			rows = [...rows].sort((a, b) =>
				sortAsc
					? a.status.localeCompare(b.status)
					: b.status.localeCompare(a.status),
			);
		return rows;
	}, [messages, search, sortAsc]);

	const paged = useMemo(
		() => filtered.slice((page - 1) * pageSize, page * pageSize),
		[filtered, page, pageSize],
	);
	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

	const handleSend = (values: CompanyMessageValues) => {
		const template = listCompanyMessages()[0];
		setMessages((current) => [
			{
				...template,
				id: `m-${crypto.randomUUID()}`,
				from: values.recipient,
				subject: values.message.slice(0, 24) + "...",
				status: "unread",
				body: values.message,
				fileKind: "text",
			},
			...current,
		]);
	};

	const handleDelete = (id: string) =>
		setMessages((current) =>
			current.filter((message) => message.id !== id),
		);

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-4">
					<div className="relative w-full max-w-xs">
						<Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							value={search}
							onChange={(event) => {
								setSearch(event.target.value);
								setPage(1);
							}}
							placeholder={t(localizationConstants.search)}
							className="h-9 rounded-none border-0 border-b border-slate-200 bg-transparent pl-6 text-sm shadow-none focus-visible:border-slate-400 focus-visible:ring-0"
						/>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="outline"
								className="h-9 gap-1.5 rounded-md border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
							>
								<Translate
									text={localizationConstants.filter}
								/>
								<ChevronDown className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							className="w-40 rounded-md border border-slate-200 bg-white p-1 shadow-md"
						>
							<DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700">
								<Translate
									text={
										localizationConstants.licensesModuleAll
									}
								/>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<Button
					type="button"
					onClick={() => setCreateOpen(true)}
					className="h-11 gap-2 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.companyMsgCreate} />
				</Button>
			</div>

			<div className="w-full overflow-x-auto rounded-md border border-slate-200 bg-white">
				<Table className="w-full min-w-[52rem]">
					<TableHeader>
						<TableRow className="border-b border-slate-200 hover:bg-transparent">
							<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
								<Translate
									text={
										localizationConstants.companyMsgColDate
									}
								/>
							</TableHead>
							<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
								<Translate
									text={
										localizationConstants.companyMsgColFrom
									}
								/>
							</TableHead>
							<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
								<Translate
									text={
										localizationConstants.companyMsgColSubject
									}
								/>
							</TableHead>
							<TableHead className="px-4 py-3 text-sm font-medium text-slate-500">
								<button
									type="button"
									onClick={() =>
										setSortAsc((value) =>
											value === null ? true : !value,
										)
									}
									className="flex cursor-pointer items-center gap-1"
								>
									<Translate
										text={
											localizationConstants.myPagesEmpLeaveColStatus
										}
									/>
									<ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
								</button>
							</TableHead>
							<TableHead className="px-4 py-3" />
							<TableHead className="px-4 py-3" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{paged.map((message) => (
							<TableRow
								key={message.id}
								className="border-b border-slate-100 hover:bg-slate-50/60"
							>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{message.date}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{message.from}
								</TableCell>
								<TableCell className="px-4 py-3.5">
									<span className="flex items-center gap-3 text-sm text-slate-700">
										<MessageFileIcon
											kind={message.fileKind}
										/>
										{message.subject}
									</span>
								</TableCell>
								<TableCell className="px-4 py-3.5">
									<span
										className={cn(
											"inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
											message.status === "read"
												? "border-green-400 text-green-600"
												: "border-slate-300 text-slate-600",
										)}
									>
										{message.status === "read" ? (
											<Check className="h-3 w-3" />
										) : (
											<Mail className="h-3 w-3" />
										)}
										<Translate
											text={
												message.status === "read"
													? localizationConstants.companyMsgStatusRead
													: localizationConstants.companyMsgStatusUnread
											}
										/>
									</span>
								</TableCell>
								<TableCell className="px-4 py-3.5">
									<Button
										type="button"
										variant="outline"
										onClick={() => setViewing(message)}
										className="h-9 rounded-md border-slate-200 bg-white px-5 text-sm font-medium text-slate-900 hover:bg-slate-50"
									>
										<Translate
											text={
												localizationConstants.companyMsgViewAction
											}
										/>
									</Button>
								</TableCell>
								<TableCell className="px-4 py-3.5">
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
											align="end"
											className="w-36 rounded-md border border-slate-200 bg-white p-1 shadow-md"
										>
											<DropdownMenuItem
												onClick={() =>
													handleDelete(message.id)
												}
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
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<TablePagination
				currentPage={page}
				totalPages={totalPages}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={(size) => {
					setPageSize(size);
					setPage(1);
				}}
			/>

			<CreateMessageDialog
				open={createOpen}
				onClose={() => setCreateOpen(false)}
				onSend={handleSend}
			/>
			<ViewMessageDialog
				message={viewing}
				onClose={() => setViewing(null)}
			/>
		</div>
	);
};

export default MessagesTab;
