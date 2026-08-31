"use client";

import React, { useCallback, useState } from "react";
import {
	Activity,
	Bot,
	CalendarDays,
	CheckCircle2,
	MapPin,
	Send,
	Wrench,
	X,
} from "lucide-react";

import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export type MachineModalType =
	| "diagnostic"
	| "map"
	| "ai"
	| "repair"
	| "booking"
	| null;

interface MachineDashboardModalsProps {
	activeModal: MachineModalType;
	initialAiPrompt?: string;
	onClose: () => void;
}

export function MachineDashboardModals({
	activeModal,
	initialAiPrompt,
	onClose,
}: MachineDashboardModalsProps) {
	// AI Assistant Chat State
	const [aiInput, setAiInput] = useState("");
	const [aiMessages, setAiMessages] = useState<
		Array<{ sender: "user" | "ai"; text: string }>
	>([
		{
			sender: "ai",
			text: "Hej! Jag är TimeFlow AI Maskinassistent. Jag övervakar telemetri för Volvo EC220E (EXC-0220). Hur kan jag hjälpa dig idag?",
		},
	]);

	// Repair Form State
	const [repairDesc, setRepairDesc] = useState("");
	const [repairPriority, setRepairPriority] = useState<"low" | "medium" | "high" | "urgent">("high");

	// Booking Form State
	const [bookingProject, setBookingProject] = useState("Slussen Ombyggnad - Zon 4");
	const [bookingDate, setBookingDate] = useState("2026-08-05");

	const handleSendAiMessage = useCallback((promptText?: string) => {
		const textToSend = promptText || aiInput;
		if (!textToSend.trim()) return;

		const userMsg = { sender: "user" as const, text: textToSend };
		setAiMessages((prev) => [...prev, userMsg]);
		if (!promptText) setAiInput("");

		setTimeout(() => {
			let reply = "Baserat på telemetrin är motortemperatur (88°C) och hydrauliktryck (210 bar) inom nominella gränser. Alla system fungerar optimalt.";
			if (textToSend.toLowerCase().includes("tomgång") || textToSend.toLowerCase().includes("idle")) {
				reply = "Tomgångstiden har varit 6.2 timmar denna vecka (25% av drifttiden), främst vid väntetid under lastning i Zon C. Vi rekommenderar automatisk motoravstängning efter 5 minuters inaktivitet för att spara ca 15 liter bränsle per dag.";
			} else if (textToSend.toLowerCase().includes("bränsle") || textToSend.toLowerCase().includes("fuel")) {
				reply = "För att optimera bränsleförbrukningen bör föraren använda Eco-läget under transport och hålla varvtalet under 1 500 RPM. Nuvarande genomsnitt är 6.6 L/h.";
			}

			setAiMessages((prev) => [
				...prev,
				{ sender: "ai", text: reply },
			]);
		}, 600);
	}, [aiInput]);

	// Trigger initial AI prompt if passed
	React.useEffect(() => {
		if (activeModal === "ai" && initialAiPrompt) {
			handleSendAiMessage(initialAiPrompt);
		}
	}, [activeModal, initialAiPrompt, handleSendAiMessage]);

	const handleCreateRepair = (e: React.FormEvent) => {
		e.preventDefault();
		if (!repairDesc.trim()) {
			showToast("error", "Vänligen ange en felbeskrivning");
			return;
		}
		showToast("success", "Reparationsorder registrerad framgångsrikt");
		setRepairDesc("");
		onClose();
	};

	const handleCreateBooking = (e: React.FormEvent) => {
		e.preventDefault();
		showToast("success", `Maskin bokad för ${bookingProject} (${bookingDate})`);
		onClose();
	};

	if (!activeModal) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
			<div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200/80 animate-in zoom-in-95 duration-200">
				{/* Close Button */}
				<button
					type="button"
					onClick={onClose}
					className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
					aria-label="Stäng"
				>
					<X className="h-5 w-5" />
				</button>

				{/* 1. Diagnostic Modal */}
				{activeModal === "diagnostic" && (
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
								<Activity className="h-5 w-5" />
							</div>
							<div>
								<h3 className="text-base font-bold text-slate-900">
									<Translate text={localizationConstants.machineModalDiagnosticTitle} />
								</h3>
								<p className="text-xs text-slate-500">
									<Translate text={localizationConstants.machineModalDiagnosticDesc} />
								</p>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3 py-2">
							<div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
								<span className="text-[11px] font-medium text-slate-500">Motortemperatur</span>
								<p className="text-lg font-bold text-slate-900">88°C</p>
								<span className="text-[10px] text-emerald-600 font-semibold">Normal (Gräns 105°C)</span>
							</div>
							<div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
								<span className="text-[11px] font-medium text-slate-500">Hydrauliktryck</span>
								<p className="text-lg font-bold text-slate-900">210 bar</p>
								<span className="text-[10px] text-emerald-600 font-semibold">Nominellt arbetstryck</span>
							</div>
							<div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
								<span className="text-[11px] font-medium text-slate-500">Batterispänning</span>
								<p className="text-lg font-bold text-slate-900">24.2 V</p>
								<span className="text-[10px] text-emerald-600 font-semibold">Generator laddar OK</span>
							</div>
							<div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
								<span className="text-[11px] font-medium text-slate-500">Motorvarvtal (RPM)</span>
								<p className="text-lg font-bold text-slate-900">1 450 RPM</p>
								<span className="text-[10px] text-blue-600 font-semibold">Lastgrad: 62%</span>
							</div>
						</div>

						<div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200/60 p-3 text-xs text-emerald-900">
							<CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
							<span>Inga aktiva kritiska felkoder (DTC) registrerade i CAN-bussen.</span>
						</div>
					</div>
				)}

				{/* 2. GPS & Live Map Modal */}
				{activeModal === "map" && (
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
								<MapPin className="h-5 w-5" />
							</div>
							<div>
								<h3 className="text-base font-bold text-slate-900">
									<Translate text={localizationConstants.machineModalMapTitle} />
								</h3>
								<p className="text-xs text-slate-500">
									<Translate text={localizationConstants.machineModalMapDesc} />
								</p>
							</div>
						</div>

						<div className="relative h-48 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center">
							<div className="absolute inset-0 bg-radial from-slate-50 to-slate-200 opacity-90" />
							<div className="relative z-10 flex flex-col items-center gap-2">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg animate-bounce">
									<MapPin className="h-5 w-5" />
								</div>
								<div className="text-center">
									<p className="text-xs font-bold text-slate-900 bg-white/90 px-3 py-1 rounded-full shadow-xs">
										59.3326° N, 18.0649° E
									</p>
									<span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 inline-block">
										Inom Norra förbifarten – Zon C
									</span>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3 text-xs">
							<div className="rounded-lg bg-slate-50 p-2.5">
								<span className="text-slate-500">GPS-precision:</span>
								<p className="font-semibold text-slate-800">±12 meter (RTK-läge)</p>
							</div>
							<div className="rounded-lg bg-slate-50 p-2.5">
								<span className="text-slate-500">Senaste rörelse:</span>
								<p className="font-semibold text-slate-800">14 min sedan (0.0 km/h)</p>
							</div>
						</div>
					</div>
				)}

				{/* 3. AI Assistant Modal */}
				{activeModal === "ai" && (
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
								<Bot className="h-5 w-5" />
							</div>
							<div>
								<h3 className="text-base font-bold text-slate-900">
									<Translate text={localizationConstants.machineModalAiTitle} />
								</h3>
								<p className="text-xs text-slate-500">Volvo EC220E telemetrianalys</p>
							</div>
						</div>

						{/* Messages Container */}
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

						{/* Input bar */}
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
								placeholder="Ställ en fråga om maskinen..."
								className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-hidden"
							/>
							<button
								type="submit"
								className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
								aria-label="Skicka"
							>
								<Send className="h-3.5 w-3.5" />
							</button>
						</form>
					</div>
				)}

				{/* 4. Repair Order Modal */}
				{activeModal === "repair" && (
					<form onSubmit={handleCreateRepair} className="flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
								<Wrench className="h-5 w-5" />
							</div>
							<div>
								<h3 className="text-base font-bold text-slate-900">
									<Translate text={localizationConstants.machineModalRepairTitle} />
								</h3>
								<p className="text-xs text-slate-500">Tillgång: Volvo EC220E (EXC-0220)</p>
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.machineModalRepairFieldDesc} />
							</label>
							<textarea
								value={repairDesc}
								onChange={(e) => setRepairDesc(e.target.value)}
								placeholder="T.ex. Läckage i hydraulslang vid bomcylinder eller slitna skoptänder..."
								rows={3}
								className="rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-hidden resize-none"
								required
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.machineModalRepairPriority} />
							</label>
							<div className="grid grid-cols-4 gap-2 text-xs">
								{(["low", "medium", "high", "urgent"] as const).map((p) => (
									<button
										key={p}
										type="button"
										onClick={() => setRepairPriority(p)}
										className={`py-1.5 rounded-lg border font-semibold capitalize transition-colors cursor-pointer ${
											repairPriority === p
												? "border-slate-900 bg-slate-900 text-white"
												: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
										}`}
									>
										{p === "low" ? "Låg" : p === "medium" ? "Medel" : p === "high" ? "Hög" : "Akut"}
									</button>
								))}
							</div>
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
								className="px-4 py-2 rounded-lg bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
							>
								<Translate text={localizationConstants.machineModalRepairSubmit} />
							</button>
						</div>
					</form>
				)}

				{/* 5. Booking Modal */}
				{activeModal === "booking" && (
					<form onSubmit={handleCreateBooking} className="flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
								<CalendarDays className="h-5 w-5" />
							</div>
							<div>
								<h3 className="text-base font-bold text-slate-900">
									<Translate text={localizationConstants.machineModalBookingTitle} />
								</h3>
								<p className="text-xs text-slate-500">Tillgång: Volvo EC220E (EXC-0220)</p>
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.machineModalBookingProject} />
							</label>
							<select
								value={bookingProject}
								onChange={(e) => setBookingProject(e.target.value)}
								className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
							>
								<option>Slussen Ombyggnad - Zon 4</option>
								<option>Norra Förbifarten - Etapp 2</option>
								<option>Kv. Göken Schaktning</option>
								<option>Depå & Underhållscenter</option>
							</select>
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.machineModalBookingDate} />
							</label>
							<input
								type="date"
								value={bookingDate}
								onChange={(e) => setBookingDate(e.target.value)}
								className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
								required
							/>
						</div>

						<div className="rounded-lg bg-emerald-50 border border-emerald-200/60 p-2.5 text-xs text-emerald-900 flex items-center gap-2">
							<CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
							<span>Inga schemakonflikter hittades för vald tidsperiod.</span>
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
								className="px-4 py-2 rounded-lg bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
							>
								<Translate text={localizationConstants.machineModalBookingSubmit} />
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
