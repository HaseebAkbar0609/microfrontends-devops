"use client";

import React, { useState } from "react";
import { X, Trash2, Plus, UserCheck } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SystemAssignee } from "@/features/data-it/types/dataItSystem.types";

interface SystemAssigneeDialogProps {
	isOpen: boolean;
	assignedUsers: SystemAssignee[];
	onClose: () => void;
	onSave: (users: SystemAssignee[]) => void;
}

export const SystemAssigneeDialog: React.FC<SystemAssigneeDialogProps> = ({
	isOpen,
	assignedUsers,
	onClose,
	onSave,
}) => {
	const t = useTranslate();
	const [list, setList] = useState<SystemAssignee[]>(assignedUsers);
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [error, setError] = useState("");

	if (!isOpen) return null;

	const handleAdd = () => {
		if (!name.trim()) {
			setError(t(localizationConstants.dataItSystemValidationRequired));
			return;
		}
		const newAssignee: SystemAssignee = {
			id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
			name: name.trim(),
			role: role.trim() || t(localizationConstants.dataItSystemDefaultRole),
			email: email.trim() || "-",
			phone: phone.trim() || "-",
		};
		setList((prev) => [...prev, newAssignee]);
		setName("");
		setRole("");
		setEmail("");
		setPhone("");
		setError("");
	};

	const handleRemove = (id: string) => {
		setList((prev) => prev.filter((item) => item.id !== id));
	};

	const handleSave = () => {
		onSave(list);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
			<div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
				{/* Dialog Header */}
				<div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
					<div className="flex items-center gap-2.5">
						<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
							<UserCheck className="h-5 w-5" />
						</div>
						<div>
							<h3 className="text-base font-semibold text-slate-900">
								{t(localizationConstants.dataItSystemAssigneesEditTitle)}
							</h3>
							<p className="text-xs text-slate-500">
								{t(localizationConstants.dataItSystemAssigneesEditDesc)}
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* Dialog Body */}
				<div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-4">
					{/* Existing Assignees List */}
					<div className="space-y-2">
						{list.length === 0 ? (
							<p className="py-4 text-center text-xs text-slate-400">
								{t(localizationConstants.dataItSystemEmptyAssignments)}
							</p>
						) : (
							list.map((u) => (
								<div
									key={u.id}
									className="flex items-center justify-between rounded-lg border border-slate-150 bg-slate-50/60 px-3.5 py-2.5"
								>
									<div className="min-w-0">
										<p className="text-sm font-semibold text-slate-900 truncate">
											{u.name}
										</p>
										<p className="text-xs text-slate-500">
											{u.role} &bull; {u.email}
										</p>
									</div>
									<button
										type="button"
										onClick={() => handleRemove(u.id)}
										className="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
										title={t(localizationConstants.dataItSystemAssigneesRemoveBtn)}
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							))
						)}
					</div>

					{/* Add New Assignee Sub-form */}
					<div className="rounded-xl border border-dashed border-slate-200 bg-white p-3.5 space-y-3">
						<p className="text-xs font-semibold text-slate-700">
							{t(localizationConstants.dataItSystemAssigneesAddBtn)}
						</p>
						<div className="grid grid-cols-2 gap-2">
							<input
								type="text"
								value={name}
								onChange={(e) => {
									setName(e.target.value);
									if (error) setError("");
								}}
								placeholder={`${t(localizationConstants.dataItSystemColAssigneeName)} *`}
								className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-hidden"
							/>
							<input
								type="text"
								value={role}
								onChange={(e) => setRole(e.target.value)}
								placeholder={t(localizationConstants.dataItSystemColAssigneeRole)}
								className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-hidden"
							/>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder={t(localizationConstants.dataItSystemColAssigneeEmail)}
								className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-hidden"
							/>
							<input
								type="tel"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								placeholder={t(localizationConstants.dataItSystemColAssigneePhone)}
								className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-hidden"
							/>
						</div>
						{error && <p className="text-xs text-rose-500">{error}</p>}
						<button
							type="button"
							onClick={handleAdd}
							className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
						>
							<Plus className="h-3.5 w-3.5" />
							<span>{t(localizationConstants.dataItSystemAssigneesAddBtn)}</span>
						</button>
					</div>
				</div>

				{/* Dialog Footer */}
				<div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
					>
						{t(localizationConstants.dataItSystemBtnCancel)}
					</button>
					<button
						type="button"
						onClick={handleSave}
						className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
					>
						{t(localizationConstants.dataItSystemBtnSave)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default SystemAssigneeDialog;
