import Image from "next/image";

interface ChatMessageItemProps {
	type: "sent" | "received";
	senderName: string;
	senderInitials?: string;
	avatarUrl?: string;
	content: string;
	timestamp: string;
}

export function ChatMessageItem({
	type,
	senderName,
	senderInitials,
	avatarUrl,
	content,
	timestamp,
}: ChatMessageItemProps) {
	const isSent = type === "sent";

	return (
		<div
			className={`flex flex-col gap-1 max-w-[75%] ${isSent ? "self-end ml-auto items-end" : ""}`}
		>
			<div
				className={`flex items-center gap-3 mb-1 ${isSent ? "justify-end" : ""}`}
			>
				{!isSent && (
					<div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium text-xs">
						{senderInitials}
					</div>
				)}
				<span className="text-sm font-semibold text-slate-900 tracking-tight">
					{senderName}
				</span>
				{isSent && (
					<div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
						{avatarUrl ? (
							<Image
								src={avatarUrl}
								alt="User"
								width={32}
								height={32}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center text-slate-600 font-medium text-xs">
								{senderInitials}
							</div>
						)}
					</div>
				)}
			</div>
			<div
				className={`${
					isSent
						? "bg-slate-100 border border-slate-100 rounded-lg rounded-tr-none mr-11"
						: "bg-white border border-slate-200 rounded-lg rounded-tl-none ml-11"
				} p-3.5 text-sm text-slate-700 shadow-sm`}
			>
				{content}
			</div>
			<span
				className={`text-xs text-slate-400 mt-1 ${isSent ? "mr-11" : "ml-11"}`}
			>
				{timestamp}
			</span>
		</div>
	);
}
