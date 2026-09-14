"use client";

import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	QrCode,
	Smartphone,
	CheckCircle2,
	AlertCircle,
	RefreshCw,
	Shield,
} from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type { BankIdAuthState } from "../../types/bank.types";

export interface BankIdConnectModalProps {
	isOpen: boolean;
	onClose: () => void;
	bankName: string;
	onSuccess: (bankName: string, personalNumber?: string) => void;
}

export function BankIdConnectModal({
	isOpen,
	onClose,
	bankName,
	onSuccess,
}: BankIdConnectModalProps) {
	const { t } = useTranslation();
	const [tab, setTab] = useState<"qr" | "same_device">("qr");
	const [personalNumber, setPersonalNumber] = useState("");
	const [authState, setAuthState] = useState<BankIdAuthState>("idle");
	const [countdown, setCountdown] = useState(30);

	useEffect(() => {
		if (isOpen) {
			setAuthState("idle");
			setPersonalNumber("");
			setCountdown(30);
		}
	}, [isOpen]);

	// Simulate countdown & auth progress
	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (authState === "waiting_app") {
			timer = setInterval(() => {
				setCountdown((prev) => {
					if (prev <= 1) {
						// Proceed to authenticating
						setAuthState("authenticating");
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		} else if (authState === "authenticating") {
			const authTimeout = setTimeout(() => {
				setAuthState("success");
			}, 2000);
			return () => clearTimeout(authTimeout);
		}
		return () => clearInterval(timer);
	}, [authState]);

	const handleStartAuth = () => {
		setCountdown(30);
		setAuthState("waiting_app");
	};

	const handleComplete = () => {
		onSuccess(bankName, personalNumber);
		onClose();
	};

	const handleReset = () => {
		setAuthState("idle");
		setCountdown(30);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-md p-6">
				<DialogHeader className="text-center space-y-1">
					<div className="mx-auto w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center mb-1">
						<Shield className="w-5 h-5" />
					</div>
					<DialogTitle className="text-base font-semibold text-slate-900">
						BankID – {bankName}
					</DialogTitle>
				</DialogHeader>

				{authState === "idle" && (
					<div className="space-y-4 pt-2">
						{/* Mode Toggle */}
						<div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg text-xs font-medium">
							<button
								type="button"
								onClick={() => setTab("qr")}
								className={`py-2 px-3 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
									tab === "qr"
										? "bg-white text-slate-900 shadow-2xs"
										: "text-slate-500 hover:text-slate-900"
								}`}
							>
								<QrCode className="w-4 h-4" />
								<Translate text={localizationConstants.bankIdTabMobileQr} />
							</button>
							<button
								type="button"
								onClick={() => setTab("same_device")}
								className={`py-2 px-3 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
									tab === "same_device"
										? "bg-white text-slate-900 shadow-2xs"
										: "text-slate-500 hover:text-slate-900"
								}`}
							>
								<Smartphone className="w-4 h-4" />
								<Translate text={localizationConstants.bankIdTabSameDevice} />
							</button>
						</div>

						{tab === "qr" ? (
							<div className="text-center space-y-3 py-3">
								<p className="text-xs text-slate-600">
									<Translate text={localizationConstants.bankIdScanQrPrompt} />
								</p>
								<div className="w-44 h-44 mx-auto bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-3 relative group">
									<QrCode className="w-24 h-24 text-slate-800 opacity-90" />
									<span className="text-[10px] text-slate-400 mt-1 font-mono">
										BankID QR Security
									</span>
								</div>
								<Button
									type="button"
									onClick={handleStartAuth}
									className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs h-10 font-medium cursor-pointer"
								>
									<Translate text={localizationConstants.btnConnectWithBankId} />
								</Button>
							</div>
						) : (
							<div className="space-y-3 py-2">
								<p className="text-xs text-slate-600">
									<Translate text={localizationConstants.bankIdSameDevicePrompt} />
								</p>
								<div>
									<label className="text-xs font-medium text-slate-700 block mb-1">
										<Translate
											text={localizationConstants.bankIdPersonalNumberLabel}
										/>
									</label>
									<Input
										type="text"
										value={personalNumber}
										onChange={(e) => setPersonalNumber(e.target.value)}
										placeholder={t(
											localizationConstants.bankIdPersonalNumberPlaceholder,
										)}
										maxLength={13}
										className="h-10 text-sm font-mono tracking-wider"
									/>
								</div>
								<Button
									type="button"
									onClick={handleStartAuth}
									disabled={personalNumber.trim().length < 10}
									className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs h-10 font-medium cursor-pointer disabled:opacity-50"
								>
									<Translate text={localizationConstants.btnConnectWithBankId} />
								</Button>
							</div>
						)}
					</div>
				)}

				{(authState === "waiting_app" || authState === "authenticating") && (
					<div className="py-8 text-center space-y-4">
						<div className="relative w-16 h-16 mx-auto flex items-center justify-center">
							<RefreshCw className="w-10 h-10 text-slate-800 animate-spin" />
						</div>
						<div className="space-y-1">
							<p className="text-sm font-semibold text-slate-900">
								<Translate
									text={
										authState === "waiting_app"
											? localizationConstants.bankIdWaitingPrompt
											: localizationConstants.lblSyncingStatus
									}
								/>
							</p>
							<p className="text-xs text-slate-500 font-mono">
								{authState === "waiting_app"
									? `Väntar på signering (${countdown}s)`
									: "Verifierar behörigheter & ansluter konton..."}
							</p>
						</div>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleReset}
							className="text-xs text-slate-600"
						>
							<Translate text={localizationConstants.btnCancel} />
						</Button>
					</div>
				)}

				{authState === "success" && (
					<div className="py-6 text-center space-y-4">
						<div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
							<CheckCircle2 className="w-8 h-8" />
						</div>
						<div className="space-y-1">
							<p className="text-base font-semibold text-slate-900">
								<Translate text={localizationConstants.bankIdSuccessTitle} />
							</p>
							<p className="text-xs text-slate-500 max-w-xs mx-auto">
								<Translate text={localizationConstants.bankIdSuccessDesc} />
							</p>
						</div>
						<div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-left text-xs space-y-1 max-w-xs mx-auto">
							<div className="flex justify-between">
								<span className="text-slate-500">Bank:</span>
								<span className="font-semibold text-slate-800">{bankName}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-500">Konto:</span>
								<span className="font-semibold text-slate-800">Företagskonto</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-500">Synkronisering:</span>
								<span className="text-emerald-700 font-medium">Aktiv (Daglig)</span>
							</div>
						</div>
						<Button
							type="button"
							onClick={handleComplete}
							className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs h-10 font-medium cursor-pointer"
						>
							<Translate text={localizationConstants.btnBankIdDone} />
						</Button>
					</div>
				)}

				{authState === "error" && (
					<div className="py-6 text-center space-y-4">
						<div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
							<AlertCircle className="w-8 h-8" />
						</div>
						<div className="space-y-1">
							<p className="text-base font-semibold text-slate-900">
								<Translate text={localizationConstants.bankIdErrorTitle} />
							</p>
							<p className="text-xs text-slate-500 max-w-xs mx-auto">
								<Translate text={localizationConstants.bankIdErrorDesc} />
							</p>
						</div>
						<Button
							type="button"
							onClick={handleReset}
							className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs h-10 font-medium cursor-pointer"
						>
							<Translate text={localizationConstants.btnBankIdRetry} />
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}

export default BankIdConnectModal;
