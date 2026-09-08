"use client";

import React, { useCallback, useState } from "react";
import {
	Bot,
	CalendarDays,
	Clock,
	LayoutGrid,
	Send,
	X,
} from "lucide-react";

import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export type DesignModalType =
	| "ai"
	| "overview"
	| "meeting"
	| "time"
	| null;

interface DesignDashboardModalsProps {
	activeModal: DesignModalType;
	initialAiPrompt?: string;
	onClose: () => void;
}

export function DesignDashboardModals({
	activeModal,
	initialAiPrompt,
	onClose,
}: DesignDashboardModalsProps) {
	const [aiInput, setAiInput] = useState("");
	const [aiMessages, setAiMessages] = useState<
		Array<{ sender: "user" | "ai"; text: string }>
	>([
		{
			sender: "ai",
			text: "Hej! Jag är TimeFlow AI Design Assistent. Jag övervakar dina ritningar, BIM-modeller och granskningar. Hur kan jag hjälpa dig idag?",
		},
	]);

	const [meetingTitle, setMeetingTitle] = useState("");
	const [meetingDate, setMeetingDate] = useState("2026-08-12");
	const [timeHours, setTimeHours] = useState("");

	const handleSendAiMessage = useCallback((promptText?: string) => {
		const textToSend = promptText || aiInput;
		if (!textToSend.trim()) return;

		const userMsg = { sender: "user" as const, text: textToSend };
		setAiMessages((prev) => [...prev, userMsg]);
		if (!promptText) setAiInput("");

		setTimeout(() => {
			let reply =
				"Baserat på aktuell projektdata ser allt ut att vara inom planerade parametrar. Inga kritiska avvikelser har registrerats.";
			if (
				textToSend.toLowerCase().includes("uppdateras") ||
				textToSend.toLowerCase().includes("ritning")
			) {
				reply =
					"Ritning A-301 behöver synkroniseras med BIM-modellen (12% avvikelse). Ritning B-102 har en öppen granskningskommentar från Erik Johansson som bör åtgärdas.";
			} else if (
				textToSend.toLowerCase().includes("revision") ||
				textToSend.toLowerCase().includes("status")
			) {
				reply =
					"Revision R3 är godkänd. Revision R4 är under granskning med 3 öppna kommentarer. Estimerad klar: 2026-08-08.";
			}

			setAiMessages((prev) => [...prev, { sender: "ai", text: reply }]);
		}, 600);
	}, [aiInput]);

	React.useEffect(() => {
		if (activeModal === "ai" && initialAiPrompt) {
			handleSendAiMessage(initialAiPrompt);
		}
	}, [activeModal, initialAiPrompt, handleSendAiMessage]);

	const handleScheduleMeeting = (e: React.FormEvent) => {
		e.preventDefault();
		if (!meetingTitle.trim()) {
			showToast("error", "Ange ett mötestitel");
			return;
		}
		showToast("success", `Möte "${meetingTitle}" schemalagt för ${meetingDate}`);
		setMeetingTitle("");
		onClose();
	};

	const handleLogTime = (e: React.FormEvent) => {
		e.preventDefault();
		if (!timeHours.trim()) {
			showToast("error", "Ange antal timmar");
			return;
		}
		showToast("success", `${timeHours} timmar loggade`);
		setTimeHours("");
		onClose();
	};

	if (!activeModal) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
			<div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200/80 animate-in zoom-in-95 duration-200">
				<button
					type="button"
					onClick={onClose}
					className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
					aria-label="Stäng"
				>
					<X className="h-5 w-5" />
				</button>

				{/* Overview Modal */}
				{activeModal === "overview" && (
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
								<LayoutGrid className="h-5 w-5" />
							</div>
							<div>
								<h3 className="text-base font-bold text-slate-900">
									<Translate text={localizationConstants.designWidgetOverviewTitle} />
								</h3>
								<p className="text-xs text-slate-500">Aktiva designprojekt</p>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3">
							{[
								{ label: "Göteborgs Kontorskomplex", status: "Aktiv", color: "text-emerald-700" },
								{ label: "Malmö Stadsbibliotek", status: "Granskning", color: "text-amber-700" },
								{ label: "Norra Länken – Sektion 4", status: "Aktiv", color: "text-emerald-700" },
								{ label: "Kv. Göken Bostäder", status: "Slutförd", color: "text-slate-500" },
							].map((project) => (
								<div
									key={project.label}
									className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 flex flex-col gap-0.5"
								>
									<span className="text-xs font-semibold text-slate-800 leading-tight">
										{project.label}
									</span>
									<span className={`text-[11px] font-medium ${project.color}`}>
										{project.status}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				{/* AI Assistant Modal */}
				{activeModal === "ai" && (
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
								<Bot className="h-5 w-5" />
							</div>
							<div>
								<h3 className="text-base font-bold text-slate-900">
									<Translate text={localizationConstants.designWidgetAiTitle} />
								</h3>
								<p className="text-xs text-slate-500">TimeFlow AI Design Assistent</p>
							</div>
						</div>

						<div className="h-60 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 flex flex-col gap-2.5 text-xs">
							{aiMessages.map((msg, idx) => (
								<div
									key={idx}
									className={`flex flex-col max-w-[85%] rounded-xl p-3 ${
										msg.sender === "user"
											? "self-end bg-slate-900 text-white"
											: "self-start bg-white border border-slate-200 text-slate-800 shadow-2xs"
									}`}
								>
									{msg.text}
								</div>
							))}
						</div>

						<form
							onSubmit={(e) => {
								e.preventDefault();
								handleSendAiMessage();
							}}
							className="flex items-center gap-2 pt-1"
						>
							<input
								type="text"
								value={aiInput}
								onChange={(e) => setAiInput(e.target.value)}
								placeholder="Ställ en fråga om ditt designprojekt..."
								className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-hidden"
							/>
							<button
								type="submit"
								className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors cursor-pointer"
								aria-label="Skicka"
							>
								<Send className="h-3.5 w-3.5" />
							</button>
						</form>
					</div>
				)}

				{/* Schedule Meeting Modal */}
				{activeModal === "meeting" && (
					<form onSubmit={handleScheduleMeeting} className="flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
								<CalendarDays className="h-5 w-5" />
							</div>
							<div>
								<h3 className="text-base font-bold text-slate-900">
									<Translate text={localizationConstants.designWidgetMeetingsScheduleCta} />
								</h3>
								<p className="text-xs text-slate-500">Nytt designmöte</p>
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-semibold text-slate-700">Mötestitel</label>
							<input
								type="text"
								value={meetingTitle}
								onChange={(e) => setMeetingTitle(e.target.value)}
								placeholder="T.ex. Technical Review – Ritning A-400"
								className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-hidden"
								required
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-semibold text-slate-700">Datum</label>
							<input
								type="date"
								value={meetingDate}
								onChange={(e) => setMeetingDate(e.target.value)}
								className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
								required
							/>
						</div>

						<div className="flex items-center justify-end gap-2 pt-2">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
							>
								Avbryt
							</button>
							<button
								type="submit"
								className="px-4 py-2 rounded-lg bg-zinc-900 text-xs font-semibold text-white hover:bg-zinc-800 cursor-pointer"
							>
								Schemalägg
							</button>
						</div>
					</form>
				)}

				{/* Log Time Modal */}
				{activeModal === "time" && (
					<form onSubmit={handleLogTime} className="flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
								<Clock className="h-5 w-5" />
							</div>
							<div>
								<h3 className="text-base font-bold text-slate-900">
									<Translate text={localizationConstants.designWidgetTimeLogCta} />
								</h3>
								<p className="text-xs text-slate-500">Registrera designtid</p>
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-semibold text-slate-700">Antal timmar</label>
							<input
								type="number"
								min="0.5"
								step="0.5"
								value={timeHours}
								onChange={(e) => setTimeHours(e.target.value)}
								placeholder="T.ex. 4"
								className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-hidden"
								required
							/>
						</div>

						<div className="flex items-center justify-end gap-2 pt-2">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
							>
								Avbryt
							</button>
							<button
								type="submit"
								className="px-4 py-2 rounded-lg bg-zinc-900 text-xs font-semibold text-white hover:bg-zinc-800 cursor-pointer"
							>
								<Translate text={localizationConstants.designWidgetTimeLogCta} />
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
