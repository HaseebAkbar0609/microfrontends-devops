"use client";

import { useEffect, useRef, useState } from "react";
import {
	Printer,
	CloudDownload,
	CloudUpload,
	LogOut,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface HeaderMenuPopupProps {
	anchorRef: React.RefObject<HTMLButtonElement | null>;
	onClose: () => void;
}

export function HeaderMenuPopup({ anchorRef, onClose }: HeaderMenuPopupProps) {
	const panelRef = useRef<HTMLDivElement>(null);
	const [zoom, setZoom] = useState(100);

	// Position the popup below the anchor button
	const [position, setPosition] = useState({ top: 0, right: 0 });

	useEffect(() => {
		const rect = anchorRef.current?.getBoundingClientRect();
		if (rect) {
			setPosition({
				top: rect.bottom + 8,
				right: window.innerWidth - rect.right,
			});
		}
	}, [anchorRef]);

	// Close on outside click or Escape
	useEffect(() => {
		function handleOutside(e: MouseEvent) {
			if (
				panelRef.current &&
				!panelRef.current.contains(e.target as Node) &&
				anchorRef.current &&
				!anchorRef.current.contains(e.target as Node)
			) {
				onClose();
			}
		}
		function handleEscape(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		document.addEventListener("mousedown", handleOutside);
		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("mousedown", handleOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [onClose, anchorRef]);

	function handleZoomOut() {
		setZoom((z) => Math.max(25, z - 10));
	}
	function handleZoomIn() {
		setZoom((z) => Math.min(400, z + 10));
	}

	const menuItems = [
		{
			icon: (
				<Printer
					size={20}
					strokeWidth={1.5}
					className="text-slate-700"
				/>
			),
			label: localizationConstants.print,
			onClick: () => {
				window.print();
				onClose();
			},
		},
		{
			icon: (
				<CloudDownload
					size={20}
					strokeWidth={1.5}
					className="text-slate-700"
				/>
			),
			label: localizationConstants.exportFiles,
			onClick: () => onClose(),
		},
		{
			icon: (
				<CloudUpload
					size={20}
					strokeWidth={1.5}
					className="text-slate-700"
				/>
			),
			label: localizationConstants.importFiles,
			onClick: () => onClose(),
		},
	];

	return (
		<div
			ref={panelRef}
			className="fixed z-50 w-64 rounded-xl border border-slate-200 bg-white shadow-xl"
			style={{ top: position.top, right: position.right }}
		>
			{/* Zoom row */}
			<div className="flex items-center justify-between rounded-t-xl bg-slate-100 px-4 py-3">
				<span className="text-sm font-medium text-slate-700">
					<Translate text={localizationConstants.zoom} />
				</span>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={handleZoomOut}
						className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-600 hover:bg-slate-200 transition-colors"
						aria-label={localizationConstants.zoomOut}
					>
						<ZoomOut size={16} strokeWidth={1.5} />
					</button>
					<span className="w-10 text-center text-sm font-medium text-slate-700">
						{zoom}%
					</span>
					<button
						type="button"
						onClick={handleZoomIn}
						className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-600 hover:bg-slate-200 transition-colors"
						aria-label={localizationConstants.zoomIn}
					>
						<ZoomIn size={16} strokeWidth={1.5} />
					</button>
				</div>
			</div>

			{/* Divider */}
			<div className="border-t border-slate-100" />

			{/* Menu items */}
			<div className="py-1">
				{menuItems.map((item) => (
					<button
						key={item.label}
						type="button"
						onClick={item.onClick}
						className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
					>
						{item.icon}
						<Translate text={item.label} />
					</button>
				))}

				{/* Divider before logout */}
				<div className="border-t border-slate-100" />

				{/* Log Out */}
				<button
					type="button"
					onClick={() => onClose()}
					className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
				>
					<LogOut
						size={20}
						strokeWidth={1.5}
						className="text-red-600"
					/>
					<Translate text={localizationConstants.logout} />
				</button>
			</div>
		</div>
	);
}
