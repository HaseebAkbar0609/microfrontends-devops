"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import { navConfig } from "./navConfig";
import { SidebarNavGroup } from "./SidebarNavGroup";
import { DashboardLogo } from "./DashboardLogo";
import { SLATE } from "@/constants/colors";

export default function Sidebar({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<aside
			className={`flex h-full shrink-0 flex-col bg-slate-800 pb-3 p-2.5 transition-all duration-300 ${mobile ? "w-full" : collapsed ? "w-16" : "w-64"}`}
		>
			{/* Inner container with rounded corners */}
			<div className="flex h-full flex-col rounded-lg bg-gray-800">
				{/* Header: Logo + Search */}
				<div className="flex flex-col gap-2 p-2">
					{/* Logo row */}
					<div
						className={`flex items-center gap-4 p-2 ${collapsed ? "flex-col justify-center" : "justify-between"}`}
					>
						{/* Logo */}
						<DashboardLogo collapsed={collapsed} />
						{!mobile && <button
							type="button"
							onClick={() => setCollapsed((prev) => !prev)}
							className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-700 text-slate-300 transition-colors cursor-pointer hover:bg-slate-600 hover:text-white"
							aria-label={
								collapsed
									? "Expand sidebar"
									: "Collapse sidebar"
							}
						>
							{collapsed ? (
								<PanelLeftOpen size={18} />
							) : (
								<PanelLeftClose size={18} />
							)}
						</button>}

						{/* <hr className="w-full border-t border-gray-800" /> */}

						{collapsed && (
							<hr
								className="w-full border-t "
								style={{ borderTopColor: SLATE[700] }}
							/>
						)}
					</div>
				</div>

				{/* Navigation */}
				<nav className="flex flex-1 flex-col gap-2 overflow-y-auto pb-2">
					<div className="flex flex-col gap-1.5">
						{navConfig.map((group) => (
							<SidebarNavGroup
								key={group.id}
								group={group}
								collapsed={collapsed}
								onNavigate={onNavigate}
							/>
						))}
					</div>
				</nav>
			</div>
		</aside>
	);
}
