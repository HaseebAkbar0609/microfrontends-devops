import { ChatMessageItem } from "./ChatMessageItem";

export function ChatMessages() {
	return (
		<div className="flex-1 p-6 overflow-y-auto space-y-8">
			<ChatMessageItem
				type="received"
				senderName="Stefan Eriksson"
				senderInitials="SE"
				content="My laptop won't start. It only shows a black screen when I press the power button."
				timestamp="2026-05-01 | 12:00"
			/>
			<ChatMessageItem
				type="sent"
				senderName="Du"
				avatarUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=e2e8f0"
				content="I think your window isn't working, install a new window"
				timestamp="2026-05-01 | 12:00"
			/>
			<ChatMessageItem
				type="received"
				senderName="Stefan Eriksson"
				senderInitials="SE"
				content="Yes, it should arrive at the destination port by 6:00 PM tomorrow. Let me know when it arrives."
				timestamp="2026-05-01 | 12:00"
			/>
		</div>
	);
}
